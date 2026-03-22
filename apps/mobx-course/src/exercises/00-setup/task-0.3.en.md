# Task 0.3: Multiple Fields

## Goal

Create a `ProfileStore` with multiple fields and a computed property, connect it to React.

## Requirements

1. Create a `ProfileStore` class with properties:
   - `name: string` (default `''`)
   - `age: number` (default `0`)
   - `bio: string` (default `''`)

2. Add setter methods:
   - `setName(value: string)`
   - `setAge(value: number)`
   - `setBio(value: string)`

3. Add a `summary` getter returning a string like `"Name, N years old"`

4. Create a store instance and a React component with a form:
   - Input for name
   - Input (type="number") for age
   - Textarea for bio
   - Profile preview block (show `summary` and `bio`)

5. Wrap the component in `observer`

## Checklist

- [ ] `ProfileStore` class with three fields
- [ ] `setName`, `setAge`, `setBio` methods
- [ ] `summary` getter (computed) works
- [ ] Component is wrapped in `observer`
- [ ] Input fields update the store
- [ ] Preview block shows current data

## How to verify

1. Enter name "Alice" — preview updates
2. Enter age 25 — summary shows "Alice, 25 years old"
3. Enter bio — text appears in preview
