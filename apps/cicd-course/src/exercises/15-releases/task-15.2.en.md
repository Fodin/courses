# Task 15.2: GitLab Release and Changelog

## Goal

Create a GitLab Release builder: the user enters release parameters (tag, name, changelog entries, asset links), and the component generates a correct `.gitlab-ci.yml` with a `release:` block and visualizes the resulting release page.

## Requirements

1. Implement a tag version input field (e.g., `v1.3.0`) with format validation `v#.#.#`
2. Implement a release name input field (e.g., `Release v1.3.0: OAuth and optimizations`)
3. Add a `Changelog entries` section — list of strings with "Add Entry" button. Each entry selects type (feat/fix/chore) and text
4. Add an `Assets` section — list of links with fields: name, url, link_type (other/image/package/runbook)
5. Show a "GitLab Release page" preview — how the release page will look
6. Generate the YAML config with a `release:` block in real time based on all fields

## Checklist

- [ ] Tag field with validation — show error on incorrect format
- [ ] Release name field
- [ ] Add/remove changelog entries (at least 3 entries initially)
- [ ] Changelog grouped by type: Features / Bug Fixes / Chores
- [ ] Add/remove asset links
- [ ] Visual release page preview (imitating GitLab UI)
- [ ] YAML config with image: release-cli, tag rules, release: block
- [ ] YAML updates on every change

## How to Verify

1. Enter tag `v2.0.0` — YAML updates, rules shows v2.0.0 in regex
2. Add changelog entry of type `feat` with text "new API" — it appears in Features section in preview
3. Add changelog entry of type `fix` — appears in Bug Fixes section
4. Add asset with link_type: `image` and Docker Hub url — appears in YAML in assets:links block
5. Enter invalid tag `1.2.3` (no v) — validation error should appear

## Hints

- Changelog entries: `{ id, type: 'feat'|'fix'|'chore', text }` in a `useState` array
- Assets: `{ id, name, url, link_type }` in a `useState` array
- For the preview use GitLab-style imitation: dark header, tag as badge, markdown sections
- Tag validation via regex `/^v\d+\.\d+\.\d+$/`
- Generate `release:` YAML block via a separate function `buildReleaseYaml(tag, name, assets)`
