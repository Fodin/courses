# Task 7.2: flow generators

## Goal

Master `flow` — an alternative to `async/await` that automatically wraps code between `yield` in an action context.

## Requirements

Create a `UserStoreFlow` store, similar to Task 7.1, but using `flow`:

1. Declare observable fields: `users: User[]`, `isLoading: boolean`, `error: string | null`
2. Use `makeAutoObservable` in the constructor
3. Implement `fetchUsers` via `flow(function* (...) { ... })`:
   - Use `yield` instead of `await`
   - **Do not** use `runInAction` — flow handles this automatically
   - Explicitly type `this`: `function* (this: UserStoreFlow)`
   - Handle errors in `try/catch`
4. Create an observer component with a button and list

```typescript
import { flow } from 'mobx'

// flow usage pattern:
fetchUsers = flow(function* (this: UserStoreFlow) {
  // yield instead of await
  // runInAction is not needed
})
```

## Checklist

- [ ] `UserStoreFlow` store created with `makeAutoObservable`
- [ ] `fetchUsers` declared via `flow(function* (...) { ... })`
- [ ] Uses `yield` instead of `await`
- [ ] `runInAction` is **not** used
- [ ] `this` is typed in the generator
- [ ] Error handling in `try/catch`

## How to verify

1. Click "Fetch Users (flow)" — behavior is identical to Task 7.1
2. No MobX errors in the console
3. No `runInAction` in the code — flow manages the context itself
