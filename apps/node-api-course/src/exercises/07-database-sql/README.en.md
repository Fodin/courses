# 🔥 Level 7: SQL Databases

## 🎯 Three Levels of Abstraction

1. **Raw driver (pg)** -- direct SQL queries, full control
2. **Query builder (Knex)** -- programmatic SQL construction, migrations
3. **ORM (Prisma)** -- typed operations, auto-generated client

## 🔥 Raw pg

```typescript
const pool = new Pool({ connectionString: DATABASE_URL, max: 20 })
const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [42])
```

Always use parameterized queries to prevent SQL injection.

## 🔥 Knex

```typescript
const users = await knex('users').where('active', true).orderBy('name').limit(20)
```

Migrations: `knex migrate:make`, `knex migrate:latest`, `knex migrate:rollback`.

## 🔥 Prisma

```typescript
const user = await prisma.user.findUnique({
  where: { id: 42 },
  include: { posts: true }
})
// Fully typed!
```

## 🔥 Transactions

```typescript
// pg: BEGIN -> queries -> COMMIT/ROLLBACK -> release
// Prisma: prisma.$transaction(async (tx) => { ... })
```

Pool tuning formula: `pool_size = (cpu_cores * 2) + spindle_count`

## ⚠️ Common Beginner Mistakes

- SQL injection via string concatenation
- Not releasing connections back to pool
- N+1 queries (use JOINs or includes)
- Transactions without ROLLBACK

## 💡 Best Practices

1. Always parameterize queries
2. Use migrations for schema management
3. Configure connection pool properly
4. Transactions with BEGIN/COMMIT/ROLLBACK and release
5. Avoid N+1 with JOINs or includes
