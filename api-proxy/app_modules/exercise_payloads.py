from __future__ import annotations

from typing import Any, Dict, List, Optional


LANGUAGE_KEY_ALIASES = {
    "c": "c",
    "cpp": "cpp",
    "c++": "cpp",
    "java": "java",
    "python": "python",
    "python3": "python",
    "py": "python",
    "csharp": "csharp",
    "c#": "csharp",
    "cs": "csharp",
}


def _is_record(value: Any) -> bool:
    return isinstance(value, dict)


def _first_non_empty_string(*values: Any) -> str:
    for value in values:
        if isinstance(value, str):
            trimmed = value.strip()
            if trimmed:
                return trimmed
    return ""


def _normalize_language_key(key: str) -> Optional[str]:
    return LANGUAGE_KEY_ALIASES.get(str(key or "").strip().lower())


def _to_string_map(value: Any) -> Dict[str, str]:
    if not _is_record(value):
        return {}
    normalized = {}
    for key, item in value.items():
        if not isinstance(item, str):
            continue
        trimmed = item.strip()
        if not trimmed:
            continue
        normalized_key = _normalize_language_key(str(key))
        if not normalized_key:
            continue
        normalized[normalized_key] = item
    return normalized


def _to_string_list(value: Any) -> List[str]:
    if not isinstance(value, list):
        return []
    normalized = []
    for item in value:
        if isinstance(item, str):
            trimmed = item.strip()
            if trimmed:
                normalized.append(trimmed)
    return normalized


def _normalize_difficulty(value: Any) -> str:
    if value in {"easy", "medium", "hard"}:
        return value
    return "medium"


def _build_exercise_description(payload: Dict[str, Any]) -> str:
    description_object = payload.get("description") if _is_record(payload.get("description")) else None
    direct = _first_non_empty_string(
        payload.get("description"),
        payload.get("problem_description"),
        payload.get("problemDescription"),
        payload.get("statement"),
        payload.get("problem_statement"),
    )
    if direct:
        return direct

    sections = []
    problem_description = _first_non_empty_string(
        payload.get("problem_description"),
        payload.get("problemDescription"),
        payload.get("statement"),
        payload.get("problem_statement"),
        description_object.get("problem") if description_object else None,
        description_object.get("problemDescription") if description_object else None,
        description_object.get("summary") if description_object else None,
    )
    input_format = _first_non_empty_string(
        payload.get("input_format"),
        payload.get("inputFormat"),
        description_object.get("input") if description_object else None,
        description_object.get("inputFormat") if description_object else None,
    )
    output_format = _first_non_empty_string(
        payload.get("output_format"),
        payload.get("outputFormat"),
        description_object.get("output") if description_object else None,
        description_object.get("outputFormat") if description_object else None,
    )
    data_range = _first_non_empty_string(
        payload.get("data_range"),
        payload.get("dataRange"),
        payload.get("constraints_text"),
        description_object.get("constraints") if description_object else None,
        description_object.get("dataRange") if description_object else None,
    )
    sample_explanation = _first_non_empty_string(
        payload.get("sample_explanation"),
        payload.get("sampleExplanation"),
        description_object.get("sampleExplanation") if description_object else None,
    )

    if problem_description:
        sections.append("【题目描述】\n" + problem_description)
    if input_format:
        sections.append("【输入格式】\n" + input_format)
    if output_format:
        sections.append("【输出格式】\n" + output_format)
    if data_range:
        sections.append("【数据范围】\n" + data_range)
    if sample_explanation:
        sections.append("【样例说明】\n" + sample_explanation)

    return "\n\n".join(sections).strip()


def _normalize_exercise_test_cases(payload: Dict[str, Any]) -> List[Dict[str, str]]:
    raw_cases = (
        payload.get("testCases")
        or payload.get("test_cases")
        or payload.get("examples")
        or payload.get("samples")
    )
    if not isinstance(raw_cases, list):
        return []

    normalized = []
    for item in raw_cases:
        if not _is_record(item):
            continue
        input_value = _first_non_empty_string(
            item.get("input"),
            item.get("stdin"),
            item.get("sampleInput"),
            item.get("sample_input"),
        )
        expected_output = _first_non_empty_string(
            item.get("expectedOutput"),
            item.get("expected_output"),
            item.get("output"),
            item.get("stdout"),
            item.get("sampleOutput"),
            item.get("sample_output"),
        )
        description = _first_non_empty_string(
            item.get("description"),
            item.get("label"),
            item.get("name"),
            item.get("title"),
        )
        if not input_value or not expected_output:
            continue
        normalized.append(
            {
                "input": input_value,
                "expectedOutput": expected_output,
                "description": description or "样例",
            }
        )
    return normalized


