# Task 3.2: Custom Variables and Priority Visualizer

## Goal

Create an interactive visualizer of GitLab CI variable priority chains. The user sets a variable value at different levels and sees which value "wins" in the end.

## Requirements

1. Display 5 variable levels as a vertical chain (or horizontal stack):
   - Instance (lowest priority)
   - Group
   - Project
   - Global `.gitlab-ci.yml` (global `variables:`)
   - Job (highest priority)
2. At each level — an input field for the `APP_ENV` variable value
3. "Determine Winner" button — finds the level with the highest priority that has a value set
4. The "winner" is visually highlighted (border, color, icon)
5. Show the resulting value large and clearly
6. "Reset" button — clears all fields

## Checklist

- [ ] 5 levels with input fields and labels
- [ ] Level order matches real GitLab CI priority
- [ ] Visual separation of levels (background, border, label color)
- [ ] "Determine Winner" button finds the correct level
- [ ] Winning level is highlighted (e.g., green border and "WINNER" badge)
- [ ] Resulting value is shown as a separate block
- [ ] Warning when no value is set anywhere
- [ ] "Reset" button works

## How to Verify

1. Set value only at Instance level → winner is Instance
2. Set values at Instance and Project → winner is Project
3. Set values at all levels → winner is Job
4. Set values at Global and Pipeline → winner is Pipeline
5. Press "Reset" → all fields are cleared, result is reset

## Hints

- Store levels as an array of objects: `{ id, label, priority, value }`. Higher `priority` = higher precedence
- To find the winner: filter levels with non-empty `value`, then find the maximum `priority` via `reduce` or `sort`
- Use a single `useState` to store all level values: an object `{ instance: '', group: '', project: '', global: '', job: '' }`
- Visual winner highlight: add conditional style `border: winnerId === level.id ? '2px solid #2E7D32' : '2px solid transparent'`
