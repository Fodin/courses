# Task 10.5: Type-Level SQL Builder

## Goal

Create a type-safe SQL query builder that validates queries at compile time: valid table names, correct column names, proper value types in WHERE clauses.

## Requirements

1. Define a `DBSchema` interface with `users`, `posts`, `comments` tables and their columns
2. Implement utility types `TableName`, `ColumnOf<T>` for extracting schema metadata
3. Implement `SQLBuilder<T, Selected>` class with methods:
   - `select(...columns)` — selects specific columns (with type narrowing of the result)
   - `where(column, op, value)` — adds a filter condition
   - `orderByCol(column, direction)` — sorting
   - `limit(n)` — limit count
   - `toSQL()` — generates SQL string
   - `execute()` — returns an array typed as `Pick<Schema[T], Selected>[]`
4. Implement a `from<T>(table)` function for convenient builder creation
5. Show several query examples with different method combinations

## Checklist

- [ ] `from("users").select("id", "name")` — compiles
- [ ] `from("users").select("nonexistent")` — compile error
- [ ] `from("users").where("name", "=", "Alice")` — compiles
- [ ] `from("users").where("fake", "=", 1)` — compile error
- [ ] `from("nonexistent")` — compile error
- [ ] `toSQL()` generates correct SQL
- [ ] `execute()` returns type with only selected columns

## How to Verify

1. Verify that `select` narrows the `execute()` return type
2. Try passing a wrong-type value to `where` — should produce an error
3. Check that without calling `select`, all columns are returned
