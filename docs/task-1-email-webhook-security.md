# Task 1 — Email Webhook Security

## Status

Complete.

## Final Architecture

Incoming email webhook flow:

1. Validate shared webhook secret.
2. Parse sender email from inbound email payload.
3. Parse project UUID from email subject.
4. Fetch project by `projects.id`.
5. Map `projects.user_id` to `contractors.tenant_id`.
6. Fetch contractor by matching `contractors.tenant_id = projects.user_id`.
7. Check `contractor_inbound_senders` for an allowed sender:
   - `contractor_inbound_senders.contractor_id = contractors.id`
   - `contractor_inbound_senders.email = normalized sender email`
8. Insert into `project_memories` only if sender is authorized.

## Verified Behavior

Allowed sender:

```text
200 OK
```
