# Task 7.2: spawn

## Goal

Master streaming process execution with `spawn`, stdio management, signal handling, and detached processes.

## Requirements

1. Create a simulation of `spawn` with streaming stdout/stderr output
2. Show different stdio modes: pipe, inherit, ignore
3. Demonstrate signal sending: SIGTERM, SIGKILL, SIGINT
4. Implement a detached process example with `unref()`
5. Show event handling: data, close, error

## Checklist

- [ ] Streaming stdout and stderr with color coding
- [ ] stdio modes explained
- [ ] Signals and their differences demonstrated
- [ ] detached + unref example
- [ ] error event handling (ENOENT)

## How to Verify

1. Click the run button
2. Verify stdout (green) and stderr (red) are visually distinct
3. Check all stdio modes are shown
4. Ensure signal differences are explained
