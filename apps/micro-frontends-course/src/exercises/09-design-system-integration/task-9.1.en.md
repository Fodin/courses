# Task 9.1 — CSS Conflict Visualizer

## Goal

Create an interactive tool that clearly demonstrates the CSS conflict problem in MFE architecture and shows how different isolation strategies solve it.

## Requirements

1. Display two MFE blocks: "MFE A — Catalog (Team Alpha)" and "MFE B — Checkout (Team Beta)"
2. In each block, show a button and CSS class selector (`selector: .btn` / `selector: .btn_hash` etc.)
3. Implement a switcher with four strategies: "No Isolation", "CSS Modules", "Shadow DOM", "CSS Layers"
4. For "No Isolation" strategy, visually simulate the conflict: MFE A button should look like MFE B button (red, rounded), display conflict warning
5. For other strategies: buttons keep their correct styles, display success message
6. For "Shadow DOM" use real `attachShadow` with isolated styles
7. Show a code block illustrating the current strategy (different CSS for each strategy)
8. Display a comparison table of all four strategies (isolation, DX, runtime cost, browser support)
9. Active strategy should be highlighted in table and switcher

## Checklist

- [ ] Switcher with 4 strategies works correctly
- [ ] On "No Isolation" MFE A button is styled like MFE B (red, rounded)
- [ ] On "No Isolation" conflict warning is displayed
- [ ] On CSS Modules / Shadow DOM / CSS Layers success message is displayed
- [ ] Shadow DOM implemented via `attachShadow`, not inline styles
- [ ] Code block changes on strategy switch
- [ ] Comparison table displayed fully with all 4 rows
- [ ] Active strategy highlighted in switcher and table

## How to Check Yourself

1. Switch to "No Isolation" — "Add" button in MFE A should be orange-red and heavily rounded. A red block with conflict description should appear.
2. Switch to "CSS Modules" — both buttons should look correct, MFE blocks should show hash classes (.btn_a3x9k / .btn_b7m2p). Green success block appears.
3. Switch to "Shadow DOM" — buttons render via real Shadow DOM (check in DevTools — elements should have `#shadow-root`).
4. In the table, the active strategy row should be highlighted with blue background.
