# Task 3.1: Predefined Variables Catalog

## Goal

Create an interactive catalog of predefined GitLab CI variables with category filtering and search. This exercise will help memorize which variables exist and what they are used for.

## Requirements

1. Display at least 20 predefined variables as a table or cards
2. Each variable should include:
   - Variable name (e.g., `CI_COMMIT_SHA`)
   - Category (commit, pipeline, job, project, runner, merge-request)
   - Description in English
   - Example value
3. Implement category filtering via filter buttons
4. Implement search by variable name and description (case-insensitive)
5. When "All" category is selected, display all variables
6. Show the count of found variables

## Checklist

- [ ] Array with 20+ variables, each with fields: name, category, description, example
- [ ] Filter buttons for 6 categories + "All" button
- [ ] Active category is visually highlighted
- [ ] Search field filters in combination with category
- [ ] Counter "Found: N variables"
- [ ] Informative message when search returns no results
- [ ] Variable names in monospace font

## How to Verify

1. Select the "commit" category — only CI_COMMIT_* variables should display
2. Search for "sha" — CI_COMMIT_SHA and CI_COMMIT_SHORT_SHA should appear
3. Select "project" category and search for "registry" — only project variables related to registry should appear
4. Clear the search — all variables of the selected category should return
5. Select "merge-request" — CI_MERGE_REQUEST_* variables should appear

## Hints

- Use `useState` to store the active category and search string
- Apply `Array.filter()` sequentially: first by category, then by search string
- The `toLowerCase()` method helps with case-insensitive search
- Use conditional styling to highlight the active filter button: `backgroundColor: activeCategory === cat ? '#1565C0' : '#e0e0e0'`
