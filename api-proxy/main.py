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
from typing import Any, Dict, Iterator, List, Optional, Tuple
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request as UrlRequest
from urllib.request import urlopen

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

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
AI_REASONING_EFFORT = (os.getenv("AI_REASONING_EFFORT") or ("high" if ENABLE_THINKING else "")).strip().lower()
AI_REQUEST_TIMEOUT_SECONDS = max(30, int(os.getenv("AI_REQUEST_TIMEOUT_SECONDS", "300") or "300"))
ENABLE_REMOTE_MINDMAP_SYNC = os.getenv("ENABLE_REMOTE_MINDMAP_SYNC", "false").strip().lower() in {"1", "true", "yes", "on"}

AI_PROTOCOL_RESPONSES = "responses"
SUPPORTED_REASONING_EFFORTS = {"low", "medium", "high"}

MINDMAP_DB_PATH = os.getenv("MINDMAP_DB_PATH", "/app/data/mindmaps.db").strip()
MINDMAP_LEGACY_FILE = os.getenv("MINDMAP_LEGACY_FILE", "/app/data/mindmaps.json").strip()
AUTH_DB_PATH = os.getenv("AUTH_DB_PATH", "/app/data/auth.db").strip()
SESSION_COOKIE_NAME = os.getenv("SESSION_COOKIE_NAME", "lingma_session").strip() or "lingma_session"
SESSION_TTL_SECONDS = max(3600, int(os.getenv("SESSION_TTL_SECONDS", "2592000") or "2592000"))
SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "").strip().lower()
PASSWORD_HASH_ITERATIONS = 120000
ALLOWED_SKILL_LEVELS = {"beginner", "intermediate", "advanced"}
VALID_SKILL_LEVELS = {"beginner", "foundation", "intermediate", "advanced"}
VALID_TARGET_LANGUAGES = {"c", "cpp", "java", "csharp", "python"}


def parse_allowed_origins() -> List[str]:
    raw = os.getenv("ALLOWED_ORIGINS", "").strip()
    if not raw:
        return DEFAULT_ALLOWED_ORIGINS
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


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
                    skill_level TEXT NOT NULL DEFAULT 'beginner',
                    target_language TEXT NOT NULL DEFAULT 'cpp',
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
            columns = {row["name"] for row in conn.execute("PRAGMA table_info(users)")}
            if "skill_level" not in columns:
                conn.execute("ALTER TABLE users ADD COLUMN skill_level TEXT NOT NULL DEFAULT 'beginner'")
            if "target_language" not in columns:
                conn.execute("ALTER TABLE users ADD COLUMN target_language TEXT NOT NULL DEFAULT 'cpp'")
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


def sanitize_skill_level(skill_level: Any) -> str:
    value = str(skill_level or "beginner").strip().lower()
    if value not in VALID_SKILL_LEVELS:
        raise ValueError("invalid skill level")
    return value


def sanitize_target_language(target_language: Any) -> str:
    value = str(target_language or "cpp").strip().lower()
    if value not in VALID_TARGET_LANGUAGES:
        raise ValueError("invalid target language")
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
        "skillLevel": row["skill_level"],
        "targetLanguage": row["target_language"],
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
                SELECT users.id, users.username, users.email, users.skill_level, users.target_language, users.created_at
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


def detect_protocol_from_url(api_url: str) -> str:
    lower = (api_url or "").lower()
    if "/responses" in lower:
        return AI_PROTOCOL_RESPONSES
    return AI_PROTOCOL_RESPONSES


def apply_protocol_to_url(api_url: str, protocol: str) -> str:
    base = (api_url or "").strip().rstrip("/")
    if not base:
        return base
    lower = base.lower()
    if lower.endswith("/chat/completions"):
        if protocol == AI_PROTOCOL_RESPONSES:
            return base[: -len("/chat/completions")] + "/responses"
        return base
    if lower.endswith("/responses"):
        return base
    if "/responses" in lower or "/chat/completions" in lower:
        return base
    if protocol == AI_PROTOCOL_RESPONSES:
        return f"{base}/responses"
    return base


