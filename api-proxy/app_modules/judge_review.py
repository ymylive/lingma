import json
from typing import Any, Dict, List, Optional


JUDGE_AI_REVIEW_STATUS_GENERATED = "generated"
JUDGE_AI_REVIEW_STATUS_SKIPPED = "skipped"
JUDGE_AI_REVIEW_STATUS_DEFERRED = "deferred"
JUDGE_AI_REVIEW_STATUS_UNAVAILABLE = "unavailable"
JUDGE_AI_REVIEW_DIMENSION_LIMITS = {
    "correctness": 40,
    "boundaryRobustness": 20,
    "complexityAndPerformance": 20,
    "codeQualityAndReadability": 20,
}
JUDGE_AI_REVIEW_MAX_OUTPUT_TOKENS = 1400


class JudgeAiReviewNormalizationError(ValueError):
    pass


def build_judge_ai_review_skipped() -> Dict[str, Any]:
    return {"triggered": False, "status": JUDGE_AI_REVIEW_STATUS_SKIPPED}


def build_judge_ai_review_deferred(model: Optional[str] = None, *, triggered: bool = False) -> Dict[str, Any]:
    payload: Dict[str, Any] = {"triggered": triggered, "status": JUDGE_AI_REVIEW_STATUS_DEFERRED}
    if model:
        payload["model"] = model
    return payload


def build_judge_ai_review_unavailable(model: Optional[str] = None) -> Dict[str, Any]:
    payload: Dict[str, Any] = {"triggered": True, "status": JUDGE_AI_REVIEW_STATUS_UNAVAILABLE}
    if model:
        payload["model"] = model
    return payload


def sanitize_judge_ai_review_string(value: Any, field_name: str, *, max_length: int = 4000) -> str:
    text = str(value or "").strip()
    if not text:
        raise JudgeAiReviewNormalizationError(f"{field_name} is required")
    return text[:max_length]


def sanitize_judge_ai_review_list(
    values: Any,
    field_name: str,
    *,
    max_items: int = 6,
    allow_empty: bool = False,
) -> List[str]:
    if not isinstance(values, list):
        raise JudgeAiReviewNormalizationError(f"{field_name} must be a list")

    normalized: List[str] = []
    for item in values:
        text = str(item or "").strip()
        if text:
            normalized.append(text[:800])

    if not allow_empty and not normalized:
        raise JudgeAiReviewNormalizationError(f"{field_name} must contain at least one item")
    return normalized[:max_items]


def normalize_judge_ai_review_payload(payload: Dict[str, Any], model: str) -> Dict[str, Any]:
    if not isinstance(payload, dict):
        raise JudgeAiReviewNormalizationError("review payload must be an object")

    raw_scores = payload.get("dimensionScores")
    if not isinstance(raw_scores, dict):
        raise JudgeAiReviewNormalizationError("dimensionScores must be an object")

    dimension_scores: Dict[str, int] = {}
    score_total = 0
    for key, max_score in JUDGE_AI_REVIEW_DIMENSION_LIMITS.items():
        raw_value = raw_scores.get(key)
        if raw_value is None:
            raise JudgeAiReviewNormalizationError(f"{key} is required")
        try:
            score = int(raw_value)
        except Exception as exc:
            raise JudgeAiReviewNormalizationError(f"{key} must be an integer") from exc
        if score < 0 or score > max_score:
            raise JudgeAiReviewNormalizationError(f"{key} must be between 0 and {max_score}")
        dimension_scores[key] = score
        score_total += score

    try:
        total_score = int(payload.get("totalScore"))
    except Exception:
        total_score = score_total

    if total_score != score_total:
        total_score = score_total

    return {
        "triggered": True,
        "status": JUDGE_AI_REVIEW_STATUS_GENERATED,
        "model": model,
        "totalScore": total_score,
        "dimensionScores": dimension_scores,
        "overallDiagnosis": sanitize_judge_ai_review_string(payload.get("overallDiagnosis"), "overallDiagnosis", max_length=6000),
        "errorPoints": sanitize_judge_ai_review_list(payload.get("errorPoints"), "errorPoints"),
        "fixSuggestions": sanitize_judge_ai_review_list(payload.get("fixSuggestions"), "fixSuggestions"),
        "optimizationSuggestions": sanitize_judge_ai_review_list(
            payload.get("optimizationSuggestions"),
            "optimizationSuggestions",
            allow_empty=True,
        ),
        "nextStep": sanitize_judge_ai_review_string(payload.get("nextStep"), "nextStep", max_length=1500),
    }


def compact_dict(values: Dict[str, Any]) -> Dict[str, Any]:
    compacted: Dict[str, Any] = {}
    for key, value in values.items():
        if value is None:
            continue
        if isinstance(value, str) and not value.strip():
            continue
        if isinstance(value, (list, dict)) and not value:
            continue
        compacted[key] = value
    return compacted


