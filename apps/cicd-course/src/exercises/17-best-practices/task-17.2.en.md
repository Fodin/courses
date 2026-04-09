# Task 17.2: Pipeline as Code — Structure Editor

## Goal

Create an interactive editor demonstrating `.gitlab-ci.yml` organization principles: structure through `include`, DRY through `extends`, and readability through documentation.

## Requirements

1. Display the initial "bad" pipeline: 4 jobs with repeated `image`, `tags`, `cache` blocks (duplication clearly visible)
2. Implement an **"Apply extends"** button — transforms the config, extracting a common `.node-job:` block and shortened jobs with `extends: .node-job`
3. Implement a **"Split into Files"** button — shows how the config would be split into `main.yml`, `test.yml`, `build.yml` with file switching tabs
4. Show a line counter "before" and "after" each transformation
5. On hover over a duplicate block in the "before" version, highlight it red, show tooltip "Duplication: this exists in N jobs"
6. After each transformation, show a brief explanation: what changed and why it's better
7. Add a "Documentation" section — two versions of the same job: without comments and with comments; a toggle shows the difference

## Checklist

- [ ] Initial config with clear duplication (at least 3 repeating blocks)
- [ ] "Apply extends" button with config transformation
- [ ] Line counter before/after (and reduction percentage)
- [ ] "Split into files" button with file tabs
- [ ] Duplication highlighting in the original config (red color or border)
- [ ] Text explanation after each transformation
- [ ] "Documentation" section: two job versions with a toggle
- [ ] All YAML blocks in monospace font on dark background

## How to Verify

1. In the initial state, 4 blocks with identical `image`, `tags`, `cache` are visible
2. After "Apply extends" — one `.node-job` block and compact jobs
3. Line counter decreased (e.g., 48 lines → 28 lines, -42%)
4. After "Split into files" — three tabs, `main.yml` contains only `include` and `stages`
5. In the documentation section, readability is significantly higher with comments

## Hints

- Store configs as strings in constants, switch via `useState` display mode
- For file tabs use `activeTab` in state, toggle buttons at the top
- Line counter: `config.split('\n').length`
- For duplication highlighting: wrap repeating blocks in `<span>` with red `backgroundColor` + title attribute for tooltip
- `useState` for: `step` (0 | 1 | 2), `activeTab` (string), `docMode` ('without' | 'with')
