# Task 4.4: Cleaning up reactions — Memory Leak Fix

## Goal

Create a component with multiple reactions (autorun and reaction) and properly dispose of all of them on unmount to prevent memory leaks.

## Requirements

1. Create a `TimerStore` class with observable fields:
   - `seconds: number` (default `0`)
   - `isRunning: boolean` (default `false`)
2. Add methods `start()`, `stop()`, `tick()`, `reset()`
3. In the component, inside `useEffect`, create:
   - An **autorun** that watches `isRunning` and manages a `setInterval` to call `tick()` every second
   - A **reaction** that watches `seconds` and logs every 5 seconds
4. In the `useEffect` cleanup function, dispose of **all** reactions:
   - Call the disposer for autorun
   - Call the disposer for reaction
   - Clear the interval via `clearInterval`
5. Add buttons: Start, Stop, Reset

## Checklist

- [ ] `TimerStore` created with `makeAutoObservable`
- [ ] autorun starts/stops the interval when `isRunning` changes
- [ ] reaction logs every 5 seconds (`seconds % 5 === 0`)
- [ ] **All** disposers are called in the `useEffect` cleanup
- [ ] The interval is cleared in the `useEffect` cleanup
- [ ] The component displays a warning about the importance of cleanup

## How to verify

1. Click Start — the timer begins counting seconds, a log entry from autorun appears
2. Wait 5 seconds — a log entry from reaction appears
3. Click Stop — the timer stops, a log entry about stopping appears
4. Click Reset — seconds reset to 0
5. Main check: navigate to another tab (another level) and back. If cleanup works correctly — the timer doesn't continue running in the background, no console errors
