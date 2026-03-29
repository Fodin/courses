# Task 11.3: Test Database

## 🎯 Goal

Master test DB management: global setup/teardown, cleanup between tests, factories for data generation, CI patterns.

## Requirements

1. Configure global setup: create test DB, run migrations
2. Configure global teardown: drop test DB
3. Implement beforeEach: clean tables in correct order (FK constraints)
4. Create factory functions: generate unique data (randomUUID for email/name)
5. Show seedTestData for creating related entities (admin, user, post)

## Checklist

- [ ] Global setup creates test DB and runs migrations
- [ ] Global teardown drops test DB
- [ ] beforeEach cleans tables respecting FK constraints
- [ ] Factory functions generate unique data
- [ ] Tests use seedTestData and are independent

## How to Verify

Click "Run" and verify that: test DB is created and dropped, tables cleaned between tests, factories generate unique data, tests are independent.
