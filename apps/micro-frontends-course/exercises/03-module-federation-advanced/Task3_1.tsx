// Task 3.1 — Simulator of shared version conflicts in Module Federation
// Visualize how singleton, strictVersion, and requiredVersion affect
// which version of React gets loaded (or if an error occurs).

// TODO: Implement the shared version conflict simulator
// Requirements:
// 1. Two config panels — Host and Remote — each with fields:
//    - version (e.g. "18.2.0")
//    - requiredVersion (semver range, e.g. "^18.0.0")
//    - singleton (checkbox)
//    - strictVersion (checkbox)
// 2. "Проверить совместимость" button runs the analysis and shows:
//    - resolved version (which React instance will be used)
//    - whether duplication will occur (both load own copy)
//    - whether a runtime error is expected (strictVersion + incompatible)
//    - status badge: green (ok), yellow (warning), red (error)
// 3. Dependency tree visualization:
//    host → react@X, remote → react@Y, resolved → react@Z
//    Color the "resolved" row to match the status
// 4. At least 4 scenario presets:
//    - "Всё совместимо" — same version, singleton on
//    - "Minor mismatch" — both in same ^18 range, different patch/minor
//    - "Major conflict" — host on ^17, remote on ^18 with strictVersion
//    - "Дублирование" — singleton off on both sides
// 5. When a preset is selected — apply it to both panels
// 6. Manual field edits reset the result and deselect the active preset

export function Task3_1() {
  return <div>Task 3.1</div>
}
