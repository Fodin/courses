# Task 4.2: withAuth — Authorization HOC via Context

## Goal

Implement an HOC `withAuth<P>` that checks user authorization via React Context and either renders the component or a stub prompting the user to log in.

## Requirements

1. Create `AuthContext` using `React.createContext`. Context value type:
   ```ts
   interface AuthContextValue {
     isAuthenticated: boolean
     user: { name: string; role: 'admin' | 'user' } | null
     login: () => void
     logout: () => void
   }
   ```
2. Create `AuthProvider` — provider component that manages authorization state (`useState` is enough for demo)
3. Implement HOC `withAuth<P>(Component, options?)`:
   - Reads `isAuthenticated` from `AuthContext` via `useContext`
   - If not authorized — renders a stub component (LoginPrompt) with "Log in" button
   - If authorized — renders the original `Component` with its props
   - Optional: accepts `options.requiredRole` — if role doesn't match, shows "Access denied"
4. Set `displayName` in format `withAuth(ComponentName)`
5. Demonstrate: `Dashboard` and `AdminPanel` wrapped with `withAuth`. `AdminPanel` requires `admin` role. Add buttons "Log in as user" / "Log in as admin" / "Log out"

## Hints

- HOCs can use hooks (`useContext`) — that's fine because the returned function is a React component
- `useContext` must be called inside the returned component, not in the HOC factory function itself
- For `AuthProvider`, `useMemo` for provider value is convenient
- `options` is passed to the factory function, not the component: `withAuth(Dashboard, { requiredRole: 'admin' })`

## Checklist

- [ ] `AuthContext` is typed and created
- [ ] `AuthProvider` manages login/logout state
- [ ] HOC reads context via `useContext`
- [ ] Unauthorized user sees stub with "Log in" button
- [ ] `displayName` is set correctly
- [ ] Demo with role switching works
- [ ] Optional role check (AdminPanel accessible only to admin)

## How to check yourself

1. Open the page — both components show a stub (not authorized)
2. Click "Log in as user" — Dashboard opens, AdminPanel shows "Access denied"
3. Click "Log in as admin" — both components open
4. Click "Log out" — both components show stubs again
