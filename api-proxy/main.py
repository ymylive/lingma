import base64
import hashlib
import html
import http.client
import ipaddress
import json
import logging
import os
import re
import secrets
import socket
import sqlite3
import ssl
import sys
import threading
from collections import defaultdict
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, Iterator, List, Optional, Tuple
from urllib.parse import urlparse

import requests
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from app_modules.judge_review import (
    JudgeAiReviewNormalizationError,
    build_judge_ai_review_deferred,
    build_judge_ai_review_prompt,
    build_judge_ai_review_skipped,
    build_judge_ai_review_unavailable,
    build_judge_forward_payload,
    collect_judge_failure_evidence,
    compact_dict,
    extract_optional_exercise_context,
    normalize_judge_ai_review_payload,
    should_trigger_judge_ai_review,
)
from app_modules.auth_recovery import (
    PASSWORD_RESET_CODE_TTL_SECONDS,
    PASSWORD_RESET_MAX_ATTEMPTS,
    PASSWORD_RESET_REQUEST_COOLDOWN_SECONDS,
    create_password_reset_code_record,
    generate_password_reset_code,
    send_password_reset_email,
    sanitize_password_reset_code,
    verify_password_reset_code,
)

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

logger = logging.getLogger("lingma.api_proxy")

MAX_MAPS_PER_USER = 200
MAX_MAPS_PAYLOAD_BYTES = 3 * 1024 * 1024
DOC_MAX_FETCH_BYTES = 2 * 1024 * 1024
DOC_MAX_LENGTH = 30000
DOC_TIMEOUT_SECONDS = 20

USER_ID_RE = re.compile(r"^[A-Za-z0-9._@:-]{1,128}$")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def env_bool(*names: str, default: bool = False) -> bool:
    for name in names:
        value = os.getenv(name)
        if value is None:
            continue
        return value.strip().lower() in {"1", "true", "yes", "on"}
    return default


def first_env(*names: str) -> str:
    for name in names:
        value = os.getenv(name)
        if value and value.strip():
            return value.strip()
    return ""

AI_API_KEY = os.getenv("AI_API_KEY", "").strip()
AI_BASE_URL = (os.getenv("AI_BASE_URL") or os.getenv("AI_API_URL") or "https://api.cornna.xyz/responses").strip()
AI_MODEL = os.getenv("AI_MODEL", "gpt-5.4").strip()
AI_SITE_URL = os.getenv("AI_SITE_URL", "https://lingma.cornna.xyz").strip()
AI_SITE_NAME = os.getenv("AI_SITE_NAME", "LingMa").strip()
ENABLE_THINKING = os.getenv("ENABLE_THINKING", "false").strip().lower() in {"1", "true", "yes", "on"}
AI_REASONING_EFFORT = (os.getenv("AI_REASONING_EFFORT") or ("high" if ENABLE_THINKING else "")).strip().lower()
AI_REQUEST_TIMEOUT_SECONDS = max(30, int(os.getenv("AI_REQUEST_TIMEOUT_SECONDS", "300") or "300"))
AI_CONNECT_TIMEOUT_SECONDS = max(5.0, float(os.getenv("AI_CONNECT_TIMEOUT_SECONDS", "20") or "20"))
AI_TRUST_ENV = env_bool("AI_TRUST_ENV", "NOFX_AI_TRUST_ENV", default=False)
ENABLE_REMOTE_MINDMAP_SYNC = os.getenv("ENABLE_REMOTE_MINDMAP_SYNC", "false").strip().lower() in {"1", "true", "yes", "on"}
JUDGE_BASE_URL = (os.getenv("JUDGE_BASE_URL") or "http://127.0.0.1:3002").strip().rstrip("/")
JUDGE_INTERNAL_TOKEN = (os.getenv("JUDGE_INTERNAL_TOKEN") or "").strip()
JUDGE_REQUEST_TIMEOUT_SECONDS = max(5.0, float(os.getenv("JUDGE_REQUEST_TIMEOUT_SECONDS", "40") or "40"))

JUDGE_AI_REVIEW_STATUS_GENERATED = "generated"
JUDGE_AI_REVIEW_STATUS_SKIPPED = "skipped"
JUDGE_AI_REVIEW_STATUS_DEFERRED = "deferred"
JUDGE_AI_REVIEW_STATUS_UNAVAILABLE = "unavailable"
JUDGE_AI_REVIEW_MODE = (os.getenv("JUDGE_AI_REVIEW_MODE") or "sync").strip().lower()
JUDGE_AI_REVIEW_DIMENSION_LIMITS = {
    "correctness": 40,
    "boundaryRobustness": 20,
    "complexityAndPerformance": 20,
    "codeQualityAndReadability": 20,
}
JUDGE_AI_REVIEW_MAX_OUTPUT_TOKENS = 1400

