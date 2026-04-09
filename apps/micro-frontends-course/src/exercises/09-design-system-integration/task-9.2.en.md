# Task 9.2 — Design Tokens Builder

## Goal

Implement an interactive design tokens builder with a four-category editor, live component preview, code generator, and distribution strategy selector.

## Requirements

1. Implement editor for four token categories: Colors, Spacing, Typography, Border Radius
2. **Colors**: 6 tokens (primary, secondary, success, error, background, text), controlled via `<input type="color">`
3. **Spacing**: 5 tokens (xs, sm, md, lg, xl) via range sliders (2–80px), visualize as bar chart
4. **Typography**: select for font-family (5 options), range sliders for h1–h4, body, small
5. **Border Radius**: range sliders for sm, md, lg (0–32px), full fixed at 9999px, visualize with shapes
6. Implement live preview: product card with "Buy" and "Details" buttons, status badges — everything uses current tokens
7. Generate CSS in `:root { --ds-color-primary: ...; ... }` format
8. Generate JSON in Design Tokens Community Group format (`value` field + `type`)
9. CSS/JSON switcher with "Copy" button
10. Distribution strategy section: three radio options (npm / federated / CDN) with pros and cons description for each

## Checklist

- [ ] Four category switcher works
- [ ] Color picker changes colors in live preview in real time
- [ ] Spacing sliders change bar visualization and live preview
- [ ] Border radius sliders change shape preview
- [ ] Live preview reflects ALL token changes (button color, spacing, radius, font)
- [ ] CSS export contains all tokens with correct `--ds-` prefixes
- [ ] JSON export contains `value` and `type` fields for each token
- [ ] "Copy" button copies code to clipboard and shows confirmation
- [ ] Strategy selection displays pros and cons for the selected option

## How to Check Yourself

1. Open "Colors" tab, change primary to any color — "Buy" button in live preview should immediately change color.
2. Open "Spacing" tab, move md slider — padding inside card should change.
3. Open "Border Radius" tab, change lg — card corner in preview should change.
4. Switch to CSS mode, click "Copy", paste in editor — should be valid CSS with `--ds-color-*`, `--ds-spacing-*` etc. variables.
5. Switch to JSON mode — structure should match `{ "color": { "primary": { "value": "#...", "type": "color" } } }` format.
6. Select "CDN" strategy — pros and cons for CDN option should appear.
