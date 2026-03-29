# Task 13.4: API Layer

## Goal

Build a type-safe API layer with request validation, response mapping, and typed controllers.

## Requirements

1. Create validation rules: `required`, `minLength`, `positive` -- each returning `Result<T>`
2. Define `RequestValidator<T>` with method `validate(data: unknown): Result<T, string[]>`
3. Implement validators for CreateOrderRequest and AddItemRequest
4. Define DTO types: `OrderResponse` (with string instead of Money, ISO date instead of timestamp)
5. Implement `toOrderResponse(order)` for domain -> API mapping
6. Create `ApiController` with typed responses: `ApiResponse<T>` (200/201/400/404)
7. Demonstrate: successful requests, validation errors, 404

## Checklist

- [ ] Validation rules return Result, collect all errors
- [ ] CreateOrderValidator checks customerId (required) and currency (3 characters)
- [ ] AddItemValidator checks: required fields, positive quantity/price, minLength name
- [ ] OrderResponse contains no domain types (Money -> string, timestamp -> ISO)
- [ ] ApiResponse is a discriminated union by status code
- [ ] createOrder returns 201, getOrder returns 200, errors return 400, not found returns 404
- [ ] Controller delegates business logic to handlers, contains no logic itself

## How to Verify

1. Create an order with valid data -- get 201
2. Send an invalid request -- get 400 with error list
3. Add items and query the order -- check response format
4. Query a non-existent order -- get 404
