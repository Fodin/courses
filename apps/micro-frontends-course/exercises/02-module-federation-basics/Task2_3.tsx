// Task 2.3 — Конструктор конфига Remote (vite-plugin-federation)
// Build an interactive form that generates a valid vite.config.ts for a remote application

// TODO: Implement the remote config constructor
// Form sections:
// 1. name — text field (required): identifier used in host's remotes map
// 2. filename — text field (default: "remoteEntry.js"): must match URL in host config
// 3. exposes — list of { key, path } pairs
//    - "Add Expose" button, delete button per entry
//    - Validate: key must start with "./" (error if missing)
//    - Validate: path must not be empty
// 4. shared — same as Task 2.2 (preset + custom + singleton + version)
// Two-level validation:
//    - Errors (blocking): empty name/filename, no exposes, key without "./"
//    - Warnings (advisory): singleton: false for react/react-dom, no shared at all
// 5. Live preview: generated vite.config.ts
// 6. "How to use in host" block: generate React.lazy(() => import('name/key')) examples
//    for each expose entry

export function Task2_3() {
  return <div>Task 2.3</div>
}
