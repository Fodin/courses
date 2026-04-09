# Task 2.3: retry and timeout

## Goal

Implement an interactive retry strategy and timeout configurator with a flaky job simulation.

## Requirements

1. **Retry configurator**:
   - Slider or input for `max` (0–5 attempts)
   - Checkboxes for error types in `when`: `runner_system_failure`, `script_failure`, `stuck_or_timeout_failure`, `api_failure`
   - YAML config preview updated in real time

2. **Timeout configurator**:
   - Input for timeout value (in seconds, for demo)
   - Visual progress bar showing remaining time during execution

3. **Flaky job simulation**:
   - "Success probability" slider (0%–100%)
   - **"Run"** button — simulates job execution
   - On each attempt: randomly success or failure (based on probability)
   - If failure and error type matches `retry.when` — automatic restart
   - Progress timer for each attempt

4. **Execution statistics**:
   - Total number of attempts
   - How many times retry was triggered
   - Final result: success / failed after N attempts

## Expected Result

```
Configuration:
  retry.max: 2
  retry.when: [runner_system_failure, script_failure]
  timeout: 30s

Simulation (success probability: 60%):
  Attempt 1/3: ████████░░ running... → FAILED (script_failure) → retry
  Attempt 2/3: ████████░░ running... → SUCCESS ✅

Statistics: 2 attempts, 1 retry, result: SUCCESS
```

## Hints

- Use `useState` for config, statistics, and attempt log
- Run simulation via `setTimeout` with a 1–2 second pause per attempt
- Choose the error type randomly from the `when` list (or `script_failure` if list is empty)
- Progress bar: `width: ${(elapsed / timeout) * 100}%` updated via `setInterval`
- The "Run" button should be disabled while simulation is running (`isRunning` state)

## Self-Check

- [ ] YAML preview updates when any config parameter changes
- [ ] Retry happens automatically when error type matches `retry.when`
- [ ] Retry does NOT happen when error type is not in `retry.when`
- [ ] After exhausting `max` attempts, the job is finally marked as failed
- [ ] Timeout is visually shown as a progress bar
- [ ] Statistics correctly count attempts and retries
- [ ] At 100% probability, the job always passes on the first attempt
