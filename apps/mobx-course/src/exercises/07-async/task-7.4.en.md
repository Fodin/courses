# Task 7.4: Loading and Cache

## Goal

Implement a store with data caching — load data only if it's stale.

## Requirements

Create a `CachedUserStore` store with caching logic:

1. Declare observable fields:
   - `users: User[]` — user list
   - `isLoading: boolean` — loading indicator
   - `lastFetchedAt: number | null` — timestamp of the last fetch
   - `maxAge: number` — cache lifetime in milliseconds (default 5000)
2. Implement computed `isStale`:
   - Returns `true` if `lastFetchedAt === null`
   - Returns `true` if `Date.now() - lastFetchedAt > maxAge`
   - Otherwise `false`
3. Implement `async fetchIfNeeded()`:
   - If `!this.isStale` — exit the method (data is fresh)
   - Otherwise — load users and update `lastFetchedAt`
   - Use `runInAction` after `await`
4. Implement action `invalidate()` — reset `lastFetchedAt = null`
5. In the component, show:
   - A "Fetch if needed" button
   - An "Invalidate cache" button
   - Status: stale or how many seconds until stale

```typescript
class CachedUserStore {
  // ...
  get isStale(): boolean { /* computed */ }
  async fetchIfNeeded(): Promise<void> { /* ... */ }
  invalidate(): void { /* action */ }
}
```

## Checklist

- [ ] `CachedUserStore` with `makeAutoObservable`
- [ ] `isStale` — computed property
- [ ] `fetchIfNeeded` loads data only when `isStale === true`
- [ ] `lastFetchedAt` is updated after a successful fetch
- [ ] `invalidate()` resets `lastFetchedAt`
- [ ] Pressing "Fetch if needed" again doesn't reload fresh data

## How to verify

1. Click "Fetch if needed" — data loads
2. Click again immediately — no loading occurs (data is fresh)
3. Wait 5 seconds and click again — loading happens (data is stale)
4. Click "Invalidate cache" — status becomes Stale
5. Next "Fetch if needed" click loads data again
