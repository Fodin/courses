# Task 11.1: Config Loader

## Goal

Implement a type-safe configuration loader with schema validation, automatic type conversion, and support for environment-specific overrides.

## Requirements

1. Define a `ConfigSchema` interface with fields: `type` ('string' | 'number' | 'boolean'), `required`, `default`, `validate`
2. Create an `InferConfig<S>` type that infers a typed result from the schema (string/number/boolean for each field)
3. Implement `createConfigLoader(schema)` with a `load(env, overrides?)` method returning `ConfigResult<T>`
4. `load()` must: parse strings to corresponding types, apply defaults, check required fields, run validate
5. On errors, return `{ ok: false, errors: ConfigError[] }` with all errors (not just the first)
6. Implement a `merge(base, override)` method for combining configurations
7. Demonstrate: successful loading, defaults applied, validation errors, overrides

## Checklist

- [ ] `ConfigSchema` describes structure with type/required/default/validate
- [ ] `InferConfig` infers number for fields with type: 'number', etc.
- [ ] Missing required field without default is an error
- [ ] String 'not-a-number' for a number field is an error with description
- [ ] All errors are collected in a single pass
- [ ] Overrides take priority over env
- [ ] Merge correctly combines two configuration objects

## How to Verify

1. Load configuration with full set of variables -- all types should be correct
2. Remove required variables -- get a list of errors
3. Pass invalid values (string instead of number) -- get clear error messages
4. Use overrides -- they should take priority over env values
