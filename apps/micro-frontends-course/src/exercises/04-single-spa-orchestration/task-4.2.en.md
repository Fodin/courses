# Task 4.2 — Single-SPA Root Config Builder

## Goal

Create a visual builder that lets you add microfrontend applications and generates correct `root-config.js` with `registerApplication()` calls in real time.

## Requirements

1. Application list: each app is displayed as a card with four editable fields:
   - **Name** (text): unique, lowercase letters/digits/hyphen only, starts with a letter
   - **Framework** (select): React, Vue, Angular, Svelte, Vanilla
   - **activeWhen** (text): URL path, starts with `/`, no duplicate routes
   - **Loader** (select): `System.import()` or `import()`

2. Colored indicator to the left of each card, color matches the selected framework.

3. Below each app's fields — a preview of the generated loading function:
   ```
   app: () => System.import('@company/catalog')
   ```

4. Real-time validation (red border + error message below field):
   - Empty name → "Name cannot be empty"
   - Name doesn't match pattern → "Only lowercase letters, digits and hyphen"
   - Duplicate name → "Name must be unique"
   - activeWhen doesn't start with `/` → "Must start with /"
   - Duplicate activeWhen → "Route overlaps with another application"

5. "Delete" button on each card.

6. "+ Add Application" button adds an empty card.

7. Code visibility toggle button ("Show/Hide Code").

8. Generated `root-config.js` includes:
   - `import { registerApplication, start } from 'single-spa'`
   - `registerApplication({ name, app, activeWhen })` for each application
   - Special case: `activeWhen: '/'` → generate predicate `location => location.pathname === '/'`
   - `start({ urlRerouteOnly: true })`
   - On errors, code is displayed with opacity 0.5

## Checklist

- [ ] All four fields are editable inline
- [ ] Framework color indicator is displayed
- [ ] Loading function preview updates when name and loader change
- [ ] All validations work in real time
- [ ] Adding and deleting cards works
- [ ] For activeWhen: '/' a predicate function is generated, not a string
- [ ] Generated code is correct and includes start()
- [ ] Code is dimmed on errors

## How to Check Yourself

- Add two apps with the same name — both should show an error
- Add two apps with the same activeWhen — both should get a route overlap error
- Set activeWhen to `/` — code should generate `location => location.pathname === '/'`
- Switch loader from SystemJS to import — preview and code should change the call

## Hint

For route overlap validation, collect all activeWhen values and check if the current value appears more than once. Use `filter(r => r === app.activeWhen).length > 1`.
