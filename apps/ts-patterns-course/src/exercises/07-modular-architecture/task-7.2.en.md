# Task 7.2: Ports & Adapters

## Objective

Implement hexagonal architecture: business logic operates through ports (interfaces) without knowing about the specific adapters behind them.

## Requirements

1. Define the `UserRepository` port with methods:
   - `findById(id: string): User | null`
   - `save(user: User): void`
   - `findAll(): User[]`
2. Create an `InMemoryUserRepository` adapter implementing `UserRepository`
3. Create a `UserService` that accepts `UserRepository` through its constructor
4. In `UserService` implement:
   - `getUser(id: string)` — finds a user or throws an error
   - `createUser(name: string, email: string)` — creates and saves a user
   - `listUsers()` — returns all users
5. Demonstrate that `UserService` works with `InMemoryUserRepository` without modification

## Checklist

- [ ] `UserRepository` interface (port) is defined
- [ ] `InMemoryUserRepository` implements the port
- [ ] `UserService` depends only on the interface, not the implementation
- [ ] Creating, finding, and listing users works correctly
- [ ] Demo: business logic is unaware of the underlying store

## How to Verify

- Click the button — a list of operations should be displayed
- Users are created and found via InMemoryUserRepository
- UserService does not contain any import/reference to InMemoryUserRepository
