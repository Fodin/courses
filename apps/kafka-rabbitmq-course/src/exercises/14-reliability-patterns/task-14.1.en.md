# Task 14.1: Retry with Exponential Backoff

## Goal

Implement an interactive **Exponential Backoff** strategy visualizer for message retry. The component shows a delay timeline before launch and simulates the processing flow: when all attempts are exhausted, the message goes to DLQ; on success — delivery is confirmed.

## Requirements

1. Declare a `RetryAttempt` interface with fields: `attempt: number`, `status: 'pending' | 'running' | 'failed' | 'success' | 'dlq'`, `delay: number`, `timestamp: number`.
2. Declare component states: `maxRetries` (slider 1–6, default 4), `baseDelay` (1–5, default 1), `multiplier` (1–4, default 2), `attempts: RetryAttempt[]`, `running: boolean`, `successOnAttempt: number | 'never'` (default `'never'`), `dlq: boolean`, `successDelivered: boolean`, `timerRef` via `useRef`.
3. Implement a `calcDelay(attempt: number): number` function — formula `baseDelay * multiplier^(attempt - 1)`.
4. Implement a `totalTime(): number` function — sum of all delays from 1 to `maxRetries`.
5. Implement a `handleStart` function:
   - Initialize a `RetryAttempt[]` array of length `maxRetries + 1` (first attempt — `status: 'running'`, rest — `'pending'`, first has `delay: 0`, rest have `delay: calcDelay(i + 1)`).
   - Launch `runAttempt(0)` — async recursion with `setTimeout` delay.
   - Each attempt: first status `'running'`, after `resolveDelay = 600ms` — result.
   - If `successOnAttempt !== 'never'` and `idx + 1 >= Number(successOnAttempt)` — status `'success'`, `setSuccessDelivered(true)`, `setRunning(false)`.
   - Otherwise — status `'failed'`; if last attempt (`nextIdx > maxRetries`) — `setDlq(true)`, `setRunning(false)`; otherwise after `nextDelay * speed` call `runAttempt(nextIdx)`.
6. Implement a `handleReset` function: clears `timerRef`, resets all states.
7. Declare dictionaries `statusColor: Record<string, string>` and `statusLabel: Record<string, string>` for 5 statuses: `pending`, `running`, `failed`, `success`, `dlq`.
8. Render a settings panel (4 sliders/selectors): `maxRetries`, `baseDelay`, `multiplier`, `successOnAttempt`. All controls are disabled during `running`, changes trigger `handleReset`.
9. Render a **Delay Timeline** (before launch): horizontal bars of proportional width for each attempt. First attempt — label "immediately", rest — `+Xs`.
10. Render **Simulation Progress** (after start): list of `RetryAttempt` cards with colored borders, `pulse` animation for `status === 'running'`, delay label, and status.
11. Render a **DLQ** block (when `dlq === true`) — orange border with text about moving to DLQ and total time.
12. Render a **"Message delivered successfully"** block (when `successDelivered === true`) — green border.
13. Add "Run Simulation" / "Reset" buttons. Start button is disabled when `running`.
14. Add CSS `@keyframes pulse` animation for status indicators.

## Checklist

- [ ] `RetryAttempt` interface declared with 4 fields
- [ ] `calcDelay` correctly implements `baseDelay * multiplier^(attempt - 1)`
- [ ] `totalTime` sums all attempt delays
- [ ] `handleStart` creates attempts array with correct initial statuses
- [ ] `runAttempt` recursion sequentially processes attempts with delays
- [ ] When `successOnAttempt !== 'never'`, simulation completes with success on the right attempt
- [ ] When attempts exhausted, `dlq` becomes `true`
- [ ] `handleReset` clears timer via `timerRef.current` and resets all states
- [ ] Sliders are disabled during `running`, changes trigger reset
- [ ] Timeline displays proportional bars for each attempt
- [ ] Simulation progress displays cards with animation for `running`
- [ ] DLQ block appears only when `dlq === true`
- [ ] Success block appears only when `successDelivered === true`
- [ ] CSS `@keyframes pulse` added

## How to test yourself

1. Open the task — 4 controls and a Timeline with 5 attempts should be displayed (baseDelay=1, multiplier=2).
2. Timeline should show delays: attempt 1 — immediately, attempt 2 — +1s, 3 — +2s, 4 — +4s, 5 — +8s. Total time — 15s.
3. Click "Run Simulation" with `successOnAttempt = 'never'`. All attempts sequentially transition to `failed`, orange DLQ block appears with text about 5 attempts.
4. Reset, select "Success on attempt: #3", run again. Attempts 1 and 2 transition to `failed`, attempt 3 — to `success`, green success block appears.
5. Change `multiplier` to 3, `baseDelay` to 2. Timeline should recalculate: attempt 2 — +2s, 3 — +6s, 4 — +18s.
6. Click "Reset" during execution — simulation stops, all attempts return to initial state.
