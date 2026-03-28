# Task 3.3: COPY vs ADD, .dockerignore

## Objective

Understand the differences between COPY and ADD, learn to create a .dockerignore to optimize the build context and improve security.

## Requirements

1. Create a COPY vs ADD comparison table with columns: scenario, COPY, ADD, recommendation
2. Include at least 4 scenarios: copying files, copying with permissions, extracting a tar archive, downloading from a URL
3. Highlight the recommended option for each scenario
4. Implement an interactive visualization of build context size: without .dockerignore vs with .dockerignore
5. Show a breakdown by file category (node_modules, .git, source code, etc.) with color indicators
6. Add a show/hide button for a sample .dockerignore for a Node.js project

## Hints

- For the table, use an array of objects with a field recommended: 'copy' | 'add' | 'neither'
- For the context visualization, create two data sets (with and without .dockerignore) and switch between them
- Show bars of different widths to visually represent file volume
- The .dockerignore example should be realistic and include comments

## Checklist

- [ ] The COPY vs ADD table contains at least 4 scenarios
- [ ] The recommended option is visually highlighted
- [ ] "Without .dockerignore" / "With .dockerignore" toggle buttons work
- [ ] The total context size and a category breakdown are displayed
- [ ] The size difference is clearly visible
- [ ] The .dockerignore example shows/hides via a button
- [ ] The example contains realistic patterns with comments

## How to verify

1. Check the table — COPY should be recommended for regular file copying
2. Toggle the context — the size without .dockerignore should be significantly larger
3. Open the .dockerignore example — it should include node_modules, .git, .env, and other typical exclusions
