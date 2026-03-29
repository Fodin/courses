# Task 1.4: Package.json exports

## Goal

Learn to use the `exports` field in package.json to control a package's public API.

## Requirements

1. Show a basic exports map with entry points
2. Demonstrate conditional exports (import/require/types/default)
3. Show subpath patterns with wildcard (*)
4. Simulate path resolution for different conditions
5. Show how exports blocks access to internal files

## Checklist

- [ ] Basic exports map with examples
- [ ] Conditional exports for dual CJS/ESM package
- [ ] Subpath patterns
- [ ] Path resolution simulation works
- [ ] Internal file blocking shown (ERR_PACKAGE_PATH_NOT_EXPORTED)

## How to verify

1. Run the simulation and verify path resolution
2. Ensure internal paths are correctly blocked
