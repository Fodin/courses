# Task 17.1: Pipeline Performance — Interactive Profiler

## Goal

Create a visualization that demonstrates the difference between a sequential pipeline and an optimized one (with `needs`, `rules:changes`, `GIT_DEPTH`). The user configures the pipeline and sees calculated execution time.

## Requirements

1. Display a set of jobs: `install`, `lint`, `test:unit`, `test:e2e`, `build`, `deploy` — each with a conditional execution time (in seconds)
2. Implement a mode switcher: **Sequential** (all jobs sequentially by stages) vs **Optimized** (with `needs` DAG)
3. In Optimized mode, `lint`, `test:unit`, `test:e2e` start simultaneously after `install`, `build` waits for all three, `deploy` waits for `build`
4. Show total calculated time for each mode and the savings percentage
5. Implement optimization toggles: `GIT_DEPTH: 1` (saves 30 sec per job), `rules:changes` (skips test:e2e if "Frontend changed" toggle is off)
6. When selecting each job, show the corresponding YAML fragment (with or without `needs`)
7. Visualize the job timeline (horizontal bars with width proportional to time)

## Checklist

- [ ] At least 6 jobs with different execution times
- [ ] Sequential / Optimized switcher with time recalculation
- [ ] Timeline (Gantt-like) — job bars, parallel jobs on same level
- [ ] Total time counter and % savings
- [ ] GIT_DEPTH toggle (affects all job times)
- [ ] "Frontend changed" toggle (controls rules:changes for test:e2e)
- [ ] YAML block with config of selected job (with `needs` in optimized mode)
- [ ] Color coding by stage (install, test, build, deploy)

## How to Verify

1. In Sequential mode, all jobs are arranged sequentially, total time = sum of all
2. In Optimized mode, `lint`, `test:unit`, `test:e2e` are parallel — total time is noticeably less
3. Enable GIT_DEPTH: 1 — each job time decreases, final time recalculates
4. Disable "Frontend changed" — `test:e2e` is skipped, time decreases
5. Click on `build` job in Optimized mode — YAML should show `needs: [lint, test:unit, test:e2e]`

## Hints

- For the timeline use `display: flex` with `position: relative` — blocks with `margin-left` proportional to start time
- In Sequential mode, each job starts after the previous one (start time = sum of previous)
- In Optimized mode, calculate `startTime` for each job via DAG: `max(endTime of dependencies)`
- `useState` for: `mode` ('sequential' | 'optimized'), `useGitDepth` (boolean), `frontendChanged` (boolean), `selectedJob` (string | null)
