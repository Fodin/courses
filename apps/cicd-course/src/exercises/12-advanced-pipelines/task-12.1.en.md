# Task 12.1: Parent-child Pipelines

## Goal

Create an interactive parent-child pipeline visualization. Show the pipeline hierarchy, the trigger + include mechanism, and the effect of `strategy: depend` on parent behavior.

## Requirements

1. Display a parent pipeline as a block with one trigger job
2. Show three child pipelines (frontend, backend, infra) launched by the parent
3. Implement a `strategy: depend / no depend` toggle — visually show the difference in parent behavior (waits or continues immediately)
4. Implement `rules: changes` checkboxes for each child — show which child pipelines will run for given changes
5. Generate YAML for the trigger job based on selected settings
6. With `strategy: depend` display a "waiting" status in the parent while children are running

## Checklist

- [ ] Parent pipeline block with trigger job
- [ ] Three child pipeline blocks named: frontend, backend, infra
- [ ] Arrows or lines from parent to each child
- [ ] Strategy toggle: depend / no depend
- [ ] Checkboxes or buttons to simulate changed directories (frontend/, backend/, infra/)
- [ ] Visual indication of "parent waiting" at strategy: depend (e.g., spinner or status)
- [ ] YAML block with trigger job config (updates on changes)
- [ ] With disabled rules, child pipeline always launches

## How to Verify

1. Enable strategy: depend — make sure parent shows "waiting" for children
2. Disable strategy: depend — parent should immediately show "completed" without waiting for children
3. Enable rules:changes for frontend/ — when only infra/ changes are selected, frontend child should not show as running
4. Check that YAML correctly includes or removes rules:changes based on settings
5. Enable all three rules:changes and select changes in all directories — all three children should launch

## Hints

- Use `useState` for: `strategyDepend` (boolean), `selectedChanges` (array of directories), `childStatuses` (object with each child's state)
- For the waiting visualization, use an animated indicator or simply text "Waiting for children..."
- Build YAML via template literal, adding or removing `strategy:` and `rules:` sections based on settings
- Color code children: green — running, gray — skipped (doesn't match rules)
