#!/usr/bin/env python3
"""
E2E smoke test for the Vibe-Coding Prompt Arena API.

Usage:
    python scripts/test_vibe_prompt_arena.py --email user@example.com --password secret
    python scripts/test_vibe_prompt_arena.py --base-url http://localhost:3001 --skip-auth

Exit code 0 = all tests passed, 1 = at least one failure.
"""

import argparse
import sys
import json
import requests


def log_pass(step: str) -> None:
    print(f"  [PASS] {step}")


def log_fail(step: str, detail: str = "") -> None:
    msg = f"  [FAIL] {step}"
    if detail:
        msg += f"\n         {detail}"
    print(msg)


def build_url(base: str, path: str) -> str:
    return base.rstrip("/") + path


def authenticate(session: requests.Session, base: str, email: str, password: str) -> bool:
    """Post to /api/auth/login and return True on success."""
    url = build_url(base, "/api/auth/login")
    try:
        resp = session.post(url, json={"email": email, "password": password}, timeout=15)
    except requests.ConnectionError as exc:
        log_fail("auth/login", f"Connection error: {exc}")
        return False
    except requests.Timeout:
        log_fail("auth/login", "Request timed out")
        return False

    if resp.status_code != 200:
        log_fail("auth/login", f"HTTP {resp.status_code}: {resp.text[:300]}")
        return False

    log_pass("auth/login - authenticated")
    return True


def safe_request(session: requests.Session, method: str, url: str, **kwargs) -> requests.Response | None:
    """Perform a request with connection/timeout error handling."""
    kwargs.setdefault("timeout", 30)
    try:
        return session.request(method, url, **kwargs)
    except requests.ConnectionError as exc:
        log_fail(url, f"Connection error: {exc}")
        return None
    except requests.Timeout:
        log_fail(url, "Request timed out")
        return None


