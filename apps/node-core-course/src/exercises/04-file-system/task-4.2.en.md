# Task 4.2: Path Module

## Goal

Master the `path` module for safe, cross-platform file path manipulation.

## Requirements

1. Demonstrate `path.join()` for safe path concatenation
2. Show `path.resolve()` for obtaining absolute paths
3. Demonstrate `path.dirname()`, `path.basename()`, `path.extname()` for path parsing
4. Show `path.parse()` and the full parsed path object
5. Demonstrate `path.relative()` for computing relative paths
6. Show cross-platform specifics: `path.sep`, `path.delimiter`, `path.posix`, `path.win32`

## Checklist

- [ ] path.join() shown with examples including `..`
- [ ] path.resolve() demonstrated with relative and absolute paths
- [ ] dirname, basename, extname shown on a real path example
- [ ] path.parse() shown with all object fields described
- [ ] path.relative() demonstrated
- [ ] Cross-platform specifics mentioned

## How to verify

1. Click "Run" and study each function's result
2. Verify path.join() correctly handles `..`
3. Check path.parse() returns all 5 fields (root, dir, base, name, ext)
4. Verify the rule is mentioned: always use path.join() instead of string concatenation
