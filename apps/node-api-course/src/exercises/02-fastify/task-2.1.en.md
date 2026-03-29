# Task 2.1: Routes & JSON Schema

## 🎯 Goal

Master Fastify's routing system with built-in request validation and response serialization via JSON Schema.

## Requirements

1. Define a route with JSON Schema for `body` validation (required fields, types, min length, email format)
2. Define a `response` schema for automatic serialization and field filtering
3. Demonstrate validation of valid and invalid requests
4. Show how response schema automatically removes extra fields (password, internalId)
5. Explain the advantage of `fast-json-stringify` for response serialization

## Checklist

- [ ] Body schema defines required, types, constraints (minLength, format)
- [ ] `additionalProperties: false` blocks extra fields
- [ ] Invalid request returns 400 with error description
- [ ] Response schema filters sensitive fields (password, internal data)
- [ ] Difference shown: what DB returns vs what client receives

## How to Verify

Click "Run" and verify that: valid request passes validation, invalid one is rejected with 400, and response schema filters password and internalId from the response.
