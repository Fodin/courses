# Task 8.1: Type-safe Builder

## Objective

Implement the Builder pattern where the `build()` method is available **only** after all required fields have been set. The check is enforced at the TypeScript type system level.

## Requirements

1. Define the `ServerConfig` interface with fields:
   - `host: string` (required)
   - `port: number` (required)
   - `protocol: 'http' | 'https'` (required)
   - `maxConnections?: number` (optional)
   - `timeout?: number` (optional)
2. Define the type `RequiredConfigKeys = 'host' | 'port' | 'protocol'`
3. Create a `ConfigBuilder<Set extends string = never>` class:
   - Generic parameter `Set` tracks which required fields have been set
   - `setHost(host)` returns `ConfigBuilder<Set | 'host'>`
   - `setPort(port)` returns `ConfigBuilder<Set | 'port'>`
   - `setProtocol(protocol)` returns `ConfigBuilder<Set | 'protocol'>`
   - Optional setters return `ConfigBuilder<Set>` (do not change the accumulator)
   - `build()` uses a `this` parameter with a conditional type: available **only** when `RequiredConfigKeys extends Set`
4. Create a factory function `createConfigBuilder()` returning `ConfigBuilder<never>`
5. Demonstrate:
   - A successful build with required fields only
   - A successful build with required and optional fields
   - Comments showing that an incomplete build does not compile

## Checklist

- [ ] `ConfigBuilder` is parameterized by the `Set` accumulator
- [ ] Each required setter extends `Set` via union
- [ ] `build()` uses a conditional type via the `this` parameter
- [ ] `build()` cannot be called without all required fields (compile error)
- [ ] The order of setter calls does not matter
- [ ] Optional setters do not affect the availability of `build()`

## How to Verify

1. Click the run button — both configs should be assembled correctly
2. Try uncommenting the `build()` call without all required fields — TypeScript should show an error
3. Confirm that setter order does not matter: `setPort → setHost → setProtocol` works too