AI_PROTOCOL_COMPAT = "compat"
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
VIBE_TRACKS = {"frontend", "backend", "debugging", "refactoring", "review"}
VIBE_DIFFICULTIES = {"beginner", "intermediate", "advanced"}
VIBE_DIMENSION_LIMITS = {
    "goal_clarity": 30,
    "boundary_constraints": 25,
    "verification_design": 25,
    "output_format": 20,
}
VIBE_MIN_PROMPT_LENGTH = 24
VIBE_MAX_PROMPT_LENGTH = 12000
VIBE_HISTORY_LIMIT = 20
VIBE_PROFILE_WINDOW = 5


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
                CREATE TABLE IF NOT EXISTS password_reset_codes (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    email TEXT NOT NULL,
                    code_hash TEXT NOT NULL,
                    code_salt TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    expires_at TEXT NOT NULL,
                    consumed_at TEXT,
                    attempt_count INTEGER NOT NULL DEFAULT 0,
                    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
                );
                CREATE INDEX IF NOT EXISTS idx_password_reset_codes_user_id ON password_reset_codes(user_id);
                CREATE INDEX IF NOT EXISTS idx_password_reset_codes_email ON password_reset_codes(email);
                CREATE INDEX IF NOT EXISTS idx_password_reset_codes_expires_at ON password_reset_codes(expires_at);
                CREATE TABLE IF NOT EXISTS vibe_challenges (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    track TEXT NOT NULL,
                    difficulty TEXT NOT NULL,
                    title TEXT NOT NULL,
                    scenario TEXT NOT NULL,
                    requirements_json TEXT NOT NULL,
                    constraints_json TEXT NOT NULL,
                    success_criteria_json TEXT NOT NULL,
                    expected_focus_json TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
                );
                CREATE INDEX IF NOT EXISTS idx_vibe_challenges_user_id ON vibe_challenges(user_id);
                CREATE INDEX IF NOT EXISTS idx_vibe_challenges_created_at ON vibe_challenges(created_at);
                CREATE TABLE IF NOT EXISTS vibe_prompt_attempts (
                    id TEXT PRIMARY KEY,
                    challenge_id TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    prompt_text TEXT NOT NULL,
                    total_score INTEGER NOT NULL,
                    goal_clarity_score INTEGER NOT NULL,
                    boundary_constraints_score INTEGER NOT NULL,
                    verification_design_score INTEGER NOT NULL,
                    output_format_score INTEGER NOT NULL,
                    strengths_json TEXT NOT NULL,
                    weaknesses_json TEXT NOT NULL,
                    rewrite_example TEXT NOT NULL,
                    next_difficulty_recommendation TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY(challenge_id) REFERENCES vibe_challenges(id) ON DELETE CASCADE,
                    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
                );
                CREATE INDEX IF NOT EXISTS idx_vibe_attempts_user_id ON vibe_prompt_attempts(user_id);
                CREATE INDEX IF NOT EXISTS idx_vibe_attempts_challenge_id ON vibe_prompt_attempts(challenge_id);
                CREATE INDEX IF NOT EXISTS idx_vibe_attempts_created_at ON vibe_prompt_attempts(created_at);
                CREATE TABLE IF NOT EXISTS vibe_user_profiles (
                    user_id TEXT PRIMARY KEY,
                    recommended_track TEXT NOT NULL,
                    recommended_difficulty TEXT NOT NULL,
                    weakest_dimension TEXT,
                    recent_average_score REAL,
                    frontend_score REAL,
                    backend_score REAL,
                    debugging_score REAL,
                    refactoring_score REAL,
                    review_score REAL,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
                );
                CREATE TABLE IF NOT EXISTS vibe_frontend_build_sessions (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    summary TEXT NOT NULL,
                    status TEXT NOT NULL,
                    latest_artifact_id TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
                );
                CREATE INDEX IF NOT EXISTS idx_vibe_frontend_build_sessions_user_id ON vibe_frontend_build_sessions(user_id);
                CREATE INDEX IF NOT EXISTS idx_vibe_frontend_build_sessions_updated_at ON vibe_frontend_build_sessions(updated_at);
                CREATE TABLE IF NOT EXISTS vibe_frontend_build_turns (
                    id TEXT PRIMARY KEY,
                    session_id TEXT NOT NULL,
                    role TEXT NOT NULL,
                    prompt_text TEXT NOT NULL,
                    summary TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY(session_id) REFERENCES vibe_frontend_build_sessions(id) ON DELETE CASCADE
                );
                CREATE INDEX IF NOT EXISTS idx_vibe_frontend_build_turns_session_id ON vibe_frontend_build_turns(session_id);
                CREATE INDEX IF NOT EXISTS idx_vibe_frontend_build_turns_created_at ON vibe_frontend_build_turns(created_at);
                CREATE TABLE IF NOT EXISTS vibe_frontend_build_artifacts (
                    id TEXT PRIMARY KEY,
                    session_id TEXT NOT NULL,
                    turn_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    summary TEXT NOT NULL,
                    html TEXT NOT NULL,
                    css TEXT NOT NULL,
                    js TEXT NOT NULL,
                    merged_html TEXT NOT NULL,
                    next_suggestions_json TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY(session_id) REFERENCES vibe_frontend_build_sessions(id) ON DELETE CASCADE,
                    FOREIGN KEY(turn_id) REFERENCES vibe_frontend_build_turns(id) ON DELETE CASCADE
                );
                CREATE INDEX IF NOT EXISTS idx_vibe_frontend_build_artifacts_session_id ON vibe_frontend_build_artifacts(session_id);
                CREATE INDEX IF NOT EXISTS idx_vibe_frontend_build_artifacts_created_at ON vibe_frontend_build_artifacts(created_at);
                """
            )
            columns = {row["name"] for row in conn.execute("PRAGMA table_info(users)")}
            if "skill_level" not in columns:
                conn.execute("ALTER TABLE users ADD COLUMN skill_level TEXT NOT NULL DEFAULT 'beginner'")
            if "target_language" not in columns:
                conn.execute("ALTER TABLE users ADD COLUMN target_language TEXT NOT NULL DEFAULT 'cpp'")
            vibe_profile_columns = {row["name"] for row in conn.execute("PRAGMA table_info(vibe_user_profiles)")}
            profile_column_defaults = {
                "recommended_track": "'frontend'",
                "recommended_difficulty": "'beginner'",
                "weakest_dimension": "NULL",
                "recent_average_score": "NULL",
                "frontend_score": "NULL",
                "backend_score": "NULL",
                "debugging_score": "NULL",
                "refactoring_score": "NULL",
                "review_score": "NULL",
                "updated_at": f"'{now_iso()}'",
            }
            for column_name, default_value in profile_column_defaults.items():
                if column_name not in vibe_profile_columns:
                    conn.execute(
                        f"ALTER TABLE vibe_user_profiles ADD COLUMN {column_name} "
                        f"{'TEXT' if column_name in {'recommended_track', 'recommended_difficulty', 'weakest_dimension', 'updated_at'} else 'REAL'} "
                        f"DEFAULT {default_value}"
                    )
            conn.commit()
        finally:
            conn.close()


def default_vibe_difficulty_for_skill(skill_level: str) -> str:
    normalized = str(skill_level or "").strip().lower()
    if normalized in {"advanced"}:
        return "advanced"
    if normalized in {"intermediate"}:
        return "intermediate"
    return "beginner"


def sanitize_vibe_track(track: Any, fallback: str = "frontend") -> str:
    value = str(track or "").strip().lower() or fallback
    if value not in VIBE_TRACKS:
        raise ValueError("Invalid vibe track")
    return value


def sanitize_vibe_difficulty(difficulty: Any, fallback: str = "beginner") -> str:
    value = str(difficulty or "").strip().lower() or fallback
    if value not in VIBE_DIFFICULTIES:
        raise ValueError("Invalid vibe difficulty")
    return value


def sanitize_vibe_prompt(prompt: Any) -> str:
    value = str(prompt or "").strip()
    if len(value) < VIBE_MIN_PROMPT_LENGTH:
        raise ValueError("prompt is too short")
    if len(value) > VIBE_MAX_PROMPT_LENGTH:
        raise ValueError("prompt is too long")
    return value


def sanitize_app_locale(locale: Any) -> str:
    value = str(locale or "").strip()
    return "en-US" if value == "en-US" else "zh-CN"


def sanitize_string_list(values: Any, field_name: str, min_items: int = 1, max_items: int = 8) -> List[str]:
    if not isinstance(values, list):
        raise ValueError(f"{field_name} must be a list")
    sanitized: List[str] = []
    for item in values:
        text = str(item or "").strip()
        if text:
            sanitized.append(text[:800])
    if len(sanitized) < min_items:
        raise ValueError(f"{field_name} must contain at least {min_items} item")
    return sanitized[:max_items]


def normalize_expected_focus(values: Any) -> List[str]:
    raw_values = sanitize_string_list(values, "expected_focus", min_items=1, max_items=4)
    normalized: List[str] = []
    for value in raw_values:
        key = value.strip().lower().replace("-", "_").replace(" ", "_")
        if key in VIBE_DIMENSION_LIMITS and key not in normalized:
            normalized.append(key)
    if not normalized:
        raise ValueError("expected_focus must reference known scoring dimensions")
    return normalized


def parse_upstream_json_object(data: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(data, dict):
        raise HTTPException(status_code=502, detail="invalid upstream response payload")

    text, _ = extract_responses_json_text(data)
    raw_payload = text.strip()
    if not raw_payload:
        raw_payload = json.dumps(data, ensure_ascii=False)

    try:
        parsed = json.loads(raw_payload)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="invalid structured AI output") from exc

    if not isinstance(parsed, dict):
        raise HTTPException(status_code=502, detail="invalid structured AI output")
    return parsed


def normalize_generated_challenge_payload(payload: Dict[str, Any], track: str, difficulty: str, user_id: str) -> Dict[str, Any]:
    try:
        title = str(payload.get("title") or "").strip()
        scenario = str(payload.get("scenario") or "").strip()
        if not title:
            raise ValueError("title is required")
        if not scenario:
            raise ValueError("scenario is required")
        requirements = sanitize_string_list(payload.get("requirements"), "requirements")
        constraints = sanitize_string_list(payload.get("constraints"), "constraints")
        success_criteria = sanitize_string_list(payload.get("success_criteria"), "success_criteria")
        expected_focus = normalize_expected_focus(payload.get("expected_focus"))
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=f"invalid challenge payload: {exc}") from exc

    return {
        "id": f"challenge_{secrets.token_urlsafe(12)}",
        "userId": user_id,
        "track": track,
        "difficulty": difficulty,
        "title": title[:200],
        "scenario": scenario[:4000],
        "requirements": requirements,
        "constraints": constraints,
        "successCriteria": success_criteria,
        "expectedFocus": expected_focus,
        "createdAt": now_iso(),
    }


def normalize_dimension_scores(values: Any) -> Dict[str, int]:
    if not isinstance(values, dict):
        raise ValueError("dimension_scores must be an object")
    normalized: Dict[str, int] = {}
    for key, max_score in VIBE_DIMENSION_LIMITS.items():
        raw_value = values.get(key)
        if raw_value is None:
            raise ValueError(f"{key} is required")
        score = int(raw_value)
        if score < 0 or score > max_score:
            raise ValueError(f"{key} must be between 0 and {max_score}")
        normalized[key] = score
    return normalized


def normalize_evaluation_payload(payload: Dict[str, Any], challenge_id: str) -> Dict[str, Any]:
    try:
        total_score = int(payload.get("total_score"))
        if total_score < 0 or total_score > 100:
            raise ValueError("total_score must be between 0 and 100")
        dimension_scores = normalize_dimension_scores(payload.get("dimension_scores"))
        strengths = sanitize_string_list(payload.get("strengths"), "strengths", min_items=1, max_items=4)
        weaknesses = sanitize_string_list(payload.get("weaknesses"), "weaknesses", min_items=1, max_items=4)
        rewrite_example = str(payload.get("rewrite_example") or "").strip()
        if not rewrite_example:
            raise ValueError("rewrite_example is required")
        next_difficulty = sanitize_vibe_difficulty(payload.get("next_difficulty_recommendation"))
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=f"invalid evaluation payload: {exc}") from exc

    return {
        "challengeId": challenge_id,
        "total_score": total_score,
        "dimension_scores": dimension_scores,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "rewrite_example": rewrite_example[:6000],
        "next_difficulty_recommendation": next_difficulty,
        "createdAt": now_iso(),
    }


def merge_frontend_build_html(title: str, html_content: str, css: str, js: str) -> str:
    safe_title = html.escape(title or "Frontend Build")
    return (
        "<!DOCTYPE html>\n"
        "<html>\n"
        "<head>\n"
        '  <meta charset="utf-8" />\n'
        '  <meta name="viewport" content="width=device-width, initial-scale=1" />\n'
        f"  <title>{safe_title}</title>\n"
        f"  <style>\n{css}\n  </style>\n"
        "</head>\n"
        "<body>\n"
        f"{html_content}\n"
        f"  <script>\n{js}\n  </script>\n"
        "</body>\n"
        "</html>"
    )


def normalize_frontend_build_payload(payload: Dict[str, Any], session_id: str, turn_id: str) -> Dict[str, Any]:
    try:
        title = str(payload.get("title") or "").strip()
        summary = str(payload.get("summary") or "").strip()
        html_content = str(payload.get("html") or "").strip()
        css = str(payload.get("css") or "")
        js = str(payload.get("js") or "")
        if not title:
            raise ValueError("title is required")
        if not summary:
            raise ValueError("summary is required")
        if not html_content:
            raise ValueError("html is required")
        next_suggestions = sanitize_string_list(payload.get("nextSuggestions"), "nextSuggestions", min_items=1, max_items=6)
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=f"invalid frontend build payload: {exc}") from exc

    return {
        "id": f"artifact_{secrets.token_urlsafe(12)}",
        "sessionId": session_id,
        "turnId": turn_id,
        "title": title[:200],
        "summary": summary[:4000],
        "html": html_content[:120000],
        "css": css[:120000],
        "js": js[:120000],
        "mergedHtml": merge_frontend_build_html(title, html_content, css, js)[:240000],
        "nextSuggestions": next_suggestions,
        "createdAt": now_iso(),
    }


def serialize_vibe_challenge_row(row: sqlite3.Row) -> Dict[str, Any]:
    return {
        "id": row["id"],
        "userId": row["user_id"],
        "track": row["track"],
        "difficulty": row["difficulty"],
        "title": row["title"],
        "scenario": row["scenario"],
        "requirements": json.loads(row["requirements_json"]),
        "constraints": json.loads(row["constraints_json"]),
        "successCriteria": json.loads(row["success_criteria_json"]),
        "expectedFocus": json.loads(row["expected_focus_json"]),
        "createdAt": row["created_at"],
    }


def serialize_vibe_evaluation_row(row: sqlite3.Row) -> Dict[str, Any]:
    return {
        "id": row["id"],
        "challengeId": row["challenge_id"],
        "promptText": row["prompt_text"],
        "total_score": row["total_score"],
        "dimension_scores": {
            "goal_clarity": row["goal_clarity_score"],
            "boundary_constraints": row["boundary_constraints_score"],
            "verification_design": row["verification_design_score"],
            "output_format": row["output_format_score"],
        },
        "strengths": json.loads(row["strengths_json"]),
        "weaknesses": json.loads(row["weaknesses_json"]),
        "rewrite_example": row["rewrite_example"],
        "next_difficulty_recommendation": row["next_difficulty_recommendation"],
        "createdAt": row["created_at"],
    }


def serialize_vibe_frontend_build_artifact_row(row: sqlite3.Row) -> Dict[str, Any]:
    return {
        "id": row["id"],
        "sessionId": row["session_id"],
        "turnId": row["turn_id"],
        "title": row["title"],
        "summary": row["summary"],
        "html": row["html"],
        "css": row["css"],
        "js": row["js"],
        "mergedHtml": row["merged_html"],
        "nextSuggestions": json.loads(row["next_suggestions_json"]),
        "createdAt": row["created_at"],
    }


def serialize_vibe_frontend_build_session_row(row: sqlite3.Row) -> Dict[str, Any]:
    return {
        "id": row["id"],
        "userId": row["user_id"],
        "title": row["title"],
        "summary": row["summary"],
        "status": row["status"],
        "latestArtifactId": row["latest_artifact_id"],
        "createdAt": row["created_at"],
        "updatedAt": row["updated_at"],
    }


def insert_vibe_challenge(conn: sqlite3.Connection, challenge: Dict[str, Any]) -> None:
    conn.execute(
        """
        INSERT INTO vibe_challenges(
            id, user_id, track, difficulty, title, scenario,
            requirements_json, constraints_json, success_criteria_json,
            expected_focus_json, created_at
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            challenge["id"],
            challenge["userId"],
            challenge["track"],
            challenge["difficulty"],
            challenge["title"],
            challenge["scenario"],
            json.dumps(challenge["requirements"], ensure_ascii=False),
            json.dumps(challenge["constraints"], ensure_ascii=False),
            json.dumps(challenge["successCriteria"], ensure_ascii=False),
            json.dumps(challenge["expectedFocus"], ensure_ascii=False),
            challenge["createdAt"],
        ),
    )


def get_vibe_challenge(conn: sqlite3.Connection, challenge_id: str, user_id: str) -> Optional[sqlite3.Row]:
    return conn.execute(
        """
        SELECT *
        FROM vibe_challenges
        WHERE id = ? AND user_id = ?
        """,
        (challenge_id, user_id),
    ).fetchone()


def insert_vibe_attempt(conn: sqlite3.Connection, attempt_id: str, user_id: str, prompt_text: str, evaluation: Dict[str, Any]) -> None:
    scores = evaluation["dimension_scores"]
    conn.execute(
        """
        INSERT INTO vibe_prompt_attempts(
            id, challenge_id, user_id, prompt_text, total_score,
            goal_clarity_score, boundary_constraints_score, verification_design_score,
            output_format_score, strengths_json, weaknesses_json, rewrite_example,
            next_difficulty_recommendation, created_at
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            attempt_id,
            evaluation["challengeId"],
            user_id,
            prompt_text,
            evaluation["total_score"],
            scores["goal_clarity"],
            scores["boundary_constraints"],
            scores["verification_design"],
            scores["output_format"],
            json.dumps(evaluation["strengths"], ensure_ascii=False),
            json.dumps(evaluation["weaknesses"], ensure_ascii=False),
            evaluation["rewrite_example"],
            evaluation["next_difficulty_recommendation"],
            evaluation["createdAt"],
        ),
    )


def insert_vibe_frontend_build_session(conn: sqlite3.Connection, session: Dict[str, Any]) -> None:
    conn.execute(
        """
        INSERT INTO vibe_frontend_build_sessions(
            id, user_id, title, summary, status, latest_artifact_id, created_at, updated_at
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            session["id"],
            session["userId"],
            session["title"],
            session["summary"],
            session["status"],
            session.get("latestArtifactId"),
            session["createdAt"],
            session["updatedAt"],
        ),
    )


def insert_vibe_frontend_build_turn(conn: sqlite3.Connection, turn: Dict[str, Any]) -> None:
    conn.execute(
        """
        INSERT INTO vibe_frontend_build_turns(id, session_id, role, prompt_text, summary, created_at)
        VALUES(?, ?, ?, ?, ?, ?)
        """,
        (
            turn["id"],
            turn["sessionId"],
            turn["role"],
            turn["promptText"],
            turn["summary"],
            turn["createdAt"],
        ),
    )


def insert_vibe_frontend_build_artifact(conn: sqlite3.Connection, artifact: Dict[str, Any]) -> None:
    conn.execute(
        """
        INSERT INTO vibe_frontend_build_artifacts(
            id, session_id, turn_id, title, summary, html, css, js, merged_html, next_suggestions_json, created_at
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            artifact["id"],
            artifact["sessionId"],
            artifact["turnId"],
            artifact["title"],
            artifact["summary"],
            artifact["html"],
            artifact["css"],
            artifact["js"],
            artifact["mergedHtml"],
            json.dumps(artifact["nextSuggestions"], ensure_ascii=False),
            artifact["createdAt"],
        ),
    )


def update_vibe_frontend_build_session_latest_artifact(
    conn: sqlite3.Connection,
    session_id: str,
    artifact_id: str,
    title: str,
    summary: str,
) -> None:
    conn.execute(
        """
        UPDATE vibe_frontend_build_sessions
        SET latest_artifact_id = ?, title = ?, summary = ?, updated_at = ?
        WHERE id = ?
        """,
        (artifact_id, title, summary, now_iso(), session_id),
    )


def get_vibe_frontend_build_session(conn: sqlite3.Connection, session_id: str, user_id: str) -> Optional[sqlite3.Row]:
    return conn.execute(
        """
        SELECT *
        FROM vibe_frontend_build_sessions
        WHERE id = ? AND user_id = ?
        """,
        (session_id, user_id),
    ).fetchone()


def list_vibe_frontend_build_sessions(conn: sqlite3.Connection, user_id: str, limit: int = 12) -> List[sqlite3.Row]:
    return conn.execute(
        """
        SELECT *
        FROM vibe_frontend_build_sessions
        WHERE user_id = ?
        ORDER BY updated_at DESC
        LIMIT ?
        """,
        (user_id, limit),
    ).fetchall()


def list_vibe_frontend_build_turn_rows(conn: sqlite3.Connection, session_id: str) -> List[sqlite3.Row]:
    return conn.execute(
        """
        SELECT *
        FROM vibe_frontend_build_turns
        WHERE session_id = ?
        ORDER BY created_at ASC
        """,
        (session_id,),
    ).fetchall()


def get_vibe_frontend_build_latest_artifact_row(conn: sqlite3.Connection, session_id: str) -> Optional[sqlite3.Row]:
    return conn.execute(
        """
        SELECT *
        FROM vibe_frontend_build_artifacts
        WHERE session_id = ?
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (session_id,),
    ).fetchone()