def resolve_responses_upstream_url() -> str:
    return apply_protocol_to_url(AI_BASE_URL, detect_protocol_from_url(AI_BASE_URL))


def responses_token_key(api_url: str) -> str:
    host = urlparse(api_url or "").netloc.lower()
    if host in {"api.openai.com", "gmn.chuangzuoli.com"}:
        return "max_output_tokens"
    return "max_tokens"


def should_omit_responses_temperature(api_url: str) -> bool:
    host = urlparse(api_url or "").netloc.lower()
    return host == "gmn.chuangzuoli.com"


def build_upstream_headers() -> Dict[str, str]:
    headers = {
        "Authorization": f"Bearer {AI_API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; tumafang/1.0; +https://lingma.cornna.xyz)",
    }
    if AI_SITE_URL:
        headers["HTTP-Referer"] = AI_SITE_URL
    if AI_SITE_NAME:
        headers["X-Title"] = AI_SITE_NAME
    return headers


def parse_boolish(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "yes", "on"}
    return bool(value)


def extract_text_content(content: Any) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, dict):
        text = content.get("text")
        if isinstance(text, str):
            return text
        nested = content.get("content")
        if nested is not None:
            return extract_text_content(nested)
    if isinstance(content, list):
        parts: List[str] = []
        for item in content:
            text = extract_text_content(item)
            if text:
                parts.append(text)
        return "\n".join(parts).strip()
    return ""


