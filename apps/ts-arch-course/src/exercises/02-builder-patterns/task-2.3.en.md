# Task 2.3: Conditional Builder Methods

## ��� Goal

Implement a Builder for database configuration where available methods depend on the selected database type.

## Requirements

1. Support at least 3 DB types: PostgreSQL, MySQL, SQLite
2. Common methods (database, logging) available for all types
3. Network methods (host, port) available only for PostgreSQL and MySQL
4. Type-specific methods:
   - PostgreSQL: ssl, poolSize
   - MySQL: charset
   - SQLite: filename, mode
5. Use this-parameter typing to restrict available methods
6. build() available only after choosing the DB type

## Checklist

- [ ] `builder.sqlite().host("x")` — compile error
- [ ] `builder.mysql().ssl(true)` — error (ssl only for postgres)
- [ ] `builder.postgres().filename("x")` — error (filename only for sqlite)
- [ ] `new DbConfigBuilder().build()` — error (no DB type selected)
- [ ] Each DB type has its own specific default settings

## How to Verify

Create configurations for all three DB types. Try calling specific methods on the wrong type — TypeScript should show an error. Verify that default values (port, charset) are correct.
