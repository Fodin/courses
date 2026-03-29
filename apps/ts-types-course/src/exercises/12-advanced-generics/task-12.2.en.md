# Task 12.2: Inference Tricks

## Goal

Master advanced type inference techniques: `const T` for preserving literal types, `NoInfer<T>` for controlling inference sites, distributive object types, and `satisfies`.

## Requirements

1. Implement `narrow<const T>` — a function that preserves the literal type of its argument (without widening to string/number)
2. Show `NoInfer<T>` — blocks type inference from a specific argument position
3. Implement `DistributiveMap<T>` — transforms an object type into a discriminated union
4. Show `handleEvent` with automatic payload type inference from event name
5. Demonstrate `satisfies` — shape validation without losing literal types

## Checklist

- [ ] `narrow("active")` has type `"active"`, not `string`
- [ ] `narrowArray(["a", "b"])` has type `readonly ["a", "b"]`, not `string[]`
- [ ] `NoInfer` prevents unwanted type unions
- [ ] `DistributiveMap<EventMap>` creates a correct discriminated union
- [ ] `handleEvent("click", p => p.x)` — TypeScript knows payload has `x` and `y`
- [ ] `satisfies Config` validates shape but preserves literal value types

## How to Verify

1. Without `const T`: `narrow("active")` — check that type is `string` (widened)
2. With `const T`: `narrow("active")` — check that type is `"active"` (literal)
3. Try `handleEvent("click", p => p.key)` — should error (click has no key)