def build_responses_input(messages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    for message in messages:
        if not isinstance(message, dict):
            continue
        role = str(message.get("role") or "user").strip().lower() or "user"
        if role not in {"system", "developer", "user", "assistant"}:
            role = "user"
        text = extract_text_content(message.get("content"))
        if not text:
            continue
        items.append(
            {
                "role": role,
                "content": [{"type": "input_text", "text": text}],
            }
        )
    if not items:
        raise HTTPException(status_code=400, detail="messages is required")
    return items


def resolve_reasoning_payload(body: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    reasoning = body.get("reasoning")
    payload = dict(reasoning) if isinstance(reasoning, dict) else {}
    effort = str(payload.get("effort") or body.get("reasoning_effort") or AI_REASONING_EFFORT or "").strip().lower()
    if effort in SUPPORTED_REASONING_EFFORTS:
        payload["effort"] = effort
    elif "effort" in payload:
        payload.pop("effort", None)
    return payload or None


def normalize_token_value(value: Any) -> int:
    try:
        return max(1, int(value))
    except Exception as exc:
        raise HTTPException(status_code=400, detail="invalid max_tokens") from exc


def build_responses_payload(body: Dict[str, Any], stream: Optional[bool] = None) -> Dict[str, Any]:
    payload = dict(body or {})
    payload["model"] = str(payload.get("model") or AI_MODEL).strip() or AI_MODEL
    if stream is not None:
        payload["stream"] = stream

    if "input" not in payload:
        messages = payload.get("messages")
        if not isinstance(messages, list) or not messages:
            raise HTTPException(status_code=400, detail="messages is required")
        payload["input"] = build_responses_input(messages)
    payload.pop("messages", None)

    token_key = responses_token_key(resolve_responses_upstream_url())
    if "max_tokens" in payload or "max_output_tokens" in payload:
        token_value = payload.get("max_output_tokens", payload.get("max_tokens"))
        payload.pop("max_tokens", None)
        payload.pop("max_output_tokens", None)
        payload[token_key] = normalize_token_value(token_value)

    if should_omit_responses_temperature(resolve_responses_upstream_url()):
        payload.pop("temperature", None)

    reasoning = resolve_reasoning_payload(payload)
    payload.pop("reasoning_effort", None)
    if reasoning is not None:
        payload["reasoning"] = reasoning
    else:
        payload.pop("reasoning", None)
    return payload


def build_legacy_request_payload(body: Dict[str, Any], stream: bool) -> Dict[str, Any]:
    messages = body.get("messages")
    if not isinstance(messages, list) or not messages:
        raise HTTPException(status_code=400, detail="messages is required")

    normalized: Dict[str, Any] = {
        "model": body.get("model") or AI_MODEL,
        "messages": messages,
        "stream": stream,
        "temperature": body.get("temperature", 0.7),
        "max_tokens": body.get("max_tokens", body.get("max_output_tokens", 8192)),
    }

    if isinstance(body.get("metadata"), dict):
        normalized["metadata"] = body["metadata"]

    return build_responses_payload(normalized, stream=stream)


def extract_error_message(body_text: str) -> str:
    trimmed = (body_text or "").strip()
    if not trimmed:
        return "upstream request failed"
    try:
        payload = json.loads(trimmed)
    except Exception:
        return trimmed[:1000]
    if isinstance(payload, dict):
        error = payload.get("error")
        if isinstance(error, dict):
            message = error.get("message")
            if isinstance(message, str) and message.strip():
                return message.strip()
        detail = payload.get("detail")
        if isinstance(detail, str) and detail.strip():
            return detail.strip()
    return trimmed[:1000]


def resolve_responses_token_key_override(body_text: str) -> Optional[str]:
    lower = (body_text or "").lower()
    if "unsupported parameter: max_output_tokens" in lower:
        return "max_tokens"
    if "unsupported parameter: max_tokens" in lower:
        return ""
    return None


def override_responses_token_key(payload: Dict[str, Any], token_key: str, fallback: int) -> Dict[str, Any]:
    value = fallback
    for key in ("max_output_tokens", "max_tokens"):
        if key in payload:
            try:
                value = int(payload[key])
            except Exception:
                value = fallback
    payload = dict(payload)
    payload.pop("max_output_tokens", None)
    payload.pop("max_tokens", None)
    if token_key:
        payload[token_key] = value
    return payload


def downgrade_reasoning_on_timeout(payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    reasoning = payload.get("reasoning")
    if not isinstance(reasoning, dict):
        return None

    effort = str(reasoning.get("effort") or "").strip().lower()
    next_effort = {
        "high": "medium",
        "medium": "low",
    }.get(effort)

    if not next_effort:
        return None

    next_payload = dict(payload)
    next_reasoning = dict(reasoning)
    next_reasoning["effort"] = next_effort
    next_payload["reasoning"] = next_reasoning
    return next_payload


def open_upstream_responses(payload: Dict[str, Any]) -> Any:
    upstream_url = resolve_responses_upstream_url()
    fallback_tokens = normalize_token_value(
        payload.get("max_output_tokens", payload.get("max_tokens", 8192)),
    )
    current_payload = dict(payload)
    token_override_attempted = False

    while True:
        try:
            headers = build_upstream_headers()
            if parse_boolish(current_payload.get("stream")):
                headers["Accept"] = "text/event-stream"
            request = UrlRequest(
                upstream_url,
                data=json.dumps(current_payload, ensure_ascii=False).encode("utf-8"),
                headers=headers,
                method="POST",
            )
            return urlopen(request, timeout=AI_REQUEST_TIMEOUT_SECONDS)
        except HTTPError as exc:
            body_text = exc.read().decode("utf-8", errors="replace")
            override_key = None if token_override_attempted else resolve_responses_token_key_override(body_text)
            if override_key is not None:
                current_payload = override_responses_token_key(current_payload, override_key, fallback_tokens)
                token_override_attempted = True
                continue
            if exc.code == 524:
                downgraded_payload = downgrade_reasoning_on_timeout(current_payload)
                if downgraded_payload is not None:
                    current_payload = downgraded_payload
                    continue
            raise HTTPException(status_code=exc.code, detail=extract_error_message(body_text)) from exc
        except URLError as exc:
            raise HTTPException(status_code=504, detail=str(exc.reason or exc)) from exc
        except HTTPException:
            raise
        except Exception as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc


def read_upstream_responses_json(payload: Dict[str, Any]) -> Dict[str, Any]:
    with open_upstream_responses(payload) as response:
        body_text = response.read().decode("utf-8", errors="replace")
    try:
        data = json.loads(body_text)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"invalid upstream response: {body_text[:500]}") from exc
    if not isinstance(data, dict):
        raise HTTPException(status_code=502, detail="invalid upstream response payload")
    return data


def extract_responses_json_text(data: Dict[str, Any]) -> Tuple[str, str]:
    output_text = data.get("output_text")
    if isinstance(output_text, str) and output_text.strip():
        return output_text.strip(), "output_text"

    texts: List[str] = []
    output = data.get("output")
    if isinstance(output, list):
        for item in output:
            if not isinstance(item, dict):
                continue
            contents = item.get("content")
            if not isinstance(contents, list):
                continue
            for content in contents:
                if isinstance(content, dict):
                    text = content.get("text")
                    if isinstance(text, str) and text.strip():
                        texts.append(text.strip())
    if texts:
        return "\n".join(texts).strip(), "output[].content[].text"

    return "", "empty"


def build_legacy_chat_response(data: Dict[str, Any]) -> Dict[str, Any]:
    text, _ = extract_responses_json_text(data)
    return {
        "id": str(data.get("id") or f"chatcmpl-{secrets.token_urlsafe(12)}"),
        "object": "chat.completion",
        "created": int(datetime.now(timezone.utc).timestamp()),
        "model": str(data.get("model") or AI_MODEL),
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": text,
                },
                "finish_reason": "stop",
            }
        ],
        "usage": data.get("usage"),
    }


