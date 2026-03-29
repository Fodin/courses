# Task 5.4: Pipeline

## Goal

Master `stream.pipeline()` as a safe replacement for `.pipe()` with automatic error handling and `AbortSignal` cancellation support.

## Requirements

1. Show the problem with `.pipe()` — resource leaks on error
2. Demonstrate `pipeline()` in both callback and promise styles
3. Show automatic stream destruction on error
4. Demonstrate `AbortSignal` for pipeline cancellation
5. Show real-world examples: file compression, HTTP streaming
6. Simulate three scenarios: success, error with pipe, error with pipeline

## Checklist

- [ ] The .pipe() resource leak problem explained
- [ ] pipeline() shown in both styles
- [ ] Automatic stream destruction demonstrated
- [ ] AbortSignal for cancellation shown
- [ ] Real-world usage examples provided
- [ ] Three scenario simulation works

## How to verify

1. Click "Run" and compare scenarios
2. Verify pipe() leaves streams open on error
3. Check that pipeline() destroys all streams
4. Verify AbortController correctly cancels the pipeline
