import html
import ipaddress
import json
import os
import re
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

AI_API_KEY = os.getenv("AI_API_KEY", "").strip()
AI_BASE_URL = (os.getenv("AI_BASE_URL") or os.getenv("AI_API_URL") or "https://openrouter.ai/api/v1").strip()
AI_MODEL = os.getenv("AI_MODEL", "openrouter/auto").strip()
AI_SITE_URL = os.getenv("AI_SITE_URL", "https://lingma.cornna.xyz").strip()
AI_SITE_NAME = os.getenv("AI_SITE_NAME", "LingMa").strip()
ENABLE_THINKING = os.getenv("ENABLE_THINKING", "false").strip().lower() in {"1", "true", "yes", "on"}
ENABLE_REMOTE_MINDMAP_SYNC = os.getenv("ENABLE_REMOTE_MINDMAP_SYNC", "false").strip().lower() in {"1", "true", "yes", "on"}

MINDMAP_DB_PATH = os.getenv("MINDMAP_DB_PATH", "/app/data/mindmaps.db").strip()
MINDMAP_LEGACY_FILE = os.getenv("MINDMAP_LEGACY_FILE", "/app/data/mindmaps.json").strip()


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
    allow_credentials=False,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_db_connection() -> sqlite3.Connection:
    return sqlite3.connect(MINDMAP_DB_PATH)


def init_mindmap_db() -> None:
    os.makedirs(os.path.dirname(MINDMAP_DB_PATH), exist_ok=True)
    with db_lock:
        conn = get_db_connection()
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


def migrate_legacy_store() -> None:
    if not MINDMAP_LEGACY_FILE or not os.path.exists(MINDMAP_LEGACY_FILE):
        return
    with db_lock:
        conn = get_db_connection()
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


@app.post("/api/mindmaps/load")
async def load_mindmaps(request: Request):
    ensure_remote_mindmap_sync_enabled()
    body = await request.json()
    try:
        user_id = sanitize_user_id(body.get("userId"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    with db_lock:
        conn = get_db_connection()
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
    body = await request.json()
    try:
        user_id = sanitize_user_id(body.get("userId"))
        maps = normalize_maps_payload(body.get("maps"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    updated_at = now_iso()
    maps_json = json.dumps(maps, ensure_ascii=False)

    with db_lock:
        conn = get_db_connection()
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


if ENABLE_REMOTE_MINDMAP_SYNC:
    init_mindmap_db()
    migrate_legacy_store()
