# Task 1.2: Stages and execution order

## Goal

Understand how stages control the execution order of jobs in the pipeline, and learn to properly distribute tasks across stages.

---

## What to do

Create a `Task1_2` component that visually demonstrates the pipeline execution order. The student adds stages and jobs, the component shows how they will execute.

### Requirements

1. Define TypeScript interface `PipelineJob`:
   - `id` — unique id
   - `name` — job name
   - `stage` — stage name
   - `status` — `'pending' | 'running' | 'success' | 'failed'`
   - `duration` — duration in seconds (for simulation)

2. Define TypeScript interface `PipelineStage`:
   - `name` — stage name
   - `jobs` — array of jobs in this stage

3. Implement an initial data set: stages `build`, `test`, `deploy` with 2-3 jobs each

4. Visualize the pipeline horizontally (stages left to right):
   - Each stage — a column
   - Jobs inside a stage — cards in the column
   - Arrow between stages shows sequence

5. Implement a "Run pipeline" button with execution simulation:
   - Jobs in the same stage "launch" simultaneously (change status to `running`)
   - After a stage "completes", the next one starts
   - Final status — `success` or `failed` (can be randomized)

6. Add a form for adding a new job with fields: job name and stage selection

---

## Expected result

- Horizontal visualization of stages with jobs
- Animation of pipeline progression through stages
- Different colors for different statuses (gray, blue, green, red)
- Job addition form updates the visualization

---

## Checklist

- [ ] `PipelineJob` and `PipelineStage` interfaces defined
- [ ] Initial data contains 3 stages with multiple jobs
- [ ] Horizontal visualization via flex
- [ ] Arrows or separators between stages
- [ ] "Run pipeline" button changes statuses
- [ ] Jobs in the same stage change status simultaneously
- [ ] Color-coded status indicators
- [ ] Job addition form works correctly

---

## How to check yourself

1. Do you see three columns (build, test, deploy) with jobs?
2. Press "Run pipeline" — did build jobs turn blue simultaneously?
3. After build completes, did test jobs start?
4. Add a new job to stage `test` — did it appear in the test column?
5. If a job failed (red) — did the next stage not start?
