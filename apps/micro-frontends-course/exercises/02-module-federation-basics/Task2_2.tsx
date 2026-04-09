// Task 2.2 — Конструктор конфига Host (vite-plugin-federation)
// Build an interactive form that generates a valid vite.config.ts for a host application

// TODO: Implement the host config constructor
// Form sections:
// 1. name — text field (required, validate non-empty)
// 2. remotes — list of { name, url } pairs
//    - "Add remote" button, delete button per entry
//    - Validate: URL must contain "remoteEntry"
// 3. shared — preset libs: react, react-dom, react-router-dom, zustand
//    - Per lib: singleton checkbox + requiredVersion text field
//    - Warn if singleton is false for react/react-dom
//    - Add custom library field
// 4. Live preview on the right — <pre> with generated vite.config.ts
//    Updates on every change
// 5. Validation summary: list errors below the form
//    At least one remote required, name required, URL format check

export function Task2_2() {
  return <div>Task 2.2</div>
}
