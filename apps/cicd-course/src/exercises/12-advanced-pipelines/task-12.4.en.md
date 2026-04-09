# Task 12.4: DAG with needs

## Goal

Create an interactive DAG pipeline visualization with `needs`. Show the difference between a linear stage pipeline and a DAG, calculate actual execution time in both modes.

## Requirements

1. Display a set of jobs with configurable duration: `build-frontend` (2 min), `build-backend` (8 min), `test-frontend` (3 min), `test-backend` (4 min), `deploy` (2 min)
2. Implement a "Linear mode / DAG with needs" toggle
3. In linear mode — show execution with stage barriers (each stage waits for all jobs in the previous)
4. In DAG mode — show that `test-frontend` starts right after `build-frontend`, without waiting for `build-backend`
5. Calculate and display total pipeline execution time in both modes
6. Generate YAML with `needs:` for DAG mode

## Checklist

- [ ] 5 job blocks with icons and execution times
- [ ] Fields or sliders to change each job's duration
- [ ] "Linear / DAG" toggle
- [ ] Dependency graph visualization (needs arrows between jobs)
- [ ] Calculation and display of total time: "Linear: X min | DAG: Y min | Savings: Z min"
- [ ] YAML with `needs:` for DAG mode (updates when dependencies change)
- [ ] "Critical path" highlighting — the longest dependency chain

## How to Verify

1. In linear mode increase `build-backend` to 20 min — all test jobs should wait for it, total time increases
2. Switch to DAG — `test-frontend` should start after 2 min, not 20
3. Change `test-backend` duration so it becomes the critical path — verify the calculation updates
4. Make sure YAML in DAG mode contains `needs:` on test jobs
5. Verify that `deploy` in YAML has needs on both test jobs

## Hints

- Use `useState` for: `dagMode` (boolean), `durations` (object `{[job]: number}`)
- Linear pipeline time: `max(build-jobs) + max(test-jobs) + deploy`
- DAG pipeline time: `max(build-frontend + test-frontend, build-backend + test-backend) + deploy`
- For visualizing arrows between blocks use CSS `position: absolute` or SVG lines
- Highlight the critical path with a different border color (e.g., orange instead of blue)
- For sliders use `<input type="range" min={1} max={20} />`
