# Task 7.4: Module Contracts

## Objective

Implement a type-safe module public API: the contract defines what is exported, and internals are hidden.

## Requirements

1. Define the `UserModuleContract` interface:
   - `createUser(input: CreateUserInput): User`
   - `getUser(id: string): User | null`
   - `listUsers(): User[]`
   - `deleteUser(id: string): boolean`
2. Define the `NotificationModuleContract` interface:
   - `send(userId: string, message: string): void`
   - `getHistory(userId: string): Notification[]`
3. Create factory functions `createUserModule()` and `createNotificationModule(deps)` that return the contracts
4. `NotificationModule` depends on `UserModuleContract` (verifies that the user exists)
5. Demonstrate inter-module interaction through contracts

## Checklist

- [ ] `UserModuleContract` is typed
- [ ] `NotificationModuleContract` is typed
- [ ] Factory functions return the contract, not the implementation
- [ ] NotificationModule depends on UserModuleContract, not on implementation details
- [ ] CRUD operations work through contracts
- [ ] Inter-module interaction demo

## How to Verify

- Click the button — user creation and notification sending should be displayed
- A notification is not sent to a non-existent user
- Modules interact only through contracts
