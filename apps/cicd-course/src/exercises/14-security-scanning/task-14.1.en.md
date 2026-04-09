# Task 14.1: SAST — Static Code Analysis

## Goal

Implement an interactive SAST configuration builder for GitLab CI. The user selects a language, analyzer, and parameters — the component generates a ready `.gitlab-ci.yml` fragment.

## Requirements

1. Display **language** selection (JavaScript, Python, Go) — changing it updates the appropriate analyzer
2. Show **connection mode**: via GitLab template (`include: template:`) or manually (`image: semgrep/semgrep`)
3. When manual mode is selected — show an input field for `SEMGREP_RULES` (default `p/owasp-top-ten`)
4. Display a field for `SAST_EXCLUDED_PATHS` with the ability to add/remove paths via checkboxes (`spec`, `test`, `vendor`, `node_modules`)
5. Show a `allow_failure: true / false` toggle with a warning when `false`
6. Display the generated YAML config, updating in real time
7. Show a table of analyzers by language: language → tool → what it finds

## Checklist

- [ ] Three language selection buttons: JavaScript, Python, Go
- [ ] Two mode buttons: GitLab Template / Manual Configuration
- [ ] In manual mode — input field for SEMGREP_RULES
- [ ] Checkboxes for SAST_EXCLUDED_PATHS (at least 4 options)
- [ ] allow_failure toggle with warning text when false
- [ ] YAML block updates on every change
- [ ] Table with 3 rows: language, analyzer, what it finds

## How to Verify

1. Select Python in template mode — YAML should show `include: template: Security/SAST.gitlab-ci.yml` and `SAST_ANALYZERS: bandit`
2. Switch to manual mode — YAML should change to `image: semgrep/semgrep` with script
3. Add `vendor` to exclusions — YAML should contain `SAST_EXCLUDED_PATHS: 'test,vendor'` (or whatever is selected)
4. Switch `allow_failure: false` — a warning about MR blocking should appear

## Hints

- Store state in `useState`: `language`, `mode` ('template' | 'manual'), `excludedPaths` (array), `semgrepRules`, `allowFailure`
- YAML generation function takes all parameters and returns a string
- In template mode YAML is short (include + variables), in manual mode — full job
- For the analyzer table use an array of objects and `.map()`
