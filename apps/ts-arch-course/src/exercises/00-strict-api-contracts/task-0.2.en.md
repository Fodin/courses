# Task 0.2: Response Mapping

## 🎯 Goal

Implement a type-safe system for mapping API responses (DTOs) to domain types with mapper composition support.

## Requirements

1. Create DTO interfaces (snake_case) and corresponding domain interfaces (camelCase) for at least 2 entities
2. Implement a `Mapper<TFrom, TTo>` type and a `createMapper()` factory function
3. Implement a `mapArray()` function — a composer that creates an array mapper from an element mapper
4. Mappers should transform:
   - snake_case -> camelCase
   - String dates -> `Date` objects
   - Cents -> dollars (numeric transformations)
   - Nested objects
5. Demonstrate mappers working on real data

## Checklist

- [ ] DTO and domain types reflect real API/frontend differences
- [ ] `createMapper` returns a correctly typed `(TFrom) => TTo` function
- [ ] `mapArray(mapUser)` automatically infers type `Mapper<ApiUserDTO[], DomainUser[]>`
- [ ] Transformations include date and numeric format conversion
- [ ] Nested objects are mapped correctly

## How to Verify

Check that the mapper doesn't allow skipping a required field of the domain type. Try removing one field from the result object — TypeScript should show an error.
