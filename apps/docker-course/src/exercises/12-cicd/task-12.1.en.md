# Task 12.1: CI Pipeline — Build and Testing

## Objective

Create an interactive reference component for a Docker CI/CD pipeline: stages, layer caching, and matrix builds. Learn to understand what steps make up automated Docker image build and testing.

## Requirements

1. Create a component with three switchable sections: "CI Pipeline", "Caching", "Matrix Builds"
2. The "CI Pipeline" section: a list of 6 stages (Lint, Build, Test, Scan, Push, Deploy) — each with a name, icon, description, tools, and estimated execution time
3. Clicking a stage expands detailed information with tools (displayed as badges) and a "Show config" button
4. A "Run Pipeline" button animates sequential progression through the stages (green = passed, yellow = in progress)
5. The "Caching" section: a table of cache types (gha, registry, local, s3) with a description, pros and cons
6. A block with an example of using cache-from/cache-to and an explanation of `mode=max`
7. The "Matrix Builds" section: 3 examples of matrix strategy (multiplatform, multiple versions, include/exclude)

## Hints

- `useState<'pipeline' | 'cache' | 'matrix'>` for switching sections
- `useState<number | null>` for the expanded stage
- `setInterval` for the pipeline animation with cleanup at the end
- Array of objects for stages: `{ name, icon, description, tools, duration, config }`
- Inline styles for all styling

## Checklist

- [ ] Three sections switch correctly
- [ ] 6 pipeline stages with descriptions and tools
- [ ] "Show config" button works independently for each stage
- [ ] "Run Pipeline" animation progresses through all stages sequentially
- [ ] Cache types table (at least 4 types) with pros and cons
- [ ] cache-from/cache-to example with mode=max explanation
- [ ] 3 matrix strategy examples with configuration

## How to Verify

1. Switch sections — the content changes correctly
2. In "CI Pipeline", click on stages — details with tools expand
3. Click "Show config" — YAML configuration is displayed
4. Click "Run Pipeline" — stages sequentially turn yellow, then green
5. In "Caching", the table with 4+ types and a usage example are visible
6. In "Matrix Builds", 3 examples with YAML configuration are visible
