# Task 0.3: Discriminated Unions

## Objective

Learn to use discriminated unions and exhaustive checks for safe handling of all variants.

## Requirements

1. Create an application event system:
   - `ClickEvent` — with coordinates `x`, `y` and `target`
   - `SubmitEvent` — with `formId` and `data`
   - `NavigateEvent` — with `from` and `to`
2. Combine into an `AppEvent` type with a `type` discriminant
3. Create a function `handleEvent(event: AppEvent): string` with a `switch` on `type`
4. Add an exhaustive check via `never` in `default`
5. Create a `formatEvent` function with formatting for each event type
6. Process an array of different events

## Checklist

- [ ] Three event types with a shared `type` discriminant
- [ ] `switch` correctly narrows types in each `case`
- [ ] `default` contains an exhaustive check via `never`
- [ ] All events from the array are processed and displayed
