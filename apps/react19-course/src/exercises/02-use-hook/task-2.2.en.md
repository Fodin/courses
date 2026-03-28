# Task 2.2: use(Context)

## Objective

Replace `useContext` with the new `use()` for reading context, using the simplified provider syntax from React 19.

## Requirements

1. Create a `ThemeContext` using `createContext`
2. Create a child component that reads the theme via `use(ThemeContext)`
3. Use the new provider syntax: `<ThemeContext value={...}>` instead of `<ThemeContext.Provider>`
4. Add a theme toggle button (light/dark)
5. The child component should change its styles based on the current theme

## Checklist

- [ ] `createContext` creates the theme context
- [ ] `use(ThemeContext)` is used instead of `useContext(ThemeContext)`
- [ ] The provider uses `<ThemeContext value={...}>` (React 19 syntax)
- [ ] The button toggles the theme
- [ ] The component's styles change when the theme is switched

## How to Verify

1. The component renders with the light theme
2. Pressing the button switches to the dark theme and back
