# Task 2.1 — Remote Module Load Lifecycle Visualizer

## Goal

Create an interactive animation that shows all stages of loading a remote module in Module Federation: from the first HTTP request to rendering the component in the DOM.

## Requirements

1. Display at least 5 load steps:
   - Request `remoteEntry.js`
   - Parse manifest
   - Load remote JS chunks
   - Shared resolution (check/reuse dependencies)
   - Render component

2. "Load Remote" button starts a step-by-step animation:
   - Each step sequentially transitions: `pending → loading → done`
   - The active step is highlighted during loading
   - Upon completion, show the total "time" (simulated)

3. For each step, show:
   - Name and description
   - Status (icon or text: waiting / loading... / N ms)

4. Network waterfall — horizontal bars:
   - Each file/request is a separate row with name, size, and bar
   - Bars appear as steps progress
   - Different colors for different file types (entry, chunk, shared, etc.)

5. "Reset" button returns everything to the initial state

## Checklist

- [ ] At least 5 steps with names and descriptions
- [ ] Animation starts on button click
- [ ] Each step has three states: pending / loading / done
- [ ] Network waterfall displays files with bars
- [ ] Reset button works correctly
- [ ] On repeated runs, animation starts from the beginning

## How to Check Yourself

- Click "Load Remote" and verify that steps highlight sequentially
- The "Shared resolution" step should explain why React is not loaded again
- In the waterfall, bars for `shared (reuse)` should be short (0 KB)
- After completion, total time should be displayed
- Reset should return all steps to "waiting" state

## Hint

Use `setTimeout` with increasing delays to simulate the sequence. Store each step's state in a `StepStatus[]` array.
