# Task 9.1: Recursive Data Structures

## Goal

Learn to model recursive data structures in TypeScript: JSON, trees, linked lists, file systems, and AST.

## Requirements

1. Create a `JsonValue` type — a recursive union for representing arbitrary JSON (string, number, boolean, null, array, object)
2. Implement a generic `TreeNode<T>` with `value` and `children` fields and a recursive `treeToString` traversal function
3. Create `LinkedList<T>` with `value` and `next` (or `null`) and a conversion function `linkedListToArray`
4. Implement `FileSystemEntry` with recursive `children` and a `countFiles` function
5. Create `Comment` with recursive `replies` and a `countComments` function
6. Implement AST via discriminated union `Expression` with types `number`, `string`, `binary`, `unary` and an `evaluate` function

## Checklist

- [ ] `JsonValue` accepts arbitrarily nested JSON structures
- [ ] `TreeNode<T>` correctly builds a tree of arbitrary depth
- [ ] `LinkedList<T>` ends with `null` and converts to array
- [ ] `FileSystemEntry` distinguishes files and directories, counts files recursively
- [ ] `Comment` supports nested replies, `countComments` counts all
- [ ] `Expression` AST evaluates recursively via `evaluate`
- [ ] Results displayed on the page

## How to verify

1. Click the "Run" button
2. Verify the tree is correctly displayed with indentation
3. Check that the linked list `1 -> 2 -> 3` displays correctly
4. Verify that `evaluate(1 + 2 * 3)` returns 7
