# Task 10.2: Versioning Strategy Builder

## Goal

Implement a builder for configuring versioning and caching strategies for each MFE with configuration validation and deployment manifest generation.

## Requirements

1. MFE table with columns: MFE Name (editable field), Strategy, URL Pattern, Cache TTL, Canary %, Rollback, delete row
2. Three version strategies:
   - `semver` → URL: `/mfe/{name}/1.0.0/remoteEntry.js`
   - `content-hash` → URL: `/mfe/{name}/abc1d2e3/remoteEntry.js`
   - `latest` → URL: `/mfe/{name}/latest/remoteEntry.js`
3. URL Pattern generated automatically based on name and strategy
4. Settings: Cache TTL (no-cache / 1h / 1d / 1w / immutable), Canary % (slider 0–100), Rollback policy (auto-on-error / manual / disabled)
5. "Add MFE" button adds new row with default values
6. "Deployment Manifest" tab shows generated JSON
7. Validation with risk warnings:
   - Error: Shell cannot use "latest" strategy
   - Error: Canary > 0% with rollback policy "disabled"
   - Error: Immutable cache with "latest" strategy
   - Warning: "Latest" strategy with Cache TTL other than no-cache
   - Warning: Canary = 100% (that's not canary anymore)
8. Reference block at bottom describing each strategy

## Checklist

- [ ] Table with three initial MFEs (shell, catalog, cart)
- [ ] URL Pattern updates automatically on name or strategy change
- [ ] Canary slider with numeric percentage indicator
- [ ] Add button and delete buttons for each row
- [ ] Two tabs: "MFE Config" and "Deployment Manifest"
- [ ] JSON in manifest updates in real time on any change
- [ ] Config errors displayed with ⛔ icon, warnings with ⚠️
- [ ] Rows with errors have distinct background (#fff8f8)
- [ ] Manifest shows config error count
- [ ] Reference block with three strategy cards
- [ ] Inline styles only, no CSS files

## How to Check Yourself

1. Change Shell strategy to "latest" — error about shell incompatibility should appear
2. Set Canary 25% and Rollback policy "disabled" — risk error should appear
3. Select Cache TTL "immutable" for MFE with "latest" strategy — error
4. Select Cache TTL "1d" for MFE with "latest" strategy — warning (not error)
5. Add new MFE, name it "payments" with "content-hash" strategy — URL should update
6. Open Manifest tab — JSON should contain all 4 MFEs with all settings
7. Verify manifest updates in real time when changing canary slider
