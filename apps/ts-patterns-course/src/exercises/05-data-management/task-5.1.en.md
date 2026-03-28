# Task 5.1: Repository (Type-safe CRUD)

## Objective

Implement the Repository pattern with a type-safe CRUD interface and an InMemoryRepository for storing entities in memory.

## Requirements

1. Create a `Repository<T extends { id: string }>` interface with methods:
   - `findById(id: string): T | undefined`
   - `findAll(): T[]`
   - `create(entity: T): T`
   - `update(id: string, updates: Partial<T>): T | undefined`
   - `delete(id: string): boolean`
2. Implement the `InMemoryRepository<T>` class, which stores data in a `Map<string, T>`
3. The `create` method must save a **copy** of the object (not a reference)
4. The `update` method must merge `updates` into the existing entity, returning `undefined` if the entity is not found
5. Demonstrate usage with a `User` interface (id, name, email, role)

## Checklist

- [ ] `Repository<T>` interface is defined with the `{ id: string }` constraint
- [ ] `InMemoryRepository<T>` implements all 5 methods
- [ ] `create` saves a copy of the object, not a reference
- [ ] `update` correctly merges partial updates
- [ ] `update` returns `undefined` for a non-existent id
- [ ] `delete` returns `true`/`false` depending on the outcome
- [ ] CRUD operation demo logs results to the console

## How to Verify

1. Click the run button
2. Confirm that create, findById, findAll, update, and delete work correctly
3. Verify that updating a non-existent entity returns undefined
4. Confirm that after delete the entity is not found via findById
