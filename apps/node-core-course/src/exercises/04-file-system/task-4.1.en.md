# Task 4.1: Sync/Async Read/Write

## Goal

Understand the three API styles of the `fs` module (callback, sync, promises) and learn to perform basic file read and write operations.

## Requirements

1. Demonstrate three fs API styles: callback, synchronous, promises
2. Show `readFile`, `writeFile`, `appendFile` operations with explanations
3. Explain the difference between reading with and without encoding (Buffer vs string)
4. Demonstrate file flags (`w`, `a`, `wx`, `r+`)
5. Show file handle usage (`fs.open`) with proper cleanup via `try/finally`
6. Simulate a virtual file system to demonstrate operations

## Checklist

- [ ] All 3 API styles shown with code examples
- [ ] readFile, writeFile, appendFile demonstrated
- [ ] Buffer vs string difference explained (encoding)
- [ ] File flags and their purpose shown
- [ ] File handles demonstrated with try/finally
- [ ] Virtual FS simulation works

## How to verify

1. Click "Run" and study the output
2. Verify each API style has corresponding syntax shown
3. Check that simulation correctly demonstrates writeFile and readFile
4. Verify appendFile adds lines rather than overwriting
