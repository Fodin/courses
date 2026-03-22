# Task 2.1: Action basics

## Goal
Set up `enforceActions: 'always'` and wrap mutations in action methods.

## Requirements

- [ ] Call `configure({ enforceActions: 'always' })` from `mobx`
- [ ] Create a `CounterStore` class with `count = 0` and a `history` array
- [ ] Use `makeAutoObservable(this)` in the constructor
- [ ] Add an `increment()` method — increases count and pushes to history
- [ ] Add a `decrement()` method — decreases count and pushes to history
- [ ] Add a `reset()` method — resets count and history
- [ ] Wrap the component with `observer` and connect buttons
