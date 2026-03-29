# Task 0.3: nextTick Starvation

## Goal

Understand how `process.nextTick` can block the Event Loop, and learn to avoid this problem.

## Requirements

1. Explain why recursive `process.nextTick` starves I/O
2. Show a dangerous code example with recursive nextTick
3. Demonstrate a safe alternative with `setImmediate`
4. Simulate a limited number of recursive calls for comparison
5. Formulate best practices for nextTick vs setImmediate usage

## Checklist

- [ ] Starvation mechanism explained
- [ ] Dangerous example with recursive nextTick shown
- [ ] Safe alternative with setImmediate shown
- [ ] Simulation for visual comparison present
- [ ] Best practices formulated

## How to verify

1. Open the task and run the simulation
2. Make sure the difference between nextTick and setImmediate is visible
3. Verify that best practices are correctly formulated
