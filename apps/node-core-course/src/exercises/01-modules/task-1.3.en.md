# Task 1.3: Circular Dependencies

## Goal

Understand how Node.js handles circular dependencies and learn to avoid them.

## Requirements

1. Show a circular dependency example in CommonJS
2. Simulate step-by-step execution with partial exports
3. Explain why an imported module can be "partial"
4. Demonstrate resolution strategies: restructuring, lazy require, dependency injection
5. Explain how ESM handles circular deps differently

## Checklist

- [ ] Cycle example A → B → A shown
- [ ] Step-by-step simulation with partial exports
- [ ] Partial loading reason explained
- [ ] At least 3 resolution strategies shown
- [ ] ESM differences mentioned

## How to verify

1. Run the simulation and trace the loading order
2. Verify you can see when a module returns partial exports
