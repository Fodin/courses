# Task 2.2: Error Events & maxListeners

## Goal

Understand the special behavior of the "error" event and the memory leak protection via maxListeners.

## Requirements

1. Show that emit("error") without a listener crashes the process
2. Demonstrate proper error handling
3. Explain maxListeners and the leak warning
4. Show a typical listener leak in a request handler
5. Demonstrate captureRejections for async errors

## Checklist

- [ ] Error behavior without handler shown
- [ ] Proper error handling demonstrated
- [ ] maxListeners mechanism explained
- [ ] Listener leak pattern shown
- [ ] captureRejections mentioned

## How to verify

1. Run the demo
2. Verify error simulation is correct
3. Ensure maxListeners warning is shown
