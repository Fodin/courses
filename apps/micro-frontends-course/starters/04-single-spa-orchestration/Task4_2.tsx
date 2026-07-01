// Task 4.2 — Single-SPA Root Config Builder
// Build a visual constructor for generating a Single-SPA root-config.js file
// with registerApplication() calls based on user-defined app configurations.

// TODO: Implement the root config constructor
// Requirements:
// 1. Form for adding applications with fields:
//    - name (text, must be unique, lowercase letters/digits/dashes, starts with a letter)
//    - framework (select: React | Vue | Angular | Svelte | Vanilla)
//    - activeWhen (text, URL path starting with "/", must not duplicate another app's route)
//    - moduleSystem (select: System.import() | import())
//
// 2. List of added apps — each app shown as a card with:
//    - Color indicator bar matching the selected framework
//    - All 4 fields editable inline
//    - Auto-generated loading function preview:
//      System.import: () => System.import('@company/app-name')
//      import:        () => import('@company/app-name')
//    - Delete button
//    - Validation errors shown inline (red border + error messages)
//
// 3. Validation rules:
//    - name: required, unique, pattern /^[a-z][a-z0-9-]*$/
//    - activeWhen: required, starts with "/", no exact duplicates
//
// 4. "+ Добавить приложение" button to add a new empty app card
//
// 5. Live code preview (toggleable) — generates root-config.js with:
//    - import { registerApplication, start } from 'single-spa'
//    - One registerApplication({ name, app, activeWhen }) per app
//    - Special case: activeWhen "/" → use location predicate function
//    - start({ urlRerouteOnly: true }) at the end
//    - Code is dimmed (opacity: 0.5) when there are validation errors

export function Task4_2() {
  return <div>Task 4.2</div>
}
