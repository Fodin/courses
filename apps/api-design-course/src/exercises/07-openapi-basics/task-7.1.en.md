# Task 7.1: Anatomy of an OpenAPI Document

## Goal

Implement an interactive map of an OpenAPI 3.x document structure. The user clicks on a section and sees a detailed description with a YAML example.

## Requirements

1. Draw all 5 OpenAPI sections: `openapi`, `info`, `servers`, `paths`, `components`
2. For each section, show an icon, name, short description, and a required/optional badge
3. The active section is highlighted with color and a left border
4. Clicking an already-open section collapses the details (toggle)
5. When a section is selected, show a block with a detailed description and a YAML example
6. The YAML example is displayed in a code block with dark background and monospace font
7. If no section is selected — show a placeholder with a hint

## Checklist

- [ ] All 5 sections are displayed
- [ ] `openapi`, `info`, `paths` marked as required (red badge)
- [ ] `servers`, `components` marked as optional (green badge)
- [ ] Click expands detailed description
- [ ] Second click on the same section hides details
- [ ] Code block with YAML example (dark background, `pre`, monospace font)
- [ ] Placeholder when no section is active

## How to Check Yourself

- Click on `info` — a description with a YAML example should appear, including fields title, version, contact
- Click on `components` — the example should contain `schemas` and `responses` with `$ref`
- Click again on `info` — details should collapse
- Make sure `openapi`, `info`, `paths` have a red "required" badge
