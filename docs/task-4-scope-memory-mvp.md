# Task 4 — Scope Memory MVP

## Status

Complete.

## Goal

Create a contractor-specific scope memory system that helps BUILDRAIL suggest reusable proposal language during estimate review.

The goal is not to make BUILDRAIL an AI pricing engine.

The goal is:

> BUILDRAIL remembers how the contractor writes and structures scope.

## Why This Matters

Contractors reuse similar scope language across jobs:

- shower valve relocation
- waterproofing prep
- hidden condition exclusions
- plumbing rough-in notes
- tile preparation
- homeowner approval language
- allowance language
- scope clarifications

Before this task, BUILDRAIL could generate and store project memory, but it did not have a dedicated reusable scope library.

Task 4 adds that reusable layer.

## Final Workflow

```text
Proposal review page
→ Suggested Scope Blocks panel
→ Insert reusable scope language
→ Edit inserted line item
→ Save proposal draft
→ Reload and preserve edits
→ Save edited line item as reusable scope block
→ Use improved language in future proposals
```
