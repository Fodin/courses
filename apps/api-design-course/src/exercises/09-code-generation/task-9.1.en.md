# Task 9.1: OpenAPI → TypeScript

## Goal

Create an interactive visualizer that shows how OpenAPI specification constructs become TypeScript types during code generation. Six examples: simple model, enum, arrays, nested objects, oneOf, allOf.

## Requirements

1. Implement a `MappingExample` interface with fields: `id`, `label`, `openapi`, `typescript`, `description`
2. Prepare 6 mapping examples: `simple`, `enum`, `array`, `nested`, `oneof`, `allof`
3. Display tabs for switching between examples — active tab highlighted with color `#6366f1`
4. Show the current example's description in a yellow hint block
5. Side by side (two columns): left — YAML OpenAPI on dark background, right — TypeScript types in blue
6. At the bottom — a reference table of type mappings as cards

## What to Implement

- [ ] `MappingExample` interface and `MAPPING_EXAMPLES` array (6 elements)
- [ ] `activeId: string` state, default `'simple'`
- [ ] Tab block: buttons for each example, active with purple background
- [ ] Description block: yellow background (`#fefce8`), border `#fde68a`
- [ ] Left panel (YAML): header with green `YAML` badge, dark background `#1e293b`
- [ ] Right panel (TS): header with blue `TS` badge, dark background, text color `#93c5fd`
- [ ] Mapping table: 12 pairs (OpenAPI type → TypeScript type), 3-column grid

## Mapping Examples

| Example | What it shows |
|---|---|
| `simple` | string, integer → number, boolean, required → required fields |
| `enum` | enum: [a,b,c] → union type `'a' | 'b' | 'c'` |
| `array` | type: array + items → `T[]` |
| `nested` | $ref to another schema → interface reference |
| `oneof` | oneOf: [A, B, C] → `A | B | C` |
| `allof` | allOf: [$ref, {object}] → intersection `A & B` or `extends` |

## How to Check Yourself

- Clicking the `enum` tab shows YAML with `type: string` and `enum: [...]` on the left, `type OrderStatus = 'pending' | ...` on the right
- Clicking `allof` shows a comment about intersection type and an alternative `extends` variant on the right
- The mapping table contains the row `oneOf: [A, B]` → `A | B`
- Switching tabs updates content without page reload
