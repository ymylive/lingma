import base64
import hashlib
import html
import ipaddress
import json
import os
import re
import secrets
import socket
import sqlite3
import threading
from datetime import datetime, timezone
from typing import Any, Dict, List
from urllib.parse import urlparse
from urllib.request import Request as UrlRequest
from urllib.request import urlopen

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from openai import OpenAI

DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://lingma.cornna.xyz",
    "http://lingma.cornna.xyz",
    "http://8.134.33.19",
    "https://8.134.33.19",
    "http://8.134.33.19:8080",
    "https://8.134.33.19:8080",
]

MAX_MAPS_PER_USER = 200
MAX_MAPS_PAYLOAD_BYTES = 3 * 1024 * 1024
DOC_MAX_FETCH_BYTES = 2 * 1024 * 1024
DOC_MAX_LENGTH = 30000
DOC_TIMEOUT_SECONDS = 20

USER_ID_RE = re.compile(r"^[A-Za-z0-9._@:-]{1,128}$")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

AI_API_KEY = os.getenv("AI_API_KEY", "").strip()
AI_BASE_URL = (os.getenv("AI_BASE_URL") or os.getenv("AI_API_URL") or "https://openrouter.ai/api/v1").strip()
AI_MODEL = os.getenv("AI_MODEL", "openrouter/auto").strip()
AI_SITE_URL = os.getenv("AI_SITE_URL", "https://lingma.cornna.xyz").strip()
AI_SITE_NAME = os.getenv("AI_SITE_NAME", "LingMa").strip()
ENABLE_THINKING = os.getenv("ENABLE_THINKING", "false").strip().lower() in {"1", "true", "yes", "on"}
ENABLE_REMOTE_MINDMAP_SYNC = os.getenv("ENABLE_REMOTE_MINDMAP_SYNC", "false").strip().lower() in {"1", "true", "yes", "on"}

MINDMAP_DB_PATH = os.getenv("MINDMAP_DB_PATH", "/app/data/mindmaps.db").strip()
MINDMAP_LEGACY_FILE = os.getenv("MINDMAP_LEGACY_FILE", "/app/data/mindmaps.json").strip()
AUTH_DB_PATH = os.getenv("AUTH_DB_PATH", "/app/data/auth.db").strip()
SESSION_COOKIE_NAME = os.getenv("SESSION_COOKIE_NAME", "lingma_session").strip() or "lingma_session"
SESSION_TTL_SECONDS = max(3600, int(os.getenv("SESSION_TTL_SECONDS", "2592000") or "2592000"))
SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "").strip().lower()
PASSWORD_HASH_ITERATIONS = 120000


def parse_allowed_origins() -> List[str]:
    raw = os.getenv("ALLOWED_ORIGINS", "").strip()
    if not raw:
        return DEFAULT_ALLOWED_ORIGINS
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


def build_client() -> OpenAI:
    headers: Dict[str, str] = {}
    if AI_SITE_URL:
        headers["HTTP-Referer"] = AI_SITE_URL
    if AI_SITE_NAME:
        headers["X-Title"] = AI_SITE_NAME
    return OpenAI(base_url=AI_BASE_URL, api_key=AI_API_KEY, default_headers=headers or None)


