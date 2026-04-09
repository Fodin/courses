# Task 0.2: Container/Presentational separation

## Goal

Split the monolithic `UserProfile` into two components: `UserProfileContainer` (loads and stores data) and `UserProfileView` (display only). This is the classic Smart/Dumb components pattern.

## Requirements

1. Create a `User` interface with fields: `id`, `name`, `email`, `role`, `avatar`, `isOnline`, `joinedAt`
2. Create `UserProfileView` — a dumb component that accepts `user: User` and displays the profile. It has no state, no fetch, no side effects
3. Create `UserProfileContainer` — a smart component that:
   - Stores `user`, `loading`, `error` in state
   - Simulates data loading (setTimeout 1 second)
   - Shows a spinner during loading
   - Shows an error message on error
   - Renders `UserProfileView` with the loaded data
4. The `Task0_2` component renders `UserProfileContainer`
5. Add a "Reload" button in the container to re-simulate loading

## Hints

- `UserProfileView` is maximally "dumb": only props → JSX. It can be tested without any mocks
- `UserProfileContainer` manages the data lifecycle: loading, success, error
- Use `useEffect` to simulate loading (setTimeout inside)
- The "Reload" button should reset state and trigger loading again

## Checklist

- [ ] `User` interface defined with all fields
- [ ] `UserProfileView` has no state and side effects
- [ ] `UserProfileContainer` manages `loading`, `error`, `user`
- [ ] A loading indicator is shown during loading (text or animation)
- [ ] An error message is displayed on "error" (can be simulated randomly)
- [ ] "Reload" button works
- [ ] `Task0_2` renders the container

## How to check yourself

1. On first render, "Loading..." should appear
2. After a second, the user profile should appear
3. Click "Reload" — "Loading..." appears again, then the profile
4. Try passing `UserProfileView` directly with a hardcoded object — it should work without the container
