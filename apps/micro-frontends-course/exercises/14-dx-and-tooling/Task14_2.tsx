// Task 14.2 — Workspace Configuration Constructor
// Build an interactive constructor for workspace configs:
// choose a tool (Nx/Turborepo/PNPM), add MFE packages with dependencies,
// generate live config preview, detect cyclic dependencies.

// TODO: Implement the workspace constructor with the following structure:
//
// TYPES:
//   WorkspaceTool = 'nx' | 'turborepo' | 'pnpm'
//   PackageType = 'app' | 'library' | 'shared'
//   MfePackage = { id, name, type: PackageType, deps: string[] }
//
// PREDEFINED_SHARED — 4 shared packages (always present, not removable):
//   ui-kit, utils, types, config — all type 'shared', no deps
//
// TOOL SELECTOR (radio-style buttons, 3 options):
//   nx:        "Полноценная платформа: affected builds, dep graph, code generators, module boundaries"
//              Badge: "Рекомендуется для больших команд"
//   turborepo: "Быстрая сборка через pipeline и Remote Cache, минималистичная конфигурация"
//              Badge: "Хорошо для средних команд"
//   pnpm:      "Базовое управление зависимостями через workspaces, без оркестрации сборки"
//              Badge: "Простой старт"
//
// ADD PACKAGE FORM:
//   - name: text input (validate: required, kebab-case /^[a-z][a-z0-9-]*$/, unique)
//   - type: select (app / library / shared)
//   - deps: checkboxes from all existing packages (PREDEFINED_SHARED + user-added)
//   - "Добавить" button
//
// PACKAGE LIST:
//   Show user-added packages with: name, type badge, deps list, "✕" remove button
//
// CYCLE DETECTION (detectCycles function):
//   Algorithm: DFS with inStack tracking
//   Build graph from all packages (predefined + added)
//   Find all cycles, return as string[][] (each cycle = path of node names)
//   Show warning block if cycles.length > 0:
//     Title: "⚠️ Обнаружены циклические зависимости!"
//     Each cycle: node → node → node (joined with ' → ')
//     Hint: "Вынесите общую логику в shared-пакет без зависимостей на app-уровень"
//
// CONFIG GENERATION (changes on every state update):
//   nx:
//     nx.json with:
//       affected.defaultBase = 'main'
//       tasksRunnerOptions.default with cacheableOperations: ['build','test','lint']
//       projects: { [name]: 'apps/<name>' for apps, 'packages/<name>' for others }
//
//   turborepo:
//     turbo.json with $schema and pipeline:
//       build: { dependsOn: ['^build'], outputs: ['dist/**'] }
//       dev:   { cache: false, persistent: true }
//       lint:  { outputs: [] }
//       test:  { dependsOn: ['build'] }
//
//   pnpm:
//     pnpm-workspace.yaml text:
//       packages:
//         - 'apps/*'      (if any app type packages)
//         - 'packages/*'  (if any library/shared packages)
//
// CONFIG PREVIEW:
//   Show filename above: nx.json / turbo.json / pnpm-workspace.yaml
//   Display in <pre> with monospace font, dark background (#0f172a), green text
//   "⎘ Скопировать" button → navigator.clipboard.writeText → show "✓ Скопировано" 2 sec
//
// TOOL TIPS (below preview, changes per tool):
//   nx:        3 tips about nx affected, nx graph, module boundaries
//   turborepo: 3 tips about turbo --filter, --parallel, Remote Cache
//   pnpm:      3 tips about pnpm -r build, workspace:*, --filter flag
//
// LAYOUT: two columns — left (tool selector + shared pkgs + form + pkg list),
//                        right (cycle warning + config preview + tips)
//
// STYLE: dark theme #0f172a background, all styles inline

export function Task14_2() {
  return <div>Task 14.2</div>
}
