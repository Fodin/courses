# Task 8.1: $ref Visualizer

## Goal

Create an interactive component that displays the dependency graph between OpenAPI schemas of an e-commerce API. Clicking on a schema shows its YAML definition and connections to other schemas.

## Requirements

1. Draw 5 schemas: `User`, `Address`, `Order`, `OrderItem`, `Product`
2. Each schema is a clickable card with color coding
3. When a schema is selected, show:
   - Which schemas it references via `$ref`
   - Which schemas reference it
   - The schema's YAML definition in a dark-background block
4. Highlight related schemas when one is selected
5. Display the number of `$ref` references for each schema as a badge

## What to Implement

- [ ] `SCHEMA_NODES` array with fields: `id`, `label`, `color`, `refs: string[]`, `yaml: string`
- [ ] `selectedId: string | null` state
- [ ] Compute `referencedBy` — who references the selected schema
- [ ] Apply different styles to: selected schema, schemas it references, schemas that reference it
- [ ] Show YAML in the right column when selected
- [ ] Second click on the same schema deselects it

## Schema Connections

```
Order → User
Order → OrderItem
OrderItem → Product
User → Address
```

## How to Check Yourself

- Clicking on `Order` highlights `User` and `OrderItem`
- Clicking on `Product` shows in the connections block that `OrderItem` references it
- Clicking on `Address` shows that `User` references it
- Schemas with no references (`Address`, `Product`) show a corresponding message
- Second click on the same schema deselects it
