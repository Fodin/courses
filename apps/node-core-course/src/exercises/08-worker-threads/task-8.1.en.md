# Task 8.1: Basic Worker

## Goal

Master Worker Threads creation: Worker constructor, workerData, parentPort, and message passing between main thread and worker.

## Requirements

1. Create a Worker lifecycle simulation: creation → workerData → processing → postMessage → exit
2. Show Worker constructor parameters (workerData, resourceLimits, env)
3. Demonstrate main thread API: postMessage, terminate, on('message'), on('error'), on('exit')
4. Show Worker-side API: parentPort, workerData, isMainThread, threadId
5. Demonstrate inline Worker via `eval: true`

## Checklist

- [ ] Full Worker lifecycle shown step by step
- [ ] All constructor parameters described
- [ ] Both sides' API (main / worker) demonstrated
- [ ] Inline Worker example shown
- [ ] Worker error handling (error, non-zero exit code)

## How to Verify

1. Click the run button
2. Follow lifecycle: creation → data → processing → result → exit
3. Verify all key constructor parameters are described
