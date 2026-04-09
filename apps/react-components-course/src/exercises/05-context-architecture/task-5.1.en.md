# Task 5.1: createStrictContext Factory

## Goal

Implement a universal generic factory `createStrictContext<T>` that creates a type-safe context with a hook that throws a clear error when used outside a provider. Apply the factory to create `ThemeContext` and `UserContext`.

## Requirements

1. Implement the function `createStrictContext<T>(displayName: string)`, which:
   - Creates `React.createContext<T | undefined>(undefined)`
   - Sets `Context.displayName = displayName` for React DevTools
   - Creates a hook `useCtx(): T` that throws an `Error` if the value is `undefined`
   - Returns a tuple `[Context, useCtx] as const`

2. Using the factory, create `ThemeContext` and `ThemeProvider`:
   - Value type: `{ mode: 'light' | 'dark'; toggleMode: () => void }`
   - Provider memoizes value via `useMemo`
   - Export hook `useTheme`

3. Using the factory, create `UserContext` and `UserProvider`:
   - Value type: `{ user: { name: string; role: string } | null; login: (name: string) => void; logout: () => void }`
   - Provider memoizes value via `useMemo`
   - Export hook `useUser`

4. Demonstrate usage:
   - `ThemeDemo` component uses `useTheme()` and shows current theme with toggle button
   - `UserDemo` component uses `useUser()` and shows login form or user data
   - Both components are wrapped in their respective providers

5. Demonstrate error outside provider:
   - Add a "Trigger error" button — it should show an `ErrorBoundary` with a clear message

## Hints

- `as const` in the factory return value preserves tuple type, not array
- Error message should hint which Provider was forgotten
- `useMemo` in the provider takes dependencies only from data that changes

## Checklist

- [ ] `createStrictContext<T>` — generic function, accepts `displayName: string`
- [ ] Hook throws `Error` with clear message when called outside provider
- [ ] `Context.displayName` is set
- [ ] `ThemeProvider` memoizes value via `useMemo`
- [ ] `UserProvider` memoizes value via `useMemo`
- [ ] `ThemeDemo` shows current theme and toggle button
- [ ] `UserDemo` shows login form and user data
- [ ] No `any` in types

## How to check yourself

Open the assignment in the browser. You should see:
- Theme block with "Toggle theme" button — on click, text changes from "Light" to "Dark"
- User block with name input and "Log in" button — after login, name and role are shown
- On clicking "Trigger error" — ErrorBoundary shows a message about a forgotten provider

Try removing the provider wrapper and make sure the hook throws an error with clear text.
