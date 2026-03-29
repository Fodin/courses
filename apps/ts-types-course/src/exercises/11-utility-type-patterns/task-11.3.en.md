# Task 11.3: DeepPick & DeepOmit

## Goal

Implement recursive versions of `Pick` and `Omit` that work with nested paths in `'user.address.city'` format.

## Requirements

1. Implement `DeepPick<T, Paths>` — extracts nested properties by dot-path
2. Implement `UnionToIntersection<U>` — helper type for merging results
3. Implement `DeepPickMulti<T, Paths>` — DeepPick for multiple paths simultaneously
4. Implement `DeepOmit<T, Paths>` — removes nested properties by dot-path
5. Implement `PathsOf<T>` — generates all valid paths in an object
6. Show runtime analogs: `deepPick(obj, path)` and `deepOmit(obj, path)`

## Checklist

- [ ] `DeepPick<User, "address.city">` = `{ address: { city: string } }`
- [ ] `DeepPick<User, "profile.settings.theme">` works at 3+ nesting levels
- [ ] `DeepPickMulti<User, "id" | "address.city">` = intersection of results
- [ ] `DeepOmit<User, "profile.bio">` removes nested property while preserving others
- [ ] `PathsOf<User>` generates all valid dot-paths
- [ ] Runtime functions work correctly with objects

## How to Verify

1. Check `DeepPick` with a non-existent path — should be `never`
2. Check that `DeepOmit` doesn't affect sibling properties
3. Verify `PathsOf` includes both intermediate (`"profile"`) and leaf (`"profile.avatar"`) paths
