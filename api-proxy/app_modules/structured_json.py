from __future__ import annotations

import json
import re
from typing import Any, Dict


CODE_FENCE_PREFIX_RE = re.compile(r"^\s*```(?:json)?\s*", re.IGNORECASE)
CODE_FENCE_SUFFIX_RE = re.compile(r"\s*```\s*$", re.IGNORECASE)


def _strip_markdown_code_fences(raw_text: str) -> str:
    cleaned = CODE_FENCE_PREFIX_RE.sub("", str(raw_text or ""), count=1)
    cleaned = CODE_FENCE_SUFFIX_RE.sub("", cleaned, count=1)
    return cleaned.strip()


def _extract_json_object_slice(raw_text: str) -> str:
    start_idx = raw_text.find("{")
    end_idx = raw_text.rfind("}")
    if start_idx == -1 or end_idx == -1 or end_idx <= start_idx:
        raise ValueError("No JSON object found in AI response")
    return raw_text[start_idx : end_idx + 1]


def _escape_control_chars_inside_strings(raw_json: str) -> str:
    fixed = []
    in_string = False
    escape = False

    for char in raw_json:
        if escape:
            fixed.append(char)
            escape = False
            continue

        if char == "\\":
            fixed.append(char)
            escape = True
            continue

        if char == '"':
            in_string = not in_string
            fixed.append(char)
            continue

        if in_string:
            if char == "\n":
                fixed.append("\\n")
                continue
            if char == "\r":
                continue
            if char == "\t":
                fixed.append("\\t")
                continue

        fixed.append(char)

    return "".join(fixed)


def _remove_exterior_newlines(raw_json: str) -> str:
    fixed = []
    in_string = False
    escape = False

    for char in raw_json:
        if escape:
            fixed.append(char)
            escape = False
            continue

        if char == "\\":
            fixed.append(char)
            escape = True
            continue

        if char == '"':
            in_string = not in_string
            fixed.append(char)
            continue

        if char in {"\n", "\r"}:
            if in_string:
                fixed.append("\\n")
            continue

        fixed.append(char)

    return "".join(fixed)


def parse_structured_json_object(raw_text: str) -> Dict[str, Any]:
    cleaned = _strip_markdown_code_fences(raw_text)
    raw_json = _extract_json_object_slice(cleaned)

    for candidate in (
        raw_json,
        _escape_control_chars_inside_strings(raw_json),
        _remove_exterior_newlines(raw_json),
    ):
        try:
            parsed = json.loads(candidate)
        except Exception:
            continue
        if isinstance(parsed, dict):
            return parsed
        raise ValueError("Structured AI output must be a JSON object")

    raise ValueError("invalid structured AI output")