def get_recent_vibe_attempt_rows(conn: sqlite3.Connection, user_id: str, limit: int = VIBE_PROFILE_WINDOW) -> List[sqlite3.Row]:
    return conn.execute(
        """
        SELECT
            vibe_prompt_attempts.*,
            vibe_challenges.track,
            vibe_challenges.difficulty
        FROM vibe_prompt_attempts
        JOIN vibe_challenges ON vibe_challenges.id = vibe_prompt_attempts.challenge_id
        WHERE vibe_prompt_attempts.user_id = ?
        ORDER BY vibe_prompt_attempts.created_at DESC
        LIMIT ?
        """,
        (user_id, limit),
    ).fetchall()


def list_vibe_history_rows(conn: sqlite3.Connection, user_id: str, limit: int = VIBE_HISTORY_LIMIT) -> List[sqlite3.Row]:
    return conn.execute(
        """
        SELECT
            vibe_prompt_attempts.*,
            vibe_challenges.track,
            vibe_challenges.difficulty,
            vibe_challenges.title,
            vibe_challenges.scenario,
            vibe_challenges.requirements_json,
            vibe_challenges.constraints_json,
            vibe_challenges.success_criteria_json,
            vibe_challenges.expected_focus_json,
            vibe_challenges.created_at AS challenge_created_at
        FROM vibe_prompt_attempts
        JOIN vibe_challenges ON vibe_challenges.id = vibe_prompt_attempts.challenge_id
        WHERE vibe_prompt_attempts.user_id = ?
        ORDER BY vibe_prompt_attempts.created_at DESC
        LIMIT ?
        """,
        (user_id, limit),
    ).fetchall()


def calculate_vibe_profile_snapshot(attempt_rows: List[sqlite3.Row], fallback_track: str, fallback_difficulty: str) -> Dict[str, Any]:
    if not attempt_rows:
        return {
            "recommended_track": fallback_track,
            "recommended_difficulty": fallback_difficulty,
            "weakest_dimension": None,
            "recent_average_score": None,
            "track_scores": {track: None for track in sorted(VIBE_TRACKS)},
        }

    recent_average = round(sum(int(row["total_score"]) for row in attempt_rows) / len(attempt_rows), 2)
    if recent_average >= 85:
        recommended_difficulty = "advanced"
    elif recent_average >= 60:
        recommended_difficulty = "intermediate"
    else:
        recommended_difficulty = "beginner"

    track_values: Dict[str, List[int]] = defaultdict(list)
    dimension_values: Dict[str, List[int]] = defaultdict(list)
    for row in attempt_rows:
        track_values[str(row["track"])].append(int(row["total_score"]))
        dimension_values["goal_clarity"].append(int(row["goal_clarity_score"]))
        dimension_values["boundary_constraints"].append(int(row["boundary_constraints_score"]))
        dimension_values["verification_design"].append(int(row["verification_design_score"]))
        dimension_values["output_format"].append(int(row["output_format_score"]))

    track_scores = {
        track: round(sum(values) / len(values), 2) if values else None
        for track, values in ((track_name, track_values.get(track_name, [])) for track_name in sorted(VIBE_TRACKS))
    }
    attempted_tracks = {track: score for track, score in track_scores.items() if score is not None}
    if attempted_tracks:
        recommended_track = min(attempted_tracks.items(), key=lambda item: (item[1], item[0]))[0]
    else:
        recommended_track = fallback_track

    weakest_dimension = min(
        (
            (dimension, round(sum(scores) / len(scores), 2))
            for dimension, scores in dimension_values.items()
            if scores
        ),
        key=lambda item: (item[1], item[0]),
    )[0]

    return {
        "recommended_track": recommended_track,
        "recommended_difficulty": recommended_difficulty,
        "weakest_dimension": weakest_dimension,
        "recent_average_score": recent_average,
        "track_scores": track_scores,
    }


def upsert_vibe_profile(conn: sqlite3.Connection, user_id: str, profile_snapshot: Dict[str, Any]) -> None:
    track_scores = profile_snapshot["track_scores"]
    conn.execute(
        """
        INSERT INTO vibe_user_profiles(
            user_id, recommended_track, recommended_difficulty, weakest_dimension,
            recent_average_score, frontend_score, backend_score, debugging_score,
            refactoring_score, review_score, updated_at
        )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            recommended_track = excluded.recommended_track,
            recommended_difficulty = excluded.recommended_difficulty,
            weakest_dimension = excluded.weakest_dimension,
            recent_average_score = excluded.recent_average_score,
            frontend_score = excluded.frontend_score,
            backend_score = excluded.backend_score,
            debugging_score = excluded.debugging_score,
            refactoring_score = excluded.refactoring_score,
            review_score = excluded.review_score,
            updated_at = excluded.updated_at
        """,
        (
            user_id,
            profile_snapshot["recommended_track"],
            profile_snapshot["recommended_difficulty"],
            profile_snapshot["weakest_dimension"],
            profile_snapshot["recent_average_score"],
            track_scores["frontend"],
            track_scores["backend"],
            track_scores["debugging"],
            track_scores["refactoring"],
            track_scores["review"],
            now_iso(),
        ),
    )


def get_stored_vibe_profile(conn: sqlite3.Connection, user_id: str) -> Optional[sqlite3.Row]:
    return conn.execute(
        "SELECT * FROM vibe_user_profiles WHERE user_id = ?",
        (user_id,),
    ).fetchone()


def serialize_vibe_profile_row(row: Optional[sqlite3.Row], fallback_track: str, fallback_difficulty: str) -> Dict[str, Any]:
    if row is None:
        return {
            "recommendedTrack": fallback_track,
            "recommendedDifficulty": fallback_difficulty,
            "weakestDimension": None,
            "recentAverageScore": None,
            "trackScores": {track: None for track in sorted(VIBE_TRACKS)},
        }

    return {
        "recommendedTrack": row["recommended_track"],
        "recommendedDifficulty": row["recommended_difficulty"],
        "weakestDimension": row["weakest_dimension"],
        "recentAverageScore": row["recent_average_score"],
        "trackScores": {
            "frontend": row["frontend_score"],
            "backend": row["backend_score"],
            "debugging": row["debugging_score"],
            "refactoring": row["refactoring_score"],
            "review": row["review_score"],
        },
    }


def serialize_vibe_frontend_build_turn_row(row: sqlite3.Row) -> Dict[str, Any]:
    return {
        "id": row["id"],
        "sessionId": row["session_id"],
        "role": row["role"],
        "promptText": row["prompt_text"],
        "summary": row["summary"],
        "createdAt": row["created_at"],
    }


def build_vibe_frontend_build_session_payload(
    session_row: sqlite3.Row,
    turn_rows: Optional[List[sqlite3.Row]] = None,
    artifact_row: Optional[sqlite3.Row] = None,
) -> Dict[str, Any]:
    payload = serialize_vibe_frontend_build_session_row(session_row)
    if turn_rows is not None:
        payload["turns"] = [serialize_vibe_frontend_build_turn_row(row) for row in turn_rows]
    if artifact_row is not None:
        payload["latestArtifact"] = serialize_vibe_frontend_build_artifact_row(artifact_row)
    return payload


def persist_new_frontend_build_session(
    user_id: str,
    session_id: str,
    prompt_text: str,
    artifact: Dict[str, Any],
) -> Dict[str, Any]:
    created_at = now_iso()
    user_turn = {
        "id": f"frontend_turn_{secrets.token_urlsafe(12)}",
        "sessionId": session_id,
        "role": "user",
        "promptText": prompt_text,
        "summary": prompt_text[:400],
        "createdAt": created_at,
    }
    assistant_turn = {
        "id": artifact["turnId"],
        "sessionId": session_id,
        "role": "assistant",
        "promptText": artifact["summary"],
        "summary": artifact["summary"],
        "createdAt": artifact["createdAt"],
    }
    session = {
        "id": session_id,
        "userId": user_id,
        "title": artifact["title"],
        "summary": artifact["summary"],
        "status": "active",
        "latestArtifactId": artifact["id"],
        "createdAt": created_at,
        "updatedAt": created_at,
    }

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            insert_vibe_frontend_build_session(conn, session)
            insert_vibe_frontend_build_turn(conn, user_turn)
            insert_vibe_frontend_build_turn(conn, assistant_turn)
            insert_vibe_frontend_build_artifact(conn, artifact)
            conn.commit()
            session_row = get_vibe_frontend_build_session(conn, session_id, user_id)
            turn_rows = list_vibe_frontend_build_turn_rows(conn, session_id)
            artifact_row = get_vibe_frontend_build_latest_artifact_row(conn, session_id)
        finally:
            conn.close()

    if session_row is None or artifact_row is None:
        raise HTTPException(status_code=500, detail="failed to persist frontend build session")
    return build_vibe_frontend_build_session_payload(session_row, turn_rows, artifact_row)


def persist_frontend_build_follow_up(
    user_id: str,
    session_id: str,
    prompt_text: str,
    artifact: Dict[str, Any],
) -> Dict[str, Any]:
    user_turn = {
        "id": f"frontend_turn_{secrets.token_urlsafe(12)}",
        "sessionId": session_id,
        "role": "user",
        "promptText": prompt_text,
        "summary": prompt_text[:400],
        "createdAt": now_iso(),
    }
    assistant_turn = {
        "id": artifact["turnId"],
        "sessionId": session_id,
        "role": "assistant",
        "promptText": artifact["summary"],
        "summary": artifact["summary"],
        "createdAt": artifact["createdAt"],
    }

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            insert_vibe_frontend_build_turn(conn, user_turn)
            insert_vibe_frontend_build_turn(conn, assistant_turn)
            insert_vibe_frontend_build_artifact(conn, artifact)
            update_vibe_frontend_build_session_latest_artifact(conn, session_id, artifact["id"], artifact["title"], artifact["summary"])
            conn.commit()
            session_row = get_vibe_frontend_build_session(conn, session_id, user_id)
            turn_rows = list_vibe_frontend_build_turn_rows(conn, session_id)
            artifact_row = get_vibe_frontend_build_latest_artifact_row(conn, session_id)
        finally:
            conn.close()

    if session_row is None or artifact_row is None:
        raise HTTPException(status_code=500, detail="failed to update frontend build session")
    return build_vibe_frontend_build_session_payload(session_row, turn_rows, artifact_row)


def build_vibe_frontend_live_build_prompt(
    user_prompt: str,
    model: str,
    locale: str,
    *,
    session_summary: str = "",
    recent_turns: Optional[List[sqlite3.Row]] = None,
    latest_artifact: Optional[sqlite3.Row] = None,
) -> Dict[str, Any]:
    normalized_locale = sanitize_app_locale(locale)
    context_rows = (recent_turns or [])[-6:]
    if normalized_locale == "en-US":
        instructions = (
            "You are a senior frontend engineer building a real single-page HTML prototype from product requests. "
            "Return JSON only with keys: title, summary, html, css, js, nextSuggestions. "
            "All user-facing text must be natural American English. Do not output markdown, code fences, or commentary. "
            "html must contain body markup only. css must contain stylesheet rules only. js must contain browser-side JavaScript only. "
            "summary must briefly explain what changed in this version. nextSuggestions must be 1-4 concrete follow-up improvements."
        )
    else:
        instructions = (
            "你是资深前端工程师，需要根据产品需求构建一个真实的单页面 HTML 原型。 "
            "只返回 JSON，字段必须且只能是：title, summary, html, css, js, nextSuggestions。 "
            "所有面向用户的文案必须使用自然、专业的简体中文；不要输出 markdown、代码块或解释性前后缀。 "
            "html 只包含 body 内部结构；css 只包含样式规则；js 只包含浏览器侧脚本。 "
            "summary 用简短文字说明这一版完成了什么；nextSuggestions 给出 1-4 条可继续优化的具体建议。"
        )

    recent_turn_text = "\n".join(
        f"- {row['role']}: {str(row['summary'] or row['prompt_text'] or '').strip()[:400]}"
        for row in context_rows
    )
    latest_artifact_text = ""
    if latest_artifact is not None:
        latest_artifact_text = (
            f"\n[Latest Artifact Title]\n{latest_artifact['title']}\n"
            f"[Latest Artifact Summary]\n{latest_artifact['summary']}\n"
            f"[Latest mergedHtml]\n{latest_artifact['merged_html'][:12000]}\n"
        )

    user_text = (
        f"[Session Summary]\n{session_summary[:1200]}\n"
        f"[Recent Turns]\n{recent_turn_text or 'none'}\n"
        f"{latest_artifact_text}"
        f"[Current User Request]\n{user_prompt}"
    )
    return {
        "model": model,
        "input": [
            {
                "role": "system",
                "content": [{"type": "input_text", "text": instructions}],
            },
            {
                "role": "user",
                "content": [{"type": "input_text", "text": user_text}],
            },
        ],
        "max_output_tokens": 1800,
    }


