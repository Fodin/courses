# Task 12.2: Multi-project Pipelines

## Goal

Create an interactive multi-project pipeline visualization. Show cross-repo triggers, variable passing between projects, and the dependency chain between independent repositories.

## Requirements

1. Display three repositories: `api`, `frontend`, `e2e-tests` as separate blocks
2. Show the trigger chain: `api` triggers `frontend` and `e2e-tests`, `frontend` — only on `api` success
3. Implement an input field (or preset options) for the project namespace in `trigger: project:`
4. Add configuration for passed variables (`API_VERSION`, `DEPLOY_ENV`) — show them in YAML
5. Implement a launch simulation: "Run" button sequentially "launches" each downstream pipeline
6. Generate the trigger job YAML based on settings

## Checklist

- [ ] Three repository blocks with names and icons
- [ ] Arrows between repositories showing trigger direction
- [ ] Field or select for `trigger: project:` (project namespace)
- [ ] Branch selection (`branch:`) — main or custom
- [ ] strategy: depend toggle
- [ ] Variables section: checkboxes or fields for API_VERSION and DEPLOY_ENV
- [ ] YAML block with current config
- [ ] "Simulate Launch" button with animation of downstream repository activation

## How to Verify

1. Change the project namespace — YAML should update with the new path
2. Enable API_VERSION in variables — make sure YAML contains `variables: API_VERSION: ...`
3. Remove strategy: depend — visually show that api doesn't wait for downstream results
4. Press "Simulate Launch" — downstream blocks should activate sequentially (or in parallel, depending on depend)
5. Change branch from main to release — YAML should contain `branch: release`

## Hints

- Use `useState` for: `projectPath` (string), `branch` (string), `strategyDepend` (boolean), `variables` (object), `simulationStep` (number for animation)
- For launch simulation use `setTimeout` with 500-1000ms delay between steps
- Color code repositories during simulation: gray → blue (running) → green (completed)
- Offer preset namespaces: `mygroup/frontend`, `mygroup/e2e-tests` via quick select buttons
