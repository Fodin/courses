# Task 4.3: Plugin System

## Objective

Implement a type-safe plugin system with lifecycle hooks and configuration.

## Requirements

1. Create a `Plugin<TConfig>` interface with fields:
   - `name: string`
   - `config?: TConfig`
   - `onInit?(): string` — called on installation
   - `onDestroy?(): string` — called on removal
2. Create a `PluginManager` class with methods:
   - `install<T>(plugin: Plugin<T>)` — installs the plugin, calls `onInit`
   - `uninstall(name: string)` — removes the plugin, calls `onDestroy`
   - `isInstalled(name: string): boolean`
   - `getPlugin<T>(name: string): Plugin<T> | undefined`
   - `listPlugins(): string[]`
3. Create at least 3 plugins with different configurations:
   - `loggerPlugin` with `LoggerPluginConfig` (level, prefix)
   - `analyticsPlugin` with `AnalyticsPluginConfig` (trackingId, enabled)
   - `cachePlugin` without configuration
4. Duplicate protection: `install` throws an error if the plugin is already installed
5. Demonstrate installation, accessing the config, and removal

## Checklist

- [ ] `Plugin<TConfig>` — a generic interface with lifecycle hooks
- [ ] `PluginManager` stores plugins in a `Map`
- [ ] `install` calls `onInit` and checks for duplicates
- [ ] `uninstall` calls `onDestroy` and removes from the Map
- [ ] `getPlugin<T>` returns the plugin with a typed config
- [ ] Three plugins with different configurations are created
- [ ] All operations are demonstrated on screen

## How to verify

- After `install(loggerPlugin)`, `isInstalled("logger")` should return `true`
- `getPlugin<LoggerPluginConfig>("logger")?.config?.level` should return `"info"`
- A second `install(loggerPlugin)` should throw an error
