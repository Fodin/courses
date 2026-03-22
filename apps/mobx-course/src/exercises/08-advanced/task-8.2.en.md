# Task 8.2: intercept & observe

## Goal

Learn to use `intercept` to validate changes before they are applied and `observe` to log changes after they are applied.

## Requirements

Create an `AgeStore` with interception and observation:

1. Observable property `age` (initial value: 25)
2. Observable array `log` for recording events
3. `intercept` on the `age` property:
   - Block values less than 0 or greater than 150
   - On block, add a log entry: `[intercept] Blocked: <value> (out of range 0-150)`
   - Return `null` to cancel the change
4. `observe` on the `age` property:
   - On successful change, add an entry: `[observe] age: <oldValue> -> <newValue>`
5. Method `setAge(value)` to set the value
6. Method `clearLog()` to clear the log
7. UI: input field, buttons for test values (-5, 200), log panel

```typescript
class AgeStore {
  age: number
  log: string[]
  setAge(value: number): void
  clearLog(): void
}
```

## Checklist

- [ ] `AgeStore` created with `makeAutoObservable`
- [ ] `intercept` blocks values outside the 0-150 range
- [ ] Blocked changes are logged with `[intercept]` label
- [ ] `observe` logs successful changes with `[observe]` label
- [ ] The `age` value doesn't change when attempting to set an invalid value
- [ ] "Set -5" and "Set 200" buttons demonstrate blocking

## How to verify

1. Enter a valid value (e.g., 30) — an `[observe]` entry should appear in the log
2. Click "Set -5" — an `[intercept] Blocked` entry should appear, `age` value doesn't change
3. Click "Set 200" — similarly, the value is blocked
4. Click "Clear log" — the log should clear
