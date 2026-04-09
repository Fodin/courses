# Task 2.3 — Remote Config Builder

## Goal

Create a form for configuring a remote application: what to export (`exposes`) and how to set up shared dependencies. The form should warn about common configuration mistakes.

## Requirements

1. The form has four sections:
   - **name**: remote name (used in `window.<name>` and as key in host)
   - **filename**: entry point filename (default `remoteEntry.js`)
   - **exposes**: list of exported modules
   - **shared**: shared dependencies

2. Managing exposes:
   - Each entry: `key` field (e.g. `./App`) + `path` field (e.g. `./src/App.tsx`)
   - "Add Expose" button, delete button
   - Validation: key must start with `"./"`

3. Shared — same as Task 2.2 (preset + custom + singleton + version)

4. Advanced validation (two levels):
   - **Errors** (blocking): empty `name`, empty `filename`, no exposes, key without `"./"`
   - **Warnings** (advisory): `singleton: false` for `react`/`react-dom`, no shared dependencies

5. Live preview:
   - Generates `vite.config.ts` for remote
   - Additionally shows "How to use in host" — example `React.lazy(() => import(...))` calls

## Checklist

- [ ] Form contains all 4 sections
- [ ] Keys in `exposes` are validated for `"./"` prefix
- [ ] When `singleton: false` for `react`/`react-dom` — a warning (not an error)
- [ ] Errors and warnings are displayed separately (different styles)
- [ ] Live preview updates in real time
- [ ] "How to use in host" block generates correct `React.lazy` calls
- [ ] Empty `path` in expose causes an error

## How to Check Yourself

- Enter an expose key without `"./"` (e.g. `App`) — an error should appear
- Uncheck `singleton` for `react` — a warning without blocking (config still generates)
- Remove all shared dependencies — a warning about possible React duplication
- Check the "How to use in host" block — component names should match expose keys

## Difference Between Error and Warning

| Situation | Level |
|---|---|
| Empty `name` | Error — config is invalid |
| Expose key without `"./"` | Error — Module Federation won't accept such config |
| `singleton: false` for react | Warning — config works but is risky |
| No shared dependencies | Warning — config works but is inefficient |
