# Task 1 — Email Webhook Security

## Status

Complete and regression tested.

## Goal

Secure the inbound email webhook so only approved sender emails can write project memories into BUILDRAIL.

## Final Architecture

Incoming email webhook flow:

1. Validate shared webhook secret.
2. Parse sender email from inbound email payload.
3. Parse project UUID from the email subject.
4. Fetch project by `projects.id`.
5. Map `projects.user_id` to `contractors.tenant_id`.
6. Fetch contractor by matching `contractors.tenant_id = projects.user_id`.
7. Check `contractor_inbound_senders` for an allowed sender:
   - `contractor_inbound_senders.contractor_id = contractors.id`
   - `contractor_inbound_senders.email = normalized sender email`
8. Insert into `project_memories` only if sender is authorized.
9. Email memories are saved through `saveProjectMemory`, so embeddings are generated automatically.

## Actual Schema Relationship

The app does not use `projects.contractor_id`.

Current relationship:

```text
projects.user_id
→ contractors.tenant_id
→ contractors.id
→ contractor_inbound_senders.contractor_id
```
