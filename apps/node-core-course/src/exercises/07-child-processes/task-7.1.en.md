# Task 7.1: exec/execFile

## Goal

Learn to run system commands from Node.js using `exec` and `execFile`, understand differences between them, and handle errors properly.

## Requirements

1. Create a simulation of `exec` call with `cwd`, `timeout`, `maxBuffer` options
2. Show stdout, stderr, and error handling in callback
3. Demonstrate the difference between `exec` and `execFile` (shell injection)
4. Show `maxBuffer exceeded` error and solutions
5. Implement an example with `promisify(exec)` for async/await

## Checklist

- [ ] Simulation of `exec` with full set of options
- [ ] Proper handling of error, stdout, stderr
- [ ] Shell injection vulnerability demonstration
- [ ] maxBuffer limit shown with spawn solution
- [ ] Promise wrapper example for exec

## How to Verify

1. Click the run button
2. Verify output shows exec options and their purpose
3. Ensure shell injection demonstration is clear
4. Check that both exec and execFile variants are shown
