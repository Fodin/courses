# Task 11.1: Testing Pyramid Visualizer

## Goal

Create an interactive testing pyramid visualizer for MFE architecture, where each layer is clickable and shows testing details, and toggles allow enabling/disabling levels for pipeline calculation.

## Requirements

1. Display a pyramid of 5 layers (bottom to top): Unit, Contract, Integration, E2E, Visual
2. Each layer is clickable, on click the right side shows:
   - Description: what's tested at this level in MFE context
   - Test code example (Jest/Pact/Playwright)
   - Metrics: speed, reliability, maintenance cost
3. For each layer — toggle (enable/disable pipeline participation)
4. Bottom right: Coverage map — 4 MFEs (Shell, Catalog, Cart, Profile) with progress bars for each testing level
5. Disabled layers: coverage bars hide (width 0), MFE shows "—"
6. Summary statistics at bottom left: CI time (min), Confidence (%), cost
7. Dark style (#0f172a background), all styles inline

## Checklist

- [ ] Pyramid of 5 layers with color coding
- [ ] Click on layer shows description + code example + metrics
- [ ] Toggle switch for each layer
- [ ] Coverage map with progress bars for 4 MFEs
- [ ] On layer disable — bars animate and collapse
- [ ] Statistics: CI time, Confidence, cost recalculate
- [ ] First layer (Unit) selected by default

## How to Check Yourself

1. Click "Contract" — description about Pact and example with `PactV3` should appear
2. Disable "E2E" toggle — corresponding bars in Coverage map should collapse, CI time decrease
3. Enable all layers — Confidence should be maximum, cost — "high"
4. Disable all except Unit — cost should become "low"
5. Verify that code example for each layer is different and matches its level
