# Task 8.2: Module Augmentation

## Goal

Learn to extend third-party module types through `declare module`, add new methods to existing types, and create type-safe plugin systems.

## Requirements

1. Explain the concept of `declare module 'library-name' { ... }` and show the syntax
2. Show an example of extending Express Request with a custom `user` field
3. Explain extending built-in types through `declare global { interface Array<T> { ... } }`
4. Create a local augmentation demonstration through `OriginalAPI` interface merging
5. Implement a plugin system through `PluginRegistry` with `core`, `auth`, `analytics` plugins
6. Show augmentation through namespace for extending lodash-like types
7. List module augmentation limitations (can't add top-level, needs module)

## Checklist

- [ ] `declare module` syntax explained
- [ ] Express Request extension example shown
- [ ] `declare global` for built-in types explained
- [ ] Local augmentation demonstration works
- [ ] Plugin registry with 3 plugins implemented and invoked
- [ ] Module augmentation limitations listed
- [ ] Results displayed on the page

## How to verify

1. Click the "Run" button
2. Verify that `OriginalAPI` contains both original and extended methods
3. Check that the plugin registry calls methods from each plugin
4. Verify that augmentation limitations are listed
