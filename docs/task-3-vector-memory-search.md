---

## `docs/task-3-vector-memory-search.md`

````md
# Task 3 — Vector Memory Search

## Status

Complete, backfilled, and regression tested.

## Goal

Upgrade BUILDRAIL from simple chronological memory retrieval to vector similarity search so AI outputs use the most relevant project memories, not just the newest logs.

## Final Architecture

Memory ingestion flow:

1. Field data is captured from voice notes, email forwards, photos, or system events.
2. `saveProjectMemory` receives the memory content.
3. OpenAI `text-embedding-3-small` generates a 1536-dimension embedding.
4. The memory is inserted into `project_memories`.
5. The `embedding` column stores the vector for future retrieval.

Retrieval flow:

1. AI generator creates a semantic search query.
2. `searchProjectMemories` embeds the query.
3. Supabase RPC `match_project_memories` performs pgvector similarity search.
4. Relevant memories are returned with similarity scores.
5. AI generators use those memories as context.

## Database Changes

Enabled pgvector:

```sql
create extension if not exists vector;
```
````
