# Task 5.2: Cache — Build Speedup

## Goal

Create a build simulator that clearly shows the difference in pipeline execution time with and without caching. Add `cache:key` and `cache:paths` configuration.

## Requirements

1. Display two pipeline variants side by side: "Without Cache" and "With Cache"
2. Each variant shows steps: `Install dependencies → Compile → Run tests`
3. Implement "Run Simulation" button — animate step execution with delays
4. "Without Cache" — installing dependencies takes ~3 seconds (simulated)
5. "With Cache" — installing dependencies takes ~0.5 seconds (cache hit)
6. Show total time for each variant and cache savings
7. Add `cache:key` configuration section — dropdown or buttons: static key, `$CI_COMMIT_REF_SLUG`, `files: [package-lock.json]`
8. Add checkboxes for `cache:paths` (at least: `node_modules/`, `.npm/`, `.cache/`)
9. Show generated YAML for the cache config

## Checklist

- [ ] Two visual blocks "Without Cache" and "With Cache" side by side (flex-layout)
- [ ] At least 3 steps in each pipeline with progress indicators (pending/running/done)
- [ ] "Run" button triggers step-by-step animation
- [ ] Different durations for "Install dependencies" step depending on cache presence
- [ ] Total time displayed after simulation completes
- [ ] cache:key configuration block with three options
- [ ] cache:paths checkboxes
- [ ] Generated YAML updates when settings change
- [ ] After simulation — comparison: "Saved X seconds (Y%)"

## How to Verify

1. Press "Run" — both pipelines should start simultaneously
2. "With Cache" should finish faster due to the dependencies step
3. Final numbers should reflect the actual time difference
4. Select `files: [package-lock.json]` in key config — YAML should update
5. Enable additional paths — they should appear in YAML

## Hints

- Use `setTimeout` inside an `async` function or a chain via `useEffect` for simulation
- Steps stored as an array: `{ name, withCacheDuration, withoutCacheDuration, status }`
- `status` can be: `'pending' | 'running' | 'done'`
- Use colored dots for indicators: gray (pending), yellow (running), green (done)
- Calculate total time as the sum of `duration` of completed steps
