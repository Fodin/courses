# Task 13.1: rules:changes — Smart Job Launching in Monorepos

## Goal

Create an interactive `rules:changes` simulator for monorepos. The user selects which files were changed in a commit and sees which jobs will run and which will be skipped.

## Requirements

1. Display a monorepo structure: three services (`auth`, `payments`, `notifications`) and one shared package (`packages/shared-utils`)
2. Implement toggles (checkboxes or buttons) to "change" files: one per service and one for shared-utils
3. For each service, define a dependency list (auth depends on shared-utils, payments — no, notifications — yes)
4. Display a list of jobs and their status: `will run` (green) or `skipped` (gray)
5. Show the resulting `.gitlab-ci.yml` fragment with `rules:changes` for all three services
6. When shared-utils is enabled — all services depending on it should also switch to `will run` status
7. Add a counter: "X out of Y jobs will run"

## Checklist

- [ ] Monorepo structure visualization (three services + shared-utils)
- [ ] Checkboxes or buttons for selecting changed paths
- [ ] Dependency logic: shared-utils → triggers auth and notifications
- [ ] Each job status: `will run` / `skipped`
- [ ] YAML block with rules:changes for all services
- [ ] Counter of running jobs
- [ ] Visual highlight for services triggered through dependencies (not directly)

## How to Verify

1. Mark only "auth changed" — auth jobs should run, payments and notifications — no
2. Mark only "shared-utils changed" — auth and notifications should run (they depend on shared-utils), payments — no
3. Mark all — all jobs run, counter shows 3 out of 3
4. Clear all marks — counter 0 out of 3, all jobs skipped
5. Verify YAML correctly reflects dependencies in rules:changes

## Hints

- Store state in an object `{ auth: boolean, payments: boolean, notifications: boolean, sharedUtils: boolean }`
- Function `willRun(service)` checks: `changed[service] || (dependsOnShared[service] && changed.sharedUtils)`
- For visual highlight of "triggered through dependency" use a different color, e.g., orange instead of green
- Generate YAML via a function that takes the service name and array of paths in `changes`
