# Task 16.1: Workflow Basics — Events, Jobs, Steps, runs-on

## Goal

Create an interactive GitHub Actions workflow builder. The student selects triggers, Runner, and job structure — and sees the resulting YAML in real time. A comparison with the equivalent GitLab CI configuration is shown in parallel.

## Requirements

1. Display the **triggers** (`on:`) selection section:
   - Checkboxes: `push`, `pull_request`, `schedule`, `workflow_dispatch`
   - When `schedule` is enabled — a cron expression input field (default `'0 2 * * *'`)
   - When `workflow_dispatch` is enabled — a hint "Manual trigger via UI"
2. Display **Runner** selection (`runs-on`): buttons `ubuntu-latest`, `windows-latest`, `macos-latest`
3. Display **three jobs**: `lint`, `test`, `build` with enable/disable checkboxes
4. Show `needs:` dependencies: `test` depends on `lint`, `build` depends on `test`
5. Show **two YAML blocks**: the resulting GitHub Actions workflow and the equivalent GitLab CI pipeline
6. Add an annotation hint for the key difference: "In GitLab code is cloned automatically. In GitHub, `actions/checkout` is needed"

## Checklist

- [ ] Checkboxes for 4 triggers with correct display in YAML
- [ ] Cron field appears only when `schedule` is enabled
- [ ] `runs-on` selection from 3 options
- [ ] Enabling/disabling jobs affects YAML and `needs:` dependencies
- [ ] When `lint` is disabled — `needs: lint` disappears from the `test` job
- [ ] Two YAML blocks: GitHub Actions and GitLab CI (for comparison)
- [ ] Block with annotation about `actions/checkout`
- [ ] YAML updates on every change

## How to Verify

1. Enable only `push` trigger — YAML should show `on: push:`
2. Enable `schedule` — a cron field appears, YAML shows `schedule:` with cron string
3. Change Runner to `macos-latest` — both jobs should have updated `runs-on`
4. Disable the `lint` job — `needs: lint` should disappear from the `test` job
5. Compare the two YAML blocks — find the difference with `actions/checkout`

## Hints

- Use `useState` for: array of enabled triggers, cron string, selected Runner, array of enabled jobs
- Function `buildGitHubYaml(config)` generates GitHub Actions YAML
- Function `buildGitLabYaml(config)` generates GitLab CI YAML for comparison
- In the `needs:` block of a job, remove references to disabled jobs
- Add `uses: actions/checkout@v4` as the first step in each active job
