# Task 4.2: rules:changes — File-Based Triggers

## Goal

Create an interactive `rules:changes` simulator — a repository file tree where you can mark changed files and see which CI jobs will be triggered.

## Requirements

1. File tree of a monorepo with three modules: frontend/, backend/, docs/ and configuration files in the root
2. Checkboxes for each file — mark as "changed"
3. "Select Random Changes" button — picks 2-3 random files
4. "Reset" button — unchecks all checkboxes
5. List of 6 CI jobs with rules:changes patterns
6. For each job — "will run" / "skipped" status based on intersection of changed files with job glob patterns
7. Counter: "X files changed, Y jobs will run"

## File Tree Structure

```
frontend/
  src/
    App.tsx
    components/Button.tsx
  package.json
  webpack.config.js
backend/
  src/
    server.go
    handlers/api.go
  go.mod
  Dockerfile
docs/
  README.md
  api-spec.yaml
.gitlab-ci.yml
docker-compose.yml
```

## CI Jobs and Their Patterns

| Job | rules:changes patterns |
|---|---|
| frontend-lint | frontend/**/* |
| frontend-test | frontend/**/* |
| backend-test | backend/**/*.go, backend/go.mod |
| docker-build | backend/Dockerfile |
| docs-publish | docs/**/* |
| full-pipeline | .gitlab-ci.yml |

## Checklist

- [ ] File tree with checkboxes, showing folder structure with indentation
- [ ] Visual highlighting of changed files (background/color)
- [ ] 6 jobs displaying their glob patterns
- [ ] Reactive status updates when checkboxes change
- [ ] For each active job — list of matching files
- [ ] Counter for changed files and active jobs in the header
- [ ] "Random Changes" and "Reset" buttons

## How to Verify

- Mark only `docs/README.md` — only docs-publish should run
- Mark `backend/Dockerfile` — docker-build and backend-test (no! no go files) should run
- Mark `.gitlab-ci.yml` — full-pipeline should run
- Mark files in both frontend/ and backend/ — jobs for both modules should run
- Reset all — no jobs should run
