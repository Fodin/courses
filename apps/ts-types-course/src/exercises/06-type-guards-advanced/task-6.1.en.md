# Task 6.1: Custom Type Predicates

## Goal

Learn to create reusable type guard functions with `is` predicates for type narrowing.

## Requirements

1. Create `User`, `Admin` (extends User), `Guest` interfaces and an `Actor` union type
2. Implement type guard functions `isUser`, `isAdmin`, `isGuest` with correct runtime checks and `actor is Type` return type
3. Create a generic type guard `isNotNull<T>(value: T | null | undefined): value is T` for array filtering
4. Implement composable guards: `isString`, `isNumber`, `isNonEmptyString` — where complex guards are built from simpler ones
5. Demonstrate using type predicates with `Array.filter` to narrow element types
6. Create a guard for API response validation: `isSuccessResponse(resp): resp is SuccessResponse`

## Checklist

- [ ] `isAdmin`, `isUser`, `isGuest` correctly check runtime properties
- [ ] Type predicates (`is`) are specified in the return type of each guard
- [ ] `isNotNull` works with `Array.filter` to narrow array type
- [ ] Composable guards are built from simpler guards
- [ ] API guard checks status and data presence
- [ ] Results are displayed on the page

## How to verify

1. Click the "Run" button
2. Verify that `isAdmin` returns `true` for an object with `role: 'admin'`
3. Verify that `filter(isNotNull)` removes `null` and `undefined` from the array
4. Check that `filter(isNonEmptyString)` filters out empty strings and non-strings
