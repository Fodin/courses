# Task 9.1: Process Object

## Goal

Study the global `process` object: environment variables, arguments, memory, I/O streams, and process properties.

## Requirements

1. Demonstrate `process.env` — reading variables, value types (always string)
2. Show `process.argv` — argument array structure
3. Show `process.memoryUsage()` — all fields with explanation (rss, heapTotal, heapUsed, external)
4. Demonstrate `process.exit()` vs `process.exitCode` — difference in approaches
5. Show `process.stdin/stdout/stderr` and other useful properties (pid, platform, uptime)

## Checklist

- [ ] process.env shown with examples and type warning
- [ ] process.argv structure explained
- [ ] All memoryUsage fields described with units
- [ ] exit() vs exitCode difference explained
- [ ] stdin/stdout/stderr described as streams

## How to Verify

1. Click the run button
2. Verify each process property has an example and explanation
3. Check memoryUsage shows concrete numbers in MB
