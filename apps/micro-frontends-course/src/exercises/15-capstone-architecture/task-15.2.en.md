# Task 15.2: Architecture Document Builder Wizard

## Goal

Implement a 6-step wizard for creating a complete MFE platform architecture document (ADR). Each step collects one aspect of the architecture: MFEs, shared deps, event contracts, routing, deploy strategies, monitoring. The final screen generates the ADR in Markdown format and evaluates decision quality on a 10-point checklist.

## Requirements

1. Implement a progress bar with 6 steps and labels (MFE / Shared Deps / Contracts / Routing / Deploy / Monitoring): completed steps highlighted in blue + checkmark, current — light blue
2. Step 1 (MFE): list of cards with 4 fields (name, domain, framework-select, team), Add/Remove buttons
3. Step 2 (Shared Deps): button-tags for adding deps from a predefined list, for each selected — strategy-select (module-federation/import-map/cdn) + singleton checkbox
4. Step 3 (Contracts): for each contract — source MFE select, target MFE select, event field (monospace), payload field. Block if < 2 MFEs
5. Step 4 (Routing): add MFE → path + lazy checkbox routes. Display path in purple monospace
6. Step 5 (Deploy): "Auto-fill all MFEs" button + for each MFE strategy-select + rollback checkbox
7. Step 6 (Monitoring): "Auto-fill all MFEs" button + for each MFE SLO-select + errorBoundary checkbox + circuitBreaker checkbox
8. Navigation buttons: "Back" (disabled on step 1) and "Next →" (steps 1-5) / "Generate ADR" (green, step 6)
9. After clicking "Generate ADR": show ADR in a monospace panel (Markdown format) + checklist with 10 items (✓/✗)
10. Checklist evaluates: presence of MFEs (≥2), all have domain, all have team, presence of shared deps, contracts, routing, deploy configs, at least one rollback, monitoring, all have error boundary

## Checklist

- [ ] Progress bar: 6 steps, completed — blue with ✓, current — light blue
- [ ] Step 1: add/remove MFEs, all 4 fields editable
- [ ] Step 2: tag buttons change color on selection, strategy and singleton available for each dep
- [ ] Step 3: source and target selection from MFE list from step 1; blocked when < 2 MFEs
- [ ] Step 4: routes with path in purple monospace, lazy checkbox works
- [ ] Step 5: Auto-fill adds all MFEs that don't have a deploy config
- [ ] Step 6: Auto-fill adds all MFEs that don't have monitoring
- [ ] "Back" is disabled on step 1, navigation between steps works
- [ ] ADR generates in correct Markdown-like format with all 6 sections
- [ ] Checklist: all 10 items display with ✓/✗ based on real data
- [ ] Checklist score: green ≥8/10, yellow ≥5, red <5
- [ ] "Copy ADR" button calls navigator.clipboard.writeText

## How to Check Yourself

1. On step 1, add 3 MFEs (catalog, cart, checkout) with domains and teams — progress bar should show step 1 as active
2. Go to step 3 — all 3 MFEs from step 1 should be available in selects
3. On step 5, click "Auto-fill" — all 3 MFEs should appear with Blue/Green and rollback: true
4. On step 6, click "Generate ADR" — a document with 6 sections should appear
5. In the checklist: if you haven't added any contracts — the "Event contracts defined" item should be ✗
6. Checklist 10/10: add 1 entry to each section, enable ErrorBoundary for all monitoring MFEs