def run_tests(base: str, session: requests.Session) -> int:
    """Run the smoke test sequence. Returns number of failures."""
    failures = 0

    # --- Step 1: GET /api/vibe-coding/profile (initial) ---
    print("\n[1] GET /api/vibe-coding/profile (initial)")
    resp = safe_request(session, "GET", build_url(base, "/api/vibe-coding/profile"))
    if resp is None:
        failures += 1
    elif resp.status_code != 200:
        log_fail("profile", f"HTTP {resp.status_code}: {resp.text[:300]}")
        failures += 1
    else:
        data = resp.json()
        if "recommendedTrack" in data:
            log_pass(f"profile returned recommendedTrack={data['recommendedTrack']!r}")
        else:
            log_fail("profile", f"Missing 'recommendedTrack' in response: {json.dumps(data)[:300]}")
            failures += 1

    # --- Step 2: GET /api/vibe-coding/history (initial) ---
    print("\n[2] GET /api/vibe-coding/history (initial)")
    resp = safe_request(session, "GET", build_url(base, "/api/vibe-coding/history"))
    if resp is None:
        failures += 1
    elif resp.status_code != 200:
        log_fail("history", f"HTTP {resp.status_code}: {resp.text[:300]}")
        failures += 1
    else:
        data = resp.json()
        if "items" in data and isinstance(data["items"], list):
            log_pass(f"history returned {len(data['items'])} items")
        else:
            log_fail("history", f"Expected {{items: [...]}} but got: {json.dumps(data)[:300]}")
            failures += 1

    # --- Step 3: POST /api/vibe-coding/generate ---
    print("\n[3] POST /api/vibe-coding/generate")
    resp = safe_request(session, "POST", build_url(base, "/api/vibe-coding/generate"),
                        json={"track": "frontend"})
    challenge_id = None
    if resp is None:
        failures += 1
    elif resp.status_code != 200:
        log_fail("generate", f"HTTP {resp.status_code}: {resp.text[:300]}")
        failures += 1
    else:
        data = resp.json()
        missing = [k for k in ("id", "title", "scenario") if k not in data]
        if missing:
            log_fail("generate", f"Missing keys {missing} in response: {json.dumps(data)[:300]}")
            failures += 1
        else:
            challenge_id = data["id"]
            log_pass(f"generated challenge id={challenge_id!r} title={data['title']!r}")

    # --- Step 4: POST /api/vibe-coding/evaluate ---
    print("\n[4] POST /api/vibe-coding/evaluate")
    if challenge_id is None:
        log_fail("evaluate", "Skipped - no challenge_id from previous step")
        failures += 1
    else:
        user_prompt = (
            "Build a responsive navbar with mobile hamburger menu. "
            "Requirements: semantic HTML, WCAG AA contrast, keyboard navigation. "
            "Verify: all links work, menu toggles on mobile, no horizontal scroll. "
            "Output: single React component with Tailwind CSS."
        )
        resp = safe_request(session, "POST", build_url(base, "/api/vibe-coding/evaluate"),
                            json={"challenge_id": challenge_id, "user_prompt": user_prompt})
        if resp is None:
            failures += 1
        elif resp.status_code != 200:
            log_fail("evaluate", f"HTTP {resp.status_code}: {resp.text[:300]}")
            failures += 1
        else:
            data = resp.json()
            has_score = "total_score" in data
            has_dims = "dimension_scores" in data
            if has_score and has_dims:
                log_pass(f"evaluated: total_score={data['total_score']}, dims={json.dumps(data['dimension_scores'])}")
            else:
                log_fail("evaluate", f"Missing total_score/dimension_scores: {json.dumps(data)[:300]}")
                failures += 1

    # --- Step 5: GET /api/vibe-coding/history (after evaluate) ---
    print("\n[5] GET /api/vibe-coding/history (after evaluate)")
    resp = safe_request(session, "GET", build_url(base, "/api/vibe-coding/history"))
    if resp is None:
        failures += 1
    elif resp.status_code != 200:
        log_fail("history", f"HTTP {resp.status_code}: {resp.text[:300]}")
        failures += 1
    else:
        data = resp.json()
        items = data.get("items", [])
        if len(items) >= 1:
            log_pass(f"history now has {len(items)} item(s)")
        else:
            log_fail("history", "Expected at least 1 item after evaluate")
            failures += 1

    # --- Step 6: GET /api/vibe-coding/profile (after evaluate) ---
    print("\n[6] GET /api/vibe-coding/profile (after evaluate)")
    resp = safe_request(session, "GET", build_url(base, "/api/vibe-coding/profile"))
    if resp is None:
        failures += 1
    elif resp.status_code != 200:
        log_fail("profile", f"HTTP {resp.status_code}: {resp.text[:300]}")
        failures += 1
    else:
        data = resp.json()
        if "recommendedTrack" in data:
            log_pass(f"profile updated: recommendedTrack={data['recommendedTrack']!r}")
        else:
            log_fail("profile", f"Missing 'recommendedTrack': {json.dumps(data)[:300]}")
            failures += 1

    return failures


def main() -> None:
    parser = argparse.ArgumentParser(
        description="E2E smoke test for the Vibe-Coding Prompt Arena API",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python scripts/test_vibe_prompt_arena.py --email user@example.com --password secret\n"
            "  python scripts/test_vibe_prompt_arena.py --base-url http://localhost:3001 --skip-auth\n"
        ),
    )
    parser.add_argument("--base-url", default="http://localhost:3001", help="API base URL (default: http://localhost:3001)")
    parser.add_argument("--email", default=None, help="Login email")
    parser.add_argument("--password", default=None, help="Login password")
    parser.add_argument("--skip-auth", action="store_true", help="Skip authentication (for environments where auth is not required)")
    args = parser.parse_args()

    print(f"=== Vibe-Coding Prompt Arena Smoke Test ===")
    print(f"Target: {args.base_url}")

    session = requests.Session()

    if not args.skip_auth:
        if not args.email or not args.password:
            print("\nError: --email and --password are required (or use --skip-auth)")
            sys.exit(1)
        print(f"\n[0] Authenticating as {args.email}")
        if not authenticate(session, args.base_url, args.email, args.password):
            print("\n=== RESULT: FAIL (authentication failed) ===")
            sys.exit(1)
    else:
        print("\n[0] Skipping authentication (--skip-auth)")

    failures = run_tests(args.base_url, session)

    print(f"\n{'=' * 44}")
    if failures == 0:
        print("=== RESULT: ALL PASSED ===")
        sys.exit(0)
    else:
        print(f"=== RESULT: {failures} FAILURE(S) ===")
        sys.exit(1)


if __name__ == "__main__":
    main()