def build_legacy_stream_chunk(chunk_id: str, model: str, delta: Optional[str] = None, finish_reason: Optional[str] = None) -> Dict[str, Any]:
    payload: Dict[str, Any] = {
        "id": chunk_id,
        "object": "chat.completion.chunk",
        "created": int(datetime.now(timezone.utc).timestamp()),
        "model": model,
        "choices": [
            {
                "index": 0,
                "delta": {},
                "finish_reason": finish_reason,
            }
        ],
    }
    if delta:
        payload["choices"][0]["delta"] = {"content": delta}
        payload["choices"][0]["finish_reason"] = None
    return payload


def iter_sse_events(response: Any) -> Iterator[str]:
    buffer: List[str] = []
    for raw_line in response:
        line = raw_line.decode("utf-8", errors="replace")
        if line in {"\n", "\r\n", "\r"}:
            if buffer:
                yield "\n".join(buffer)
                buffer = []
            continue
        buffer.append(line.rstrip("\r\n"))
    if buffer:
        yield "\n".join(buffer)


def extract_sse_data(event_block: str) -> str:
    data_lines: List[str] = []
    for line in event_block.splitlines():
        if line.startswith("data:"):
            data_lines.append(line[5:].lstrip())
    return "\n".join(data_lines).strip()


@app.get("/v1/models")
async def list_models():
    return JSONResponse(
        content={
            "object": "list",
            "data": [
                {
                    "id": AI_MODEL,
                    "object": "model",
                    "created": int(datetime.now(timezone.utc).timestamp()),
                    "owned_by": "tumafang",
                }
            ],
        }
    )


