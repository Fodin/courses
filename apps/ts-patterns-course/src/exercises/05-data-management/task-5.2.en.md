# Task 5.2: Unit of Work (Transactions with commit/rollback)

## Objective

Implement the Unit of Work pattern to group operations across multiple entities into an atomic transaction with support for commit and rollback.

## Requirements

1. Create a `UnitOfWork` interface with methods:
   - `registerNew<T extends Entity>(entity: T, repoName: string): void` — register a new entity
   - `registerDirty<T extends Entity>(entity: T, repoName: string): void` — register a modified entity
   - `registerDeleted(id: string, repoName: string): void` — register a deletion
   - `commit(): string[]` — apply all changes; returns an operation log
   - `rollback(): void` — discard all accumulated changes
2. Implement the `InMemoryUnitOfWork` class, which accepts a `Map<string, Repository<Entity>>` — a map of repositories
3. `commit()` must apply operations in order: create → update → delete
4. After `commit()` the internal operation lists are cleared
5. `rollback()` clears all accumulated operations without applying them

## Checklist

- [ ] `UnitOfWork` interface is defined with all methods
- [ ] `registerNew`, `registerDirty`, `registerDeleted` accumulate operations
- [ ] `commit()` applies operations to the corresponding repositories
- [ ] Commit order: create → update → delete
- [ ] `commit()` returns a log of executed operations
- [ ] After commit, internal lists are empty
- [ ] `rollback()` clears accumulated operations without applying them
- [ ] Demo shows both commit and rollback scenarios

## How to Verify

1. Click the run button
2. Confirm that after commit the data appears in the repository
3. Confirm that after rollback the repository is unchanged
4. Verify that the operation log contains all applied actions
