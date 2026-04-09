# Task 0.3: CI/CD tools landscape

## Goal

Study the main CI/CD tools and their characteristics. Implement interactive cards with the ability to filter and compare tools by key parameters.

---

## What to do

Create a `Task0_3` component that displays CI/CD tool cards with filtering and comparison.

### Requirements

1. Define a TypeScript interface `CITool` with fields:
   - `id` — unique identifier
   - `name` — tool name
   - `type` — type: `'saas' | 'self-hosted' | 'both'`
   - `free` — availability of a free plan (boolean)
   - `configFile` — configuration file name (string)
   - `ecosystem` — ecosystem level: `'small' | 'medium' | 'large'`
   - `setupComplexity` — setup complexity: `'low' | 'medium' | 'high'`
   - `bestFor` — array of strings (use cases)
   - `pros` — array of strings (advantages)
   - `cons` — array of strings (disadvantages)
   - `color` — card color (hex)

2. Create a `tools` array with data for 5 tools:
   - GitHub Actions
   - GitLab CI
   - Jenkins
   - CircleCI
   - Travis CI

3. Implement a state for filtering by type (`'all' | 'saas' | 'self-hosted'`)

4. Implement a `selectedTool` state — stores the id of the selected tool for detailed view or `null`

5. Display filter buttons: "All", "SaaS", "Self-hosted"

6. Display tool cards in a grid (flex wrap). Each card contains:
   - Name and type (SaaS/Self-hosted badge)
   - Free plan icon (if available)
   - Setup complexity (colored dots or scale)
   - "Details" button

7. Clicking "Details" shows a detailed panel with:
   - Configuration file
   - List of pros and cons
   - Use cases (bestFor)

---

## Expected result

- Type filtering buttons (All / SaaS / Self-hosted)
- Card grid with basic information
- Detail panel on card click
- Visual setup complexity indicators

---

## Checklist

- [ ] `CITool` interface defined with all fields
- [ ] `tools` array created with data for 5 tools
- [ ] Type filtering implemented (All / SaaS / Self-hosted)
- [ ] Cards displayed in a grid
- [ ] Each card contains type badge and complexity indicator
- [ ] "Details" click opens a detailed panel
- [ ] Details show pros, cons, and use cases
- [ ] Component is correctly typed (no `any`)

---

## How to check yourself

1. Open the component — do you see cards for all 5 tools?
2. Press the "SaaS" filter — only GitHub Actions, GitLab CI (saas), CircleCI remain?
3. Press the "Self-hosted" filter — only Jenkins and GitLab CI (both) remain?
4. Click "Details" on Jenkins — do you see high setup complexity and the pros/cons list?
5. Click "Details" on GitHub Actions — configuration file `.github/workflows/*.yml`?
