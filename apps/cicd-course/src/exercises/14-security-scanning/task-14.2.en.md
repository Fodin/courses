# Task 14.2: Dependency Scanning and Container Scanning

## Goal

Implement a multi-level scanning visualization: show that Dependency Scanning and Container Scanning cover different "layers" of the application, and build an interactive pipeline with both tools.

## Requirements

1. Display a **layered diagram** of the Docker image: app code (5%) → dependencies (30%) → OS packages (65%) — each layer is clickable, clicking shows which tool scans it
2. Implement a **vulnerability finding simulator**: "Find Vulnerabilities" button — a list appears with two groups (found in dependencies / found in OS)
3. Show **severity threshold configuration**: LOW / MEDIUM / HIGH / CRITICAL buttons — when selected, shows how many found vulnerabilities will block the pipeline
4. Add a **--ignore-unfixed toggle**: when enabled, part of the vulnerability list turns "gray" (no patch) and isn't counted
5. Display the final YAML with settings for both tools
6. Show a comparison table: Dependency Scanning vs Container Scanning

## Checklist

- [ ] Layered diagram with three layers and percentages
- [ ] Clicking a layer shows the tool description for that layer
- [ ] "Scan" button — 4-6 mock vulnerabilities appear in two groups
- [ ] Severity selection buttons (4 options) — counter "will block X of Y"
- [ ] --ignore-unfixed toggle with effect on the list
- [ ] YAML block with dependency-scanning and container-scanning configs
- [ ] Comparison table with 2 rows

## How to Verify

1. Click the middle layer (dependencies) — Dependency Scanning description should appear
2. Press "Scan" — vulnerabilities of different severity should appear
3. Select HIGH threshold — LOW and MEDIUM vulnerabilities should not block
4. Enable --ignore-unfixed — some vulnerabilities should become gray/inactive
5. Check YAML — both jobs should be present with correct artifact reports

## Hints

- Mock vulnerabilities can be hardcoded as an array: `{ name, severity, source: 'deps'|'os', fixed: boolean }`
- Draw layers via `div` with different heights and `background-color`
- For the counter: filter vulnerabilities by `severity >= selected threshold`
- When `ignoreUnfixed: true` additionally filter by `fixed: true`
- Severity order for comparison: LOW=1, MEDIUM=2, HIGH=3, CRITICAL=4
