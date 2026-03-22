# Task 4.1: autorun — Theme Store

## Goal

Create a theme store and set up an `autorun` that applies a CSS class to `document.body` every time the theme changes.

## Requirements

1. Create a `ThemeStore` class with an observable field `theme: 'light' | 'dark'` (default `'light'`)
2. Add a `toggleTheme()` method — toggles between `'light'` and `'dark'`
3. Add a `setTheme(value)` method — sets a specific theme
4. In the component, create an `autorun` inside `useEffect` that:
   - Reads `themeStore.theme`
   - Removes `theme-light` and `theme-dark` classes from `document.body`
   - Adds `theme-${theme}` class to `document.body`
   - Writes an entry to the log
5. Return the disposer in the `useEffect` cleanup function
6. In cleanup, also remove the CSS classes from `document.body`
7. Wrap the component in `observer`

## Checklist

- [ ] `ThemeStore` created with `makeAutoObservable`
- [ ] `autorun` runs immediately on mount and applies the initial theme
- [ ] Clicking the Toggle Theme button toggles the theme and `autorun` applies the new class
- [ ] Disposer is called in the `useEffect` cleanup
- [ ] CSS classes are cleaned up on unmount

## How to verify

1. Open DevTools → Elements → `<body>`. On mount, `body` should have the `theme-light` class
2. Click Toggle Theme — the class should change to `theme-dark`
3. Check the log in the component — the first entry should appear immediately (autorun runs on creation)
4. Each button click adds a new log entry
