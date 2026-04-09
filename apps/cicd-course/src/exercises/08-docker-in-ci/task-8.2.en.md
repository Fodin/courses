# Task 8.2: Kaniko — Configuring a Secure Build

## Goal

Create an interactive Kaniko command builder for GitLab CI. The user configures parameters (cache, snapshot mode, destination tags, authentication) and gets a ready YAML config.

## Requirements

1. Input field for image name (destination): default `$CI_REGISTRY_IMAGE`
2. Tag checkboxes: `$CI_COMMIT_SHORT_SHA`, `$CI_COMMIT_REF_SLUG`, `latest` (warning when selecting latest without a condition)
3. Cache toggle: off / on. When enabled — field for `--cache-repo` (default `${CI_REGISTRY_IMAGE}/cache`)
4. Snapshot mode selection: `time` (default) / `redo` / `full` — with a brief description of each
5. Checkbox `--compressed-caching=false` — with an explanation of when it's useful
6. Final YAML block with the full job config: `image`, `before_script` (config.json), `script` with assembled flags
7. Show the final `/kaniko/executor` command line with current flags prominently

## Checklist

- [ ] Input field for image name (editable, default — GitLab variable)
- [ ] At least 3 tag checkboxes (SHA, branch slug, latest)
- [ ] Warning when selecting latest without the main branch
- [ ] Cache toggle with additional cache-repo field
- [ ] Snapshot mode selection with descriptions
- [ ] YAML with before_script block (config.json creation for Registry)
- [ ] Final /kaniko/executor command with all flags
- [ ] YAML updates in real time on any change

## How to Verify

1. Enable cache — `--cache=true` and `--cache-repo` appear in YAML
2. Select snapshot mode `redo` — `--snapshot-mode=redo` flag appears in the command
3. Check the `latest` tag — a warning about latest semantics appears
4. Enable `--compressed-caching=false` — the flag is added to the command
5. Select all three tags — YAML should have three `--destination` lines

## Hints

- Use `useState` for: `imageName`, `selectedTags` (array), `cacheEnabled`, `cacheRepo`, `snapshotMode`, `compressedCaching`
- Assemble the executor command from an array of flags joined with line breaks
- The `before_script` block with config.json is always the same — it can be hardcoded
- For the latest warning: show it when `selectedTags.includes('latest')`
