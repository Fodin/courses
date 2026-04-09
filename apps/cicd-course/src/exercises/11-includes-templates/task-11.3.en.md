# Task 11.3: Corporate Templates — Reusable CI Templates

## Goal

Create a corporate CI template library simulator. The user selects a project type (Node.js, Python, Go), technology stack, and sees a generated `.gitlab-ci.yml` with template includes from a corporate repository.

## Requirements

1. Show the `company/ci-templates` repository "structure" as a file tree (interactive file list)
2. Provide a project configuration form:
   - Project type: Node.js / Python / Go
   - Additional modules: Docker Build, Security Scan, Deploy to K8s (checkboxes)
   - Template version: dropdown (v1.0.0, v2.0.0, v2.1.0 — latest)
3. When `v2.0.0` is selected instead of the latest — show an informational message "v2.1.0 available"
4. Generate the resulting `.gitlab-ci.yml` with correct include and extends
5. Show which jobs will be in the pipeline (list with icons) based on selected modules
6. Add a "Copy YAML" button (copies to clipboard via `navigator.clipboard.writeText`)

## Checklist

- [ ] ci-templates repository file tree (at least 4 template files)
- [ ] Project type selection (3 options)
- [ ] Checkboxes for additional modules (at least 3)
- [ ] Version selection (3 options with latest marker)
- [ ] Notification about available newer version when non-latest is selected
- [ ] Generated YAML updates on any parameter change
- [ ] Pipeline job list updates along with YAML
- [ ] "Copy YAML" button with feedback ("Copied!")

## How to Verify

1. Select Node.js + Docker Build + Security Scan — YAML should contain three `include` blocks
2. Select version v1.0.0 — a notification about available v2.1.0 should appear
3. Add "Deploy to K8s" — pipeline job list should increase
4. Press "Copy YAML" — button text should change to "Copied!" for 2 seconds
5. Switch to Go — YAML should change the template from `nodejs.yml` to `golang.yml`

## Hints

- State structure: `{ projectType, selectedModules: [], templateVersion }`
- For the copy button: `navigator.clipboard.writeText(yaml).then(() => setCopied(true))`; reset via `setTimeout`
- Version list: `[{ value: 'v1.0.0', label: 'v1.0.0' }, { value: 'v2.0.0', label: 'v2.0.0' }, { value: 'v2.1.0', label: 'v2.1.0 (latest)' }]`
- Templates by project type: `nodejs.yml`, `python.yml`, `golang.yml`
- Modules: `docker.yml` (Docker Build), `security.yml` (Security Scan), `deploy-k8s.yml` (Deploy to K8s)
- For the file tree use nested `div` with indentation and icons (📁 / 📄)
