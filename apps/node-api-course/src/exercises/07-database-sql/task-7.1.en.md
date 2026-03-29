# Task 7.1: Raw pg

## 🎯 Goal

Master PostgreSQL interaction via the `pg` driver: Pool configuration, parameterized queries, CRUD operations, and error handling.

## Requirements

1. Configure `Pool` with: host, port, database, user, password, max, idleTimeoutMillis, connectionTimeoutMillis
2. Show the SQL injection danger and the solution via parameterized queries (`$1`, `$2`, ...)
3. Implement CRUD: SELECT (with filtering), INSERT RETURNING, UPDATE RETURNING, DELETE
4. Show the result structure: `{ rows, rowCount, command }`
5. Handle pg errors: unique_violation (23505), foreign_key_violation (23503), undefined_table (42P01)

## Checklist

- [ ] Pool configured with max connections and timeouts
- [ ] SQL injection shown as anti-pattern, parameterization as the solution
- [ ] CRUD operations use `pool.query(sql, params)`
- [ ] INSERT/UPDATE use RETURNING to get the created/updated record
- [ ] pg errors handled by err.code with mapping to HTTP status codes

## How to Verify

Click "Run" and verify that: Pool is configured, all CRUD operations shown with SQL and results, and pg errors are mapped to HTTP status codes.