def build_vibe_track_brief(track: str, locale: str) -> str:
    normalized_locale = sanitize_app_locale(locale)
    zh_briefs = {
        "frontend": "围绕现有 React/Vite/Tailwind 页面或组件改造，强调布局、交互、状态、可访问性或样式回归。",
        "backend": "围绕接口、鉴权、数据库、缓存、任务队列或部署代理，强调输入输出契约、兼容性和回归验证。",
        "debugging": "围绕线上缺陷、异常日志、复现路径和根因定位，强调证据收集、最小修复和验证闭环。",
        "refactoring": "围绕职责拆分、重复逻辑收口、模块边界清理或技术债治理，强调可回滚和低风险演进。",
        "review": "围绕代码审查、风险分级、性能/安全/正确性问题识别，强调给出明确结论和修复建议。",
    }
    en_briefs = {
        "frontend": "Use a real React/Vite/Tailwind page or component task focused on layout, interaction, state, accessibility, or styling regressions.",
        "backend": "Use an API, auth, database, cache, job, or deployment-proxy task focused on contracts, compatibility, and regression verification.",
        "debugging": "Use a production bug or failing flow focused on reproduction, evidence gathering, root-cause isolation, and a minimal fix.",
        "refactoring": "Use a maintainability task focused on tightening ownership, deduplicating logic, clarifying module boundaries, and keeping the rollout reversible.",
        "review": "Use a code-review task focused on correctness, performance, security, or release risk with explicit findings and remediation advice.",
    }
    briefs = en_briefs if normalized_locale == "en-US" else zh_briefs
    return briefs.get(track, briefs["frontend"])


def build_vibe_difficulty_brief(difficulty: str, locale: str) -> str:
    normalized_locale = sanitize_app_locale(locale)
    zh_briefs = {
        "beginner": "题目应控制在单模块或单链路内，边界清晰，避免跨多个系统协同。",
        "intermediate": "题目可以涉及两个相关模块，但依旧要有明确边界和可执行验证路径。",
        "advanced": "题目可以包含跨模块影响、兼容性压力或发布风险，但必须保持任务范围可评分、可落地。",
    }
    en_briefs = {
        "beginner": "Keep the task within one module or one delivery path, with obvious scope boundaries and low coordination cost.",
        "intermediate": "The task may span two related modules, but it still needs crisp boundaries and a concrete verification path.",
        "advanced": "The task may involve cross-module impact, compatibility pressure, or release risk, but it must remain bounded and scorable.",
    }
    briefs = en_briefs if normalized_locale == "en-US" else zh_briefs
    return briefs.get(difficulty, briefs["beginner"])


def build_vibe_generation_prompt(track: str, difficulty: str, profile: Dict[str, Any], user: sqlite3.Row, model: str, locale: str) -> Dict[str, Any]:
    normalized_locale = sanitize_app_locale(locale)
    if normalized_locale == "en-US":
        profile_summary = (
            f"recommendedTrack={profile['recommendedTrack']}, "
            f"recommendedDifficulty={profile['recommendedDifficulty']}, "
            f"weakestDimension={profile['weakestDimension'] or 'none'}, "
            f"skillLevel={user['skill_level']}, targetLanguage={user['target_language']}"
        )
        instructions = (
            "You are a senior software-engineering coach creating one realistic prompt-writing exercise for an AI-assisted coding lab. "
            "Return JSON only with exactly these keys: title, scenario, requirements, constraints, success_criteria, expected_focus. "
            "All user-facing fields must be written in natural American English. Do not mix in Chinese unless a code symbol, path, command, API name, or library name requires it. "
            "Do not output markdown, code fences, commentary, or unicode escape sequences. "
            "The exercise must feel like a real ticket from an existing product team, not a meta prompt-engineering lecture. "
            "Title: specific and concrete, naming the module, flow, or defect. "
            "Scenario: 2-4 sentences covering product context, the current problem, the requested outcome, and the expected deliverable. "
            "Requirements: 3-5 actionable items describing what the learner's prompt should ask the AI to do. "
            "Constraints: 2-4 hard boundaries that limit scope, dependencies, compatibility, rollout, or forbidden changes. "
            "Success criteria: 2-4 reviewable outcomes, including at least one verification or regression expectation. "
            "expected_focus must contain 2-4 items chosen only from goal_clarity, boundary_constraints, verification_design, output_format. "
            "Do not generate abstract prompt-engineering drills, checklist fragments, vague best-practice advice, or exercises whose entire topic is 'write a better prompt'. "
            "The task must revolve around one concrete bug, feature, refactor, or review scenario aligned to the requested track and difficulty."
        )
        user_text = (
            f"track={track}\n"
            f"difficulty={difficulty}\n"
            f"profile={profile_summary}\n"
            f"track_brief={build_vibe_track_brief(track, normalized_locale)}\n"
            f"difficulty_brief={build_vibe_difficulty_brief(difficulty, normalized_locale)}\n"
            "Make the exercise realistic, bounded, professional, and immediately usable in a training session."
        )
    else:
        profile_summary = (
            f"recommendedTrack={profile['recommendedTrack']}, "
            f"recommendedDifficulty={profile['recommendedDifficulty']}, "
            f"weakestDimension={profile['weakestDimension'] or 'none'}, "
            f"skillLevel={user['skill_level']}, targetLanguage={user['target_language']}"
        )
        instructions = (
            "你是资深软件工程教练，需要为 AI 协作编程训练场生成一道真实的 prompt 书写练习题。 "
            "只返回 JSON，对象字段必须且只能是：title, scenario, requirements, constraints, success_criteria, expected_focus。 "
            "所有面向用户的字段都必须使用自然、专业的简体中文；命令、路径、API 名、库名可以保留原文。 "
            "不要输出 markdown、代码块、解释性前后缀，也不要输出 \\uXXXX 形式的转义文本。 "
            "题目必须像真实研发团队里的工单，而不是 prompt 工程元讨论。 "
            "title 要具体，能看出模块、流程或缺陷。 "
            "scenario 用 2-4 句交代产品背景、当前问题、目标结果和期望交付物。 "
            "requirements 提供 3-5 条可执行要求，描述学员写出的 prompt 应该要求 AI 做什么。 "
            "constraints 提供 2-4 条硬性边界，限制改动范围、依赖、兼容性、上线方式或不可触碰区域。 "
            "success_criteria 提供 2-4 条可核查的完成标准，至少一条包含验证或回归要求。 "
            "expected_focus 必须给出 2-4 个评分维度，只能从 goal_clarity, boundary_constraints, verification_design, output_format 中选择。 "
            "禁止生成抽象题、清单碎片、空泛最佳实践总结、或题目本身只是“写一个更好的 prompt”。 "
            "整道题必须围绕一个具体 bug、feature、refactor 或 review 场景展开，并与给定赛道和难度匹配。"
        )
        user_text = (
            f"track={track}\n"
            f"difficulty={difficulty}\n"
            f"profile={profile_summary}\n"
            f"track_brief={build_vibe_track_brief(track, normalized_locale)}\n"
            f"difficulty_brief={build_vibe_difficulty_brief(difficulty, normalized_locale)}\n"
            "请生成真实、专业、边界清晰、可以直接用于训练的练习题。"
        )
    return {
        "model": model,
        "input": [
            {
                "role": "system",
                "content": [{"type": "input_text", "text": instructions}],
            },
            {
                "role": "user",
                "content": [{"type": "input_text", "text": user_text}],
            },
        ],
        "max_output_tokens": 900,
    }


def build_vibe_evaluation_prompt(challenge: Dict[str, Any], prompt_text: str, model: str, locale: str) -> Dict[str, Any]:
    normalized_locale = sanitize_app_locale(locale)
    if normalized_locale == "en-US":
        instructions = (
            "You are evaluating the quality of the user's software-engineering prompt only. Do not score hypothetical code quality. "
            "Return JSON only with keys: total_score, dimension_scores, strengths, weaknesses, rewrite_example, next_difficulty_recommendation. "
            "All user-facing fields must be written in natural American English. Do not output markdown, code fences, commentary, or unicode escape sequences. "
            "dimension_scores must include goal_clarity (0-30), boundary_constraints (0-25), verification_design (0-25), output_format (0-20). "
            "strengths and weaknesses must be concrete observations tied to the prompt, not generic advice. "
            "rewrite_example must be a polished, directly usable replacement prompt for this exact challenge, not an outline or checklist. "
            "next_difficulty_recommendation must be one of beginner, intermediate, advanced."
        )
    else:
        instructions = (
            "你只评估用户这段软件工程协作 prompt 的质量，不评估假设中的代码质量。 "
            "只返回 JSON，字段必须且只能是：total_score, dimension_scores, strengths, weaknesses, rewrite_example, next_difficulty_recommendation。 "
            "所有面向用户的字段都必须使用自然、专业的简体中文；不要输出 markdown、代码块、解释性前后缀，也不要输出 \\uXXXX 形式的转义文本。 "
            "dimension_scores 必须包含 goal_clarity (0-30), boundary_constraints (0-25), verification_design (0-25), output_format (0-20)。 "
            "strengths 和 weaknesses 必须是结合当前 prompt 的具体观察，不能写成空泛建议。 "
            "rewrite_example 必须是一段可以直接提交给 AI 的完整改写 prompt，而不是点评提纲或关键词列表。 "
            "next_difficulty_recommendation 只能是 beginner, intermediate, advanced。"
        )
    challenge_summary = json.dumps(
        {
            "track": challenge["track"],
            "difficulty": challenge["difficulty"],
            "title": challenge["title"],
            "scenario": challenge["scenario"],
            "requirements": challenge["requirements"],
            "constraints": challenge["constraints"],
            "successCriteria": challenge["successCriteria"],
            "expectedFocus": challenge["expectedFocus"],
        },
        ensure_ascii=False,
    )
    return {
        "model": model,
        "input": [
            {
                "role": "system",
                "content": [{"type": "input_text", "text": instructions}],
            },
            {
                "role": "user",
                "content": [{"type": "input_text", "text": f"challenge={challenge_summary}\nuser_prompt={prompt_text}"}],
            },
        ],
        "max_output_tokens": 1200,
    }


