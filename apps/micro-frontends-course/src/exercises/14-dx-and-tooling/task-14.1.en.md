# Task 14.1: Monorepo vs Polyrepo Visualizer

## Goal

Build an interactive visualizer that clearly shows the difference between monorepo and polyrepo approaches in MFE architecture: file/repository structure, CI pipeline, dependency graph, and key metrics. Allows you to "add an MFE" and see how each approach scales.

## Requirements

1. Implement a "Monorepo" / "Polyrepo" switcher (two buttons); visualization changes on click
2. For each mode, show a file/repository tree: monorepo — a single folder structure with apps/ and packages/, polyrepo — a list of separate repositories with a git icon
3. Show the CI pipeline as a sequence of steps: monorepo — affected-only with skipped steps marked, polyrepo — full run of all MFEs in parallel
4. Display a dependency graph between MFEs and shared packages as connected blocks
5. Show 4 metrics with numeric values: CI time (sec), cross-MFE refactoring (easy/hard), onboarding (clone N repos), dependency consistency (auto/manual)
6. "+ Add MFE" button — adds a new MFE to the list, recalculates CI time: for monorepo the time does not grow (affected-only), for polyrepo ~30 sec is added per MFE
7. Show a comparison table below the visualization with 5 criteria

## Checklist

- [ ] Monorepo/Polyrepo switcher works and changes the entire visualization
- [ ] File tree correctly displays the structure for each mode
- [ ] CI pipeline shows affected-only in monorepo (some steps grayed out — skipped) and full run in polyrepo
- [ ] Dependency graph shows MFEs and shared packages with connection lines
- [ ] 4 metrics are displayed with correct values for each mode
- [ ] "+ Add MFE" button adds an MFE to the structure and recalculates CI time
- [ ] In polyrepo, CI time grows linearly; in monorepo it stays constant (affected-only)
- [ ] Comparison table shows all 5 criteria with correct values
- [ ] Dark theme, all styles inline

## How to Check Your Work

1. Open the task — one of the modes should be shown (monorepo by default)
2. Switch to Polyrepo — structure, pipeline, and metrics should change
3. Click "+ Add MFE" 3 times in Polyrepo mode — CI time should increase (~90 sec for 3 MFEs)
4. Switch to Monorepo and click "+ Add MFE" 3 times — CI time should stay constant
5. The comparison table should reflect the current number of MFEs in the onboarding row
