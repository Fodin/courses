# Task 3.1: Template Literal Basics

## Goal

Learn to create union types from template literal types, understand the Cartesian product when combining union types, and apply template literal types to real-world tasks.

## Requirements

1. Create type `ColorVariant` = `${Shade}-${Color}` where Shade = 'light' | 'dark', Color = 'red' | 'green' | 'blue'. Create an array with all variants
2. Create type `CSSValue` = `${number}${CSSUnit}` for type-safe CSS values. Implement a `setCSSValue` function
3. Create type `EventHandler` = `on${Capitalize<DOMEvent>}` for event handler names
4. Create type `ApiRoute` = `/api/${Version}/${Resource}` for API routes. Generate all possible combinations
5. Create type `LogEntry` = `[${HttpMethod}] ${StatusCode}` for log strings. Show the number of combinations

## Checklist

- [ ] `ColorVariant` contains all 6 combinations (2 * 3)
- [ ] `CSSValue` accepts '100px', '1.5rem', '50vh', but not '100' without a unit
- [ ] `EventHandler` correctly capitalizes event names ('click' -> 'onClick')
- [ ] `ApiRoute` contains all version/resource combinations
- [ ] The Cartesian product and its potential growth are demonstrated

## How to Verify

1. Try assigning an invalid string to CSSValue — should error
2. Count the number of LogEntry variants manually and compare
3. Verify all ColorVariant options are present in the array
