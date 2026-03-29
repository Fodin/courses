# Task 10.3: Dependency Inversion

## 🎯 Goal

Apply the Dependency Inversion Principle: business logic depends on abstractions (ports), and concrete implementations (adapters) are injected externally.

## Requirements

1. Create port interfaces:
   - `Logger` — `info`, `error`, `warn`
   - `Cache<T>` — `get`, `set`, `delete`, `clear`
   - `NotificationService` — `sendEmail`, `sendPush`
   - `UserStore` — `findById`, `save`
2. Create `UserServiceDeps` — an object with all dependencies
3. Implement `createUserService(deps)`:
   - `getUser` — checks cache, then store, caches the result
   - `updateUser` — updates, invalidates cache, sends notification
4. Create adapters: `createConsoleLogger`, `createMemoryCache`, `createMockNotifications`, `createMemoryUserStore`
5. Adapters must be swappable without changing business logic

## Checklist

- [ ] `UserService` depends on interfaces, not concrete classes
- [ ] `Logger`, `Cache`, `NotificationService`, `UserStore` are pure interfaces
- [ ] `createUserService` accepts deps: UserServiceDeps
- [ ] `getUser` uses cache.get -> store.findById -> cache.set
- [ ] `updateUser` calls cache.delete (invalidation) and notifications.sendEmail
- [ ] Adapters fully implement their respective interfaces

## How to Verify

Create UserService with in-memory adapters. Call `getUser` twice — first time should hit the store, second time the cache (verify through logger). Replace one adapter — the service should continue working.
