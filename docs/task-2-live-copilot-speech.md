---

## `docs/task-2-live-copilot-speech.md`

````md
# Task 2 — Live Copilot Speech Integration

## Status

Implemented and build cleared.

## Goal

Replace simulated walkthrough behavior with real browser speech recognition so the Live Walkthrough Copilot can analyze spoken walkthrough notes in near real time.

## Final Architecture

Live walkthrough flow:

1. User opens the capture page.
2. User starts recording.
3. Browser microphone permission is requested.
4. `MediaRecorder` records the walkthrough audio.
5. Browser `SpeechRecognition` / `webkitSpeechRecognition` captures live transcript text.
6. Interim transcript appears in the UI.
7. Final transcript is appended to the running transcript.
8. Transcript chunks are sent to `analyzeWalkthroughChunk`.
9. AI returns structured alerts only when there is meaningful risk, missing information, scope dependency, or margin-protection concern.
10. Copilot alerts can be saved into `project_memories` as `system_auto`.

## Supported Alert Types

The backend currently returns:

```ts
'risk' | 'missing_question' | 'scope_dependency' | 'margin_protection';
```
````
