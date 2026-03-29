# Task 8.1: Interface Merging

## Goal

Learn to use interface merging to extend types, understand property and method merging rules, and overload ordering.

## Requirements

1. Create a `User` interface with `id` and `name` fields, then extend it with a second declaration adding `email` and `role`
2. Demonstrate method merging: create `Logger` with `log(message)` and `log(message, level)` overloads
3. Show overload ordering during merging: string literals are hoisted, later blocks have priority
4. Demonstrate type conflicts during merging: same property must have same type
5. Implement generic interface merging with `Container<T>` having `getValue()`, `setValue()`, `isEmpty()`
6. Show class + interface merging (class with additional properties from interface)
7. Explain practical usage: extending Window

## Checklist

- [ ] Two `User` declarations merge into one interface with 4 fields
- [ ] `log` overloads created through merging two `Logger` blocks
- [ ] Overload ordering rules explained (literals, block priority)
- [ ] Type conflicts during merging demonstrated
- [ ] Generic `Container<T>` works with both sets of methods
- [ ] Class + interface merging shown
- [ ] Results displayed on the page

## How to verify

1. Click the "Run" button
2. Verify that the `User` object contains all 4 fields from both declarations
3. Check that `Logger` is called with 1 and 2 arguments
4. Verify that `Container<string>` has methods from both declarations
