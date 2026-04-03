# Password Recovery Design

**Date:** 2026-03-30

**Status:** Approved in chat, pending final user review

## Goal

Add a password recovery flow to the existing auth system so users can reset their password by receiving a one-time verification code through email.

## Product Scope

This feature stays inside the current auth experience at `/auth` and does not introduce a separate auth product or a new identity system.

The first release includes:

- email-based password recovery
- one-time six-digit verification code delivery
- password reset confirmation in the same auth page
- SMTP-based email sending with environment-variable configuration
- development fallback that logs the verification code when SMTP is not configured
- invalidation of existing sessions after a successful password reset

The first release does not include:

- SMS recovery
- passwordless login
- magic-link login
- multi-factor authentication
- admin moderation screens
- third-party email providers beyond generic SMTP

## Current State

The current auth system is session-cookie based and lives under `/api/auth/*`.

- The frontend uses `UserProvider` in `src/contexts/UserContext.tsx` to restore a cookie-backed session from `/api/auth/session`.
- The auth page at `src/pages/Auth.tsx` currently combines login and register in a single route using local component state.
- The backend auth implementation lives in `api-proxy/main.py`.
- User records are stored in SQLite in the `users` table.
- Sessions are stored in SQLite in the `user_sessions` table.
- Passwords are hashed with per-user salt and PBKDF2.

This means password recovery should reuse:

- the existing `/api/auth/*` namespace
- the same SQLite database and initialization path
- the same frontend auth page shell
- the same frontend auth fetch style in `UserContext.tsx`

This feature should not introduce JWT, a separate auth service, or a new frontend route unless later requirements force it.

## Core User Flow

1. User opens `/auth`.
2. User clicks `Forgot password?` from the login mode.
3. The page switches into a recovery mode without leaving `/auth`.
4. User enters their email and requests a verification code.
5. Backend always returns a generic success response whether the account exists or not.
6. If the account exists, backend generates a one-time code, stores only its hash, and sends the code by email.
7. User enters:
   - email
   - verification code
   - new password
   - confirm password
8. Backend verifies the code and resets the password.
9. Backend invalidates all active sessions for that user.
10. Frontend returns the user to login mode and shows a success message telling them to sign in with the new password.

## UX Design

The existing `Auth` page remains the single auth entry point.

### Mode Model

Replace the current binary `isLogin` view state with a mode enum:

- `login`
- `register`
- `forgot`

This keeps the route structure stable and avoids touching protected-route logic.

### Entry Point

In `login` mode, add a small secondary action below the password field and above the submit button:

- Chinese: `忘记密码？`
- English: `Forgot password?`

### Recovery Form

The recovery experience should use the same card shell, error banner, and loading button patterns already used by the auth page.

Recovery mode should support two local steps inside the same page:

### Step 1: Request Code

Fields:

- email

Action:

- `Send verification code`

On success:

- keep the user in recovery mode
- reveal the reset form fields
- show a generic message such as:
  - Chinese: `如果该邮箱已注册，我们已发送验证码。`
  - English: `If that email is registered, we have sent a verification code.`

### Step 2: Confirm Reset

Fields:

- email
- verification code
- new password
- confirm password

Actions:

- `Reset password`
- `Back to sign in`

Frontend validation:

- new password and confirm password must match
- new password must satisfy the same length rule already used by registration
- verification code must be non-empty and numeric in the UI layer

On success:

- switch mode back to `login`
- clear password recovery local state
- show a success message:
  - Chinese: `密码已重置，请使用新密码登录。`
  - English: `Password reset successfully. Please sign in with your new password.`

## Backend Design

The backend continues to mount auth routes in `api-proxy/main.py`, but recovery-specific helpers should be extracted into a focused module:

- `api-proxy/app_modules/auth_recovery.py`

This module should contain only the recovery-specific logic such as:

- code generation
- code hashing helpers
- expiry checks
- send throttling rules
- SMTP send function

`main.py` remains the integration point for:

- database initialization
- route definitions
- dependency wiring
- HTTP status and JSON payload contracts

## Database Design

Add a new SQLite table in `init_auth_db()`:

`password_reset_codes`

Recommended columns:

- `id TEXT PRIMARY KEY`
- `user_id TEXT NOT NULL`
- `email TEXT NOT NULL`
- `code_hash TEXT NOT NULL`
- `code_salt TEXT NOT NULL`
- `created_at TEXT NOT NULL`
- `expires_at TEXT NOT NULL`
- `consumed_at TEXT`
- `attempt_count INTEGER NOT NULL DEFAULT 0`

Recommended indexes:

- index on `user_id`
- index on `email`
- index on `expires_at`

Behavior rules:

- Only store hashed verification codes, never plaintext.
- A new request for the same email should invalidate older unused codes for that email.
- Successful confirmation should mark the matched row as consumed.
- Expired codes should be cleaned up opportunistically during request and confirm operations.

No separate migration framework is needed. This should follow the project’s current startup-initialized SQLite schema pattern.

## Verification Code Rules

Use a short numeric verification code for the first release.

Recommended policy:

- six digits
- valid for 10 minutes
- one active code per email
- maximum 5 incorrect attempts per issued code

Security rules:

- compare against a stored hash, not plaintext
- on each failed confirm, increment `attempt_count`
- if `attempt_count >= 5`, treat the code as invalid and unusable
- after successful password reset, delete all `user_sessions` rows for that user

