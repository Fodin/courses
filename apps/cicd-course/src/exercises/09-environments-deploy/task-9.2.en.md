# Task 9.2: Deploy Strategies — Rolling, Blue-Green, Canary

## Goal

Create an interactive simulator of three deploy strategies. The user selects a strategy and runs an animated step-by-step visualization of the instance update process.

## Requirements

1. Three tabs or buttons for strategy selection: `Rolling`, `Blue-Green`, `Canary`
2. Display 4 servers/instances as blocks (each strategy has different logic)
3. "Run Deploy" button — launches step-by-step animation of the update
4. For **Rolling**: blocks update one at a time (v1 → v2), the currently updating one is highlighted
5. For **Blue-Green**: 4 blue blocks (v1) + 4 green blocks (v2), load balancer switches from blue to green entirely
6. For **Canary**: 4 blocks, 1 becomes canary (v2), remaining 3 stay v1; "Promote" button switches all to v2
7. Show GitLab CI YAML configuration for the selected strategy
8. Show strategy characteristics: Downtime, Rollback speed, Resource cost

## Checklist

- [ ] Switching between three strategies without losing state of other tabs
- [ ] Server blocks with visual version differentiation (v1 — blue, v2 — green, canary — yellow)
- [ ] "Run Deploy" button — sequentially updates blocks (can be click-based steps without setTimeout)
- [ ] For Blue-Green: separate traffic switch button to Green
- [ ] For Canary: separate Promote button for full rollout
- [ ] YAML block with selected strategy config (monospace font, dark background)
- [ ] Table or badges with characteristics: Downtime / Rollback speed / Resource cost
- [ ] "Reset" button to return to initial state

## How to Verify

1. Select Rolling, press "Run Deploy" — blocks should update sequentially
2. Select Blue-Green — 2 groups (blue/green) should display, traffic switching happens via button
3. Select Canary — 1 of 4 becomes canary, Promote switches all to v2
4. Check that YAML changes when switching strategies
5. "Reset" button returns all blocks to v1

## Hints

- For step-by-step animation without a timer: store `step` (number), each Deploy click increments by 1
- Rolling: `blocks.map((b, i) => i <= step ? 'v2' : 'v1')`
- Blue-Green: `trafficOnGreen` (boolean) — changes on traffic switch button
- Canary: `promoted` (boolean) — if true, all blocks are v2, otherwise block 0 is canary
- For YAML use an object `{rolling: '...yaml...', bluegreen: '...yaml...', canary: '...yaml...'}`
