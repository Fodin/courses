# 🔥 Level 11: API Testing

## 🎯 Three Testing Levels

1. **Unit tests** -- isolated testing of functions/services with mocks
2. **Integration tests** -- full request cycle via supertest
3. **Test Database** -- test DB management, fixtures, factories

## 🔥 Unit Testing with Vitest

```typescript
const mockDb = { users: { create: vi.fn().mockResolvedValue({ id: 1 }) } }
const service = new UserService(mockDb, mockMailer)
expect(mockDb.users.create).toHaveBeenCalledWith(data)
```

Mock req/res for handler testing, vi.spyOn for spying.

## ��� Integration Tests with Supertest

```typescript
const res = await request(app)
  .post('/api/users')
  .send({ name: 'Alice', email: 'alice@test.com' })
  .set('Authorization', `Bearer ${token}`)
  .expect(201)
```

## 🔥 Test Database

Global setup/teardown, beforeEach cleanup, factories with random data.

## ⚠️ Common Beginner Mistakes

- Tests depending on each other
- Not cleaning DB between tests
- Mocking everything (hides real bugs)
- Testing implementation instead of behavior

## 💡 Best Practices

1. Unit tests for service business logic
2. Integration tests for API endpoints with real DB
3. Clean DB before each test
4. Use factories with random data
5. Each test creates its own data
