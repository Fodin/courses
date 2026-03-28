# Task 8.2: lazy() — recursive schemas

## Objective

Learn to use `yup.lazy()` to create recursive schemas that validate tree-shaped data structures.

## Requirements

1. Define the `TreeNode` interface:
   ```ts
   interface TreeNode {
     id: number
     label: string
     children: TreeNode[]
   }
   ```

2. Create `treeNodeSchema` — a recursive object schema:
   - `id`: required, positive number
   - `label`: required, min(1)
   - `children`: array of `yup.lazy(() => treeNodeSchema.default(undefined))`
   - Don't forget `.default([])` on the array

3. Implement a component with a textarea for entering a JSON tree and a validation button:
   - Parse JSON via `JSON.parse()`
   - Validate via `treeNodeSchema.validate(data, { abortEarly: false })`
   - On success, display the node count (recursive count)
   - Handle `SyntaxError` (invalid JSON) and `ValidationError` separately

## Checklist

- [ ] `treeNodeSchema` is typed as `yup.ObjectSchema<TreeNode>`
- [ ] `children` uses `yup.lazy(() => treeNodeSchema.default(undefined))`
- [ ] `.default([])` is placed on the children array
- [ ] JSON errors and validation errors are handled separately
- [ ] Node count is displayed on successful validation

## How to verify

1. Default tree (Root → Child 1 → Grandchild, Child 2) — success, 4 nodes
2. Remove `label` from a node — validation error
3. Enter invalid JSON (`{broken}`) — parse error
4. Empty `children: []` — ok, leaf node
5. Negative `id` — error "positive"
