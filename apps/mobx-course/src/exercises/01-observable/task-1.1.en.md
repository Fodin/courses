# Task 1.1: makeAutoObservable

## Goal
Refactor a store to use `makeAutoObservable` instead of explicit annotations.

## Requirements

- [ ] Create `TemperatureStore` with `celsius` field
- [ ] Use `makeAutoObservable(this)` in constructor
- [ ] Add `setCelsius(value)` method
- [ ] Add `fahrenheit` getter — formula: `celsius * 9/5 + 32`
- [ ] Add `description` getter — 'Freezing' / 'Cold' / 'Comfortable' / 'Hot'
- [ ] Wrap component with `observer` and display data
