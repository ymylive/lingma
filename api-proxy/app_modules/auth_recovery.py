import base64
import hashlib
import os
import secrets
import smtplib
from email.message import EmailMessage


PASSWORD_RESET_CODE_TTL_SECONDS = 10 * 60
PASSWORD_RESET_REQUEST_COOLDOWN_SECONDS = 60
PASSWORD_RESET_MAX_ATTEMPTS = 5
PASSWORD_RESET_HASH_ITERATIONS = 120000


def generate_password_reset_code() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def derive_password_reset_code_hash(code: str, salt_b64: str) -> str:
    salt = base64.b64decode(salt_b64.encode("ascii"))
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        code.encode("utf-8"),
        salt,
        PASSWORD_RESET_HASH_ITERATIONS,
    )
    return base64.b64encode(digest).decode("ascii")


def create_password_reset_code_record(code: str) -> dict[str, str]:
    salt_b64 = base64.b64encode(secrets.token_bytes(16)).decode("ascii")
    return {
        "code_hash": derive_password_reset_code_hash(code, salt_b64),
        "code_salt": salt_b64,
    }


def verify_password_reset_code(code: str, code_hash: str, code_salt: str) -> bool:
    return derive_password_reset_code_hash(code, code_salt) == code_hash


def send_password_reset_email(*, to_email: str, code: str, expires_in_minutes: int) -> None:
    smtp_host = (os.getenv("SMTP_HOST") or "").strip()
    smtp_from = (os.getenv("SMTP_FROM_EMAIL") or "").strip()
    dev_log_fallback = (os.getenv("PASSWORD_RESET_DEV_LOG_FALLBACK") or "").strip().lower() in {"1", "true", "yes", "on"}

    if not smtp_host:
        if dev_log_fallback:
            print(f"[password-reset] email={to_email} code={code} expires_in={expires_in_minutes}m")
            return
        raise RuntimeError("SMTP is not configured")

    message = EmailMessage()
    message["Subject"] = "Lingma password reset verification code"
    message["From"] = smtp_from or "no-reply@lingma.local"
    message["To"] = to_email
    message.set_content(
        f"Your Lingma password reset verification code is {code}. "
        f"It expires in {expires_in_minutes} minutes."
    )

    smtp_port = int((os.getenv("SMTP_PORT") or "587").strip())
    smtp_username = (os.getenv("SMTP_USERNAME") or "").strip()
    smtp_password = (os.getenv("SMTP_PASSWORD") or "").strip()
    use_tls = (os.getenv("SMTP_USE_TLS") or "true").strip().lower() not in {"0", "false", "no", "off"}

    with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
        if use_tls:
            server.starttls()
        if smtp_username:
            server.login(smtp_username, smtp_password)
        server.send_message(message)
