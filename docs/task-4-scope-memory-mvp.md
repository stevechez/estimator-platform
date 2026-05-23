# Task 4 — Scope Memory MVP

## Status

Implemented and in active testing.

## Goal

Create contractor-specific reusable scope memory so BUILDRAIL can suggest prior scope language during proposal drafting.

## Final Architecture

1. Reusable scope language is stored in `scope_blocks`.
2. Each scope block has:
   - title
   - body
   - project type
   - trade
   - room
   - tags
   - source project
   - embedding
   - usage count
3. `saveScopeBlock` generates an embedding using `text-embedding-3-small`.
4. `searchScopeBlocks` performs vector search through the `match_scope_blocks` RPC.
5. `SuggestedScopeBlocks` displays relevant reusable scope blocks in the proposal review flow.
6. Contractors can copy or insert suggested language.
7. Inserted scope blocks become editable proposal line items.
8. Proposal line items can be saved back as reusable scope blocks.

## Database Objects

- `scope_blocks`
- `match_scope_blocks`
- `increment_scope_block_usage`

## Product Positioning

This is not AI pricing.

This is contractor-specific organizational memory:

> BUILDRAIL remembers how you write and structure scopes.

## MVP Behavior

- Suggestions appear in the review/proposal page.
- Insert adds a new editable line item.
- Save persists the updated estimate draft.
- Save as Scope Block turns edited proposal language into reusable future memory.

## Next Improvements

- Avoid duplicate scope blocks.
- Add edit/delete management for saved blocks.
- Improve tags and trade classification.
- Add hybrid retrieval using project memory plus scope memory.
