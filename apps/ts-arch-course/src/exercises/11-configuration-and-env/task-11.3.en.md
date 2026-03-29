# Task 11.3: Environment Types

## Goal

Implement a type-safe environment variable loading system with declarative specification, enum constraints, and automatic type inference.

## Requirements

1. Create an `EnvVarDef<T>` type with fields: `key`, `transform`, `fallback`, `required`
2. Implement factory functions: `envString`, `envNumber`, `envBoolean`, `envEnum`
3. `envEnum` must constrain allowed values via literal types (as const)
4. Create an `InferEnv<S>` type that infers the final type from the specification
5. Implement `loadEnv(spec, env)` returning `{ ok, value }` or `{ ok, errors }`
6. Demonstrate: full loading, fallback values, validation errors, enum constraints

## Checklist

- [ ] `envNumber` converts string to number and errors for invalid values
- [ ] `envBoolean` accepts 'true'/'false'/'1'/'0'
- [ ] `envEnum` constrains allowed values: 'test' for NODE_ENV is an error
- [ ] `InferEnv` infers `'development' | 'staging' | 'production'` for NODE_ENV
- [ ] Fallback values are applied for missing variables
- [ ] Missing required variable without fallback is an error
- [ ] All errors are collected into a single array

## How to Verify

1. Load a full set of variables -- all types should be correct
2. Load a minimal set -- fallback values should be applied
3. Pass invalid enum values -- get errors
4. Verify that `result.value.port` is a number and `result.value.nodeEnv` is a literal union
