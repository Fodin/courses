# Task 0.1: Event Loop Phases

## Goal

Understand the Node.js Event Loop phases and learn to predict the execution order of `setTimeout`, `setImmediate`, and `process.nextTick`.

## Requirements

1. Create a visual demonstration of Event Loop phases
2. Show a diagram of the 6 Event Loop phases with descriptions
3. Demonstrate code with `setTimeout`, `setImmediate`, `process.nextTick` and expected execution order
4. Show the difference in behavior when called from main module vs from I/O callback
5. Implement a "Run" button for step-by-step result display

## Checklist

- [ ] Event Loop phase diagram is shown
- [ ] All 6 phases are described with API examples for each
- [ ] Execution order demonstrated: sync → nextTick → Promise → setTimeout → setImmediate
- [ ] Behavior inside I/O callback is explained
- [ ] Component uses `useState` for state management

## How to verify

1. Open the task in the browser
2. Click "Run" and study the execution order
3. Make sure the explanation matches actual Node.js behavior
4. Verify that the main module vs I/O callback difference is mentioned
