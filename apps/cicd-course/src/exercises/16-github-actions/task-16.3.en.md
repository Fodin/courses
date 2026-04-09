# Task 16.3: Matrix Strategy — Parallel Testing

## Goal

Create an interactive matrix strategy visualizer. The student adds matrix parameters, sees how many jobs will be created, and manages `fail-fast` and `max-parallel` options. Clearly show the difference between include/exclude.

## Requirements

1. Display **three matrix axes**:
   - `os` — multi-select: `ubuntu-latest`, `windows-latest`, `macos-latest`
   - `node-version` — multi-select: `18`, `20`, `22`
   - `experimental` — optional toggle (adds fourth version `24`)
2. Display a **job counter**: "Will create: N jobs" — product of selected values
3. Visualize the **matrix grid**: rows = OS, columns = Node versions, cells = individual jobs
4. Add toggles:
   - `fail-fast` (on/off) — when enabled, highlight that the first failure stops all
   - `max-parallel` — numeric input (1–12), show how many jobs run simultaneously
5. Add an **exclude** section — ability to mark specific matrix cells as excluded
6. Show the final **YAML** with `strategy.matrix`, `fail-fast` and `max-parallel`

## Checklist

- [ ] OS multi-select (at least 2 values by default)
- [ ] Node-version multi-select (at least 2 values by default)
- [ ] Job counter updates on selection change
- [ ] Visual grid: rows × columns = jobs
- [ ] `fail-fast` toggle changes YAML
- [ ] `max-parallel` field with validation (1 ≤ n ≤ total jobs)
- [ ] Click on a matrix cell adds combination to `exclude`
- [ ] Excluded cells visually struck through / gray

## How to Verify

1. Select 2 OS × 3 Node versions → counter should show "6 jobs"
2. Add third axis via `experimental` → counter grows to 8
3. Click on cell "windows-latest / 18" → it becomes gray, `exclude:` appears in YAML
4. Turn off `fail-fast` → in YAML: `fail-fast: false`
5. Set `max-parallel: 2` → `max-parallel: 2` is added to YAML

## Hints

- State: `selectedOS` (string[]), `selectedNode` (string[]), `failFast` (boolean), `maxParallel` (number), `excluded` (array of pairs `{os, node}`)
- Job count: `selectedOS.length * selectedNode.length` minus exclusions
- For grid rendering: `selectedOS.map(os => selectedNode.map(node => cell))`
- Exclusion check: `excluded.some(e => e.os === os && e.node === node)`
- YAML for exclude:
  ```
  exclude:
    - os: windows-latest
      node-version: '18'
  ```
