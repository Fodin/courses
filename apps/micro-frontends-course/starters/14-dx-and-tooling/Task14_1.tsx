// Task 14.1 — Monorepo vs Polyrepo Visualizer
// Build an interactive visualizer comparing monorepo and polyrepo approaches
// in MFE architecture: file structure, CI pipeline, dependency graph, metrics.

// TODO: Implement the visualizer with the following structure:
//
// DATA:
//   INITIAL_MFES — 4 MFE entries (id, label, color):
//     shell (#1565c0), catalog (#2e7d32), cart (#6a1b9a), checkout (#e65100)
//
//   SHARED_PACKAGES — 3 shared packages:
//     ui-kit (#00695c), utils (#37474f), types (#4527a0)
//
//   INITIAL_EDGES — dependency edges:
//     shell→catalog, shell→cart, shell→checkout,
//     catalog→ui-kit, cart→ui-kit, checkout→ui-kit,
//     checkout→cart, catalog→utils, cart→types
//
//   BASE_CI_MONOREPO_SEC = 45 (constant, does not grow with MFE count)
//   CI_PER_MFE_POLYREPO_SEC = 30 (added per each MFE beyond initial 4)
//   BASE_CI_POLYREPO_SEC = 120
//
// MODE SWITCHER:
//   Two buttons: "Monorepo" / "Polyrepo" — toggle between modes
//   Clicking changes all visualizations below
//
// "+ Добавить MFE" button:
//   Adds a new MFE from a predefined names list: payments, profile,
//   notifications, search, reviews (cycle with index suffix if exhausted)
//   Use colors array: #b45309, #7c3aed, #0369a1, #b91c1c, #047857
//
// METRICS ROW (4 metric cards):
//   monorepo:
//     Время CI → `~${BASE_CI_MONOREPO_SEC} сек` (green #4ade80)
//     Cross-MFE рефакторинг → 'Лёгкий' (green)
//     Onboarding → 'clone 1 репо' (green)
//     Консистентность deps → 'Авто' (green)
//   polyrepo:
//     Время CI → `~${polyCiSec} сек` (red #f87171), polyCiSec grows with mfes
//     Cross-MFE рефакторинг → 'Сложный' (red)
//     Onboarding → `clone ${mfes.length + SHARED_PACKAGES.length} репо` (red)
//     Консистентность deps → 'Ручная' (yellow #fbbf24)
//
// FILE TREE (left column):
//   monorepo — folder tree with apps/ listing mfes, packages/ listing shared
//   polyrepo — list of github.com/company/<name> repo entries
//
// DEPENDENCY GRAPH (right column):
//   Show MFE list on left, arrow in middle, shared packages on right
//   List edge pairs below: "shell → @company/ui-kit" etc.
//
// CI PIPELINE (full width):
//   monorepo: step boxes → detect(affected) → build:catalog(active) →
//     build:others(gray, "⏭ пропущено") → test → deploy
//   polyrepo: one row per MFE with 6 steps: clone→install→lint→build→test→deploy
//   Show CI time above pipeline: monorepo = constant, polyrepo grows
//
// COMPARISON TABLE:
//   5 rows: Cross-MFE рефакторинг, CI при изменении shared, Onboarding,
//     Консистентность зависимостей, Изоляция команд
//   Monorepo column (green ✅ or red ⚠️), Polyrepo column (opposite)
//   Note: last row (Изоляция команд) polyrepo wins
//
// STYLE: dark theme #0f172a background, all styles inline

export function Task14_1() {
  return <div>Task 14.1</div>
}
