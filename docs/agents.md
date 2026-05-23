You are taking over BUILDRAIL. First read /docs/agents.md and docs/BUILDRAIL_DOCTRINE.md and the existing repo structure. Do not rewrite architecture unless necessary.

Task: Reinstate secure inbound email webhook handling.

Inspect:

- src/app/api/webhooks/email/route.ts
- Supabase client/server setup
- any schema or migration files
- contractors, projects, and project_memories usage

Goals:

1. Restore contractor/project authorization for inbound forwarded emails.
2. Keep local MVP testing possible via a clearly named dev-only bypass.
3. Ensure service role usage happens only server-side.
4. Add validation for project UUID extraction.
5. Add clear error responses and logging without exposing secrets.
6. Run typecheck/lint/tests if available.

Return a summary of files changed, risks, and any manual Supabase/RLS changes required.
