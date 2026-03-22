# Task 2.3: Bound actions

## Goal
Use `autoBind: true` so methods don't lose `this` when passed as callbacks.

## Requirements

- [ ] Create a `TimerStore` class with `seconds` and `running` fields
- [ ] Use `makeAutoObservable(this, {}, { autoBind: true })`
- [ ] Add a `start()` method — starts `setInterval` with `this.tick`
- [ ] Add a `tick()` method — increments `seconds` by 1
- [ ] Add a `stop()` method — clears the interval
- [ ] Add a `reset()` method — stops and resets seconds
- [ ] Add a `formatted` getter — format `MM:SS`
- [ ] Pass methods directly to `onClick` (without arrow function wrappers)
