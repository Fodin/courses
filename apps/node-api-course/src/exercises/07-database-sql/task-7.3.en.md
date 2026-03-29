# Task 7.3: Prisma

## 🎯 Goal

Master Prisma ORM: schema definition, client generation, and typed CRUD operations with relations.

## Requirements

1. Define Prisma schema: model User, Post with relations (@relation), enum Role
2. Show typed CRUD: create, findUnique, findMany, update, upsert, delete
3. Implement a query with relations: `include` for loading related data
4. Show pagination: `skip`, `take`, `orderBy`
5. Show `select` for choosing specific fields

## Checklist

- [ ] Schema: model User with @id, @unique, @default, @relation, @updatedAt
- [ ] Schema: model Post with foreign key via @relation(fields, references)
- [ ] CRUD fully typed: TypeScript knows all field types
- [ ] Include: loading related posts with filtering and sorting
- [ ] Select: choosing specific fields for query optimization

## How to Verify

Click "Run" and verify that: Prisma schema is defined, CRUD operations are typed, include loads relations, and the result contains nested data.
