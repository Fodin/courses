# Task 8.4: Effect Pattern

## Objective

Implement the Effect pattern — lazy computations with typed dependencies (`R`), errors (`E`), and a result (`A`). TypeScript automatically merges dependencies and errors when composing effects.

## Requirements

1. Define `Result<E, A>` — a discriminated union:
   - `{ success: true, value: A }`
   - `{ success: false, error: E }`
2. Create constructors `ok<A>(value)` and `err<E>(error)`
3. Create an `Effect<R, E, A>` class with:
   - `constructor(run: (context: R) => Result<E, A>)`
   - `map<B>(f: (a: A) => B): Effect<R, E, B>`
   - `flatMap<R2, E2, B>(f: (a: A) => Effect<R2, E2, B>): Effect<R & R2, E | E2, B>`
   - `catchError<E2, B>(f: (e: E) => Effect<R, E2, B>): Effect<R, E2, A | B>`
4. Create smart constructors:
   - `succeed<A>(value): Effect<unknown, never, A>`
   - `fail<E>(error): Effect<unknown, E, never>`
   - `service<R, A>(f: (ctx: R) => A): Effect<R, never, A>`
   - `serviceWithError<R, E, A>(f: (ctx: R) => Result<E, A>): Effect<R, E, A>`
5. Define services: `DatabaseService`, `EmailService`, `LoggerService`
6. Define errors: `DatabaseError`, `EmailError`, `NotFoundError`
7. Implement effects: `findUser`, `sendEmail`, `logMessage`
8. Compose `notifyUser` via `flatMap` — TypeScript should automatically infer the merged `R` and `E`
9. Demonstrate: success, error, recovery via `catchError`, and transformation via `map`

## Checklist

- [ ] `Effect<R, E, A>` is correctly parameterized with three generic parameters
- [ ] `flatMap` merges requirements via `R & R2` and errors via `E | E2`
- [ ] `catchError` allows recovery from an error
- [ ] `map` transforms the value without changing `R` and `E`
- [ ] `findUser` requires `{ db: DatabaseService }`, can return `NotFoundError`
- [ ] `sendEmail` requires `{ email: EmailService }`, can return `EmailError`
- [ ] `notifyUser` automatically requires all three services and can return both error types
- [ ] Effects are lazy — nothing executes until `.run(context)` is called

## How to Verify

1. Click the run button — all 4 cases execute correctly
2. Try running `notifyUser` without one of the services in the context — there should be a compile error
3. Confirm that `catchError` intercepts the `NotFoundError` and returns a fallback value
4. Hover over the type of `notifyUser` — TypeScript should show `Effect<{db, email, logger}, NotFoundError | EmailError, string>`
