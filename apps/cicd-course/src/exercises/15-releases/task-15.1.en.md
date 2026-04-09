# Task 15.1: Semantic Versioning and Git Tags

## Goal

Create an interactive versioning simulator: show how commit type affects the version, and visualize which CI/CD pipeline is triggered when a tag is created.

## Requirements

1. Display the current version in `vMAJOR.MINOR.PATCH` format — large, centered on the panel
2. Implement three commit type buttons: `feat!` (MAJOR), `feat` (MINOR), `fix` (PATCH) — each increments the corresponding version component
3. On button press, animatedly update the version (at least change color for a second) and add a commit to the log
4. Show a "Create Tag" block — a button that "creates" a git tag with the current version
5. After tag creation, show which pipeline will run: build → release, displaying `CI_COMMIT_TAG`
6. Output generated YAML config with `rules` for the tag trigger, containing the current version

## Checklist

- [ ] Current version displayed large in vX.Y.Z format
- [ ] feat!, feat, fix buttons correctly change the corresponding version component
- [ ] MAJOR-bump resets MINOR and PATCH (1.2.3 → 2.0.0)
- [ ] MINOR-bump resets PATCH (1.2.3 → 1.3.0)
- [ ] Commit log shows added "commits" with type and description
- [ ] "Create Tag" button is only enabled after at least one commit
- [ ] After tag creation displays: CI_COMMIT_TAG and triggered pipeline
- [ ] YAML config updates with actual tag value

## How to Verify

1. Start from version 0.1.0 — press `fix`, get 0.1.1
2. Press `feat` — get 0.2.0 (PATCH reset)
3. Press `feat!` — get 1.0.0 (MINOR and PATCH reset)
4. Press "Create Tag" — a panel with CI_COMMIT_TAG = v1.0.0 and pipeline appears
5. Press `fix` again — version becomes 1.0.1, create another tag — CI_COMMIT_TAG updates

## Hints

- Use `useState` for `{ major, minor, patch }` and `logs: string[]`
- On MAJOR-bump: `{ major: m+1, minor: 0, patch: 0 }`
- On MINOR-bump: `{ major: m, minor: n+1, patch: 0 }`
- Build YAML via template literal, substituting `v${major}.${minor}.${patch}`
- For visual animation — temporarily change version color via `setTimeout` and additional `useState`
