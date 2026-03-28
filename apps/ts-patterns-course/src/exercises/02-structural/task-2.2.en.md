# Task 2.2: Decorator

## Objective

Implement three functional decorators (`withLogging`, `withCache`, `withRetry`) that add behavior to any function without changing its signature.

## Requirements

1. Define the type `AnyFunction = (...args: never[]) => unknown`
2. Implement the decorator `withLogging<T extends AnyFunction>(fn: T, name: string): T`:
   - Wraps the function call, prepending the result with `[LOG:<name>]`
   - Returns a function with the same signature
3. Implement the decorator `withCache<T extends AnyFunction>(fn: T): T`:
   - Caches results by the key `JSON.stringify(args)`
   - On repeated calls with the same arguments, returns `[CACHE HIT] <cached result>`
   - On new arguments, calls the original function
4. Implement the decorator `withRetry<T extends AnyFunction>(fn: T, maxRetries: number): T`:
   - On error, retries the call up to `maxRetries` times
   - If all attempts fail, returns `[RETRY FAILED] after N attempts: <error message>`
5. Demonstrate decorator composition: `withLogging(withCache(fn), name)`

## Checklist

- [ ] Type `AnyFunction` is defined
- [ ] `withLogging` adds logging while preserving signature `T`
- [ ] `withCache` caches results by arguments
- [ ] `withRetry` retries calls on errors
- [ ] Decorators can be composed (nested inside each other)
- [ ] Demonstration shows each decorator and their composition in action

## How to verify

1. Click the run button
2. `withLogging` — result starts with `[LOG:name]`
3. `withCache` — a second call with the same arguments returns `[CACHE HIT]`
4. `withRetry` — an unreliable function eventually returns a result
5. Composition — `withLogging(withCache(fn))` checks the cache first, then logs
