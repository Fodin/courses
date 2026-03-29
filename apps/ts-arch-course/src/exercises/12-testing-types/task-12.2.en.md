# Task 12.2: Type-Safe Fixtures

## Goal

Build a fixture factory with typed partial overrides, deep merge for nested objects, auto-increment, and support for entity relationships.

## Requirements

1. Create a `DeepPartial<T>` type that recursively makes all fields optional
2. Implement `FixtureFactory<T>` with methods: `build(overrides?)`, `buildMany(count, overrides?)`, `buildWith(key, value)`, `reset()`
3. Implement `createFixtureFactory(defaults, sequenceKey?)` with deep merge and auto-increment
4. Create factories for `User`, `Post`, `Comment` with different fields
5. Demonstrate: creating with defaults, partial overrides (including nested), `buildMany`, entity relationships

## Checklist

- [ ] `DeepPartial` works for nested objects (settings.theme without settings.notifications)
- [ ] `build()` with no arguments returns an object with defaults
- [ ] `build({ role: 'admin' })` overrides only role
- [ ] Deep merge: `build({ settings: { theme: 'dark' } })` preserves notifications
- [ ] `buildMany(3)` creates 3 objects with unique ids
- [ ] `buildWith('status', 'published')` is a type-safe shortcut
- [ ] Relationships: post.authorId === user.id

## How to Verify

1. Create a user with defaults, then with partial override -- verify deep merge
2. Call `buildMany(3)` -- ids should be unique
3. Create related data: user -> post -> comments
4. Reset the factory via `reset()` -- the id counter should restart
