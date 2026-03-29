# Task 7.2: Knex

## 🎯 Goal

Master the Knex query builder: building queries, schema migrations, and seeds for initial data.

## Requirements

1. Configure Knex: client, connection, pool options
2. Show the query builder: `knex('table').select().where().orderBy().limit()`
3. Show complex queries: JOIN, WHERE with operators (>=, IN), whereNotNull
4. Implement a migration: `createTable` with columns (increments, string, enum, boolean, timestamps)
5. Implement a seed: `knex('table').del()` + `knex('table').insert([...])`

## Checklist

- [ ] Knex configured with pg client and pool
- [ ] Query builder: SELECT, INSERT (returning), JOIN shown with SQL equivalents
- [ ] WHERE: simple, with operators (>=), whereIn, whereNotNull
- [ ] Migration: createTable with primary key, unique, notNullable, defaultTo, timestamps
- [ ] Seed: cleanup + initial data insertion

## How to Verify

Click "Run" and verify that: each Knex query is shown with its SQL equivalent, migration creates a users table with all columns, and seed populates initial data.
