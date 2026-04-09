# Task 10.2: Comparing Documentation Tools

## Goal

Study the three main tools for API documentation: Swagger UI, Redoc, and Stoplight — and learn to choose the right one for a specific project.

## Requirements

1. Implement two display modes (toggle): "Cards" and "Comparison"
2. In "Cards" mode:
   - Three tabs for switching between tools (Swagger UI, Redoc, Stoplight)
   - Each card contains: colored header, UI description with features, list of pros and cons, "When to use" block
   - "Show configuration example" button — expands a block with configuration code
3. In "Comparison" mode:
   - Table with criteria in rows and tools in columns
   - Criteria: Try it out, Mock server, Design, Open Source, Self-host, Collaboration, Design-first, Setup complexity, Price
4. Each tool must have a unique color (Swagger — green, Redoc — purple, Stoplight — yellow)

## Tools for Comparison

**Swagger UI** — interactive documentation with Try it out from OpenAPI specification
**Redoc** — beautiful three-column layout, excellent design
**Stoplight** — complete platform: editor + documentation + mock server + linting

## Checklist

- [ ] Mode toggle switch (Cards / Comparison)
- [ ] Three tabs for Swagger UI / Redoc / Stoplight
- [ ] Card with pros, cons, and recommendation for each
- [ ] Expandable block with configuration example
- [ ] Comparison table in "Comparison" mode
- [ ] Unique colors for each tool

## How to Check Yourself

1. Switch between the three tools — cards should change
2. Click "Show configuration example" for each tool — code should expand
3. Switch to "Comparison" mode — a table should appear
4. Check that the table correctly reflects the information (e.g., Try it out is free for Swagger, paid for Redoc)
