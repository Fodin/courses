# Task 12.1: DatePicker in Controlled and Uncontrolled modes

## Goal

Implement a `DatePicker` component with full calendar UI that works correctly in both modes. TypeScript must require `onChange` when passing `value` (controlled) and forbid mixing modes.

## Requirements

1. `DatePickerProps` type — discriminated union: `ControlledProps | UncontrolledProps`
2. `ControlledProps`: `value: Date`, `onChange: (date: Date) => void`, `defaultValue?: never`
3. `UncontrolledProps`: `defaultValue?: Date`, `value?: never`, `onChange?: never`
4. `useControllableState` hook abstracts both modes — component doesn't know which mode it works in
5. UI: calendar grid (7 × 5 or 7 × 6 cells), month navigation (previous / next)
6. Selected date is highlighted, today's date is marked
7. Demo shows both modes simultaneously: controlled with external state + uncontrolled

## Hints

- `useControllableState<T>(controlled, defaultVal, onChange)` — returns `[value, setValue]`
- For generating month days: `new Date(year, month + 1, 0).getDate()` — number of days
- For determining first day of week: `new Date(year, month, 1).getDay()`
- TypeScript won't let you pass `href` where `Date` is expected — that's fine

## Checklist

- [ ] `ControlledProps` requires both `value` and `onChange`
- [ ] `UncontrolledProps` requires neither `value` nor `onChange`
- [ ] TypeScript: passing `value` without `onChange` — compile error
- [ ] TypeScript: mixing `value` and `defaultValue` — compile error
- [ ] `useControllableState` hook works in both modes
- [ ] Calendar grid displays correct days (first day in correct column)
- [ ] Month navigation works (forward / back)
- [ ] Selected date visually highlighted
- [ ] Today's date marked (circle or other way)
- [ ] Demo: two `DatePicker` side by side — controlled and uncontrolled

## How to check yourself

Open the assignment. You should see:
- Controlled DatePicker: on date selection — value updates from outside
- Uncontrolled DatePicker: stores selection independently
- Both show correct day grid with month navigation

Check TypeScript: try passing `value` without `onChange` — should be an error.
