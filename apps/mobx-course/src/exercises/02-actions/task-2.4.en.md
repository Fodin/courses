# Task 2.4: Batching

## Goal
Verify that multiple mutations in a single action trigger only one re-render.

## Requirements

- [ ] Create a `ProfileStore` class with `firstName`, `lastName`, `age` fields
- [ ] Use `makeAutoObservable(this)` in the constructor
- [ ] Add an `updateProfile(first, last, age)` method — updates all 3 fields
- [ ] Add a `fullName` getter
- [ ] In the component, use `useRef` to count re-renders
- [ ] Wrap the component with `observer`
- [ ] Verify that clicking a button increments the render counter by 1 (not 3)
