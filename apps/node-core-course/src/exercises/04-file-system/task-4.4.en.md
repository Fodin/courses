# Task 4.4: File Watching

## Goal

Learn to watch file changes using `fs.watch()` and `fs.watchFile()`, understand the difference between them, and common pitfalls.

## Requirements

1. Demonstrate `fs.watch()` with `change` and `rename` event handling
2. Show `fs.watchFile()` with polling and `curr`/`prev` stats comparison
3. Show a comparison table of `fs.watch()` vs `fs.watchFile()`
4. Demonstrate the duplicate events problem and debouncing solution
5. Show the async iterator API for `fs.watch()` (Node.js 18.11+)
6. Demonstrate chokidar usage as a production solution

## Checklist

- [ ] fs.watch() with change/rename events shown
- [ ] fs.watchFile() with polling demonstrated
- [ ] Comparison table of watch vs watchFile present
- [ ] Duplicate events problem and debouncing explained
- [ ] Async iterator for watch shown
- [ ] Event simulation works correctly

## How to verify

1. Click "Run" and study the comparison table
2. Verify the difference between OS notifications and polling is explained
3. Check that simulation shows duplicate events and their filtering
4. Verify chokidar is mentioned as a production solution
