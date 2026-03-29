# Task 13.2: Memory Profiling

## Goal

Learn to profile memory in Node.js: track `heapUsed`, detect memory leaks, use heap snapshots, and understand `v8.getHeapStatistics()`.

## Requirements

1. Show `process.memoryUsage()` with explanation of each field (rss, heapTotal, heapUsed, external)
2. Demonstrate periodic memory monitoring for leak detection
3. List typical memory leak causes with examples
4. Show manual GC via `global.gc()` and `--expose-gc` flag
5. Demonstrate heap snapshot creation via `v8.writeHeapSnapshot()`
6. Show `v8.getHeapStatistics()` and key metrics to watch

## Checklist

- [ ] process.memoryUsage() with all fields described
- [ ] Periodic monitoring with formatMB helper
- [ ] 4+ typical leaks with code examples
- [ ] Manual GC for diagnostics
- [ ] Heap snapshots and Chrome DevTools instructions
- [ ] v8.getHeapStatistics() with key metrics

## How to verify

1. Click "Run" — complete profiling information should be displayed
2. Verify memory leak signs are described
3. Check typical leak causes are shown with fixes
4. Verify heap snapshots are explained with instructions
