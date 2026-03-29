# Task 13.1: perf_hooks

## Goal

Master the Node.js Performance API: `performance.now()`, marks/measures, `PerformanceObserver`, `timerify()`, and Garbage Collection monitoring.

## Requirements

1. Demonstrate `performance.now()` usage for precise time measurement
2. Show creating marks and measures with `performance.mark()` and `performance.measure()`
3. Implement `PerformanceObserver` for reactive result collection
4. Demonstrate `performance.timerify()` for automatic function timing
5. Show GC monitoring via PerformanceObserver with entryTypes: ["gc"]
6. Provide a practical example: API request timing

## Checklist

- [ ] performance.now() with explanation of difference from Date.now()
- [ ] Marks and measures for operation timing
- [ ] PerformanceObserver with different entryTypes
- [ ] timerify() for automatic function measurement
- [ ] GC monitoring with kind descriptions
- [ ] Practical example with API timing

## How to verify

1. Click "Run" — all Performance API tools should be displayed
2. Verify performance.now() advantage over Date.now() is explained
3. Check PerformanceObserver is shown for different entry types
4. Verify GC monitoring requires the --expose-gc flag