@app.post("/v1/responses")
async def responses_proxy(request: Request):
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    stream = parse_boolish(body.get("stream"))
    payload = build_responses_payload(body, stream=stream)

    if stream:
        def event_stream() -> Iterator[bytes]:
            try:
                with open_upstream_responses(payload) as upstream:
                    for raw_line in upstream:
                        yield raw_line
            except HTTPException as exc:
                yield f"data: {json.dumps({'error': {'message': str(exc.detail)}}, ensure_ascii=False)}\n\n".encode("utf-8")
                yield b"data: [DONE]\n\n"

        headers = {
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
        return StreamingResponse(event_stream(), media_type="text/event-stream", headers=headers)

    data = read_upstream_responses_json(payload)
    return JSONResponse(content=data)


@app.post("/api/ai")
async def chat_completion(request: Request):
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    payload = build_legacy_request_payload(body, stream=False)
    data = read_upstream_responses_json(payload)
    return JSONResponse(content=build_legacy_chat_response(data))


@app.post("/api/ai/stream")
async def chat_completion_stream(request: Request):
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    payload = build_legacy_request_payload(body, stream=True)

    def event_stream() -> Iterator[str]:
        chunk_id = f"chatcmpl-{secrets.token_urlsafe(12)}"
        model_name = str(payload.get("model") or AI_MODEL)
        sent_delta = False
        stop_sent = False
        try:
            with open_upstream_responses(payload) as upstream:
                for event_block in iter_sse_events(upstream):
                    data_text = extract_sse_data(event_block)
                    if not data_text or data_text == "[DONE]":
                        continue
                    try:
                        event = json.loads(data_text)
                    except Exception:
                        continue
                    if not isinstance(event, dict):
                        continue

                    response_obj = event.get("response")
                    if isinstance(response_obj, dict):
                        chunk_id = str(response_obj.get("id") or chunk_id)
                        model_name = str(response_obj.get("model") or model_name)

                    event_type = str(event.get("type") or "")
                    if event_type == "response.output_text.delta":
                        delta = event.get("delta")
                        if isinstance(delta, str) and delta:
                            sent_delta = True
                            yield f"data: {json.dumps(build_legacy_stream_chunk(chunk_id, model_name, delta=delta), ensure_ascii=False)}\n\n"
                    elif event_type == "response.output_text.done":
                        done_text = event.get("text")
                        if isinstance(done_text, str) and done_text and not sent_delta:
                            sent_delta = True
                            yield f"data: {json.dumps(build_legacy_stream_chunk(chunk_id, model_name, delta=done_text), ensure_ascii=False)}\n\n"
                    elif event_type == "response.completed":
                        if isinstance(response_obj, dict) and not sent_delta:
                            final_text, _ = extract_responses_json_text(response_obj)
                            if final_text:
                                yield f"data: {json.dumps(build_legacy_stream_chunk(chunk_id, model_name, delta=final_text), ensure_ascii=False)}\n\n"
                        yield f"data: {json.dumps(build_legacy_stream_chunk(chunk_id, model_name, finish_reason='stop'), ensure_ascii=False)}\n\n"
                        yield "data: [DONE]\n\n"
                        stop_sent = True
                        return
                    elif event_type == "response.failed" or isinstance(event.get("error"), dict):
                        error = event.get("error") if isinstance(event.get("error"), dict) else {}
                        message = str(error.get("message") or "upstream stream failed")
                        yield f"data: {json.dumps({'error': message}, ensure_ascii=False)}\n\n"
                        return
        except HTTPException as exc:
            yield f"data: {json.dumps({'error': str(exc.detail)}, ensure_ascii=False)}\n\n"
            return
        except Exception as exc:
            yield f"data: {json.dumps({'error': str(exc)}, ensure_ascii=False)}\n\n"
            return

        if not stop_sent:
            yield f"data: {json.dumps(build_legacy_stream_chunk(chunk_id, model_name, finish_reason='stop'), ensure_ascii=False)}\n\n"
            yield "data: [DONE]\n\n"

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
        skill_level = sanitize_skill_level(body.get("skillLevel"))
        target_language = sanitize_target_language(body.get("targetLanguage"))
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
                INSERT INTO users(id, username, email, password_hash, password_salt, skill_level, target_language, created_at)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    user_id,
                    username,
                    email,
                    password_record["password_hash"],
                    password_record["password_salt"],
                    skill_level,
                    target_language,
                    created_at,
                ),
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
                "skillLevel": skill_level,
                "targetLanguage": target_language,
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
                SELECT id, username, email, password_hash, password_salt, skill_level, target_language, created_at
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


@app.post("/api/auth/profile")
async def auth_update_profile(request: Request):
    user = require_authenticated_user(request)
    body = await request.json()
    try:
        skill_level = sanitize_skill_level(body.get("skillLevel", user["skill_level"]))
        target_language = sanitize_target_language(body.get("targetLanguage", user["target_language"]))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            conn.execute(
                """
                UPDATE users
                SET skill_level = ?, target_language = ?
                WHERE id = ?
                """,
                (skill_level, target_language, user["id"]),
            )
            row = conn.execute(
                """
                SELECT id, username, email, created_at, skill_level, target_language
                FROM users
                WHERE id = ?
                """,
                (user["id"],),
            ).fetchone()
            conn.commit()
        finally:
            conn.close()

    return JSONResponse(content={"user": serialize_user(row)})


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
