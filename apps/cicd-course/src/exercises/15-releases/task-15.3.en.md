# Task 15.3: Complete Release Pipeline

## Goal

Create a full release pipeline visualizer: from a git tag appearing to npm package publication, Docker image, and GitLab Release. Show parallel job execution, their dependencies, and status.

## Requirements

1. Display all pipeline stages as columns: `test` → `build` → `release`
2. Show jobs in each stage:
   - test: `unit-tests`
   - build: `build-npm` and `build-docker` (in parallel)
   - release: `publish-npm`, `create-changelog`, `create-gitlab-release` (the last depends on the first two)
3. Implement "Run Pipeline" button — sequentially launches jobs with execution simulation (delays via setTimeout)
4. Each job has three states: `pending` (gray), `running` (blue with animation), `success` (green)
5. Show an execution log below: what happens at each step
6. After pipeline completion, display a final summary: version published to npm, Docker image with two tags, GitLab Release created

## Checklist

- [ ] Three stage columns in correct order
- [ ] All six jobs displayed in correct stages
- [ ] build-npm and build-docker launch in parallel (simultaneously transition to running)
- [ ] create-gitlab-release waits for publish-npm and create-changelog to complete
- [ ] Visual states: pending / running / success with different colors
- [ ] Log updates during pipeline execution
- [ ] "Run" button is disabled during execution and changes text to "Reset" after completion
- [ ] Final summary after completion (npm registry, Docker Hub, GitLab Release)

## How to Verify

1. Press "Run Pipeline" — unit-tests should transition to running
2. After test stage completes — build-npm and build-docker should start simultaneously
3. After build completes — publish-npm and create-changelog start in parallel
4. create-gitlab-release should only start after both previous jobs complete
5. After full completion — a final summary with publication details appears
6. Press "Reset" — all jobs return to pending

## Hints

- Each job state: `Record<string, 'pending' | 'running' | 'success'>`
- Use `async/await` with `setTimeout` for delay simulation: `await delay(1500)`
- For parallel launch: `Promise.all([runJob('build-npm'), runJob('build-docker')])`
- `delay(ms)` function: `new Promise(resolve => setTimeout(resolve, ms))`
- Log: `string[]` in useState, add lines via `setLog(prev => [...prev, message])`
- For running state animation: CSS `animation: pulse` or simply `opacity: 0.7` via additional state
