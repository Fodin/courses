# Task 7.1: Testing Pyramid in the Pipeline

## Goal

Create an interactive testing pyramid visualization with GitLab CI pipeline structure configuration. Show how different test types map to stages and why order matters.

## Requirements

1. Display a visual pyramid with three levels: Unit (base), Integration (middle), E2E (top)
2. Each pyramid level is clickable — when selected, it highlights and shows details: typical execution time, percentage of all tests, whether external dependencies are needed
3. Show the corresponding YAML pipeline with stages, updating when a level is selected
4. Implement checkboxes for enabling/disabling each test type in the pipeline
5. When faster tests are disabled, show a warning about violating the fail-fast principle
6. Show total expected pipeline time as the sum of selected stages

## Checklist

- [ ] Visual pyramid with three levels of different widths (Unit — wide, E2E — narrow)
- [ ] Color coding for levels (green — unit, blue — integration, orange — e2e)
- [ ] On level click — information block (time, % of tests, dependencies)
- [ ] YAML block with current stages for the selected test set
- [ ] Checkboxes for enabling/disabling test types
- [ ] Warning when order is violated (E2E without unit tests)
- [ ] Display of total pipeline time

## How to Verify

1. Click on each pyramid level — make sure different information is shown
2. Disable Unit tests — a fail-fast principle warning should appear
3. Enable only E2E — pipeline time should show "~20 min"
4. Enable all three levels — YAML should contain stages: [lint, unit-test, integration, e2e, deploy]
5. Check that YAML updates when checkboxes change

## Hints

- The pyramid can be drawn using `div` with `clipPath` or CSS `border` (triangles via border trick)
- Simpler approach — three rectangles of different widths, centered, with different colors
- Use `useState` for `selectedLevel` (string) and `enabledTypes` (Set or array)
- Pipeline time is a simple sum of constants: unit ≈ 2 min, integration ≈ 5 min, e2e ≈ 15 min
- Build YAML via template literal with conditional blocks
