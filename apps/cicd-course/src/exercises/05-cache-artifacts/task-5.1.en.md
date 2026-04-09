# Task 5.1: Artifacts — Passing Data Between Jobs

## Goal

Create an interactive pipeline visualization with artifacts. Show how data "flows" between jobs and allow configuring artifact parameters.

## Requirements

1. Display three jobs as blocks: `build` → `test` → `deploy`
2. Visually show artifacts being passed between jobs (arrows or flow)
3. Implement `artifacts:paths` configuration — input field or checkbox list with paths (`dist/`, `reports/`, `public/`)
4. Implement `artifacts:expire_in` selection via buttons: `1 hour`, `1 day`, `1 week`, `never`
5. Implement `artifacts:when` selection via buttons: `on_success`, `on_failure`, `always`
6. Show generated YAML config, updating in real time when settings change
7. When `when: on_failure` is selected, visually highlight that the artifact is saved only on job failure

## Checklist

- [ ] Three job blocks with names and icons or color coding
- [ ] Arrows or artifact flow indicators between jobs
- [ ] Checkboxes or buttons for paths selection (at least 3 options)
- [ ] expire_in selection buttons (4 options)
- [ ] when selection buttons (3 options)
- [ ] YAML block with syntax highlighting (monospace font, dark background)
- [ ] YAML updates on every settings change
- [ ] Tooltip or description for each when value

## How to Verify

1. Enable `dist/` and `reports/` in paths — make sure both appear in YAML
2. Select `expire_in: never` — YAML should show `expire_in: never`
3. Select `when: on_failure` — job display should change visually
4. Uncheck all path checkboxes — YAML should handle an empty list correctly
5. Try different combinations and verify the resulting YAML

## Hints

- Use `useState` to store: `selectedPaths` (array), `expireIn` (string), `when` (string)
- YAML can be built via template literal or `buildYaml(config)` function
- Use `→` symbols or CSS `border-right` with `content` for arrows between jobs
- For `on_failure` visual distinction — change border color or add a warning icon
