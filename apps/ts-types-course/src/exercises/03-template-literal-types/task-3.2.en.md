# Task 3.2: String Manipulation Types

## Goal

Master built-in string manipulation types (Uppercase, Lowercase, Capitalize, Uncapitalize) and create custom string type transformations: CamelCase, KebabCase, Replace, ReplaceAll.

## Requirements

1. Demonstrate all 4 built-in types: Uppercase, Lowercase, Capitalize, Uncapitalize with examples
2. Implement type `CamelCase<S>` for converting kebab-case to camelCase. Create a runtime function `toCamelCase`
3. Implement a runtime function `toKebabCase` for reverse conversion (camelCase -> kebab-case)
4. Implement a runtime function `toSnakeCase` for converting camelCase to snake_case
5. Show practical application: mapping CSS properties (kebab) to JS properties (camel)
6. Implement types `Replace<S, From, To>` and `ReplaceAll<S, From, To>` for substring replacement

## Checklist

- [ ] All 4 built-in types are demonstrated with compile-time results
- [ ] `CamelCase<'background-color'>` resolves to `'backgroundColor'`
- [ ] `CamelCase<'border-top-width'>` handles 3+ segments
- [ ] Runtime functions correctly transform strings
- [ ] CSS-to-JS mapping works for real CSS properties
- [ ] `Replace` replaces the first occurrence, `ReplaceAll` replaces all

## How to Verify

1. Check CamelCase for strings with 1, 2, and 3+ segments
2. Compare compile-time CamelCase type with runtime toCamelCase result
3. Verify that ReplaceAll actually replaces all occurrences