def _normalize_fill_blank_items(payload: Dict[str, Any]) -> List[Dict[str, str]]:
    raw_blanks = payload.get("blanks") or payload.get("blank_items") or payload.get("blankItems")
    if not isinstance(raw_blanks, list):
        return []

    normalized = []
    for index, item in enumerate(raw_blanks):
        if not _is_record(item):
            continue
        blank_id = _first_non_empty_string(item.get("id"), item.get("key"), item.get("name")) or "BLANK_%d" % (index + 1)
        answer = _first_non_empty_string(
            item.get("answer"),
            item.get("expected"),
            item.get("expectedAnswer"),
            item.get("expected_answer"),
        )
        hint = _first_non_empty_string(item.get("hint"), item.get("description"), item.get("label"))
        if not answer:
            continue
        normalized.append({"id": blank_id, "answer": answer, "hint": hint})
    return normalized


def normalize_generated_exercise_payload(payload: Any) -> Dict[str, Any]:
    if not _is_record(payload):
        raise ValueError("AI exercise payload must be an object")

    title = _first_non_empty_string(
        payload.get("title"),
        payload.get("problem_title"),
        payload.get("problemTitle"),
        payload.get("name"),
    )
    description = _build_exercise_description(payload)
    templates = _to_string_map(
        payload.get("templates")
        or payload.get("template")
        or payload.get("starterCode")
        or payload.get("starter_code")
    )
    solutions = _to_string_map(
        payload.get("solutions")
        or payload.get("solution")
        or payload.get("referenceSolutions")
        or payload.get("reference_solutions")
    )
    test_cases = _normalize_exercise_test_cases(payload)
    hints = _to_string_list(payload.get("hints") or payload.get("tips") or payload.get("clues"))
    explanation = _first_non_empty_string(
        payload.get("explanation"),
        payload.get("analysis"),
        payload.get("solutionExplanation"),
        payload.get("solution_explanation"),
    )

    if not title:
        raise ValueError("AI exercise payload is missing title")
    if not description:
        raise ValueError("AI exercise payload is missing description")
    if not test_cases:
        raise ValueError("AI exercise payload is missing test cases")
    if not templates:
        raise ValueError("AI exercise payload is missing templates")

    return {
        "title": title,
        "description": description,
        "difficulty": _normalize_difficulty(payload.get("difficulty")),
        "templates": templates,
        "solutions": solutions,
        "testCases": test_cases,
        "hints": hints,
        "explanation": explanation,
    }


def normalize_generated_fill_blank_payload(payload: Any) -> Dict[str, Any]:
    if not _is_record(payload):
        raise ValueError("AI fill-blank payload must be an object")

    title = _first_non_empty_string(
        payload.get("title"),
        payload.get("problem_title"),
        payload.get("problemTitle"),
        payload.get("name"),
    )
    description = _first_non_empty_string(
        payload.get("description"),
        payload.get("problem_description"),
        payload.get("problemDescription"),
        payload.get("statement"),
    )
    code_template = _to_string_map(
        payload.get("codeTemplate")
        or payload.get("code_template")
        or payload.get("templates")
    )
    blanks = _normalize_fill_blank_items(payload)
    explanation = _first_non_empty_string(
        payload.get("explanation"),
        payload.get("analysis"),
        payload.get("solutionExplanation"),
        payload.get("solution_explanation"),
    )

    if not title:
        raise ValueError("AI fill-blank payload is missing title")
    if not description:
        raise ValueError("AI fill-blank payload is missing description")
    if not code_template:
        raise ValueError("AI fill-blank payload is missing code template")
    if not blanks:
        raise ValueError("AI fill-blank payload is missing blanks")

    return {
        "title": title,
        "description": description,
        "difficulty": _normalize_difficulty(payload.get("difficulty")),
        "codeTemplate": code_template,
        "blanks": blanks,
        "explanation": explanation,
    }
