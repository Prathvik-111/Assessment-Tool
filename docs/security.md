# Security Checklist

- Never commit `.env`, API keys, SMTP passwords, database credentials, or real student submissions.
- Authenticate users and enforce student/instructor/admin authorization on every protected route.
- Verify webhook signatures and reject replayed or malformed events.
- Validate file types, file sizes, and uploaded content; store uploads privately.
- Treat LLM output as untrusted; validate it against strict schemas and rubric limits.
- Keep a traceable audit history of grade changes and certificate issuance.
- Require human review for uncertain, disputed, or flagged assessments.
- Apply rate limits, safe error responses, retention policies, and backups before production.
