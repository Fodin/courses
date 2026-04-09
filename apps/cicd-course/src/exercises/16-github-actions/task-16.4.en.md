# Task 16.4: Reusable Workflows and Composite Actions

## Goal

Create an interactive GitHub Actions reusable component builder. The student builds either a Reusable Workflow (for reusing multiple jobs) or a Composite Action (for reusing steps), and sees both files: definition and caller.

## Requirements

1. Display a **type switcher**: `Reusable Workflow` / `Composite Action`
2. For **Reusable Workflow**:
   - `workflow name` field — workflow file name
   - Add **inputs**: input name, type (string/boolean/number), required (toggle), default value
   - Add **secrets**: secret name, required (toggle)
   - Show **two YAML blocks**: definition file (`workflow_call` trigger) and caller file (`uses:` + `with:` + `secrets:`)
3. For **Composite Action**:
   - `action name` and `description` fields
   - Add **inputs**: name, description, required, default
   - List of preset steps (checkboxes): checkout, setup-node, npm-ci
   - Show **two YAML blocks**: `action.yml` (with `runs.using: composite`) and caller via `uses: ./.github/actions/`
4. Add a **comparison panel** with GitLab CI analogs:
   - Reusable Workflow ↔ `include: project:`
   - Composite Action ↔ `extends:` / scripts in `.gitlab/scripts/`

## Checklist

- [ ] Reusable Workflow / Composite Action switcher
- [ ] For Workflow: add/remove inputs with parameters
- [ ] For Workflow: add/remove secrets
- [ ] Two YAML blocks: definition and caller
- [ ] For Composite Action: name + description fields
- [ ] Standard step checkboxes for Composite Action
- [ ] Caller YAML correctly passes inputs and secrets
- [ ] Comparison panel with GitLab CI analogs

## How to Verify

1. Select Reusable Workflow → add input `environment` (string, required) → in YAML: `inputs: environment: type: string required: true`
2. Add secret `DEPLOY_KEY` (required) → in definition: `secrets: DEPLOY_KEY: required: true`, in caller: `secrets: DEPLOY_KEY: ${{ secrets.PROD_KEY }}`
3. Switch to Composite Action → set name `setup-project` → enable steps checkout + setup-node + npm-ci
4. Check `action.yml`: should have `runs: using: composite` and all selected steps
5. Check caller: `uses: ./.github/actions/setup-project`

## Hints

- State: `type` ('workflow' | 'action'), `inputs` (array of objects), `secrets` (array of objects), `selectedSteps` (string[])
- For Reusable Workflow caller: `uses: ./.github/workflows/${workflowName}.yml`
- In caller's `with:` block: `${input.name}: ${{ inputs.${input.name} }}` (placeholder example)
- `runs.using: composite` is required for each step in Composite Action: add `shell: bash`
- Each Composite Action step must have `shell:` — this is a GitHub Actions requirement
