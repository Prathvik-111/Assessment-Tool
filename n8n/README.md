# n8n workflows

Import exported workflow JSON files through the n8n UI. Configure credentials inside n8n rather than committing credentials or exported secret values.

Recommended workflows:
1. Submission received — receive a signed webhook and validate the event.
2. Assessment orchestration — call the backend grading endpoint.
3. Grading completed — notify the student when results are released.
4. Human review alert — notify authorized instructors for uncertain results.
5. Certificate generation — request a certificate only after backend eligibility checks.
6. Email notification — send approved templates.
7. Failure recovery — retry transient errors with limits and alert on repeated failure.

The JSON files in this starter are documentation placeholders, not ready-to-import n8n exports. Build and export the real workflows from your n8n instance.
