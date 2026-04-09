# Task 13.2: Dynamic Child Pipelines for Monorepos

## Goal

Visualize the dynamic child pipeline generation process in a monorepo. The user "launches" change analysis, sees which child pipelines were generated, and can simulate their execution.

## Requirements

1. Display two stages: **generation** (parent pipeline) and **execution** (child pipelines)
2. Implement "Run Change Analysis" button — after pressing, simulate the generate job (2-3 seconds with progress indicator or status change)
3. After generation, show which child pipeline files were created (only for changed services)
4. Allow "launching" generated child pipelines — for each show its stages: `build → test → deploy`
5. Show generated YAML for the selected child pipeline
6. Visually show `strategy: depend` — the parent pipeline should be "waiting" while child pipelines haven't completed

## Checklist

- [ ] Toggles for selecting changed services (like in task 13.1)
- [ ] Launch button with generation process indication
- [ ] List of generated .yml files (only for changed services)
- [ ] Block with YAML content of the selected child pipeline
- [ ] Child pipeline stage statuses: pending → running → success/failed
- [ ] Parent pipeline waiting visualization (strategy: depend)
- [ ] "Reset" button for re-simulation

## How to Verify

1. Select only payments → only `pipeline-payments.yml` should be generated
2. Select auth and notifications → two child pipeline files
3. Press "Run" → jobs go through stages build → test → deploy
4. Parent pipeline should show "waiting" status while child pipelines haven't completed
5. Click on a generated file → see its YAML content

## Hints

- Store simulation state in an object: `{ phase: 'idle' | 'generating' | 'running' | 'done', pipelines: {...} }`
- Use `setTimeout` inside event handlers to simulate async operations
- Child pipeline stages: `{ stage: 'build' | 'test' | 'deploy', status: 'pending' | 'running' | 'success' }`
- For sequential stage execution, start each via `setTimeout` with increasing delay
- Parent pipeline waiting indicator: pulsing color or spinner via CSS animation
