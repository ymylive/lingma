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
import threading
from collections import defaultdict
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Any, Dict, Iterator, List, Optional, Tuple
from urllib.parse import urlparse

import requests
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.concurrency import run_in_threadpool
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
AI_BASE_URL = (os.getenv("AI_BASE_URL") or os.getenv("AI_API_URL") or "https://openrouter.ai/api/v1").strip()
AI_MODEL = os.getenv("AI_MODEL", "openrouter/auto").strip()
AI_SITE_URL = os.getenv("AI_SITE_URL", "https://lingma.cornna.xyz").strip()
AI_SITE_NAME = os.getenv("AI_SITE_NAME", "LingMa").strip()
ENABLE_THINKING = os.getenv("ENABLE_THINKING", "false").strip().lower() in {"1", "true", "yes", "on"}
AI_REASONING_EFFORT = (os.getenv("AI_REASONING_EFFORT") or ("high" if ENABLE_THINKING else "")).strip().lower()
AI_REQUEST_TIMEOUT_SECONDS = max(30, int(os.getenv("AI_REQUEST_TIMEOUT_SECONDS", "300") or "300"))
AI_CONNECT_TIMEOUT_SECONDS = max(5.0, float(os.getenv("AI_CONNECT_TIMEOUT_SECONDS", "20") or "20"))
AI_TRUST_ENV = env_bool("AI_TRUST_ENV", "NOFX_AI_TRUST_ENV", default=False)
ENABLE_REMOTE_MINDMAP_SYNC = os.getenv("ENABLE_REMOTE_MINDMAP_SYNC", "false").strip().lower() in {"1", "true", "yes", "on"}
JUDGE_BASE_URL = (os.getenv("JUDGE_BASE_URL") or "http://127.0.0.1:3002").strip().rstrip("/")
JUDGE_INTERNAL_TOKEN = (os.getenv("JUDGE_INTERNAL_TOKEN") or "local-judge-token").strip()
JUDGE_REQUEST_TIMEOUT_SECONDS = max(5.0, float(os.getenv("JUDGE_REQUEST_TIMEOUT_SECONDS", "40") or "40"))

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


def build_vibe_generation_prompt(track: str, difficulty: str, profile: Dict[str, Any], user: sqlite3.Row) -> Dict[str, Any]:
    profile_summary = (
        f"recommendedTrack={profile['recommendedTrack']}, "
        f"recommendedDifficulty={profile['recommendedDifficulty']}, "
        f"weakestDimension={profile['weakestDimension'] or 'none'}, "
        f"skillLevel={user['skill_level']}, targetLanguage={user['target_language']}"
    )
    instructions = (
        "Generate one prompt-writing exercise for AI-assisted software engineering. "
        "Return JSON only with keys: title, scenario, requirements, constraints, success_criteria, expected_focus. "
        "Make the challenge concrete, scorable, and aligned to the selected track and difficulty. "
        "expected_focus must use only: goal_clarity, boundary_constraints, verification_design, output_format."
    )
    user_text = (
        f"track={track}\n"
        f"difficulty={difficulty}\n"
        f"profile={profile_summary}\n"
        "Make the exercise realistic, professional, and bounded."
    )
    return {
        "model": AI_MODEL,
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


def build_vibe_evaluation_prompt(challenge: Dict[str, Any], prompt_text: str) -> Dict[str, Any]:
    instructions = (
        "You are evaluating the quality of a user's software-engineering prompt only. "
        "Do not score hypothetical code quality. Return JSON only with keys: "
        "total_score, dimension_scores, strengths, weaknesses, rewrite_example, next_difficulty_recommendation. "
        "dimension_scores must include goal_clarity (0-30), boundary_constraints (0-25), "
        "verification_design (0-25), output_format (0-20). "
        "next_difficulty_recommendation must be one of beginner, intermediate, advanced."
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
        "model": AI_MODEL,
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


def is_openai_official(api_url: str) -> bool:
    host = urlparse(api_url or "").netloc.lower()
    return host == "api.openai.com"


def should_force_responses_stream(api_url: str, protocol: str) -> bool:
    return protocol == AI_PROTOCOL_RESPONSES and not is_openai_official(api_url)


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


def prepare_upstream_request(payload: Dict[str, Any]) -> Tuple[str, Dict[str, Any], Dict[str, str], bool]:
    upstream_url = resolve_responses_upstream_url()
    protocol = detect_protocol_from_url(upstream_url)
    stream_requested = parse_boolish(payload.get("stream"))
    effective_stream = stream_requested or should_force_responses_stream(upstream_url, protocol)

    request_payload = dict(payload)
    if effective_stream:
        request_payload["stream"] = True

    headers = build_upstream_headers()
    headers["Accept"] = "text/event-stream" if effective_stream else "application/json"
    return upstream_url, request_payload, headers, effective_stream


def decode_response_text(response: requests.Response) -> str:
    response.encoding = response.encoding or "utf-8"
    return response.text


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


def perform_upstream_responses_request(payload: Dict[str, Any]) -> Tuple[requests.Session, requests.Response]:
    explicit_proxies = resolve_explicit_upstream_proxies()
    fallback_tokens = normalize_token_value(
        payload.get("max_output_tokens", payload.get("max_tokens", 8192)),
    )
    current_payload = dict(payload)
    token_override_attempted = False

    while True:
        request_url, request_payload, headers, effective_stream = prepare_upstream_request(current_payload)
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
            return session, response

        body_text = decode_response_text(response)
        response.close()
        session.close()

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
    session, response = perform_upstream_responses_request(payload)
    try:
        yield response
    finally:
        response.close()
        session.close()


def read_upstream_responses_json(payload: Dict[str, Any]) -> Dict[str, Any]:
    with open_upstream_responses(payload) as response:
        body_text = decode_response_text(response)
        content_type = (response.headers.get("Content-Type") or "").lower()
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
        line_iter = response.iter_lines(decode_unicode=True)
    else:
        line_iter = (raw_line.decode("utf-8", errors="replace") for raw_line in response)

    for line in line_iter:
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
                with open_upstream_responses(payload) as upstream:
                    for chunk in upstream.iter_content(chunk_size=8192):
                        if chunk:
                            yield chunk
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
    return await proxy_internal_judge_request(request, "/api/judge", require_auth=True)


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

    payload = build_vibe_generation_prompt(track, difficulty, profile, user)
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


@app.post("/api/vibe-coding/evaluate")
async def vibe_coding_evaluate(request: Request):
    user = require_authenticated_user(request)
    if not AI_API_KEY:
        raise HTTPException(status_code=500, detail="AI_API_KEY is not configured")

    body = await request.json()
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
    payload = build_vibe_evaluation_prompt(challenge, prompt_text)
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