## API Contract

All recovery endpoints should stay under `/api/auth/*`.

### `POST /api/auth/password-reset/request`

Request body:

```json
{
  "email": "user@example.com"
}
```

Response body:

```json
{
  "ok": true
}
```

Contract rules:

- Always return the same success shape whether the email exists or not.
- Do not reveal account existence through status code or response body.
- If the email exists and sending is currently allowed, create a new code and send it.
- If the email exists but the request is still inside the cooldown window, return a generic success response without issuing a fresh code.

### `POST /api/auth/password-reset/confirm`

Request body:

```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewPassword123"
}
```

Successful response:

```json
{
  "ok": true
}
```

Failure behavior:

- invalid or expired code returns `400`
- malformed input returns `400`
- SMTP failure is only relevant to the request endpoint, not the confirm endpoint

The confirm endpoint should not auto-login the user. The user must sign in explicitly after reset.

## SMTP Design

Email delivery should use generic SMTP configuration from environment variables.

Recommended variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`
- `SMTP_USE_TLS`
- `PASSWORD_RESET_DEV_LOG_FALLBACK`

Behavior:

- In production, if SMTP is required but not configured, the request endpoint should fail clearly with a server error so operators notice the issue.
- In local development, if `PASSWORD_RESET_DEV_LOG_FALLBACK` is enabled and SMTP is not configured, log the generated code instead of sending email.
- Logs must avoid printing the code in production.

Email content for the first release should stay minimal:

- subject stating password reset verification code
- body with the code
- body with expiry reminder
- brief notice that existing sessions will be logged out after reset

## Abuse Prevention

This project currently uses only SQLite and does not have Redis or a background job system, so rate limiting should stay simple and database-backed.

The first release should enforce:

- per-email send cooldown: 60 seconds
- one active unused code per email
- per-code failed-attempt cap: 5
- short expiry: 10 minutes

The first release should not implement:

- IP-based rate limiting
- CAPTCHA
- global email quota controls

Those may be added later if the app faces abuse in production.

## Frontend Integration

The frontend auth request style should remain centered in `src/contexts/UserContext.tsx`.

Add two new request helpers:

- `requestPasswordReset(email: string): Promise<boolean>`
- `confirmPasswordReset(email: string, code: string, newPassword: string): Promise<boolean>`

These methods should:

- reuse `AUTH_BASE_URL`
- reuse `readAuthError`
- use `credentials: 'include'`
- not modify `user`
- not modify `progress`
- not change `isLoggedIn`

The auth page should call these methods directly, just as it currently calls `login` and `register`.

This keeps API access patterns consistent and avoids introducing a second auth service file for one feature.

## Error Handling

The flow should separate security-sensitive messaging from user-actionable messaging.

### Request Phase

Always show a generic success confirmation:

- never say the email does not exist
- never expose cooldown details in a way that confirms account existence

### Confirm Phase

Allow concrete but bounded messages:

- invalid verification code
- verification code expired
- password must be at least 6 characters
- passwords do not match

These messages are acceptable because the user has already entered a code and the endpoint no longer leaks simple account-existence information by itself.

## Testing Plan

### Backend Tests

Extend `api-proxy/tests/test_auth_api.py` with recovery-specific coverage:

- request endpoint returns `200` and `{ "ok": true }` for an existing email
- request endpoint returns the same `200` and `{ "ok": true }` for a missing email
- generated code is not stored in plaintext
- cooldown suppresses repeated issuance inside 60 seconds
- confirm fails for:
  - expired code
  - wrong code
  - too many attempts
  - malformed password
- confirm succeeds for a valid code
- after confirm:
  - old password no longer works
  - new password works
  - prior session is invalidated

Backend tests should continue using the current pattern of temporary SQLite databases and dynamic module loading.

### Frontend Tests

Add targeted coverage for:

- auth page mode switching into and out of `forgot`
- request-step success state
- confirm-step local validation
- success return to login mode

Extend `src/contexts/UserContext.test.tsx` to cover the new auth request methods and their fetch behavior.

## File-Level Change Plan

Expected primary files:

- Modify: `src/pages/Auth.tsx`
- Modify: `src/contexts/UserContext.tsx`
- Modify: `src/contexts/UserContext.test.tsx`
- Modify: `api-proxy/main.py`
- Create: `api-proxy/app_modules/auth_recovery.py`
- Modify: `api-proxy/tests/test_auth_api.py`
- Modify: deployment env documentation if needed in `README.md` or `api-proxy/README.md`

## Why This Design

This design is the smallest feature-complete recovery flow that fits the current codebase.

It works because it:

- preserves the existing route architecture
- preserves the existing session model
- uses the same SQLite initialization pattern already used in the backend
- keeps frontend auth behavior centralized in the current provider
- adds only one focused backend helper module instead of a large auth refactor

It intentionally avoids introducing:

- a new auth framework
- tokenized reset links
- infrastructure the project does not already have

## Validation

Before implementation is considered complete, validation should include:

- `python -m pytest api-proxy/tests/test_auth_api.py -q`
- targeted frontend tests for auth context and auth page
- `npm run test`
- `npm run build`

If SMTP is configured in a non-local environment, a manual smoke test should verify:

- request email delivery
- successful password reset
- forced logout of existing sessions