client = build_client()
db_lock = threading.Lock()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_db_connection(db_path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def init_mindmap_db() -> None:
    os.makedirs(os.path.dirname(MINDMAP_DB_PATH), exist_ok=True)
    with db_lock:
        conn = get_db_connection(MINDMAP_DB_PATH)
        try:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS user_mindmaps (
                    user_id TEXT PRIMARY KEY,
                    maps_json TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            conn.commit()
        finally:
            conn.close()


def init_auth_db() -> None:
    os.makedirs(os.path.dirname(AUTH_DB_PATH), exist_ok=True)
    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    username TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    password_salt TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS user_sessions (
                    session_id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    expires_at TEXT NOT NULL,
                    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
                );
                CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
                CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
                """
            )
            conn.commit()
        finally:
            conn.close()


def normalize_node(node: Any) -> Dict[str, Any]:
    if not isinstance(node, dict):
        raise ValueError("Invalid node")
    title = str(node.get("title", "")).strip() or "Untitled Node"
    note = str(node.get("note", ""))[:8000]
    children_raw = node.get("children", [])
    children = [normalize_node(child) for child in children_raw] if isinstance(children_raw, list) else []
    node_id = str(node.get("id", "")).strip() or f"node_{int(datetime.now().timestamp() * 1000)}"
    return {
        "id": node_id,
        "title": title,
        "note": note,
        "collapsed": bool(node.get("collapsed", False)),
        "children": children,
    }


def normalize_map(data: Any) -> Dict[str, Any]:
    if not isinstance(data, dict):
        raise ValueError("Invalid map")
    source = data.get("source", {}) if isinstance(data.get("source"), dict) else {}
    source_type = source.get("type")
    if source_type not in {"topic", "url", "file"}:
        source_type = "topic"
    map_id = str(data.get("id", "")).strip() or f"map_{int(datetime.now().timestamp() * 1000)}"
    title = str(data.get("title", "")).strip() or "Untitled Mind Map"
    nodes_raw = data.get("nodes", [])
    nodes = [normalize_node(item) for item in nodes_raw] if isinstance(nodes_raw, list) else []
    created_at = str(data.get("createdAt", "")).strip() or now_iso()
    updated_at = str(data.get("updatedAt", "")).strip() or now_iso()
    return {
        "id": map_id,
        "title": title,
        "source": {
            "type": source_type,
            "value": str(source.get("value", ""))[:80000],
            "title": str(source.get("title", ""))[:512],
        },
        "nodes": nodes,
        "createdAt": created_at,
        "updatedAt": updated_at,
    }


def normalize_maps_payload(maps: Any) -> List[Dict[str, Any]]:
    if not isinstance(maps, list):
        raise ValueError("maps must be a list")
    if len(maps) > MAX_MAPS_PER_USER:
        raise ValueError(f"too many maps, max {MAX_MAPS_PER_USER}")
    normalized = [normalize_map(item) for item in maps]
    payload_size = len(json.dumps(normalized, ensure_ascii=False).encode("utf-8"))
    if payload_size > MAX_MAPS_PAYLOAD_BYTES:
        raise ValueError("maps payload too large")
    return normalized


def sanitize_user_id(user_id: Any) -> str:
    value = str(user_id or "").strip()
    if not USER_ID_RE.match(value):
        raise ValueError("Invalid userId")
    return value


def ensure_remote_mindmap_sync_enabled() -> None:
    if not ENABLE_REMOTE_MINDMAP_SYNC:
        raise HTTPException(status_code=403, detail="remote mind map sync is disabled")


def sanitize_email(email: Any) -> str:
    value = str(email or "").strip().lower()
    if len(value) > 320 or not EMAIL_RE.match(value):
        raise ValueError("Invalid email")
    return value


def sanitize_username(username: Any) -> str:
    value = str(username or "").strip()
    if not value:
        raise ValueError("username is required")
    if len(value) > 64:
        raise ValueError("username is too long")
    return value


def sanitize_password(password: Any) -> str:
    value = str(password or "")
    if len(value) < 6:
        raise ValueError("password must be at least 6 characters")
    if len(value) > 128:
        raise ValueError("password is too long")
    return value


def generate_user_id() -> str:
    return f"usr_{secrets.token_urlsafe(12)}"


def derive_password_hash(password: str, salt_b64: str) -> str:
    salt = base64.b64decode(salt_b64.encode("ascii"))
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PASSWORD_HASH_ITERATIONS)
    return base64.b64encode(digest).decode("ascii")


def create_password_record(password: str) -> Dict[str, str]:
    salt_b64 = base64.b64encode(secrets.token_bytes(16)).decode("ascii")
    return {
        "password_hash": derive_password_hash(password, salt_b64),
        "password_salt": salt_b64,
    }


def verify_password(password: str, password_hash: str, password_salt: str) -> bool:
    return derive_password_hash(password, password_salt) == password_hash


def serialize_user(row: sqlite3.Row) -> Dict[str, str]:
    return {
        "id": row["id"],
        "username": row["username"],
        "email": row["email"],
        "createdAt": row["created_at"],
    }


def cleanup_expired_sessions(conn: sqlite3.Connection) -> None:
    conn.execute("DELETE FROM user_sessions WHERE expires_at <= ?", (now_iso(),))


def create_session(user_id: str) -> str:
    session_id = secrets.token_urlsafe(32)
    created_at = now_iso()
    expires_at = datetime.fromtimestamp(datetime.now().timestamp() + SESSION_TTL_SECONDS, tz=timezone.utc).isoformat()

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            cleanup_expired_sessions(conn)
            conn.execute(
                """
                INSERT INTO user_sessions(session_id, user_id, created_at, expires_at)
                VALUES(?, ?, ?, ?)
                """,
                (session_id, user_id, created_at, expires_at),
            )
            conn.commit()
        finally:
            conn.close()

    return session_id


def should_secure_session_cookie(request: Request) -> bool:
    if SESSION_COOKIE_SECURE in {"1", "true", "yes", "on"}:
        return True
    if SESSION_COOKIE_SECURE in {"0", "false", "no", "off"}:
        return False

    forwarded_proto = (request.headers.get("x-forwarded-proto") or "").strip().lower()
    if forwarded_proto:
        return forwarded_proto == "https"

    host = (request.headers.get("host") or "").strip().lower()
    return request.url.scheme == "https" and "localhost" not in host and "127.0.0.1" not in host


def apply_session_cookie(response: JSONResponse, request: Request, session_id: str) -> None:
    response.set_cookie(
        SESSION_COOKIE_NAME,
        session_id,
        max_age=SESSION_TTL_SECONDS,
        httponly=True,
        secure=should_secure_session_cookie(request),
        samesite="lax",
        path="/",
    )


def clear_session_cookie(response: JSONResponse, request: Request) -> None:
    response.delete_cookie(
        SESSION_COOKIE_NAME,
        httponly=True,
        secure=should_secure_session_cookie(request),
        samesite="lax",
        path="/",
    )


def get_authenticated_user(request: Request) -> sqlite3.Row | None:
    session_id = request.cookies.get(SESSION_COOKIE_NAME)
    if not session_id:
        return None

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            cleanup_expired_sessions(conn)
            row = conn.execute(
                """
                SELECT users.id, users.username, users.email, users.created_at
                FROM user_sessions
                JOIN users ON users.id = user_sessions.user_id
                WHERE user_sessions.session_id = ? AND user_sessions.expires_at > ?
                """,
                (session_id, now_iso()),
            ).fetchone()
            conn.commit()
            return row
        finally:
            conn.close()


def require_authenticated_user(request: Request) -> sqlite3.Row:
    user = get_authenticated_user(request)
    if user is None:
        raise HTTPException(status_code=401, detail="authentication required")
    return user
def migrate_legacy_store() -> None:
    if not MINDMAP_LEGACY_FILE or not os.path.exists(MINDMAP_LEGACY_FILE):
        return
    with db_lock:
        conn = get_db_connection(MINDMAP_DB_PATH)
        try:
            row = conn.execute("SELECT COUNT(1) FROM user_mindmaps").fetchone()
            if row and row[0] > 0:
                return
            with open(MINDMAP_LEGACY_FILE, "r", encoding="utf-8") as f:
                raw = f.read().lstrip("\ufeff")
            if not raw.strip():
                return
            payload = json.loads(raw)
            users = payload.get("users", {}) if isinstance(payload, dict) else {}
            for raw_user_id, entry in users.items():
                try:
                    user_id = sanitize_user_id(raw_user_id)
                    maps = normalize_maps_payload(entry.get("maps", []))
                    updated_at = str(entry.get("updatedAt", "")).strip() or now_iso()
                    conn.execute(
                        """
                        INSERT INTO user_mindmaps(user_id, maps_json, updated_at)
                        VALUES(?, ?, ?)
                        ON CONFLICT(user_id) DO UPDATE SET
                          maps_json=excluded.maps_json,
                          updated_at=excluded.updated_at
                        """,
                        (user_id, json.dumps(maps, ensure_ascii=False), updated_at),
                    )
                except Exception:
                    continue
            conn.commit()
        finally:
            conn.close()


def ensure_public_url(target_url: str) -> None:
    parsed = urlparse(target_url)
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("Only http/https URLs are allowed")
    host = (parsed.hostname or "").strip().lower()
    if not host:
        raise ValueError("Invalid URL")
    if host == "localhost" or host.endswith(".local"):
        raise ValueError("Local domains are not allowed")

    try:
        infos = socket.getaddrinfo(host, None)
    except Exception as exc:
        raise ValueError("DNS lookup failed") from exc

    for item in infos:
        ip_str = item[4][0]
        ip = ipaddress.ip_address(ip_str)
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_multicast or ip.is_reserved:
            raise ValueError("Private network targets are not allowed")


def html_to_text(raw_html: str) -> str:
    cleaned = re.sub(r"<script[\s\S]*?</script>", " ", raw_html, flags=re.IGNORECASE)
    cleaned = re.sub(r"<style[\s\S]*?</style>", " ", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"</(p|div|li|h[1-6]|br)>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"<li>", "- ", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"<[^>]+>", " ", cleaned)
    cleaned = html.unescape(cleaned)
    cleaned = re.sub(r"\s+\n", "\n", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


def fetch_document(target_url: str, max_length: int) -> Dict[str, Any]:
    ensure_public_url(target_url)
    req = UrlRequest(
        target_url,
        headers={
            "User-Agent": "LingMaMindMapBot/1.0",
            "Accept": "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
        },
    )
    with urlopen(req, timeout=DOC_TIMEOUT_SECONDS) as resp:
        final_url = resp.geturl()
        ensure_public_url(final_url)
        raw_bytes = resp.read(DOC_MAX_FETCH_BYTES + 1)
        if len(raw_bytes) > DOC_MAX_FETCH_BYTES:
            raise ValueError("Content too large")
        content_type = (resp.headers.get("Content-Type") or "").lower()
        raw_text = raw_bytes.decode("utf-8", errors="ignore")
        title = urlparse(final_url).hostname or "Document"
        if "text/html" in content_type or "<html" in raw_text.lower():
            match = re.search(r"<title[^>]*>([^<]*)</title>", raw_text, flags=re.IGNORECASE)
            if match:
                title = html.unescape(match.group(1)).strip() or title
            text = html_to_text(raw_text)
        else:
            text = raw_text

    normalized = re.sub(r"\s+", " ", text).strip()
    return {
        "url": final_url,
        "title": title,
        "text": normalized[:max_length],
        "length": len(normalized),
    }


def build_request_payload(body: Dict[str, Any], stream: bool) -> Dict[str, Any]:
    messages = body.get("messages")
    if not isinstance(messages, list) or not messages:
        raise HTTPException(status_code=400, detail="messages is required")

    payload: Dict[str, Any] = {
        "model": body.get("model") or AI_MODEL,
        "messages": messages,
        "stream": stream,
        "temperature": body.get("temperature", 0.7),
        "max_tokens": body.get("max_tokens", 8192),
    }

    extra_body = body.get("extra_body")
    if extra_body is None and ENABLE_THINKING:
        extra_body = {"enable_thinking": True}
    if extra_body is not None:
        payload["extra_body"] = extra_body
    return payload


@app.post("/api/ai")
async def chat_completion(request: Request):
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    payload = build_request_payload(body, stream=False)
    try:
        response = client.chat.completions.create(**payload)
    except Exception as exc:
        message = str(exc)
        status_code = 504 if "timeout" in message.lower() else 502
        raise HTTPException(status_code=status_code, detail=message) from exc
    return JSONResponse(content=response.model_dump())


@app.post("/api/ai/stream")
async def chat_completion_stream(request: Request):
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    payload = build_request_payload(body, stream=True)

    def event_stream():
        try:
            stream = client.chat.completions.create(**payload)
            for chunk in stream:
                if not chunk.choices:
                    continue
                yield f"data: {json.dumps(chunk.model_dump(), ensure_ascii=False)}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as exc:
            yield f"data: {json.dumps({'error': str(exc)}, ensure_ascii=False)}\n\n"

    headers = {
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    }
    return StreamingResponse(event_stream(), media_type="text/event-stream", headers=headers)


@app.post("/api/doc")
async def doc_fetch(request: Request):
    body = await request.json()
    target_url = str(body.get("url", "")).strip()
    if not target_url:
        raise HTTPException(status_code=400, detail="url is required")
    max_length = int(body.get("maxLength") or 16000)
    max_length = max(1000, min(max_length, DOC_MAX_LENGTH))
    try:
        return JSONResponse(content=fetch_document(target_url, max_length))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.get("/api/auth/session")
async def auth_session(request: Request):
    user = get_authenticated_user(request)
    if user is None:
        raise HTTPException(status_code=401, detail="not authenticated")
    return JSONResponse(content={"user": serialize_user(user)})


@app.post("/api/auth/register")
async def auth_register(request: Request):
    body = await request.json()
    try:
        username = sanitize_username(body.get("username"))
        email = sanitize_email(body.get("email"))
        password = sanitize_password(body.get("password"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    password_record = create_password_record(password)
    created_at = now_iso()
    user_id = generate_user_id()

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
            if existing is not None:
                raise HTTPException(status_code=409, detail="email already registered")

            conn.execute(
                """
                INSERT INTO users(id, username, email, password_hash, password_salt, created_at)
                VALUES(?, ?, ?, ?, ?, ?)
                """,
                (user_id, username, email, password_record["password_hash"], password_record["password_salt"], created_at),
            )
            conn.commit()
        finally:
            conn.close()

    session_id = create_session(user_id)
    response = JSONResponse(
        content={
            "user": {
                "id": user_id,
                "username": username,
                "email": email,
                "createdAt": created_at,
            }
        }
    )
    apply_session_cookie(response, request, session_id)
    return response


@app.post("/api/auth/login")
async def auth_login(request: Request):
    body = await request.json()
    try:
        email = sanitize_email(body.get("email"))
        password = sanitize_password(body.get("password"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            row = conn.execute(
                """
                SELECT id, username, email, password_hash, password_salt, created_at
                FROM users
                WHERE email = ?
                """,
                (email,),
            ).fetchone()
        finally:
            conn.close()

    if row is None or not verify_password(password, row["password_hash"], row["password_salt"]):
        raise HTTPException(status_code=401, detail="invalid email or password")

    session_id = create_session(row["id"])
    response = JSONResponse(content={"user": serialize_user(row)})
    apply_session_cookie(response, request, session_id)
    return response


@app.post("/api/auth/logout")
async def auth_logout(request: Request):
    session_id = request.cookies.get(SESSION_COOKIE_NAME)

    if session_id:
        with db_lock:
            conn = get_db_connection(AUTH_DB_PATH)
            try:
                conn.execute("DELETE FROM user_sessions WHERE session_id = ?", (session_id,))
                conn.commit()
            finally:
                conn.close()

    response = JSONResponse(content={"ok": True})
    clear_session_cookie(response, request)
    return response


@app.post("/api/mindmaps/load")
async def load_mindmaps(request: Request):
    ensure_remote_mindmap_sync_enabled()
    current_user = require_authenticated_user(request)
    user_id = current_user["id"]

    with db_lock:
        conn = get_db_connection(MINDMAP_DB_PATH)
        try:
            row = conn.execute(
                "SELECT maps_json, updated_at FROM user_mindmaps WHERE user_id = ?",
                (user_id,),
            ).fetchone()
        finally:
            conn.close()

    if not row:
        return JSONResponse(content={"maps": [], "updatedAt": None})

    try:
        maps = normalize_maps_payload(json.loads(row[0]))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"stored data is invalid: {exc}") from exc
    return JSONResponse(content={"maps": maps, "updatedAt": row[1]})


@app.post("/api/mindmaps/save")
async def save_mindmaps(request: Request):
    ensure_remote_mindmap_sync_enabled()
    current_user = require_authenticated_user(request)
    body = await request.json()
    try:
        user_id = current_user["id"]
        maps = normalize_maps_payload(body.get("maps"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    updated_at = now_iso()
    maps_json = json.dumps(maps, ensure_ascii=False)

    with db_lock:
        conn = get_db_connection(MINDMAP_DB_PATH)
        try:
            conn.execute(
                """
                INSERT INTO user_mindmaps(user_id, maps_json, updated_at)
                VALUES(?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                  maps_json=excluded.maps_json,
                  updated_at=excluded.updated_at
                """,
                (user_id, maps_json, updated_at),
            )
            conn.commit()
        finally:
            conn.close()

    return JSONResponse(content={"maps": maps, "updatedAt": updated_at})


init_auth_db()
if ENABLE_REMOTE_MINDMAP_SYNC:
    init_mindmap_db()
    migrate_legacy_store()
