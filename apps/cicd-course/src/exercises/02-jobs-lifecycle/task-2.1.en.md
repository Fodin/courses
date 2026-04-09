# Task 2.1: Job States

## Goal

Implement an interactive CI/CD job state machine visualization that clearly shows state transitions on various events.

## Requirements

1. Display the current job state with an icon and color coding (pending, running, success, failed, canceled, skipped, manual)
2. Implement event buttons: **Start**, **Success**, **Fail**, **Cancel**, **Timeout** — each transitions the job to the corresponding state
3. Buttons should only be enabled when the transition is valid (e.g., "Success" should be disabled if the job is not in `running` state)
4. Maintain a transition log: each transition is recorded with a timestamp and event description
5. **Reset** button — returns the job to the initial `created` state and clears the log

## Implementation

- Define a `JobState` type — a union type of all possible states
- Define a `transitions` constant — an object describing valid transitions from each state
- Each state should be displayed in its own color: pending — gray, running — blue, success — green, failed — red, canceled — orange, skipped — gray, manual — purple

## Expected Result

```
Current state: [running ▶️]

[Start] [✓ Success] [✗ Fail] [Cancel] [Timeout]    [Reset]

Transition log:
14:23:01  created → pending     Job queued
14:23:05  pending → running     Runner picked up the job
```

## Hints

- Use `useState` to store the current state and the log entries array
- A `canTransition(from, event)` function checks whether the transition is valid
- Use `new Date().toLocaleTimeString()` for timestamps
- Buttons are `disabled` via `!canTransition(currentState, 'start')`, etc.

## Self-Check

- [ ] All 7 states display correctly with the right colors
- [ ] Invalid transitions are blocked (buttons `disabled`)
- [ ] The log shows the full transition history with timestamps
- [ ] Reset returns to the initial state and clears the log
- [ ] The interface is intuitive: it's immediately clear which state is active
