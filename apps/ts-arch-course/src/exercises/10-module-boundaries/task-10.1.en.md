# Task 10.1: Public API Surface

## 🎯 Goal

Design a module with internal and public type separation, where the public API hides implementation details through barrel exports and type mapping.

## Requirements

1. Create an internal `InternalUserRecord` type with private fields (`_id`, `_rev`, `passwordHash`, `deletedAt`)
2. Create a public `PublicUser` type with minimal fields (`id`, `name`, `email`, `createdAt`)
3. Create input types: `CreateUserInput`, `UpdateUserInput`, `UserQueryOptions`
4. Implement `toPublicUser(record: Internal) => Public` for boundary mapping
5. Implement `createUserModule()` returning an object with CRUD methods:
   - `createUser`, `getUser`, `updateUser`, `listUsers`, `deleteUser`
   - All methods return `PublicUser`, not `InternalUserRecord`
6. `listUsers` supports sorting and pagination via `UserQueryOptions`

## Checklist

- [ ] `InternalUserRecord` contains private fields not visible externally
- [ ] `PublicUser` doesn't contain `passwordHash`, `_rev`, `deletedAt`
- [ ] All module methods return `PublicUser`, not the internal type
- [ ] `toPublicUser` maps `_id` -> `id`, `firstName + lastName` -> `name`
- [ ] `listUsers` supports `sortBy`, `sortOrder`, `limit`, `offset`
- [ ] Soft delete: `deleteUser` marks `deletedAt`, `listUsers` filters deleted

## How to Verify

Create several users through the module and verify that returned objects don't contain internal fields. Try accessing `user.passwordHash` — TypeScript should show an error.
