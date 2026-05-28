# Task 14.3: Reference E-commerce API

## Goal

Study the reference design of a REST API for an online store — a complete set of resources, methods, status codes, request/response formats, and cross-cutting concerns. Understand how all course topics come together.

## Resources to Study

Study each resource and its endpoints:

1. **Products** (4 endpoints) — list, create, details, update
2. **Cart** (4 endpoints) — view cart, add/change/remove items
3. **Orders** (4 endpoints) — create, list, details, cancel (action endpoint)
4. **Users** (3 endpoints) — registration, login, profile
5. **Reviews** (2 endpoints) — review list with rating, create

## Checklist

- [ ] Products: understand the difference between list (brief card) and detailed response
- [ ] Cart: why does POST /cart/items return 409 if the product is out of stock?
- [ ] Orders: why is there a `timeline` field in GET /orders/{id}
- [ ] Orders: understand why cancel is POST /orders/{id}/cancel, not DELETE
- [ ] Users: why is POST /auth/login rate-limited by IP, not by user ID?
- [ ] Reviews: what does the `verified` field mean in a review and how is it set?
- [ ] Cross-cutting concerns: memorize the error format, versioning, date and money format

## Self-Check Questions

1. Why is money stored as `{ "amount": 850.00, "currency": "RUB" }` instead of just a number?
2. What happens if a client calls POST /orders/{id}/cancel for an already cancelled order?
3. Why does the review list `meta.distribution` show the count for each rating?
4. What's the difference between GET /products (list) and GET /products/{id} (details)?
5. Why do public endpoints (GET /products) not require authorization, but POST /reviews does?

## How to Check Yourself

1. Study all 5 resources sequentially, reading request and response for each endpoint
2. Answer all 5 self-check questions — write down your answers
3. Try to reproduce the API structure from memory: what resources? what methods?
4. Pay attention to the "Cross-cutting concerns" block — it applies to the entire API
5. Compare this API with the one you saw in Task 14.2 — find specific differences

## Tips

- `timeline` in an order — a State Machine History pattern: the complete history of status transitions
- POST /orders/{id}/cancel — this is an action endpoint, not DELETE, because cancellation has business logic (reason, refund, inventory update)
- `verified: true` in a review means the user has confirmed they purchased this item (verified via orderId)
- The `meta.distribution` structure is needed for rendering a rating bar chart without an additional request
