# Task 8.3: TypeScript and InferType

## Objective

Learn to infer TypeScript types from Yup schemas using `InferType` and create type-safe validation functions.

## Requirements

1. Create `profileSchema` — an object schema:
   - `firstName`: required, min(2)
   - `lastName`: required, min(2)
   - `email`: email, required
   - `age`: required, positive, integer, min(13), max(120)
   - `role`: `oneOf(['admin', 'editor', 'viewer'] as const)`, required
   - `bio`: optional, max(500)
   - `website`: url, nullable
   - `joinedAt`: date, `default(() => new Date())`

2. Infer the type via `InferType`:
   ```ts
   type Profile = InferType<typeof profileSchema>
   ```

3. Create a generic `validateProfile` function:
   ```ts
   async function validateProfile(data: unknown):
     Promise<{ success: true; data: Profile } | { success: false; errors: string[] }>
   ```

4. Display `role` as a literal type (thanks to `as const`)

## Checklist

- [ ] `role` uses `oneOf([...] as const)` for literal types
- [ ] `InferType<typeof profileSchema>` produces a correct type
- [ ] `bio` — optional (string | undefined)
- [ ] `website` — nullable (string | null)
- [ ] `joinedAt` — has a default (always present)
- [ ] `validateProfile` is correctly typed

## How to verify

1. Fill in all required fields — success, the Profile type is displayed
2. Empty form — all errors are shown
3. Age < 13 — error "min 13"
4. Invalid email — error "Invalid email"
5. role is displayed as a literal ("admin" | "editor" | "viewer")
6. website empty — null (nullable), not an error
