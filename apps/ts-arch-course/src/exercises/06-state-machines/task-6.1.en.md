# Task 6.1: State Transitions

## Goal

Implement a type-safe state machine with an allowed transition map that prevents invalid state transitions.

## Requirements

1. Define a `MachineState` type as a union of string literals for HTTP request lifecycle states: `idle`, `fetching`, `success`, `error`
2. Create an `AllowedTransitions` map describing which transitions are allowed from each state
3. Implement a `TypedStateMachine` class with methods: `state` (current getter), `transition(to)`, `history` (transition list)
4. `transition()` must check transition validity and throw an error for invalid ones
5. Demonstrate a full cycle: idle -> fetching -> success -> fetching -> error -> idle
6. Show rejection of invalid transitions: idle -> success, fetching -> idle

## Checklist

- [ ] `MachineState` is a union type with 4 states
- [ ] Transition map defines allowed transitions for each state
- [ ] `transition('success')` from `idle` throws an error with description
- [ ] `transition('fetching')` from `idle` succeeds
- [ ] Transition history is saved and accessible via `history`
- [ ] Component displays successful and failed transitions

## How to Verify

1. Go through a full cycle idle -> fetching -> success -> idle and check the history
2. Try an invalid transition -- should get an informative error message
3. Ensure the transition map covers all 4 states
