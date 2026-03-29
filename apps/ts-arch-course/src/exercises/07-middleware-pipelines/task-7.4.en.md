# Task 7.4: Plugin Architecture

## 🎯 Goal

Design a type-safe plugin system with typed hook points where each plugin declaratively subscribes to events with compile-time payload checking.

## Requirements

1. Create a `PluginHooks` interface with at least 5 named hooks, each with its own payload type
2. Create a `HookHandler<T>` type and a `Plugin` interface with fields `name`, `version`, `hooks` (Partial over PluginHooks)
3. Implement a `PluginSystem` class:
   - `register(plugin)` — registers a plugin and its hooks
   - `emit(hook, payload)` — type-safely invokes all handlers for a hook
   - `getPlugins()` — returns the list of registered plugins
4. Create at least 3 plugins: logging, metrics, security

## Checklist

- [ ] `PluginHooks` defines at least 5 hooks with different payload types
- [ ] `Plugin.hooks` uses `Partial` — plugin subscribes only to needed hooks
- [ ] `emit('app:init', payload)` checks payload type by hook name
- [ ] `emit('unknown', {})` causes a compile error
- [ ] Plugins are called in registration order
- [ ] `getPlugins()` returns a typed list

## How to Verify

Register 3 plugins and call `emit` for each hook. Verify that: (1) only subscribed plugins are called, (2) payload is checked by the compiler, (3) unknown hooks cause an error.
