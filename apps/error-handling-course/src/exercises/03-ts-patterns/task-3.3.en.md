# Task 3.3: Type-safe Errors

## Goal
Create a system of typed errors with codes and additional context.

## Requirements
1. Define a union type of error codes: `VALIDATION`, `NOT_FOUND`, `UNAUTHORIZED`, `NETWORK`, `UNKNOWN`
2. Create a generic interface `TypedError<C>` with fields `code`, `message`, `details?`
3. Specialize: `ValidationErr` with field `field`, `NotFoundErr` with `resource` and `id`
4. Create a function `handleAppError(error)` that handles each code via switch
5. Display the handling of 5 different errors

## Checklist
- [ ] Union type of codes defined
- [ ] `TypedError` generic interface created
- [ ] Specialized types with additional fields
- [ ] `handleAppError` handles all codes
- [ ] TypeScript narrows the type in each case
