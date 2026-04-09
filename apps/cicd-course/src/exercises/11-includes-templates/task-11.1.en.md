# Task 11.1: include — Connecting External Configs

## Goal

Create an interactive `include` configuration builder. The user selects the include type (local, file, remote, template), fills in parameters, and sees the resulting YAML.

## Requirements

1. Display four `include` types as a switcher or tabs: `local`, `file`, `remote`, `template`
2. For each type, show the corresponding form:
   - `local`: path input field (`ci/lint.yml`)
   - `file`: fields for `project`, `ref` (with warning when value is `main`), `file`
   - `remote`: URL field with validation (must start with `https://`)
   - `template`: dropdown of built-in templates (SAST, Dependency-Scanning, Code-Quality, Auto-DevOps)
3. Show the ability to add multiple `include` entries ("+ Add another" button)
4. Display the resulting YAML in real time as the form is filled
5. For type `file` with `ref: 'main'` — show an anti-pattern warning

## Checklist

- [ ] Four include types with switching
- [ ] Form with fields for each type
- [ ] Warning for ref: 'main' in file type
- [ ] Button to add a second include (at least 2 blocks)
- [ ] Resulting YAML updates in real time
- [ ] YAML displayed in monospace font, dark background
- [ ] URL validation (remote must start with https://)

## How to Verify

1. Select type `file`, enter `ref: main` — an anti-pattern warning should appear
2. Add a second include ("+ Add" button) — YAML should show an array of two elements
3. Select `remote` and enter a URL without `https://` — the form should show an error
4. Switch to `template` and select `Security/SAST.gitlab-ci.yml` — YAML should contain `template: Security/SAST.gitlab-ci.yml`
5. Remove all includes — YAML should become empty or show a placeholder

## Hints

- Use `useState` for: `includes` (array of objects), each with `type` field and parameters
- For YAML generation use a `buildIncludeYaml(includes)` function
- Warning for anti-pattern can be shown via conditional render: `ref === 'main' && <Warning />`
- For adding includes: `setIncludes(prev => [...prev, { type: 'local', path: '' }])`
- Built-in GitLab templates: `['Security/SAST.gitlab-ci.yml', 'Security/Dependency-Scanning.gitlab-ci.yml', 'Code-Quality.gitlab-ci.yml', 'Auto-DevOps.gitlab-ci.yml']`
