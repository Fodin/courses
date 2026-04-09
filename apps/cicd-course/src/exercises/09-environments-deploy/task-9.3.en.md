# Task 9.3: Rollback — Deploy Rollback Simulator

## Goal

Create an interactive deployment history simulator with rollback capability. Visualize three image tags: `sha`, `stable`, `previous` — and show how they change with each deploy and rollback.

## Requirements

1. Display an "image registry" — list of 5 images with SHA tags (e.g., `a1b2c3d`, `e4f5g6h`, ...)
2. Show three special tags: `previous`, `stable`, `latest/sha` — which image they currently point to
3. "Deploy new version" button — simulates deploying a new image: `previous` ← old `stable`, `stable` ← new SHA
4. "Rollback" button — simulates rollback: `stable` ← `previous`, show visual success signal
5. Display "Production" — a block showing the current `stable` tag and its SHA
6. Event log — list of last 6 actions (Deploy v4, Rollback to v3, Deploy v5, ...)
7. "Simulate incident" button — automatically does a Deploy, then offers a Rollback with problem highlighting

## Checklist

- [ ] List of SHA images as a table or cards
- [ ] Visual arrows or badges showing which tag (previous/stable) points to which SHA
- [ ] Production block showing the current active image (stable)
- [ ] Deploy button updates previous and stable tags
- [ ] Rollback button switches stable back to previous, previous becomes unavailable (no history deeper than 1)
- [ ] After two consecutive Rollbacks, the button should be disabled (no previous)
- [ ] Event log — last 6 entries with time
- [ ] Simulate Incident button — 2 automatic steps with delay or step-by-step

## How to Verify

1. Press Deploy three times — verify previous/stable switch correctly
2. Press Rollback — stable should return to the previous SHA
3. Press Rollback again — button should be disabled (no previous version to roll back to)
4. Press Simulate Incident — a "bad" version should be deployed, then a rollback offer appears
5. Check the log — all actions should be recorded

## Hints

- Store `images` (array of SHA strings), `stableIndex` (number), `previousIndex` (number | null)
- On Deploy: `previousIndex = stableIndex`, `stableIndex = stableIndex + 1` (cyclic through array)
- On Rollback: `stableIndex = previousIndex`, `previousIndex = null`
- Disabled for Rollback: `previousIndex === null`
- For Simulate Incident: set `incident: true` in state, change Production block style
