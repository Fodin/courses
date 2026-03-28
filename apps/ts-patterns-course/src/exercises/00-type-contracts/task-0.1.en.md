# Task 0.1: Branded Types

## Objective

Learn to create branded types to prevent mixing values of the same primitive type.

## Requirements

1. Create a utility type `Brand<T, B>` for branding
2. Create three branded types: `UserId`, `Email`, `OrderId`
3. For each type, create a constructor function with validation:
   - `createUserId(id: string)` — minimum 3 characters
   - `createEmail(value: string)` — valid email (regex)
   - `createOrderId(id: string)` — format `ORD-XXXX` (digits)
4. Create functions that accept only a specific branded type:
   - `findUser(userId: UserId): string`
   - `sendEmail(email: Email): string`
   - `getOrder(orderId: OrderId): string`
5. Demonstrate successful creation and validation errors

## Checklist

- [ ] Type `Brand<T, B>` is correctly defined
- [ ] Three branded types are created
- [ ] Constructor functions validate input data
- [ ] Invalid data causes a thrown Error
- [ ] Functions only accept their own branded type
- [ ] The demonstration works — the button outputs results
