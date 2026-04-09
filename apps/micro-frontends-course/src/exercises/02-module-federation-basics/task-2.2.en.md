# Task 2.2 — Host Config Builder

## Goal

Create an interactive form for configuring a host application with Module Federation that generates a ready-to-use `vite.config.ts` in real time.

## Requirements

1. The form has three sections:
   - **name**: text field — name of the host application
   - **remotes**: list of remote applications to connect
   - **shared**: libraries shared via singleton

2. Managing remotes:
   - "Add Remote" button adds a row with two fields: remote name + remoteEntry.js URL
   - Each remote can be deleted
   - URL must contain `remoteEntry` (validation)

3. Managing shared:
   - Preset of 4 libraries: `react`, `react-dom`, `react-router-dom`, `zustand`
   - For each: `singleton` checkbox and `requiredVersion` field
   - Ability to add a custom library (field + button)
   - Preset libraries cannot be deleted (only custom ones)

4. Live preview to the right of the form:
   - `<pre>` block with dark background
   - Updates on every form change
   - Displays valid `vite.config.ts` syntax

5. Validation:
   - `name` cannot be empty
   - At least one remote is required
   - Remote URL must contain `remoteEntry`
   - Error list displayed below the form

## Checklist

- [ ] `name` field is required, error on empty value
- [ ] Multiple remotes can be added, each can be removed
- [ ] Warning shown for `react` and `react-dom` when `singleton` is unchecked
- [ ] Live preview updates on every change
- [ ] Custom shared library can be added via Enter or button
- [ ] Invalid URL (without `remoteEntry`) shows an error

## How to Check Yourself

- Clear the `name` field — a validation error should appear
- Uncheck `singleton` for `react` — a "singleton required" warning should appear
- Add a remote with URL without `remoteEntry.js` — an error should appear
- Verify that generated config contains all entered data

## Generated Config Format

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host-app',
      remotes: {
        catalogApp: 'catalogApp@http://localhost:3001/remoteEntry.js',
      },
      shared: {
        'react': { singleton: true, requiredVersion: '^18.0.0' },
        // ...
      },
    }),
  ],
  build: { target: 'esnext', minify: false },
})
```
