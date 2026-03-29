# Task 7.3: fork and IPC

## Goal

Learn to create Node.js worker processes via `fork`, exchange messages through IPC, and implement the Worker pattern.

## Requirements

1. Create a simulation of `fork` creating a child Node.js process
2. Demonstrate IPC exchange: `child.send()` and `process.on('message')`
3. Implement the Worker pattern: parent sends task, child returns result
4. Show IPC limitations (JSON serialization)
5. Demonstrate proper child process shutdown

## Checklist

- [ ] fork simulation with IPC channel
- [ ] Bidirectional message exchange parent ↔ child
- [ ] Worker pattern (task → result)
- [ ] Serialization limitations shown
- [ ] Proper shutdown via shutdown message

## How to Verify

1. Click the run button
2. Verify Parent→Child and Child→Parent messages are color-coded
3. Check the full cycle is shown: task → processing → result
4. Ensure IPC limitations are described
