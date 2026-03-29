# Task 4.3: Directory Operations

## Goal

Learn to perform directory operations: reading contents, creation, deletion, and recursive file tree traversal.

## Requirements

1. Demonstrate `readdir` with `withFileTypes` option to determine entry type
2. Show recursive `readdir` (Node.js 18.17+)
3. Demonstrate `mkdir` with `{ recursive: true }` for nested directory creation
4. Show `rm` with `{ recursive: true, force: true }` for tree deletion
5. Implement a directory tree visualization
6. Show the recursive traversal pattern with async generator

## Checklist

- [ ] readdir with withFileTypes demonstrated
- [ ] Recursive readdir shown
- [ ] mkdir with recursive creates nested directories
- [ ] rm with recursive deletes trees
- [ ] Tree visualization works correctly
- [ ] Async generator walkDir pattern shown

## How to verify

1. Click "Run" and study the directory tree
2. Verify the tree displays with correct symbols (├──, └──)
3. Check that APIs for creation, reading, and deletion are shown
4. Verify the walkDir pattern is implemented correctly
