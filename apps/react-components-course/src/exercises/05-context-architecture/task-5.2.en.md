# Task 5.2: Split monolithic AppContext into 4 contexts

## Goal

Take a ready-made monolithic `AppContext` (user + theme + locale + notifications in one) and split it into 4 independent contexts. Prove the optimization with render counters.

## Requirements

1. Take the monolithic `AppContext` from the template and split it into 4 independent providers:
   - `UserProvider` — `{ user, setUser }`
   - `ThemeProvider` — `{ mode, setMode }`
   - `LocaleProvider` — `{ locale, setLocale }`
   - `NotificationsProvider` — `{ notifications, addNotification, dismissNotification }`

2. Create each provider via `createStrictContext<T>` from task 5.1 (or implement a similar one directly in the file).

3. Each provider memoizes value via `useMemo`.

4. Implement 4 demo components, each reading only its "own" context:
   - `UserWidget` — shows user name
   - `ThemeWidget` — shows and toggles theme
   - `LocaleWidget` — shows and toggles locale
   - `NotificationsWidget` — shows list and "Add notification" button

5. Add a render counter to each widget via `useRef`:
   - `const renderCount = useRef(0); renderCount.current += 1`
   - Display the counter in the corner: `Renders: {renderCount.current}`

6. Demonstrate isolation: when clicking "Add notification", the counter should grow only for `NotificationsWidget`, not for `UserWidget`, `ThemeWidget`, and `LocaleWidget`.

## Hints

- `useRef` for the counter — specifically `useRef`, not `useState`. `useState` would trigger an extra render
- Counter in `useRef` increments on every component function call, which is the render
- When changing theme — only `ThemeWidget` should increase its render counter

## Checklist

- [ ] 4 separate contexts: User, Theme, Locale, Notifications
- [ ] Each provider uses `useMemo` to memoize value
- [ ] Each widget subscribes only to its "own" context
- [ ] Render counter via `useRef` in each widget
- [ ] When adding notification — only `NotificationsWidget` re-renders
- [ ] When changing theme — only `ThemeWidget` re-renders
- [ ] No `any` in types

## How to check yourself

Open the assignment in the browser. You'll see 4 widgets with render counters.

1. Click "Add notification" several times — counter should grow only for `NotificationsWidget`
2. Click "Change theme" — counter should grow only for `ThemeWidget`
3. Click "Change locale" — counter should grow only for `LocaleWidget`

If all counters grow when adding notifications — the contexts are not separated (or the monolithic AppContext is still in use).
