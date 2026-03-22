# Task 7.1: Async + runInAction

## Goal

Learn to correctly update observable state after asynchronous operations using `runInAction`.

## Requirements

Create a `UserStoreAsync` store that loads a list of users from the server:

1. Declare observable fields: `users: User[]`, `isLoading: boolean`, `error: string | null`
2. Use `makeAutoObservable` in the constructor
3. Implement an `async fetchUsers()` method:
   - Before `await`, set `isLoading = true` and `error = null`
   - Call `mockApi.fetchUsers()` via `await`
   - After `await`, wrap updates in `runInAction`:
     - Write the received users to `this.users`
     - Set `isLoading = false`
   - In `catch`, wrap updates in `runInAction`:
     - Write the error to `this.error`
     - Set `isLoading = false`
4. Create an observer component with a "Fetch Users" button and a user list

```typescript
interface User {
  id: string
  name: string
  email: string
}
```

## Checklist

- [ ] `UserStoreAsync` store created with `makeAutoObservable`
- [ ] `fetchUsers` is an async method
- [ ] Updates after `await` are wrapped in `runInAction`
- [ ] Error handling in `catch` is also wrapped in `runInAction`
- [ ] Button is disabled during loading
- [ ] Error is displayed in the UI

## How to verify

1. Click "Fetch Users" — a loading indicator should appear
2. After ~1 second, a list of 3 users should appear
3. The button is disabled during loading
4. No MobX errors about changes outside of actions in the console