def normalize_node(node: Any) -> Dict[str, Any]:
    if not isinstance(node, dict):
        raise ValueError("Invalid node")

    def parse_collapsed(value: Any) -> bool:
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"true", "1", "yes", "on"}:
                return True
            if normalized in {"false", "0", "no", "off", ""}:
                return False
        if isinstance(value, (int, float)):
            return value != 0
        return False

    title = str(node.get("title", "")).strip() or "Untitled Node"
    note = str(node.get("note", ""))[:8000]
    children_raw = node.get("children", [])
    children = [normalize_node(child) for child in children_raw] if isinstance(children_raw, list) else []
    node_id = str(node.get("id", "")).strip() or f"node_{int(datetime.now().timestamp() * 1000)}"
    return {
        "id": node_id,
        "title": title,
        "note": note,
        "collapsed": parse_collapsed(node.get("collapsed", False)),
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


AUTH_REGISTRATION_FAILURE_DETAIL = "unable to create account"
AUTH_MISSING_USER_PASSWORD_SALT_B64 = base64.b64encode(b"lingma-missing-user").decode("ascii")
AUTH_MISSING_USER_PASSWORD_HASH = derive_password_hash(
    "LingMaMissingUserPassword!2026",
    AUTH_MISSING_USER_PASSWORD_SALT_B64,
)


def resolve_login_password_record(row: sqlite3.Row | None) -> Tuple[str, str]:
    if row is None:
        return AUTH_MISSING_USER_PASSWORD_HASH, AUTH_MISSING_USER_PASSWORD_SALT_B64
    return str(row["password_hash"]), str(row["password_salt"])


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


def resolve_public_target(target_url: str) -> Tuple[Any, str, int, str, List[str]]:
    parsed = urlparse(target_url)
    if parsed.scheme not in {"http", "https"}:
        raise ValueError("Only http/https URLs are allowed")
    host = (parsed.hostname or "").strip().lower()
    if not host:
        raise ValueError("Invalid URL")
    if host == "localhost" or host.endswith(".local"):
        raise ValueError("Local domains are not allowed")

    try:
        infos = socket.getaddrinfo(host, parsed.port or (443 if parsed.scheme == "https" else 80), type=socket.SOCK_STREAM)
    except Exception as exc:
        raise ValueError("DNS lookup failed") from exc

    resolved_ips: List[str] = []
    for item in infos:
        ip_str = item[4][0]
        ip = ipaddress.ip_address(ip_str)
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_multicast or ip.is_reserved:
            raise ValueError("Private network targets are not allowed")
        resolved_ips.append(ip_str)

    if not resolved_ips:
        raise ValueError("DNS lookup failed")

    path = parsed.path or "/"
    if parsed.query:
        path = f"{path}?{parsed.query}"
    return parsed, host, parsed.port or (443 if parsed.scheme == "https" else 80), path, resolved_ips


class PinnedHTTPConnection(http.client.HTTPConnection):
    def __init__(self, connect_host: str, host_header: str, *args: Any, **kwargs: Any) -> None:
        self._connect_host = connect_host
        super().__init__(host_header, *args, **kwargs)

    def connect(self) -> None:
        self.sock = socket.create_connection((self._connect_host, self.port), self.timeout, self.source_address)


class PinnedHTTPSConnection(http.client.HTTPSConnection):
    def __init__(self, connect_host: str, host_header: str, *args: Any, **kwargs: Any) -> None:
        self._connect_host = connect_host
        super().__init__(host_header, *args, **kwargs)

    def connect(self) -> None:
        sock = socket.create_connection((self._connect_host, self.port), self.timeout, self.source_address)
        self.sock = self._context.wrap_socket(sock, server_hostname=self.host)


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
    parsed, host, port, path, resolved_ips = resolve_public_target(target_url)
    connect_host = resolved_ips[0]
    headers = {
        "Host": host,
        "User-Agent": "LingMaMindMapBot/1.0",
        "Accept": "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
        "Accept-Encoding": "identity",
    }
    connection: http.client.HTTPConnection
    if parsed.scheme == "https":
        connection = PinnedHTTPSConnection(
            connect_host,
            host,
            port=port,
            timeout=DOC_TIMEOUT_SECONDS,
            context=ssl.create_default_context(),
        )
    else:
        connection = PinnedHTTPConnection(connect_host, host, port=port, timeout=DOC_TIMEOUT_SECONDS)

    try:
        connection.request("GET", path, headers=headers)
        resp = connection.getresponse()
        if 300 <= resp.status < 400:
            raise ValueError("Redirects are not allowed")
        if resp.status >= 400:
            raise ValueError(f"Remote server returned {resp.status}")

        raw_bytes = resp.read(DOC_MAX_FETCH_BYTES + 1)
        if len(raw_bytes) > DOC_MAX_FETCH_BYTES:
            raise ValueError("Content too large")
        content_type = (resp.getheader("Content-Type") or "").lower()
        raw_text = raw_bytes.decode("utf-8", errors="ignore")
        title = host or "Document"
        if "text/html" in content_type or "<html" in raw_text.lower():
            match = re.search(r"<title[^>]*>([^<]*)</title>", raw_text, flags=re.IGNORECASE)
            if match:
                title = html.unescape(match.group(1)).strip() or title
            text = html_to_text(raw_text)
        else:
            text = raw_text
    finally:
        connection.close()

    normalized = re.sub(r"\s+", " ", text).strip()
    return {
        "url": parsed._replace(fragment="").geturl(),
        "title": title,
        "text": normalized[:max_length],
        "length": len(normalized),
    }


def build_internal_judge_headers(content_type: str = "application/json") -> Dict[str, str]:
    headers = {"Accept": "application/json", "Content-Type": content_type}
    if JUDGE_INTERNAL_TOKEN:
        headers["X-Judge-Token"] = JUDGE_INTERNAL_TOKEN
    return headers


def perform_internal_judge_request(method: str, path: str, body: bytes | None = None, content_type: str = "application/json") -> requests.Response:
    return requests.request(
        method,
        f"{JUDGE_BASE_URL}{path}",
        data=body,
        headers=build_internal_judge_headers(content_type),
        timeout=(5.0, JUDGE_REQUEST_TIMEOUT_SECONDS),
    )


async def proxy_internal_judge_request(request: Request, path: str, require_auth: bool) -> Response:
    if require_auth:
        require_authenticated_user(request)

    if not JUDGE_INTERNAL_TOKEN:
        raise HTTPException(status_code=503, detail="judge proxy is not configured")

    body = await request.body() if request.method in {"POST", "PUT", "PATCH"} else None
    content_type = request.headers.get("content-type") or "application/json"
    try:
        upstream = await run_in_threadpool(perform_internal_judge_request, request.method, path, body, content_type)
    except requests.RequestException as exc:
        logger.warning("Judge proxy request failed: %s", exc)
        raise HTTPException(status_code=502, detail="judge service is unavailable") from exc

    response_headers = {"Content-Type": upstream.headers.get("Content-Type", "application/json")}
    return Response(content=upstream.content, status_code=upstream.status_code, headers=response_headers)


def detect_protocol_from_url(api_url: str) -> str:
    lower = (api_url or "").lower()
    if "/responses" in lower:
        return AI_PROTOCOL_RESPONSES
    if lower.endswith("/chat/completions") or lower.endswith("/v1"):
        return AI_PROTOCOL_COMPAT
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
        if protocol == AI_PROTOCOL_COMPAT:
            return base[: -len("/responses")] + "/chat/completions"
        return base
    if "/responses" in lower or "/chat/completions" in lower:
        return base
    if protocol == AI_PROTOCOL_RESPONSES:
        return f"{base}/responses"
    if protocol == AI_PROTOCOL_COMPAT and lower.endswith("/v1"):
        return f"{base}/chat/completions"
    return base


def resolve_responses_upstream_url() -> str:
    return apply_protocol_to_url(AI_BASE_URL, detect_protocol_from_url(AI_BASE_URL))


def is_openai_official(api_url: str) -> bool:
    host = urlparse(api_url or "").netloc.lower()
    return host in {"api.openai.com", "api.cornna.xyz"}


def should_force_responses_stream(api_url: str, protocol: str) -> bool:
    return protocol == AI_PROTOCOL_RESPONSES and not is_openai_official(api_url)


def responses_token_key(api_url: str) -> str:
    host = urlparse(api_url or "").netloc.lower()
    if host in {"api.openai.com", "api.cornna.xyz", "gmn.chuangzuoli.com"}:
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
        headers["Referer"] = AI_SITE_URL
        headers["HTTP-Referer"] = AI_SITE_URL
    if AI_SITE_NAME:
        headers["X-Title"] = AI_SITE_NAME
    return headers


def resolve_explicit_upstream_proxies() -> Optional[Dict[str, str]]:
    all_proxy = first_env("AI_ALL_PROXY", "NOFX_PROXY", "NOFX_ALL_PROXY")
    http_proxy = first_env("AI_HTTP_PROXY", "NOFX_HTTP_PROXY") or all_proxy
    https_proxy = first_env("AI_HTTPS_PROXY", "NOFX_HTTPS_PROXY") or http_proxy or all_proxy

    proxies: Dict[str, str] = {}
    if http_proxy:
        proxies["http"] = http_proxy
    if https_proxy:
        proxies["https"] = https_proxy
    return proxies or None


def build_upstream_session(proxies: Optional[Dict[str, str]] = None) -> requests.Session:
    session = requests.Session()
    session.trust_env = bool(AI_TRUST_ENV and not proxies)
    return session


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


def resolve_requested_model(value: Any) -> str:
    requested = str(value or "").strip()
    return requested or AI_MODEL


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


def normalize_compat_role(role: Any) -> str:
    value = str(role or "user").strip().lower() or "user"
    if value == "developer":
        return "system"
    if value not in {"system", "user", "assistant", "tool"}:
        return "user"
    return value


def build_compat_messages(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    messages: List[Dict[str, Any]] = []
    input_items = payload.get("input")
    if isinstance(input_items, list) and input_items:
        for item in input_items:
            if not isinstance(item, dict):
                continue
            text = extract_text_content(item.get("content"))
            if not text:
                continue
            messages.append(
                {
                    "role": normalize_compat_role(item.get("role")),
                    "content": text,
                }
            )
    raw_messages = payload.get("messages")
    if not messages and isinstance(raw_messages, list):
        for item in raw_messages:
            if not isinstance(item, dict):
                continue
            text = extract_text_content(item.get("content"))
            if not text:
                continue
            messages.append(
                {
                    "role": normalize_compat_role(item.get("role")),
                    "content": text,
                }
            )
    if not messages:
        raise HTTPException(status_code=400, detail="messages is required")
    return messages


def build_compat_request_payload(payload: Dict[str, Any], stream: bool) -> Dict[str, Any]:
    request_payload: Dict[str, Any] = {
        "model": str(payload.get("model") or AI_MODEL).strip() or AI_MODEL,
        "messages": build_compat_messages(payload),
        "stream": stream,
    }
    if "temperature" in payload:
        request_payload["temperature"] = payload["temperature"]
    if isinstance(payload.get("metadata"), dict):
        request_payload["metadata"] = payload["metadata"]

    token_value = payload.get("max_tokens", payload.get("max_output_tokens"))
    if token_value is not None:
        request_payload["max_tokens"] = normalize_token_value(token_value)

    reasoning = payload.get("reasoning")
    if isinstance(reasoning, dict):
        effort = str(reasoning.get("effort") or "").strip().lower()
        if effort in SUPPORTED_REASONING_EFFORTS:
            request_payload["reasoning_effort"] = effort
    return request_payload


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


def prepare_upstream_request(payload: Dict[str, Any]) -> Tuple[str, Dict[str, Any], Dict[str, str], bool, str]:
    upstream_url = resolve_responses_upstream_url()
    protocol = detect_protocol_from_url(upstream_url)
    stream_requested = parse_boolish(payload.get("stream"))
    effective_stream = stream_requested or should_force_responses_stream(upstream_url, protocol)

    if protocol == AI_PROTOCOL_COMPAT:
        request_payload = build_compat_request_payload(payload, effective_stream)
    else:
        request_payload = dict(payload)
        if effective_stream:
            request_payload["stream"] = True

    headers = build_upstream_headers()
    headers["Accept"] = "text/event-stream" if effective_stream else "application/json"
    return upstream_url, request_payload, headers, effective_stream, protocol


def decode_response_text(response: requests.Response) -> str:
    raw = response.content or b""
    if not raw:
        return ""
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("utf-8", errors="replace")


def extract_compat_message_text(data: Dict[str, Any]) -> str:
    choices = data.get("choices")
    if not isinstance(choices, list):
        return ""
    for choice in choices:
        if not isinstance(choice, dict):
            continue
        message = choice.get("message")
        if isinstance(message, dict):
            text = extract_text_content(message.get("content"))
            if text:
                return text
        delta = choice.get("delta")
        if isinstance(delta, dict):
            text = extract_text_content(delta.get("content"))
            if text:
                return text
    return ""


def build_synthetic_responses_payload_from_compat(data: Dict[str, Any], fallback_text: str = "") -> Dict[str, Any]:
    text = extract_compat_message_text(data) or str(fallback_text or "").strip()
    return {
        "id": str(data.get("id") or f"resp_{secrets.token_urlsafe(12)}"),
        "object": "response",
        "created_at": int(datetime.now(timezone.utc).timestamp()),
        "model": str(data.get("model") or AI_MODEL),
        "output_text": text,
        "output": [
            {
                "type": "message",
                "role": "assistant",
                "content": [{"type": "output_text", "text": text}],
            }
        ],
        "usage": data.get("usage"),
    }
 

def iter_compat_stream_events(response: Any) -> Iterator[Tuple[str, Optional[str], Dict[str, Any]]]:
    last_event: Dict[str, Any] = {}
    for event_block in iter_sse_events(response):
        data_text = extract_sse_data(event_block)
        if not data_text:
            continue
        if data_text == "[DONE]":
            break
        try:
            event = json.loads(data_text)
        except Exception:
            continue
        if not isinstance(event, dict):
            continue
        last_event = event
        choices = event.get("choices")
        if not isinstance(choices, list) or not choices:
            continue
        choice = choices[0] if isinstance(choices[0], dict) else {}
        delta = choice.get("delta") if isinstance(choice, dict) else {}
        if isinstance(delta, dict):
            text = extract_text_content(delta.get("content"))
            if text:
                yield "delta", text, event
        finish_reason = choice.get("finish_reason") if isinstance(choice, dict) else None
        if finish_reason:
            yield "done", None, event
            return
    yield "done", None, last_event


def iter_standardized_upstream_events(payload: Dict[str, Any]) -> Iterator[Dict[str, Any]]:
    accumulated = ""
    with open_upstream_responses(payload) as upstream:
        protocol = getattr(upstream, "_lingma_protocol", detect_protocol_from_url(resolve_responses_upstream_url()))
        if protocol == AI_PROTOCOL_COMPAT:
            last_event: Dict[str, Any] = {}
            for event_type, delta_text, raw_event in iter_compat_stream_events(upstream):
                if raw_event:
                    last_event = raw_event
                if event_type == "delta" and isinstance(delta_text, str) and delta_text:
                    accumulated += delta_text
                    yield {
                        "type": "response.output_text.delta",
                        "delta": delta_text,
                        "response": build_synthetic_responses_payload_from_compat(raw_event, fallback_text=accumulated),
                    }
                elif event_type == "done":
                    response_obj = build_synthetic_responses_payload_from_compat(last_event, fallback_text=accumulated)
                    yield {"type": "response.completed", "response": response_obj}
                    return
            return

        for event_block in iter_sse_events(upstream):
            data_text = extract_sse_data(event_block)
            if not data_text or data_text == "[DONE]":
                continue
            try:
                event = json.loads(data_text)
            except Exception:
                continue
            if isinstance(event, dict):
                yield event


def extract_responses_sse_json(body_text: str) -> Dict[str, Any]:
    last_payload: Optional[Dict[str, Any]] = None
    last_response: Optional[Dict[str, Any]] = None

    for line in (body_text or "").splitlines():
        current = line.strip()
        if not current.startswith("data:"):
            continue
        payload_text = current[len("data:") :].strip()
        if not payload_text or payload_text == "[DONE]":
            continue
        try:
            event = json.loads(payload_text)
        except Exception:
            continue
        if not isinstance(event, dict):
            continue

        last_payload = event
        response_obj = event.get("response")
        if isinstance(response_obj, dict):
            last_response = response_obj

        event_type = str(event.get("type") or "")
        if event_type == "response.completed" and isinstance(response_obj, dict):
            return response_obj
        if event_type == "response.failed":
            error = event.get("error") if isinstance(event.get("error"), dict) else {}
            message = str(error.get("message") or "upstream stream failed").strip()
            raise HTTPException(status_code=502, detail=message or "upstream stream failed")

    if isinstance(last_response, dict):
        return last_response
    if isinstance(last_payload, dict) and isinstance(last_payload.get("error"), dict):
        message = str(last_payload["error"].get("message") or "upstream stream failed").strip()
        raise HTTPException(status_code=502, detail=message or "upstream stream failed")
    raise HTTPException(status_code=502, detail=f"invalid upstream response: {(body_text or '').strip()[:500]}")


def extract_compat_sse_json(body_text: str) -> Dict[str, Any]:
    accumulated = ""
    last_event: Dict[str, Any] = {}
    for event_type, delta_text, raw_event in iter_compat_stream_events((body_text or "").splitlines()):
        if raw_event:
            last_event = raw_event
        if event_type == "delta" and isinstance(delta_text, str) and delta_text:
            accumulated += delta_text
        elif event_type == "done":
            return build_synthetic_responses_payload_from_compat(last_event, fallback_text=accumulated)
    return build_synthetic_responses_payload_from_compat(last_event, fallback_text=accumulated)


def perform_upstream_responses_request(payload: Dict[str, Any]) -> Tuple[requests.Session, requests.Response, str]:
    explicit_proxies = resolve_explicit_upstream_proxies()
    fallback_tokens = normalize_token_value(
        payload.get("max_output_tokens", payload.get("max_tokens", 8192)),
    )
    current_payload = dict(payload)
    token_override_attempted = False

    while True:
        request_url, request_payload, headers, effective_stream, protocol = prepare_upstream_request(current_payload)
        session = build_upstream_session(explicit_proxies)
        try:
            response = session.post(
                request_url,
                headers=headers,
                json=request_payload,
                timeout=(AI_CONNECT_TIMEOUT_SECONDS, AI_REQUEST_TIMEOUT_SECONDS),
                proxies=explicit_proxies,
                stream=effective_stream,
            )
        except requests.Timeout as exc:
            session.close()
            downgraded_payload = downgrade_reasoning_on_timeout(current_payload)
            if downgraded_payload is not None:
                current_payload = downgraded_payload
                continue
            raise HTTPException(status_code=504, detail=str(exc)) from exc
        except requests.RequestException as exc:
            session.close()
            raise HTTPException(status_code=502, detail=str(exc)) from exc

        if response.status_code < 400:
            return session, response, protocol

        body_text = decode_response_text(response)
        response.close()
        session.close()

        if protocol == AI_PROTOCOL_RESPONSES:
            override_key = None if token_override_attempted else resolve_responses_token_key_override(body_text)
            if override_key is not None:
                current_payload = override_responses_token_key(current_payload, override_key, fallback_tokens)
                token_override_attempted = True
                continue
        if response.status_code == 524:
            downgraded_payload = downgrade_reasoning_on_timeout(current_payload)
            if downgraded_payload is not None:
                current_payload = downgraded_payload
                continue
        raise HTTPException(status_code=response.status_code, detail=extract_error_message(body_text))


@contextmanager
def open_upstream_responses(payload: Dict[str, Any]) -> Iterator[requests.Response]:
    session, response, protocol = perform_upstream_responses_request(payload)
    try:
        setattr(response, "_lingma_protocol", protocol)
    except Exception:
        pass
    try:
        yield response
    finally:
        response.close()
        session.close()


def read_upstream_responses_json(payload: Dict[str, Any]) -> Dict[str, Any]:
    request_payload = dict(payload or {})
    request_payload["stream"] = True
    session, response, protocol = perform_upstream_responses_request(request_payload)
    try:
        body_text = decode_response_text(response)
        content_type = (response.headers.get("Content-Type") or "").lower()
    finally:
        response.close()
        session.close()

    if protocol == AI_PROTOCOL_COMPAT:
        if "text/event-stream" in content_type or "data:" in body_text:
            return extract_compat_sse_json(body_text)
        try:
            data = json.loads(body_text)
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"invalid upstream response: {body_text[:500]}") from exc
        if not isinstance(data, dict):
            raise HTTPException(status_code=502, detail="invalid upstream response payload")
        return build_synthetic_responses_payload_from_compat(data)

    if "text/event-stream" in content_type or "data:" in body_text:
        return extract_responses_sse_json(body_text)
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
    if hasattr(response, "iter_lines"):
        line_iter = response.iter_lines(decode_unicode=False)
    else:
        line_iter = response

    for line in line_iter:
        if isinstance(line, bytes):
            line = line.decode("utf-8", errors="replace")
        if line in {"", "\n", "\r\n", "\r"}:
            if buffer:
                yield "\n".join(buffer)
                buffer = []
            continue
        buffer.append(str(line).rstrip("\r\n"))
    if buffer:
        yield "\n".join(buffer)


def extract_sse_data(event_block: str) -> str:
    data_lines: List[str] = []
    for line in event_block.splitlines():
        if line.startswith("data:"):
            data_lines.append(line[5:].lstrip())
    return "\n".join(data_lines).strip()


def build_sse_data(payload: Dict[str, Any]) -> str:
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


def build_sse_done() -> str:
    return "data: [DONE]\n\n"


def build_standard_streaming_headers() -> Dict[str, str]:
    return {
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    }


def parse_streamed_json_object(final_text: str, fallback_response: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    raw_payload = str(final_text or "").strip()
    if raw_payload:
        try:
            parsed = json.loads(raw_payload)
        except Exception as exc:
            if fallback_response is None:
                raise HTTPException(status_code=502, detail="invalid structured AI output") from exc
        else:
            if isinstance(parsed, dict):
                return parsed
            raise HTTPException(status_code=502, detail="invalid structured AI output")

    if fallback_response is not None:
        return parse_upstream_json_object(fallback_response)
    raise HTTPException(status_code=502, detail="invalid structured AI output")


def iter_upstream_text_stream(payload: Dict[str, Any]) -> Iterator[Tuple[str, str, Optional[Dict[str, Any]]]]:
    accumulated = ""
    for event in iter_standardized_upstream_events(payload):
        response_obj = event.get("response") if isinstance(event.get("response"), dict) else None
        event_type = str(event.get("type") or "")
        if event_type == "response.output_text.delta":
            delta = event.get("delta")
            if isinstance(delta, str) and delta:
                accumulated += delta
                yield "preview", accumulated, None
        elif event_type == "response.output_text.done":
            done_text = event.get("text")
            if isinstance(done_text, str) and done_text and not accumulated:
                accumulated = done_text
                yield "preview", accumulated, None
        elif event_type == "response.completed":
            if response_obj is not None:
                final_text, _ = extract_responses_json_text(response_obj)
                if final_text and final_text != accumulated:
                    accumulated = final_text
                    yield "preview", accumulated, None
            yield "final", accumulated, response_obj
            return
        elif event_type == "response.failed" or isinstance(event.get("error"), dict):
            error = event.get("error") if isinstance(event.get("error"), dict) else {}
            message = str(error.get("message") or "upstream stream failed").strip()
            raise HTTPException(status_code=502, detail=message or "upstream stream failed")

    yield "final", accumulated, None


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
    require_authenticated_user(request)
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    stream = parse_boolish(body.get("stream"))
    payload = build_responses_payload(body, stream=stream)

    if stream:
        def event_stream() -> Iterator[bytes]:
            try:
                for event in iter_standardized_upstream_events(payload):
                    yield build_sse_data(event).encode("utf-8")
                yield build_sse_done().encode("utf-8")
            except HTTPException as exc:
                yield f"data: {json.dumps({'error': {'message': str(exc.detail)}}, ensure_ascii=False)}\n\n".encode("utf-8")
                yield b"data: [DONE]\n\n"

        headers = {
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
        return StreamingResponse(event_stream(), media_type="text/event-stream", headers=headers)

    data = await run_in_threadpool(read_upstream_responses_json, payload)
    return JSONResponse(content=data)


@app.post("/api/ai")
async def chat_completion(request: Request):
    require_authenticated_user(request)
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    payload = build_legacy_request_payload(body, stream=False)
    data = await run_in_threadpool(read_upstream_responses_json, payload)
    return JSONResponse(content=build_legacy_chat_response(data))


@app.post("/api/ai/stream")
async def chat_completion_stream(request: Request):
    require_authenticated_user(request)
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
            for event in iter_standardized_upstream_events(payload):
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
    require_authenticated_user(request)
    body = await request.json()
    target_url = str(body.get("url", "")).strip()
    if not target_url:
        raise HTTPException(status_code=400, detail="url is required")
    max_length = int(body.get("maxLength") or 16000)
    max_length = max(1000, min(max_length, DOC_MAX_LENGTH))
    try:
        document = await run_in_threadpool(fetch_document, target_url, max_length)
        return JSONResponse(content=document)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logger.warning("Document fetch failed for %s: %s", target_url, exc)
        raise HTTPException(status_code=502, detail="document fetch failed") from exc


@app.post("/api/judge")
async def judge_proxy(request: Request):
    require_authenticated_user(request)
    if not JUDGE_INTERNAL_TOKEN:
        raise HTTPException(status_code=503, detail="judge proxy is not configured")

    body = await request.json()
    if not isinstance(body, dict):
        raise HTTPException(status_code=400, detail="invalid request payload")

    forwarded_payload = build_judge_forward_payload(body)
    exercise_context = extract_optional_exercise_context(body)
    model_name = resolve_requested_model(body.get("model"))
    requested_ai_review_mode = str(body.get("aiReviewMode") or "").strip().lower()
    request_body = json.dumps(forwarded_payload, ensure_ascii=False).encode("utf-8")

    try:
        upstream = await run_in_threadpool(
            perform_internal_judge_request,
            "POST",
            "/api/judge",
            request_body,
            "application/json",
        )
    except requests.RequestException as exc:
        logger.warning("Judge proxy request failed: %s", exc)
        raise HTTPException(status_code=502, detail="judge service is unavailable") from exc

    response_headers = {"Content-Type": upstream.headers.get("Content-Type", "application/json")}
    if upstream.status_code >= 400:
        return Response(content=upstream.content, status_code=upstream.status_code, headers=response_headers)

    body_text = decode_response_text(upstream)
    try:
        judge_payload = json.loads(body_text)
    except Exception:
        return Response(content=upstream.content, status_code=upstream.status_code, headers=response_headers)

    if not isinstance(judge_payload, dict):
        return Response(content=upstream.content, status_code=upstream.status_code, headers=response_headers)

    if not should_trigger_judge_ai_review(judge_payload):
        judge_payload["aiReview"] = build_judge_ai_review_skipped()
        return JSONResponse(content=judge_payload, status_code=upstream.status_code)

    if requested_ai_review_mode == "stream":
        if JUDGE_AI_REVIEW_MODE == JUDGE_AI_REVIEW_STATUS_DEFERRED:
            judge_payload["aiReview"] = build_judge_ai_review_deferred(model_name)
        elif not AI_API_KEY:
            judge_payload["aiReview"] = build_judge_ai_review_unavailable(model_name)
        else:
            judge_payload["aiReview"] = build_judge_ai_review_deferred(model_name, triggered=True)
        return JSONResponse(content=judge_payload, status_code=upstream.status_code)

    if JUDGE_AI_REVIEW_MODE == JUDGE_AI_REVIEW_STATUS_DEFERRED:
        judge_payload["aiReview"] = build_judge_ai_review_deferred(model_name)
        return JSONResponse(content=judge_payload, status_code=upstream.status_code)

    if not AI_API_KEY:
        judge_payload["aiReview"] = build_judge_ai_review_unavailable(model_name)
        return JSONResponse(content=judge_payload, status_code=upstream.status_code)

    try:
        prompt_payload = build_judge_ai_review_prompt(
            exercise_context,
            str(forwarded_payload.get("code") or ""),
            str(forwarded_payload.get("language") or ""),
            judge_payload,
            model_name,
        )
        ai_response = await run_in_threadpool(read_upstream_responses_json, prompt_payload)
        judge_payload["aiReview"] = normalize_judge_ai_review_payload(
            parse_upstream_json_object(ai_response),
            model_name,
        )
    except Exception as exc:
        logger.warning("Judge AI review unavailable for model %s: %s", model_name, exc)
        judge_payload["aiReview"] = build_judge_ai_review_unavailable(model_name)

    return JSONResponse(content=judge_payload, status_code=upstream.status_code)


@app.post("/api/judge/review/stream")
async def judge_review_stream(request: Request):
    require_authenticated_user(request)
    body = await request.json()
    if not isinstance(body, dict):
        raise HTTPException(status_code=400, detail="invalid request payload")

    model_name = resolve_requested_model(body.get("model"))
    judge_payload = body.get("judgePayload")
    if not isinstance(judge_payload, dict):
        raise HTTPException(status_code=400, detail="judgePayload is required")

    if not should_trigger_judge_ai_review(judge_payload):
        def skipped_stream() -> Iterator[str]:
            yield build_sse_data({"type": "final", "payload": build_judge_ai_review_skipped()})
            yield build_sse_done()

        return StreamingResponse(skipped_stream(), media_type="text/event-stream", headers=build_standard_streaming_headers())

    if JUDGE_AI_REVIEW_MODE == JUDGE_AI_REVIEW_STATUS_DEFERRED:
        def deferred_stream() -> Iterator[str]:
            yield build_sse_data({"type": "final", "payload": build_judge_ai_review_deferred(model_name)})
            yield build_sse_done()

        return StreamingResponse(deferred_stream(), media_type="text/event-stream", headers=build_standard_streaming_headers())

    if not AI_API_KEY:
        def unavailable_stream() -> Iterator[str]:
            yield build_sse_data({"type": "final", "payload": build_judge_ai_review_unavailable(model_name)})
            yield build_sse_done()

        return StreamingResponse(unavailable_stream(), media_type="text/event-stream", headers=build_standard_streaming_headers())

    exercise_context = extract_optional_exercise_context(body)
    prompt_payload = build_judge_ai_review_prompt(
        exercise_context,
        str(body.get("code") or ""),
        str(body.get("language") or ""),
        judge_payload,
        model_name,
    )

    def event_stream() -> Iterator[str]:
        try:
            for phase, text, response_obj in iter_upstream_text_stream(prompt_payload):
                if phase == "preview":
                    if text:
                        yield build_sse_data({"type": "preview", "text": text})
                    continue

                parsed = parse_streamed_json_object(text, response_obj)
                normalized = normalize_judge_ai_review_payload(parsed, model_name)
                yield build_sse_data({"type": "final", "payload": normalized})
                yield build_sse_done()
                return
        except Exception as exc:
            logger.warning("Judge AI review stream unavailable for model %s: %s", model_name, exc)
            yield build_sse_data({"type": "final", "payload": build_judge_ai_review_unavailable(model_name)})
            yield build_sse_done()

    return StreamingResponse(event_stream(), media_type="text/event-stream", headers=build_standard_streaming_headers())


@app.post("/api/run")
async def judge_run_proxy(request: Request):
    return await proxy_internal_judge_request(request, "/api/run", require_auth=True)


@app.get("/api/health")
async def judge_health_proxy(request: Request):
    return await proxy_internal_judge_request(request, "/api/health", require_auth=False)


@app.post("/api/vibe-coding/generate")
async def vibe_coding_generate(request: Request):
    user = require_authenticated_user(request)
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    fallback_track = "frontend"
    fallback_difficulty = default_vibe_difficulty_for_skill(user["skill_level"])
    model_name = resolve_requested_model(body.get("model"))
    locale = sanitize_app_locale(body.get("locale"))

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            stored_profile = get_stored_vibe_profile(conn, user["id"])
            profile = serialize_vibe_profile_row(stored_profile, fallback_track, fallback_difficulty)
        finally:
            conn.close()

    try:
        track = sanitize_vibe_track(body.get("track"), fallback=profile["recommendedTrack"] or fallback_track)
        difficulty = sanitize_vibe_difficulty(body.get("difficulty"), fallback=profile["recommendedDifficulty"] or fallback_difficulty)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    payload = build_vibe_generation_prompt(track, difficulty, profile, user, model_name, locale)
    data = await run_in_threadpool(read_upstream_responses_json, payload)
    normalized = normalize_generated_challenge_payload(parse_upstream_json_object(data), track, difficulty, user["id"])

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            insert_vibe_challenge(conn, normalized)
            conn.commit()
        finally:
            conn.close()

    return JSONResponse(content=normalized)


@app.post("/api/vibe-coding/generate/stream")
async def vibe_coding_generate_stream(request: Request):
    user = require_authenticated_user(request)
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    fallback_track = "frontend"
    fallback_difficulty = default_vibe_difficulty_for_skill(user["skill_level"])
    model_name = resolve_requested_model(body.get("model"))
    locale = sanitize_app_locale(body.get("locale"))

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            stored_profile = get_stored_vibe_profile(conn, user["id"])
            profile = serialize_vibe_profile_row(stored_profile, fallback_track, fallback_difficulty)
        finally:
            conn.close()

    try:
        track = sanitize_vibe_track(body.get("track"), fallback=profile["recommendedTrack"] or fallback_track)
        difficulty = sanitize_vibe_difficulty(body.get("difficulty"), fallback=profile["recommendedDifficulty"] or fallback_difficulty)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    payload = build_vibe_generation_prompt(track, difficulty, profile, user, model_name, locale)

    def event_stream() -> Iterator[str]:
        try:
            for phase, text, response_obj in iter_upstream_text_stream(payload):
                if phase == "preview":
                    if text:
                        yield build_sse_data({"type": "preview", "text": text})
                    continue

                parsed = parse_streamed_json_object(text, response_obj)
                normalized = normalize_generated_challenge_payload(parsed, track, difficulty, user["id"])
                with db_lock:
                    conn = get_db_connection(AUTH_DB_PATH)
                    try:
                        insert_vibe_challenge(conn, normalized)
                        conn.commit()
                    finally:
                        conn.close()
                yield build_sse_data({"type": "final", "payload": normalized})
                yield build_sse_done()
                return
        except HTTPException as exc:
            yield build_sse_data({"type": "error", "message": str(exc.detail)})
            yield build_sse_done()
        except Exception as exc:
            yield build_sse_data({"type": "error", "message": str(exc)})
            yield build_sse_done()

    return StreamingResponse(event_stream(), media_type="text/event-stream", headers=build_standard_streaming_headers())


@app.post("/api/vibe-coding/evaluate")
async def vibe_coding_evaluate(request: Request):
    user = require_authenticated_user(request)
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    model_name = resolve_requested_model(body.get("model"))
    locale = sanitize_app_locale(body.get("locale"))
    challenge_id = str(body.get("challenge_id") or "").strip()
    if not challenge_id:
        raise HTTPException(status_code=400, detail="challenge_id is required")
    try:
        prompt_text = sanitize_vibe_prompt(body.get("user_prompt"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            challenge_row = get_vibe_challenge(conn, challenge_id, user["id"])
        finally:
            conn.close()

    if challenge_row is None:
        raise HTTPException(status_code=404, detail="challenge not found")

    challenge = serialize_vibe_challenge_row(challenge_row)
    payload = build_vibe_evaluation_prompt(challenge, prompt_text, model_name, locale)
    data = await run_in_threadpool(read_upstream_responses_json, payload)
    evaluation = normalize_evaluation_payload(parse_upstream_json_object(data), challenge_id)
    attempt_id = f"attempt_{secrets.token_urlsafe(12)}"

    fallback_difficulty = default_vibe_difficulty_for_skill(user["skill_level"])
    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            insert_vibe_attempt(conn, attempt_id, user["id"], prompt_text, evaluation)
            recent_rows = get_recent_vibe_attempt_rows(conn, user["id"], limit=VIBE_PROFILE_WINDOW)
            profile_snapshot = calculate_vibe_profile_snapshot(recent_rows, challenge["track"], fallback_difficulty)
            upsert_vibe_profile(conn, user["id"], profile_snapshot)
            conn.commit()
        finally:
            conn.close()

    response_payload = {
        "id": attempt_id,
        "challengeId": challenge_id,
        "promptText": prompt_text,
        "total_score": evaluation["total_score"],
        "dimension_scores": evaluation["dimension_scores"],
        "strengths": evaluation["strengths"],
        "weaknesses": evaluation["weaknesses"],
        "rewrite_example": evaluation["rewrite_example"],
        "next_difficulty_recommendation": evaluation["next_difficulty_recommendation"],
        "createdAt": evaluation["createdAt"],
    }
    return JSONResponse(content=response_payload)


@app.post("/api/vibe-coding/evaluate/stream")
async def vibe_coding_evaluate_stream(request: Request):
    user = require_authenticated_user(request)
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    model_name = resolve_requested_model(body.get("model"))
    locale = sanitize_app_locale(body.get("locale"))
    challenge_id = str(body.get("challenge_id") or "").strip()
    if not challenge_id:
        raise HTTPException(status_code=400, detail="challenge_id is required")
    try:
        prompt_text = sanitize_vibe_prompt(body.get("user_prompt"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            challenge_row = get_vibe_challenge(conn, challenge_id, user["id"])
        finally:
            conn.close()

    if challenge_row is None:
        raise HTTPException(status_code=404, detail="challenge not found")

    challenge = serialize_vibe_challenge_row(challenge_row)
    payload = build_vibe_evaluation_prompt(challenge, prompt_text, model_name, locale)

    def event_stream() -> Iterator[str]:
        try:
            for phase, text, response_obj in iter_upstream_text_stream(payload):
                if phase == "preview":
                    if text:
                        yield build_sse_data({"type": "preview", "text": text})
                    continue

                parsed = parse_streamed_json_object(text, response_obj)
                evaluation = normalize_evaluation_payload(parsed, challenge_id)
                attempt_id = f"attempt_{secrets.token_urlsafe(12)}"
                fallback_difficulty = default_vibe_difficulty_for_skill(user["skill_level"])
                with db_lock:
                    conn = get_db_connection(AUTH_DB_PATH)
                    try:
                        insert_vibe_attempt(conn, attempt_id, user["id"], prompt_text, evaluation)
                        recent_rows = get_recent_vibe_attempt_rows(conn, user["id"], limit=VIBE_PROFILE_WINDOW)
                        profile_snapshot = calculate_vibe_profile_snapshot(recent_rows, challenge["track"], fallback_difficulty)
                        upsert_vibe_profile(conn, user["id"], profile_snapshot)
                        conn.commit()
                    finally:
                        conn.close()

                response_payload = {
                    "id": attempt_id,
                    "challengeId": challenge_id,
                    "promptText": prompt_text,
                    "total_score": evaluation["total_score"],
                    "dimension_scores": evaluation["dimension_scores"],
                    "strengths": evaluation["strengths"],
                    "weaknesses": evaluation["weaknesses"],
                    "rewrite_example": evaluation["rewrite_example"],
                    "next_difficulty_recommendation": evaluation["next_difficulty_recommendation"],
                    "createdAt": evaluation["createdAt"],
                }
                yield build_sse_data({"type": "final", "payload": response_payload})
                yield build_sse_done()
                return
        except HTTPException as exc:
            yield build_sse_data({"type": "error", "message": str(exc.detail)})
            yield build_sse_done()
        except Exception as exc:
            yield build_sse_data({"type": "error", "message": str(exc)})
            yield build_sse_done()

    return StreamingResponse(event_stream(), media_type="text/event-stream", headers=build_standard_streaming_headers())


@app.get("/api/vibe-coding/history")
async def vibe_coding_history(request: Request):
    user = require_authenticated_user(request)
    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            rows = list_vibe_history_rows(conn, user["id"])
        finally:
            conn.close()

    items = []
    for row in rows:
        items.append(
            {
                "id": row["id"],
                "track": row["track"],
                "difficulty": row["difficulty"],
                "createdAt": row["created_at"],
                "challenge": {
                    "id": row["challenge_id"],
                    "track": row["track"],
                    "difficulty": row["difficulty"],
                    "title": row["title"],
                    "scenario": row["scenario"],
                    "requirements": json.loads(row["requirements_json"]),
                    "constraints": json.loads(row["constraints_json"]),
                    "successCriteria": json.loads(row["success_criteria_json"]),
                    "expectedFocus": json.loads(row["expected_focus_json"]),
                    "createdAt": row["challenge_created_at"],
                },
                "evaluation": {
                    "total_score": row["total_score"],
                    "dimension_scores": {
                        "goal_clarity": row["goal_clarity_score"],
                        "boundary_constraints": row["boundary_constraints_score"],
                        "verification_design": row["verification_design_score"],
                        "output_format": row["output_format_score"],
                    },
                    "strengths": json.loads(row["strengths_json"]),
                    "weaknesses": json.loads(row["weaknesses_json"]),
                    "rewrite_example": row["rewrite_example"],
                    "next_difficulty_recommendation": row["next_difficulty_recommendation"],
                },
                "promptText": row["prompt_text"],
            }
        )

    return JSONResponse(content={"items": items})


@app.get("/api/vibe-coding/profile")
async def vibe_coding_profile(request: Request):
    user = require_authenticated_user(request)
    fallback_track = "frontend"
    fallback_difficulty = default_vibe_difficulty_for_skill(user["skill_level"])

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            row = get_stored_vibe_profile(conn, user["id"])
            if row is None:
                recent_rows = get_recent_vibe_attempt_rows(conn, user["id"], limit=VIBE_PROFILE_WINDOW)
                if recent_rows:
                    snapshot = calculate_vibe_profile_snapshot(recent_rows, fallback_track, fallback_difficulty)
                    upsert_vibe_profile(conn, user["id"], snapshot)
                    conn.commit()
                    row = get_stored_vibe_profile(conn, user["id"])
        finally:
            conn.close()

    return JSONResponse(content=serialize_vibe_profile_row(row, fallback_track, fallback_difficulty))


@app.post("/api/vibe-coding/frontend/session")
async def vibe_frontend_build_create_session(request: Request):
    user = require_authenticated_user(request)
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    model_name = resolve_requested_model(body.get("model"))
    locale = sanitize_app_locale(body.get("locale"))
    try:
        prompt_text = sanitize_vibe_prompt(body.get("prompt"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    session_id = f"frontend_session_{secrets.token_urlsafe(12)}"
    assistant_turn_id = f"frontend_turn_{secrets.token_urlsafe(12)}"
    payload = build_vibe_frontend_live_build_prompt(prompt_text, model_name, locale)
    data = await run_in_threadpool(read_upstream_responses_json, payload)
    artifact = normalize_frontend_build_payload(parse_upstream_json_object(data), session_id, assistant_turn_id)
    return JSONResponse(content=persist_new_frontend_build_session(user["id"], session_id, prompt_text, artifact))


@app.post("/api/vibe-coding/frontend/session/{session_id}/turns")
async def vibe_frontend_build_append_turn(session_id: str, request: Request):
    user = require_authenticated_user(request)
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    model_name = resolve_requested_model(body.get("model"))
    locale = sanitize_app_locale(body.get("locale"))
    try:
        prompt_text = sanitize_vibe_prompt(body.get("prompt"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            session_row = get_vibe_frontend_build_session(conn, session_id, user["id"])
            turn_rows = list_vibe_frontend_build_turn_rows(conn, session_id) if session_row is not None else []
            latest_artifact_row = get_vibe_frontend_build_latest_artifact_row(conn, session_id) if session_row is not None else None
        finally:
            conn.close()

    if session_row is None:
        raise HTTPException(status_code=404, detail="frontend build session not found")

    assistant_turn_id = f"frontend_turn_{secrets.token_urlsafe(12)}"
    payload = build_vibe_frontend_live_build_prompt(
        prompt_text,
        model_name,
        locale,
        session_summary=str(session_row["summary"] or ""),
        recent_turns=turn_rows,
        latest_artifact=latest_artifact_row,
    )
    data = await run_in_threadpool(read_upstream_responses_json, payload)
    artifact = normalize_frontend_build_payload(parse_upstream_json_object(data), session_id, assistant_turn_id)
    return JSONResponse(content=persist_frontend_build_follow_up(user["id"], session_id, prompt_text, artifact))


@app.post("/api/vibe-coding/frontend/session/stream")
async def vibe_frontend_build_create_session_stream(request: Request):
    user = require_authenticated_user(request)
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    model_name = resolve_requested_model(body.get("model"))
    locale = sanitize_app_locale(body.get("locale"))
    try:
        prompt_text = sanitize_vibe_prompt(body.get("prompt"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    session_id = f"frontend_session_{secrets.token_urlsafe(12)}"
    assistant_turn_id = f"frontend_turn_{secrets.token_urlsafe(12)}"
    payload = build_vibe_frontend_live_build_prompt(prompt_text, model_name, locale)

    def event_stream() -> Iterator[str]:
        try:
            for phase, text, response_obj in iter_upstream_text_stream(payload):
                if phase == "preview":
                    if text:
                        yield build_sse_data({"type": "preview", "text": text})
                    continue

                parsed = parse_streamed_json_object(text, response_obj)
                artifact = normalize_frontend_build_payload(parsed, session_id, assistant_turn_id)
                final_payload = persist_new_frontend_build_session(user["id"], session_id, prompt_text, artifact)
                yield build_sse_data({"type": "final", "payload": final_payload})
                yield build_sse_done()
                return
        except HTTPException as exc:
            yield build_sse_data({"type": "error", "message": str(exc.detail)})
            yield build_sse_done()
        except Exception as exc:
            yield build_sse_data({"type": "error", "message": str(exc)})
            yield build_sse_done()

    return StreamingResponse(event_stream(), media_type="text/event-stream", headers=build_standard_streaming_headers())


@app.post("/api/vibe-coding/frontend/session/{session_id}/turns/stream")
async def vibe_frontend_build_append_turn_stream(session_id: str, request: Request):
    user = require_authenticated_user(request)
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
    model_name = resolve_requested_model(body.get("model"))
    locale = sanitize_app_locale(body.get("locale"))
    try:
        prompt_text = sanitize_vibe_prompt(body.get("prompt"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            session_row = get_vibe_frontend_build_session(conn, session_id, user["id"])
            turn_rows = list_vibe_frontend_build_turn_rows(conn, session_id) if session_row is not None else []
            latest_artifact_row = get_vibe_frontend_build_latest_artifact_row(conn, session_id) if session_row is not None else None
        finally:
            conn.close()

    if session_row is None:
        raise HTTPException(status_code=404, detail="frontend build session not found")

    assistant_turn_id = f"frontend_turn_{secrets.token_urlsafe(12)}"
    payload = build_vibe_frontend_live_build_prompt(
        prompt_text,
        model_name,
        locale,
        session_summary=str(session_row["summary"] or ""),
        recent_turns=turn_rows,
        latest_artifact=latest_artifact_row,
    )

    def event_stream() -> Iterator[str]:
        try:
            for phase, text, response_obj in iter_upstream_text_stream(payload):
                if phase == "preview":
                    if text:
                        yield build_sse_data({"type": "preview", "text": text})
                    continue

                parsed = parse_streamed_json_object(text, response_obj)
                artifact = normalize_frontend_build_payload(parsed, session_id, assistant_turn_id)
                final_payload = persist_frontend_build_follow_up(user["id"], session_id, prompt_text, artifact)
                yield build_sse_data({"type": "final", "payload": final_payload})
                yield build_sse_done()
                return
        except HTTPException as exc:
            yield build_sse_data({"type": "error", "message": str(exc.detail)})
            yield build_sse_done()
        except Exception as exc:
            yield build_sse_data({"type": "error", "message": str(exc)})
            yield build_sse_done()

    return StreamingResponse(event_stream(), media_type="text/event-stream", headers=build_standard_streaming_headers())


@app.get("/api/vibe-coding/frontend/sessions")
async def vibe_frontend_build_list_sessions(request: Request):
    user = require_authenticated_user(request)
    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            rows = list_vibe_frontend_build_sessions(conn, user["id"])
        finally:
            conn.close()
    return JSONResponse(content={"items": [serialize_vibe_frontend_build_session_row(row) for row in rows]})


@app.get("/api/vibe-coding/frontend/session/{session_id}")
async def vibe_frontend_build_get_session(session_id: str, request: Request):
    user = require_authenticated_user(request)
    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            session_row = get_vibe_frontend_build_session(conn, session_id, user["id"])
            if session_row is None:
                raise HTTPException(status_code=404, detail="frontend build session not found")
            turn_rows = list_vibe_frontend_build_turn_rows(conn, session_id)
            artifact_row = get_vibe_frontend_build_latest_artifact_row(conn, session_id)
        finally:
            conn.close()
    return JSONResponse(content=build_vibe_frontend_build_session_payload(session_row, turn_rows, artifact_row))


@app.get("/api/vibe-coding/frontend/session/{session_id}/download")
async def vibe_frontend_build_download(session_id: str, request: Request):
    user = require_authenticated_user(request)
    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            session_row = get_vibe_frontend_build_session(conn, session_id, user["id"])
            if session_row is None:
                raise HTTPException(status_code=404, detail="frontend build session not found")
            artifact_row = get_vibe_frontend_build_latest_artifact_row(conn, session_id)
        finally:
            conn.close()

    if artifact_row is None:
        raise HTTPException(status_code=404, detail="frontend build artifact not found")

    filename = f"{str(artifact_row['title'] or 'frontend-build').strip() or 'frontend-build'}.html"
    return Response(
        content=artifact_row["merged_html"],
        media_type="text/html; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


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
                raise HTTPException(status_code=409, detail=AUTH_REGISTRATION_FAILURE_DETAIL)

            try:
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
            except sqlite3.IntegrityError as exc:
                raise HTTPException(status_code=409, detail=AUTH_REGISTRATION_FAILURE_DETAIL) from exc
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

    password_hash, password_salt = resolve_login_password_record(row)
    password_matches = verify_password(password, password_hash, password_salt)
    if row is None or not password_matches:
        raise HTTPException(status_code=401, detail="invalid email or password")

    session_id = create_session(row["id"])
    response = JSONResponse(content={"user": serialize_user(row)})
    apply_session_cookie(response, request, session_id)
    return response


@app.post("/api/auth/password-reset/request")
async def auth_password_reset_request(request: Request):
    body = await request.json()
    try:
        email = sanitize_email(body.get("email"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    code = ""
    reset_code_id = ""
    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            now_value = now_iso()
            now_dt = datetime.now(timezone.utc)
            conn.execute("DELETE FROM password_reset_codes WHERE expires_at <= ?", (now_value,))
            user = conn.execute(
                "SELECT id, email FROM users WHERE email = ?",
                (email,),
            ).fetchone()
            if user is None:
                conn.commit()
                return JSONResponse(content={"ok": True})

            latest_row = conn.execute(
                """
                SELECT created_at
                FROM password_reset_codes
                WHERE email = ? AND consumed_at IS NULL
                ORDER BY created_at DESC
                LIMIT 1
                """,
                (email,),
            ).fetchone()
            if latest_row is not None:
                created_at_dt = datetime.fromisoformat(str(latest_row["created_at"]))
                if (now_dt - created_at_dt).total_seconds() < PASSWORD_RESET_REQUEST_COOLDOWN_SECONDS:
                    conn.commit()
                    return JSONResponse(content={"ok": True})

            conn.execute(
                "DELETE FROM password_reset_codes WHERE email = ? AND consumed_at IS NULL",
                (email,),
            )
            code = generate_password_reset_code()
            reset_code_id = f"prc_{secrets.token_urlsafe(12)}"
            record = create_password_reset_code_record(code)
            created_at = now_dt.isoformat()
            expires_at = (now_dt + timedelta(seconds=PASSWORD_RESET_CODE_TTL_SECONDS)).isoformat()
            conn.execute(
                """
                INSERT INTO password_reset_codes(
                    id, user_id, email, code_hash, code_salt, created_at, expires_at, consumed_at, attempt_count
                )
                VALUES(?, ?, ?, ?, ?, ?, ?, NULL, 0)
                """,
                (
                    reset_code_id,
                    user["id"],
                    email,
                    record["code_hash"],
                    record["code_salt"],
                    created_at,
                    expires_at,
                ),
            )
            conn.commit()
        finally:
            conn.close()

    try:
        await run_in_threadpool(
            send_password_reset_email,
            to_email=email,
            code=code,
            expires_in_minutes=PASSWORD_RESET_CODE_TTL_SECONDS // 60,
        )
    except Exception:
        with db_lock:
            conn = get_db_connection(AUTH_DB_PATH)
            try:
                conn.execute("DELETE FROM password_reset_codes WHERE id = ?", (reset_code_id,))
                conn.commit()
            finally:
                conn.close()
        raise

    return JSONResponse(content={"ok": True})


@app.post("/api/auth/password-reset/confirm")
async def auth_password_reset_confirm(request: Request):
    body = await request.json()
    try:
        email = sanitize_email(body.get("email"))
        code = sanitize_password_reset_code(body.get("code"))
        new_password = sanitize_password(body.get("newPassword"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    with db_lock:
        conn = get_db_connection(AUTH_DB_PATH)
        try:
            now_value = now_iso()
            conn.execute("DELETE FROM password_reset_codes WHERE expires_at <= ?", (now_value,))
            row = conn.execute(
                """
                SELECT id, user_id, code_hash, code_salt, expires_at, attempt_count
                FROM password_reset_codes
                WHERE email = ? AND consumed_at IS NULL
                ORDER BY created_at DESC
                LIMIT 1
                """,
                (email,),
            ).fetchone()
            if row is None or int(row["attempt_count"]) >= PASSWORD_RESET_MAX_ATTEMPTS:
                raise HTTPException(status_code=400, detail="invalid or expired verification code")

            if not verify_password_reset_code(code, str(row["code_hash"]), str(row["code_salt"])):
                conn.execute(
                    "UPDATE password_reset_codes SET attempt_count = attempt_count + 1 WHERE id = ?",
                    (row["id"],),
                )
                conn.commit()
                raise HTTPException(status_code=400, detail="invalid or expired verification code")

            password_record = create_password_record(new_password)
            conn.execute(
                """
                UPDATE users
                SET password_hash = ?, password_salt = ?
                WHERE id = ?
                """,
                (password_record["password_hash"], password_record["password_salt"], row["user_id"]),
            )
            conn.execute(
                "UPDATE password_reset_codes SET consumed_at = ? WHERE id = ?",
                (now_value, row["id"]),
            )
            conn.execute("DELETE FROM user_sessions WHERE user_id = ?", (row["user_id"],))
            conn.commit()
        finally:
            conn.close()

    response = JSONResponse(content={"ok": True})
    clear_session_cookie(response, request)
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
