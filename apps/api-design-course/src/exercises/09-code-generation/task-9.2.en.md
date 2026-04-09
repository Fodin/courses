# Task 9.2: Generation Tool Comparison

## Goal

Create an interactive component for exploring three main TypeScript code generation tools from OpenAPI: `openapi-generator`, `openapi-typescript`, `orval`. For each — what it generates, pros, cons, run command, example output. Plus a comparison table.

## Requirements

1. Implement a `Tool` interface with fields: `id`, `name`, `tagline`, `color`, `generates`, `pros`, `cons`, `command`, `output`
2. Describe 3 tools with realistic content
3. Tool selection buttons: active button — tool color, inactive — gray border
4. Separate "Comparison Table" button — toggles the visibility of the comparison table
5. Comparison table: 8+ criteria in rows, 3 tools in columns
6. Detail block: header with "what it generates" tags, pros/cons in 2 columns, command + output on dark background

## What to Implement

- [ ] `Tool` interface and `TOOLS` array (3 elements)
- [ ] `activeTool: string` and `showTable: boolean` states
- [ ] Tool buttons row + table button
- [ ] Comparison table (conditional render when `showTable`)
- [ ] Tool card header: name, tagline, "what it generates" badges
- [ ] Pros block (green header) and cons block (red header) side by side
- [ ] Two code blocks: command (green text `#a3e635`) and output (blue text `#93c5fd`)

## Tool Content

| Tool | Color | Key Features |
|---|---|---|
| `openapi-generator` | `#10b981` | Java dependency, 50+ languages, Mustache templates |
| `openapi-typescript` | `#3b82f6` | Node.js, types only, openapi-fetch integration |
| `orval` | `#8b5cf6` | React Query hooks, MSW mocks, Zod validation |

## How to Check Yourself

- Table shows/hides on clicking the "Comparison Table" button
- When selecting `orval`, the card header contains "React Query hooks" as one of the generated products
- The cons of `openapi-generator` mention Java/Docker dependency
- The active tool button is displayed with the tool color as background
- The table contains rows for "Runtime dependency" and "Generates hooks"
