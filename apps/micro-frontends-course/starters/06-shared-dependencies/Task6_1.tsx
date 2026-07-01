// Task 6.1 — Dependency Graph Visualizer
// Visualize how shared dependency settings affect total bundle size across MFEs.

// TODO: Implement the dependency graph visualizer with the following structure:
//
// DATA:
// - 7 libraries: react (45KB, v18.3.0), react-dom (130KB), react-router (52KB),
//   zustand (12KB), lodash (72KB), axios (38KB), date-fns (88KB)
// - 4 MFEs with their dependency lists:
//   - Shell:   react, react-dom, react-router, zustand
//   - Catalog: react, react-dom, react-router, axios, date-fns
//   - Cart:    react, react-dom, zustand, axios, lodash
//   - Profile: react, react-dom, react-router, axios, date-fns, lodash
//
// STATE:
// - sharedLibs: Set<string> — which libraries are currently marked as shared
//   (initial: new Set(['react', 'react-dom']))
//
// CALCULATIONS:
// - totalWithoutSharing: sum of all deps of all MFEs (baseline, static)
// - totalWithSharing: shared libs count once; non-shared multiply by usageCount
// - saved = totalWithoutSharing - totalWithSharing
// - savedPercent = Math.round(saved / totalWithoutSharing * 100)
// - duplicateLibs: non-shared libs used by 2+ MFEs
// - conflictsCount: shared libs with version mismatch
//   (simulate: Cart uses react@18.2.0, others use 18.3.0 — conflict exists only when react is shared)
//
// UI SECTIONS:
//
// 1. STATISTICS (4 cards):
//    - Total bundle size (KB)
//    - Savings (KB + %)
//    - Duplicates count (red if > 0)
//    - Version conflicts count (amber if > 0)
//
// 2. VERSION CONFLICT WARNING (show only when conflictsCount > 0):
//    - Amber/yellow card listing the conflicting shared libraries with their versions
//    - Explanation why this is dangerous
//
// 3. LIBRARIES section (toggle panel):
//    - 3 preset buttons: "Ничего не шарить", "Только React", "Всё shared"
//    - For each library: colored dot, name, version, size in KB, toggle button (shared/local)
//    - Show "✕ дубль ×N" badge if non-shared and used by N >= 2 MFEs
//    - Show "⚠ конфликт" badge if shared and has version conflict
//
// 4. MFEs section (cards grid):
//    - For each MFE: colored header, "собственный бандл: X KB" (only non-shared deps)
//    - Dependency badges with 3 states:
//      green   = shared
//      blue    = local (non-shared, used by 1 MFE)
//      red     = duplicate (non-shared, used by 2+ MFEs)
//    - Color legend
//
// All styles must be inline (no CSS files, no CSS modules)

export function Task6_1() {
  return <div>Task 6.1</div>
}
