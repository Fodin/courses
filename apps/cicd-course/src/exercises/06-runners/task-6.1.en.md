# Task 6.1: Runners and Executors Catalog

## Goal

Create an interactive GitLab Runner executor catalog with cards, comparison table, and filtering by criteria.

## Requirements

1. Define an `Executor` interface with properties:
   - `id: string` — unique identifier (docker, shell, kubernetes, docker-machine)
   - `name: string` — display name
   - `description: string` — brief description of how it works
   - `pros: string[]` — list of advantages
   - `cons: string[]` — list of disadvantages
   - `useCases: string[]` — when to use
   - `isolation: 'full' | 'partial' | 'none'` — isolation level
   - `speed: 'fast' | 'medium' | 'slow'` — startup speed
   - `complexity: 'low' | 'medium' | 'high'` — setup complexity

2. Create data for 4 executors: Docker, Shell, Kubernetes, Docker Machine

3. Implement card display (2 per row) with:
   - Name and description
   - Badges for isolation / speed / complexity
   - Lists of pros (✅) and cons (❌)
   - Collapsible "Use cases" section

4. Add filtering by isolation level (All / Full / Partial / None)

5. Add a comparison table at the bottom with columns: Executor, Isolation, Speed, Complexity, Requires Docker

6. On card click — highlight it (selected state) and show a config.toml example for that executor

## Expected Result

- Cards with visual characteristic indicators
- Working isolation filter
- Comparison table
- On executor selection — config example

## Checklist

- [ ] `Executor` interface with typed isolation/speed/complexity fields
- [ ] Data for all 4 executors
- [ ] Cards display pros, cons, badges
- [ ] Isolation filter works correctly
- [ ] Table shows comparison of all 4 executors
- [ ] Clicking a card shows config.toml example
- [ ] All code is typed, no `any`

## How to Verify

Click the "Docker" card — a config.toml example with `executor = "docker"` should appear at the bottom. Select filter "None" — only the Shell executor card should remain. The table should always show 4 rows regardless of the filter.
