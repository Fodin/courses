# Task 4.4: Exhaustive Handling

## Goal
Use the `never` type to guarantee handling of all union type variants.

## Requirements
1. Create a function `assertNever(value: never): never`
2. Define a `Shape` type with variants: `circle`, `rectangle`, `triangle`
3. Implement `calculateArea(shape)` returning `Result<number, string>`
4. Use `assertNever` in the default branch of switch
5. Show that TypeScript will error when a new variant is added

## Checklist
- [ ] `assertNever` implemented
- [ ] `Shape` union with 3 variants
- [ ] `calculateArea` handles all variants + validation
- [ ] `assertNever` used in default
- [ ] Calculation results on the page
