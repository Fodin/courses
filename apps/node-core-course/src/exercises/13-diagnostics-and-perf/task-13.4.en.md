# Task 13.4: Util & Misc

## Goal

Master Node.js utilities: `util.promisify` for callback-to-Promise conversion, `util.inspect` for formatting, `util.types` for type checking, custom Console, and readline for interactive input.

## Requirements

1. Demonstrate `util.promisify()` for converting callback functions
2. Show `util.inspect()` with depth, color settings, and custom inspect
3. Demonstrate `util.types` for precise object type checking
4. Show creating a custom Console with file output
5. Demonstrate readline for interactive input and line-by-line file reading
6. Show console.table, console.time/timeEnd for debugging

## Checklist

- [ ] util.promisify() with fs and child_process examples
- [ ] util.inspect() with settings and custom inspect
- [ ] util.types — isDate, isPromise, isProxy, and others
- [ ] Custom Console with stdout/stderr to files
- [ ] readline with question and for-await-of for files
- [ ] console.table and console.time for debugging

## How to verify

1. Click "Run" — all utilities should be displayed
2. Verify promisify is shown for non-standard callbacks
3. Check custom inspect hides sensitive data
4. Verify readline is shown in both callback and Promise versions
