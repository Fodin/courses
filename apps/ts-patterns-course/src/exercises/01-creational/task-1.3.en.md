# Task 1.3: Builder

## Objective

Implement the Builder pattern for step-by-step construction of SQL-like queries with a fluent API (method chaining).

## Requirements

1. Create a `Query` interface with fields:
   - `table: string`, `fields: string[]`, `conditions: string[]`
   - `order?: { field: string; direction: 'asc' | 'desc' }`
   - `limitCount?: number`
2. Create a `QueryBuilder` class with methods:
   - `.select(...fields: string[])` — select fields
   - `.from(table: string)` — specify the table
   - `.where(condition: string)` — add a condition (multiple allowed)
   - `.orderBy(field: string, direction: 'asc' | 'desc')` — set sort order
   - `.limit(count: number)` — limit the row count
   - `.build(): Query` — assemble the final object
   - `.toSQL(): string` — generate the SQL string
3. Each method (except `build`/`toSQL`) returns `this` for chaining
4. `build()` throws an error if `table` or `fields` are not specified

## Checklist

- [ ] Interface `Query` is defined
- [ ] `QueryBuilder` supports fluent chaining (`.select().from().where()`)
- [ ] Method `.where()` supports multiple conditions
- [ ] `build()` validates required fields
- [ ] `toSQL()` generates a correct SQL string
- [ ] Demonstration shows both simple and complex queries

## How to verify

1. Click the run button
2. Verify that the chain `.select().from().where().orderBy().limit().build()` works
3. Verify that `build()` without `.from()` throws an error
4. Verify that `toSQL()` generates valid SQL
