# Task 16.2: Actions Marketplace — uses, with, Secrets and Variables

## Goal

Create an interactive browser for popular GitHub Actions from Marketplace. The student selects needed actions, configures parameters, and sees how correct YAML with secrets and environment variables is formed.

## Requirements

1. Display an **actions catalog** — at least 5 cards:
   - `actions/checkout@v4` — code cloning
   - `actions/setup-node@v4` — Node.js installation
   - `actions/setup-python@v5` — Python installation
   - `actions/upload-artifact@v4` — artifact upload
   - `actions/cache@v4` — dependency caching
2. When **an action is selected** (click on card) — show parameters (`with:`):
   - `setup-node`: `node-version` selection (buttons: 18, 20, 22) and `cache: npm` toggle
   - `setup-python`: `python-version` selection (buttons: 3.10, 3.11, 3.12)
   - `upload-artifact`: `name` and `path` fields, `retention-days` selection (1, 7, 30)
3. Display a **secrets** section — add variables via "secret name → value from `secrets.*`" pair:
   - "Add Secret" button
   - Text fields: environment variable name (e.g., `AWS_KEY`) and secret name (e.g., `AWS_ACCESS_KEY`)
   - On secret deletion — remove from YAML
4. Show the final **step YAML** with the selected action, its parameters, and secrets
5. Add a warning: secrets can't be used directly — only via `${{ secrets.NAME }}`

## Checklist

- [ ] At least 5 action cards with name and description
- [ ] Selecting an action highlights the card and shows parameters
- [ ] Changing parameters (node-version, cache) updates YAML
- [ ] Secrets section with dynamic fields
- [ ] In YAML, secrets display as `${{ secrets.NAME }}`
- [ ] Secret delete button removes the line from YAML
- [ ] Warning about secret handling rules

## How to Verify

1. Select `setup-node` → change version to 22 → YAML should show `node-version: '22'`
2. Enable `cache: npm` — `cache: 'npm'` is added to YAML
3. Select `upload-artifact` → set name and path → check YAML
4. Add secret `AWS_KEY` → `AWS_ACCESS_KEY_ID` → in YAML: `AWS_KEY: ${{ secrets.AWS_ACCESS_KEY_ID }}`
5. Delete the secret — verify the line disappeared from YAML

## Hints

- State: `selectedAction` (id of selected action), `nodeVersion`, `useCache`, `secrets` (array of `{envName, secretName}`)
- For dynamic secret addition use `[...prev, { envName: '', secretName: '' }]`
- Each secret in YAML: line `${envName}: ${{ secrets.${secretName} }}`
- Highlight the card via conditional style: `border: selected ? '2px solid #1565C0' : '2px solid #e0e0e0'`
