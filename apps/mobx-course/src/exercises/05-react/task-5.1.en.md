# Task 5.1: observer HOC

## Goal

Learn to wrap React components in `observer` from `mobx-react-lite` so they automatically react to observable state changes.

## Requirements

1. Create a `TimerStore` class with `makeAutoObservable`:
   - Observable field `seconds: number` (initial value `0`)
   - Private field `intervalId` to store the interval identifier
2. Add action methods:
   - `start()` — starts a `setInterval` with a 1-second step (if the timer is not already running)
   - `stop()` — stops the interval via `clearInterval`
   - `reset()` — stops the timer and resets `seconds` to `0`
   - `tick()` — increments `seconds` by 1 (called from `setInterval`)
3. Add a computed getter `formatted` — returns a string in `MM:SS` format (with leading zeros)
4. Create a store instance at the module level
5. Wrap the component in `observer` and display:
   - Formatted time in a large monospace font
   - Three buttons: Start, Stop, Reset

```typescript
class TimerStore {
  seconds = 0
  private intervalId: ReturnType<typeof setInterval> | null = null

  get formatted(): string // "MM:SS"

  start(): void
  stop(): void
  reset(): void
  tick(): void
}
```

## Checklist

- [ ] `TimerStore` created with `makeAutoObservable`
- [ ] `start()` starts the interval, calling it again doesn't create a duplicate interval
- [ ] `stop()` stops the interval
- [ ] `reset()` stops and resets the counter
- [ ] Computed `formatted` returns time in `MM:SS` format
- [ ] Component is wrapped in `observer` and updates automatically

## How to verify

1. Click Start — the timer begins counting, the display updates every second
2. Click Stop — counting stops, time is frozen
3. Click Start again — counting resumes from the same value
4. Click Reset — the timer resets to `00:00`
5. Verify the format is always `MM:SS` (e.g., `01:05`, not `1:5`)
