# Task 6.2: Tags and Job Routing

## Goal

Create an interactive routing simulator: configure runners with tags, create jobs with tags, and visualize which runner picks up each job.

## Requirements

1. Define interfaces:
   - `Runner` with fields: `id, name, tags: string[], runUntagged: boolean, status: 'online' | 'offline'`
   - `CiJob` with fields: `id, name, tags: string[], assignedRunnerId: string | null, status: 'pending' | 'running' | 'matched' | 'no-runner'`

2. Create initial data: 3 runners (docker-runner with tags [docker, linux], shell-runner with tags [shell, windows, legacy], prod-runner with tags [production, docker]) and 4 jobs (build without tags, test with [docker], deploy-staging with [docker, linux], deploy-prod with [production, docker])

3. Implement matching logic: a runner picks up a job if:
   - All job tags are present on the runner
   - If the job has no tags — only if the runner has `runUntagged = true`

4. Display two columns:
   - Left: list of runners with their tags (badges) and status
   - Right: list of jobs with their tags and assignment status

5. Add a "Run Routing" button — animates the job assignment process (one by one with a delay)

6. Show the result: arrows or highlighting showing which runner took which job

7. Add the ability to add a custom tag to any runner and recalculate routing

8. Edge cases: if a job doesn't find a runner — show an explanation of why (which tags didn't match)

## Expected Result

- Visual display of runners and jobs
- After "Run Routing" — jobs get assigned runners
- Unassigned jobs highlighted in red with an explanation
- Adding a tag to a runner and rerouting works

## Checklist

- [ ] Runner and CiJob interfaces are typed
- [ ] matchRunner logic correctly implements the "all job tags present on runner" rule
- [ ] Untagged jobs respect runUntagged on the runner
- [ ] Two-column visualization with tag badges
- [ ] Routing button works
- [ ] Unassigned jobs show the reason (which tags were missing)
- [ ] Interactive tag addition to a runner

## How to Verify

Press "Run Routing". The "build" job (without tags) should remain without a runner (none have runUntagged = true). Add a tag to docker-runner so it covers all tags of deploy-prod — it should pick it up.
