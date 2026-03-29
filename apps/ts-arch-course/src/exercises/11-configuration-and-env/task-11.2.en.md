# Task 11.2: Feature Flags

## Goal

Create a type-safe Feature Flag system with a typed flag registry, support for different value types, and an override mechanism.

## Requirements

1. Define `FlagDefinition<T>` with fields: `description`, `defaultValue`, `type`
2. Create a `FlagValues<R>` type that infers the specific value type for each flag
3. Implement `createFeatureFlags(registry, overrides?)` returning a `FeatureFlagService`
4. The service must support methods: `isEnabled`, `getValue`, `getAll`, `override`, `reset`, `resetAll`
5. `getValue` must return a specific type: `getValue('MAX_UPLOAD_SIZE')` -> `number`
6. Demonstrate: default values, `isEnabled` checks, overrides, and reset

## Checklist

- [ ] `FlagDefinition` supports boolean, number, and string types
- [ ] `FlagValues` infers the correct type for each flag
- [ ] `getValue('DARK_MODE')` returns `boolean`, not `string | number | boolean`
- [ ] `isEnabled` works for all types (boolean, truthy/falsy for number/string)
- [ ] `override` only accepts a value of the correct type for the given flag
- [ ] `resetAll` returns all flags to their default values
- [ ] Initial overrides when creating the service work correctly

## How to Verify

1. Get all default values -- types should match definitions
2. Override several flags and verify old values are preserved
3. Reset one flag -- it returns to default, others remain
4. Use `resetAll` -- all values return to defaults
