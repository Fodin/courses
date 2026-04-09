# Task 0.2: Pipeline anatomy

## Goal

Learn to visually represent the structure of a CI/CD pipeline. Implement an interactive horizontal visualization: stages left to right, jobs within stages, execution order and dependencies.

---

## What to do

Create a `Task0_2` component that visualizes a CI/CD pipeline as a horizontal flow.

### Requirements

1. Define TypeScript interfaces:
   - `PipelineJob` — a single job: `id`, `name`, `duration` (string, e.g. `'~2 min'`), `status` (`'pending' | 'running' | 'success' | 'failed'`)
   - `PipelineStage` — a stage: `id`, `name`, `jobs` (array of `PipelineJob`), `color` (header color)

2. Create a `pipelineStages` array with at least 4 stages:
   - **Source** — jobs: checkout, install dependencies
   - **Build** — jobs: compile, build docker image
   - **Test** — jobs: unit tests, integration tests, lint
   - **Deploy** — jobs: deploy to staging, smoke tests, deploy to prod

3. Implement a `selectedStage` state — stores the id of the selected stage or `null`

4. Display stages horizontally (flex, left to right):
   - Between stages — an arrow `→`
   - Each stage — a rectangle with name and job count
   - Clicking a stage shows the list of jobs inside it

5. In a detail panel (below or to the side) when a stage is selected, show:
   - List of jobs with status icons
   - Execution time of each job
   - Total stage time

6. Add a "Run pipeline" button — it sequentially animates job statuses (`pending → running → success`) at 500ms intervals

---

## Expected result

- Horizontal chain: Source → Build → Test → Deploy
- Clicking a stage opens the job list
- "Run" animation shows pipeline progress
- Execution times are visible

---

## Checklist

- [ ] `PipelineJob` and `PipelineStage` interfaces defined
- [ ] `pipelineStages` array created with at least 4 stages
- [ ] Stages displayed horizontally with arrows between them
- [ ] Clicking a stage shows jobs in a detail panel
- [ ] Each job has a status icon and execution time
- [ ] "Run pipeline" button animates execution
- [ ] Component is correctly typed (no `any`)

---

## How to check yourself

1. Open the component — do you see a horizontal chain of stages?
2. Do arrows between stages point left to right?
3. Click on "Test" — do you see three jobs (unit tests, integration tests, lint)?
4. Press "Run pipeline" — do statuses change sequentially?
5. Do jobs within the same stage launch in parallel (transition to running simultaneously)?
