# Task 0.1: Upgrading to React 19

## Objective

Create a component that visually demonstrates the upgrade process from React 18 to React 19.

## Requirements

1. Create two sections: **"Before upgrade"** and **"After upgrade"**
2. In each section, show the contents of `package.json` (dependencies)
3. Show which packages need to be updated:
   - `react` — 18.x → 19.x
   - `react-dom` — 18.x → 19.x
   - `@types/react` — 18.x → 19.x
   - `@types/react-dom` — 18.x → 19.x
4. Add a button to reveal the update commands (`npm install ...`)
5. List additional packages that need to be updated (eslint-plugin, testing-library, etc.)

## Hints

- Use `useState` to toggle the command display
- Version data can be stored as objects
- Use `JSON.stringify(obj, null, 2)` for pretty-printed JSON output

## Checklist

- [ ] Two sections "Before" and "After" with package versions
- [ ] Button to show/hide upgrade commands
- [ ] List of `npm install` commands
- [ ] Mention of additional dependencies
