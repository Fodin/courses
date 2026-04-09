# Task 14.2: Workspace Configuration Builder

## Goal

Build an interactive builder that allows you to select a tool (Nx, Turborepo, PNPM), define a list of MFEs with dependencies, and generate a ready-to-use configuration file with cyclic dependency validation.

## Requirements

1. Implement tool selection from three options: Nx / Turborepo / PNPM workspaces — each with a brief description (radio-style); the selection affects the generated config
2. Display pre-configured shared packages: ui-kit, utils, types, config — they are always present in the config
3. MFE addition form: fields for name (text), type (select: app/library/shared), dependencies (checkboxes from existing packages)
4. List of added MFEs with a delete button for each
5. Live preview of the generated config in a code block that updates on any change — the format depends on the selected tool: Nx (nx.json), Turborepo (turbo.json), PNPM (pnpm-workspace.yaml)
6. Cyclic dependency validation: when a cycle is detected, show a warning with the names of the packages forming the cycle
7. "Copy" button to copy the config to the clipboard

## Generated Config Formats

**Nx (nx.json):**
```json
{
  "affected": { "defaultBase": "main" },
  "tasksRunnerOptions": { "default": { "runner": "nx/tasks-runners/default", "options": { "cacheableOperations": ["build", "test", "lint"] } } },
  "projects": { "<name>": "apps/<name>", ... }
}
```

**Turborepo (turbo.json):**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": { "outputs": [] }
  }
}
```

**PNPM (pnpm-workspace.yaml):**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## Checklist

- [ ] Tool selection changes the generated config
- [ ] Shared packages (ui-kit, utils, types, config) are present in the dependency list
- [ ] MFE addition form works: name, type, dependencies
- [ ] Added MFEs are displayed in the list with a delete button
- [ ] Live preview updates on every change (tool selection, adding/removing MFEs)
- [ ] When adding an MFE with a dependency that creates a cycle, a warning appears with the names of the cyclic packages
- [ ] Correct Nx config with projects
- [ ] Correct Turborepo config with pipeline
- [ ] Correct PNPM config with packages
- [ ] "Copy" button copies the config to the clipboard

## How to Check Your Work

1. Open the task, select "Nx" — nx.json with a basic structure should appear in the preview
2. Add an MFE "catalog" with type "app" and dependency "ui-kit" — it should appear in the list and in the config
3. Switch to "Turborepo" — the config should change to turbo.json
4. Add an MFE "payments" with dependency "checkout", then "checkout" with dependency "payments" — a cycle warning should appear: payments → checkout → payments
5. Click "Copy" — the config should be copied to the clipboard (or a success notification should appear)
