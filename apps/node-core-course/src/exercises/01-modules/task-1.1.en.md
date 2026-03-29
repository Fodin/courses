# Task 1.1: CommonJS

## Goal

Understand the mechanics of `require()`, `module.exports`, `exports`, and module caching in CommonJS.

## Requirements

1. Demonstrate the 5 steps of `require()`: Resolve, Cache Check, Load, Wrap, Execute
2. Show the difference between `exports` and `module.exports`
3. Simulate module caching: two require calls return the same object
4. Show the Module Wrapper Function
5. Explain file search order during resolve

## Checklist

- [ ] All 5 require() steps shown
- [ ] exports vs module.exports difference explained with examples
- [ ] Caching simulation works correctly
- [ ] Wrapper function shown
- [ ] Component uses useState

## How to verify

1. Click "Run" and study the output
2. Verify that caching demonstrates a shared object
3. Check that the exports reassignment trap is explained
