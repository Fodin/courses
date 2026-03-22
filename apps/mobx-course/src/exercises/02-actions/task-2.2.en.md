# Task 2.2: runInAction

## Goal
Use `runInAction` to update state after an async operation.

## Requirements

- [ ] Create a `UserLoaderStore` class with `user`, `loading`, `error` fields
- [ ] Use `makeAutoObservable(this)` in the constructor
- [ ] Add an async `loadUser(id)` method with simulated loading (setTimeout/Promise)
- [ ] Before await, set `loading = true` (inside action — OK)
- [ ] After await, wrap state updates in `runInAction(() => { ... })`
- [ ] Handle errors in catch, also via `runInAction`
- [ ] Wrap the component with `observer`, add a load button
