# Task 5.2 — Web Component Contract Builder

## Goal

Create a step-by-step builder that describes a Custom Element's public API (attributes, properties, events, CSS Custom Properties, slots) and generates a TypeScript interface and class skeleton in real time.

## Requirements

1. **Step navigation** — 7 steps with ability to navigate between them:
   - Step "Name" → "Attributes" → "Properties" → "Events" → "CSS Vars" → "Slots" → "Result"
   - Completed steps visually highlighted (different color)

2. **"Name" step** — text input for Custom Element name
   - Validation: name must contain a hyphen (`my-element`, not `myelement`)
   - Validation: lowercase and digits only
   - Show a preview of the class name: `my-catalog-card` → `MyCatalogCard`
   - Error message if name is invalid, success message if valid

3. **"Attributes" step** — list of attributes with fields:
   - Name (string), Type (`string` / `number` / `boolean`), Default value
   - Add/delete attribute buttons
   - Minimum 0 attributes (optional)

4. **"Properties" step** — list of JS properties with fields:
   - Name (string), TypeScript type (free input), Description
   - Add/delete property buttons

5. **"Events" step** — list of CustomEvents with fields:
   - Event name (string), Payload type (TS type for `detail`)
   - Add/delete event buttons

6. **"CSS Vars" step** — list of CSS Custom Properties with fields:
   - Name (must start with `--`), Default value
   - Validation: name starts with `--`
   - Add/delete buttons

7. **"Slots" step** — list of slots with fields:
   - Name (empty = default slot), Description
   - Add/delete buttons

8. **Live preview** (right column) — updates on every change:
   - "TypeScript Interface" tab — interfaces for attributes, properties, events, comments for CSS vars and slots
   - "Class Skeleton" tab — full skeleton `class MyElement extends HTMLElement { ... }` with `observedAttributes`, `connectedCallback`, getters/setters, event emit helpers

9. **Validation** on the "Result" step:
   - Error: name doesn't contain a hyphen
   - Error: duplicate attribute names
   - Error: duplicate property names
   - Error: CSS Custom Property doesn't start with `--`

10. All styles — inline (no CSS files)

## Checklist

- [ ] Step-by-step navigation — 7 steps
- [ ] Name with hyphen passes validation, without hyphen — error
- [ ] Attributes, properties, events, CSS vars, slots can be added and removed
- [ ] When adding an attribute, type select works (string/number/boolean)
- [ ] TypeScript Interface generates and updates live
- [ ] Class Skeleton generates and updates live
- [ ] Class skeleton contains `observedAttributes`, `connectedCallback`, getters/setters for properties
- [ ] Skeleton contains emit helpers for each event
- [ ] Validation errors on "Result" step

## How to Check Yourself

1. Enter name `my-catalog-card` — class `MyCatalogCard` should appear
2. Enter name `mycatalogcard` (no hyphen) — an error should appear
3. Add attribute `item-id` of type `string` — `itemId?: string` should appear in interface
4. Add property `items` of type `Item[]` — getter/setter should appear in skeleton
5. Add event `catalog:selected` with payload `{ id: string }` — emit helper should appear
6. Add CSS var without `--` — a validation error should appear
7. Add slot `footer` with description — should appear in class comments
