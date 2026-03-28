# Task 2.4: Proxy

## Objective

Implement two types of proxy for `ApiService` using the built-in `Proxy` API: a logging proxy and a caching proxy.

## Requirements

1. Use the provided interface and class:
   - `ApiService` with methods `fetchUser(id)`, `fetchProduct(id)`, `updateUser(id, data)`
   - `RealApiService` implementing `ApiService`
2. Implement the function `createLoggingProxy<T extends object>(target: T, logs: string[]): T`:
   - Intercepts all method calls via `Proxy` and a `get` handler
   - Logs the method name and arguments: `[Proxy:LOG] methodName(args)`
   - Logs the result: `[Proxy:LOG] -> result`
   - Writes logs to the `logs` array
3. Implement the function `createCachingProxy<T extends object>(target: T, logs: string[]): T`:
   - Caches call results by the key `methodName:JSON.stringify(args)`
   - On a cache hit, logs `[Proxy:CACHE HIT]` and returns the cached value
   - On a cache miss, logs `[Proxy:CACHE MISS]` and calls the original method
4. Both proxies must be generic — work with any object, not just `ApiService`
5. Demonstrate both proxies in action

## Checklist

- [ ] `createLoggingProxy` intercepts method calls and logs input/output
- [ ] `createCachingProxy` caches results by method + arguments key
- [ ] Both proxies are generic (`<T extends object>`) and return the same type `T`
- [ ] `Reflect.get` is used to access properties of the original object
- [ ] The proxied object has the same interface — client code does not notice the proxy
- [ ] Demonstration shows logging and caching in action

## How to verify

1. Click the run button
2. Logging proxy — each method call logs the name, arguments, and result
3. Caching proxy — the first call to `fetchUser('42')` shows `CACHE MISS`, the second shows `CACHE HIT`
4. The proxy is fully transparent: `loggingApi.fetchUser('42')` behaves the same as `api.fetchUser('42')`