def extract_optional_exercise_context(body: Dict[str, Any]) -> Dict[str, str]:
    raw = body.get("exerciseContext")
    if not isinstance(raw, dict):
        return {}

    field_limits = {
        "exerciseId": 200,
        "title": 300,
        "description": 6000,
        "difficulty": 80,
        "category": 120,
        "explanation": 6000,
    }
    normalized: Dict[str, str] = {}
    for key, max_length in field_limits.items():
        text = str(raw.get(key) or "").strip()
        if text:
            normalized[key] = text[:max_length]
    return normalized


def build_judge_forward_payload(body: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "code": body.get("code"),
        "language": body.get("language"),
        "testCases": body.get("testCases"),
    }


def build_judge_review_failure_entry(result: Dict[str, Any]) -> Dict[str, Any]:
    return compact_dict(
        {
            "testCase": result.get("testCase"),
            "status": str(result.get("status") or "").strip(),
            "description": str(result.get("description") or "").strip(),
            "checkpoint": str(result.get("checkpointTitle") or result.get("checkpoint") or "").strip(),
            "checkpointGroup": str(result.get("checkpointGroup") or "").strip(),
            "input": str(result.get("input") or ""),
            "expectedOutput": str(result.get("expectedOutput") or ""),
            "actualOutput": str(result.get("actualOutput") or ""),
            "error": str(result.get("error") or "").strip(),
            "feedbackHint": str(result.get("feedbackHint") or "").strip(),
            "hidden": bool(result.get("hidden")),
        }
    )


def collect_judge_failure_evidence(judge_payload: Dict[str, Any]) -> Dict[str, Any]:
    compile_errors: List[Dict[str, Any]] = []
    runtime_failures: List[Dict[str, Any]] = []
    wrong_answers: List[Dict[str, Any]] = []
    other_failures: List[Dict[str, Any]] = []
    failed_results: List[Dict[str, Any]] = []

    results = judge_payload.get("results")
    if not isinstance(results, list):
        return {}

    for result in results:
        if not isinstance(result, dict):
            continue
        if result.get("passed") is True:
            continue

        entry = build_judge_review_failure_entry(result)
        if not entry:
            continue

        failed_results.append(entry)
        status = str(result.get("status") or "").strip().upper()
        if status == "CE":
            compile_errors.append(entry)
        elif status in {"RE", "TLE", "MLE", "OLE"}:
            runtime_failures.append(entry)
        elif status == "WA":
            wrong_answers.append(entry)
        else:
            other_failures.append(entry)

    return compact_dict(
        {
            "failedResults": failed_results,
            "compileErrors": compile_errors,
            "runtimeFailures": runtime_failures,
            "wrongAnswers": wrong_answers,
            "otherFailures": other_failures,
        }
    )


def should_trigger_judge_ai_review(judge_payload: Dict[str, Any]) -> bool:
    all_passed = judge_payload.get("allPassed") is True
    summary = judge_payload.get("summary")
    if not isinstance(summary, dict):
        return True

    try:
        score = int(summary.get("score"))
    except Exception:
        return True
    return not (all_passed and score == 100)


def build_judge_ai_review_prompt(
    exercise_context: Dict[str, str],
    code: str,
    language: str,
    judge_payload: Dict[str, Any],
    model: str,
) -> Dict[str, Any]:
    summary = judge_payload.get("summary") if isinstance(judge_payload.get("summary"), dict) else {}
    checkpoints = judge_payload.get("checkpoints") if isinstance(judge_payload.get("checkpoints"), list) else []
    review_request = compact_dict(
        {
            "exercise": exercise_context,
            "submission": {
                "language": language,
                "code": code,
            },
            "deterministicJudge": compact_dict(
                {
                    "success": judge_payload.get("success"),
                    "allPassed": judge_payload.get("allPassed"),
                    "error": str(judge_payload.get("error") or "").strip(),
                    "summary": summary,
                    "checkpoints": checkpoints,
                    "failureEvidence": collect_judge_failure_evidence(judge_payload),
                }
            ),
        }
    )

    instructions = (
        "You are reviewing a coding exercise submission after a deterministic judge has already run. "
        "The deterministic judge is the source of truth. Never replace or contradict its verdicts. "
        "Return JSON only with keys: totalScore, dimensionScores, overallDiagnosis, errorPoints, "
        "fixSuggestions, optimizationSuggestions, nextStep. "
        "dimensionScores must include correctness, boundaryRobustness, complexityAndPerformance, codeQualityAndReadability. "
        "Score ranges are correctness 0-40, boundaryRobustness 0-20, complexityAndPerformance 0-20, codeQualityAndReadability 0-20. "
        "totalScore must equal the sum of the four dimension scores. "
        "Use only the deterministic evidence provided. Do not invent hidden inputs, hidden outputs, or hidden failures. "
        "Compile errors must cite compiler output. Runtime errors must cite runtime error text and relevant case metadata. "
        "Wrong answers must cite failed case input, expected output, actual output, and checkpoint context. "
        "Keep errorPoints and fixSuggestions concise and actionable. "
        "Provide optimizationSuggestions only when relevant; otherwise return an empty array."
    )
    user_text = f"judge_review_request={json.dumps(review_request, ensure_ascii=False)}"

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
        "max_output_tokens": JUDGE_AI_REVIEW_MAX_OUTPUT_TOKENS,
    }
