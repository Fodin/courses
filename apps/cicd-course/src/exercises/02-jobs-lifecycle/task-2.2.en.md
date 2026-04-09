# Task 2.2: allow_failure and when

## Goal

Implement an interactive pipeline simulator that clearly demonstrates how `allow_failure` and `when` affect CI/CD behavior on errors.

## Requirements

1. Display a pipeline with 4 jobs: **lint**, **test**, **coverage**, **deploy**
2. For each job, provide toggles:
   - `allow_failure: true/false`
   - `when`: dropdown (on_success, on_failure, always, manual)
3. **"Run Pipeline"** button simulates execution
4. **"Fail"** / **"Success"** buttons for each running job — controls the result
5. Overall pipeline status (Pass / Fail) should update in real time
6. Show visual state of each job: pending (gray), running (blue with animation), success (green), failed (red), skipped (gray dashed), warning (yellow — this is failed + allow_failure)

## Simulation Logic

- Jobs execute sequentially
- `on_success`: runs only if previous jobs succeeded (or are warning)
- `on_failure`: runs only if there is a failed job (not warning)
- `always`: runs regardless
- `manual`: displayed as "waiting for click", doesn't start automatically
- `allow_failure: true`: on failure, status = warning, pipeline doesn't stop
- `allow_failure: false` (default): on failure, subsequent `on_success` jobs are skipped

## Expected Result

```
[lint ✅] → [test ❌ warning] → [coverage ⏭️ skipped] → [deploy ✅]
              allow_failure: true    when: on_success       when: always

Pipeline result: ✅ SUCCESS (despite test failure)
```

## Hints

- Define a `JobConfig` type with fields: id, name, allowFailure, when
- Define a `JobStatus` type: 'pending' | 'running' | 'success' | 'failed' | 'warning' | 'skipped' | 'manual'
- A `computeNextStatus(job, pipelineHasFailed)` function determines the next job's status
- "Pipeline broken" = at least one `failed` (not `warning`)

## Self-Check

- [ ] With `allow_failure: true`, a job failure doesn't block subsequent `on_success` jobs
- [ ] With `allow_failure: false`, a failure shows subsequent `on_success` jobs as skipped
- [ ] A job with `when: on_failure` runs only when there's a real `failed` (not `warning`)
- [ ] A job with `when: always` runs regardless
- [ ] A job with `when: manual` waits for a click and doesn't block the pipeline
- [ ] Final pipeline status is correct: Pass if no `failed`, Fail if at least one exists
