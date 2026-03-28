# Task 1.4: Singleton

## Objective

Implement the Singleton pattern for a configuration manager with type-safe access via generics.

## Requirements

1. Create a `ConfigManager` class with:
   - `private constructor()` — prevents direct instantiation
   - `static getInstance(): ConfigManager` — returns the single instance
   - `get<T>(key: string): T | undefined` — retrieve a value
   - `set<T>(key: string, value: T): void` — set a value
   - `has(key: string): boolean` — check if a key exists
   - `getAll(): Record<string, unknown>` — retrieve all values
   - `clear(): void` — clear the configuration
2. Internal storage — `Map<string, unknown>`
3. `getInstance()` creates the instance on the first call, then returns the same one
4. Add `static resetInstance()` for resetting (useful for tests)

## Checklist

- [ ] Constructor is private — `new ConfigManager()` is not possible
- [ ] `getInstance()` always returns the same instance
- [ ] `get/set` are typed via generics
- [ ] `has`, `getAll`, `clear` work correctly
- [ ] Changes made through one "instance" are visible through another
- [ ] Demonstration proves instance identity

## How to verify

1. Click the run button
2. Verify that `config1 === config2` returns `true`
3. Verify that `config2.get("theme")` sees the value set via `config1`
4. Verify that `new ConfigManager()` triggers a TypeScript error
