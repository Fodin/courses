# Task 10.4: .dockerignore and BuildKit

## Objective

Learn to properly configure `.dockerignore` to reduce build context size, and use BuildKit features: parallel builds, secrets, SSH agent, and heredoc syntax.

## Requirements

1. Create a component with two sections: ".dockerignore" and "BuildKit"
2. The ".dockerignore" section shows a table of syntax patterns (comments, wildcards, exclusions with `!`, directories) with examples
3. Add a "Show Node.js template" button and a "Show Python template" button — they display ready-made `.dockerignore` files
4. Visualization: a comparison of build context size with and without `.dockerignore` (two progress bars with numbers)
5. The "BuildKit" section shows a table of BuildKit features: parallel builds, cache mounts, secrets (`--mount=type=secret`), SSH (`--mount=type=ssh`), heredoc
6. For each BuildKit feature: an "Example" button that shows a code block
7. At the bottom: a block with the command to check the BuildKit version and a recommendation to use `# syntax=docker/dockerfile:1`

## Hints

- `useState<string>` for the active section
- `useState<string | null>` for the open `.dockerignore` template
- `useState<string | null>` for the open BuildKit example
- Pattern table: `{ pattern, description, example }`
- BuildKit table: `{ feature, description, codeExample }`

## Checklist

- [ ] Two sections are switchable
- [ ] `.dockerignore` syntax table (5+ patterns)
- [ ] Template buttons for Node.js and Python work
- [ ] Build context size visualization (progress bars)
- [ ] BuildKit features table (5 features)
- [ ] BuildKit example buttons show code
- [ ] BuildKit recommendation block at the bottom

## How to Verify

1. Switch sections — the content changes
2. `.dockerignore` template buttons show/hide content
3. Progress bars clearly show the difference (e.g., 1.5 GB vs 45 KB)
4. In "BuildKit", the table contains 5 features
5. BuildKit example buttons show code blocks
6. The recommendation block is always visible
