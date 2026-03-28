# Task 3.1: WORKDIR, ENV, ARG

## Objective

Understand the WORKDIR, ENV, and ARG instructions: learn their purpose, scope, and the difference between build-time and runtime variables.

## Requirements

1. Create an interactive component with tabs for switching between instructions: WORKDIR, ENV, ARG, ARG + ENV
2. For each instruction, show a Dockerfile example with syntax highlighting (use `<pre>` with a dark background)
3. Below each example, add an explanation — what the instruction does and when to use it
4. Create an ENV vs ARG comparison table with columns: characteristic, ENV, ARG
5. The table should show/hide via a button
6. The table must include at least 5 characteristics: availability during build, in the container, persistence in the image, override at build time, override at runtime

## Hints

- Use `useState` to manage the active tab and table visibility
- For tabs, define an array of objects with a key and a label
- Store Dockerfile examples in an array of objects with fields: title, type, dockerfile, explanation
- For the comparison table, use an array with boolean values and highlight in green/red

## Checklist

- [ ] Tabs for switching between WORKDIR, ENV, ARG, ARG + ENV are implemented
- [ ] Each tab shows a Dockerfile example in a `<pre>` block
- [ ] A text explanation is shown below each example
- [ ] The show/hide button for the ENV vs ARG comparison table works
- [ ] The table contains at least 5 rows with characteristics
- [ ] Table cells are visually highlighted (green/red)

## How to verify

1. Switch between tabs — each should show its own example and explanation
2. Click the comparison button — the table should appear/disappear
3. Make sure the Dockerfile examples contain valid syntax
4. Verify that the table correctly shows which capabilities ENV and ARG each have
