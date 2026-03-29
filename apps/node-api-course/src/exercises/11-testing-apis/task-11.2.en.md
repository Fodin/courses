# Task 11.2: Integration Tests

## 🎯 Goal

Master integration testing with supertest: full HTTP request cycle, setup/teardown, testing with authentication.

## Requirements

1. Set up supertest with Express app (`request(app)`)
2. Test CRUD: POST (201, 400, 409), GET (200, 401), PUT, DELETE
3. Verify status, Content-Type, response body structure (toMatchObject)
4. Test authentication: token retrieval in beforeAll, sending via set('Authorization')
5. Verify passwords don't leak in responses (not.toHaveProperty)

## Checklist

- [ ] Supertest configured and sending real HTTP requests
- [ ] CRUD endpoints covered (happy path + error cases)
- [ ] Authentication tested: 200 with token, 401 without token
- [ ] Response body verified via toMatchObject
- [ ] Sensitive data (password) doesn't leak

## How to Verify

Click "Run" and verify that: supertest executes requests to API, all CRUD operations verified, authentication works.
