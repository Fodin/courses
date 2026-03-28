# Task 0.2: Type Guards

## Objective

Learn to create custom type guard functions for safe type narrowing.

## Requirements

1. Create types `SuccessResponse` and `ErrorResponse` with a `status` discriminant field
2. Create type guard functions:
   - `isErrorResponse(resp): resp is ErrorResponse`
   - `isSuccessResponse(resp): resp is SuccessResponse`
3. Create a shape system (`Circle`, `Rectangle`, `Triangle`) with a `kind` field
4. Create type guards `isCircle`, `isRectangle` and a `getArea` function based on them
5. Create a universal guard `isNonNullable<T>` for filtering out null/undefined

## Checklist

- [ ] API response guards correctly narrow the type
- [ ] Shape guards work with the discriminated union
- [ ] `getArea` calculates the area for all shapes
- [ ] `isNonNullable` filters null and undefined from an array
- [ ] Results are displayed on the page
