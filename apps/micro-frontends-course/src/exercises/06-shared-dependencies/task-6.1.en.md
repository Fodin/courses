# Task 6.1 — Dependency Graph Visualizer

## Goal

Create an interactive tool that clearly shows how enabling/disabling shared dependencies affects the final bundle size of microfrontends, and helps detect duplication and version conflicts.

## Requirements

1. Predefined 4 MFEs: Shell, Catalog, Cart, Profile — each with a set of dependencies (react, react-dom, react-router, zustand, lodash, axios, date-fns)
2. For each of the 7 libraries — a toggle button `shared / local`
3. Dynamic recalculation of total bundle size on each toggle:
   - Shared library loads once (not bundled into each MFE)
   - Local library is multiplied by the number of MFEs using it
4. Duplicate highlighting: if a library is not shared and used in 2+ MFEs — red badge
5. Version conflict warning: Cart uses react 18.2.0, others — 18.3.0; warning only shows when react is in shared
6. Statistics block with 4 cards: total size, savings (KB and %), duplicates, version conflicts
7. Three presets: "Share Nothing", "React Only", "Share Everything"
8. MFE list with colored badges for each dependency (color depends on status: shared / local / duplicate)

## Checklist

- [ ] Shared/local toggle works for each library
- [ ] Total bundle size recalculates correctly on shared change
- [ ] Duplicate libraries highlighted in red
- [ ] React version conflict warning only appears when shared: true
- [ ] "Savings" statistic shows correct percentage
- [ ] All three presets apply correctly
- [ ] Badges in MFE list reflect current dependency status

## How to Check Yourself

Open the visualizer and run the sequence:

1. Click "Share Nothing" → verify all badges are blue (local), savings = 0
2. Click "React Only" → react and react-dom turned green, version conflict warning appeared, size decreased
3. Click "Share Everything" → no red badges, "Duplicates: 0", maximum savings
4. Manually disable react from shared → version conflict warning disappeared, Cart and Shell, Catalog, Profile show react as red duplicate

## Hints

- For calculation: if library is shared — add once; if not — multiply by `usageCount`
- `libUsageCount` — Map from library name to number of MFEs that use it
- `totalWithoutSharing` (baseline) doesn't depend on toggles — it's the sum of all dependencies of all MFEs without sharing
- React version conflict is simulated statically: Cart = 18.2.0, others = 18.3.0
