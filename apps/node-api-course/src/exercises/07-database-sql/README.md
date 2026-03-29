# 🔥 Уровень 7: Работа с SQL-базами данных

## 🎯 Три уровня абстракции

1. **Raw драйвер (pg)** -- прямые SQL-запросы, полный контроль
2. **Query builder (Knex)** -- программное построение SQL, миграции
3. **ORM (Prisma)** -- типизированные операции, автогенерация клиента

## 🔥 Raw pg -- драйвер PostgreSQL

### Connection Pool

```typescript
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: 'myapp',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,                    // Макс. соединений
  idleTimeoutMillis: 30000,   // Таймаут idle-соединения
  connectionTimeoutMillis: 5000
})
```

📌 **Pool vs Client:** всегда используйте Pool. Он управляет соединениями автоматически -- не нужно вручную подключаться/отключаться для каждого запроса.

### Параметризованные запросы

```typescript
// ❌ SQL Injection!
const BAD = `SELECT * FROM users WHERE name = '${name}'`

// ✅ Параметризованный запрос
const result = await pool.query(
  'SELECT * FROM users WHERE name = $1 AND age > $2',
  [name, 18]
)
```

### CRUD операции

```typescript
// SELECT
const { rows } = await pool.query(
  'SELECT id, name, email FROM users WHERE active = $1 LIMIT $2',
  [true, 20]
)

// INSERT с RETURNING
const { rows: [user] } = await pool.query(
  'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
  [name, email]
)

// UPDATE
await pool.query(
  'UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2',
  [newName, userId]
)

// DELETE
const { rowCount } = await pool.query(
  'DELETE FROM users WHERE id = $1',
  [userId]
)
if (rowCount === 0) throw new NotFoundError('User')
```

### Обработка ошибок PostgreSQL

```typescript
try {
  await pool.query(...)
} catch (err) {
  switch (err.code) {
    case '23505': // unique_violation
      throw new ConflictError('Email already exists')
    case '23503': // foreign_key_violation
      throw new ValidationError('Referenced entity not found')
    case '23502': // not_null_violation
      throw new ValidationError(`${err.column} is required`)
  }
  throw err
}
```

## 🔥 Knex -- Query Builder

### Построение запросов

```typescript
const knex = require('knex')({ client: 'pg', connection: DATABASE_URL })

// SELECT с фильтрацией
const users = await knex('users')
  .select('id', 'name', 'email')
  .where('active', true)
  .whereIn('role', ['admin', 'editor'])
  .orderBy('created_at', 'desc')
  .limit(20)
  .offset(0)

// JOIN
const posts = await knex('posts')
  .join('users', 'posts.author_id', 'users.id')
  .select('posts.*', 'users.name as authorName')
  .where('posts.published', true)
```

### Миграции

```bash
npx knex migrate:make create_users_table
npx knex migrate:latest
npx knex migrate:rollback
```

```typescript
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('name', 100).notNullable()
    table.string('email').unique().notNullable()
    table.enum('role', ['user', 'admin', 'editor']).defaultTo('user')
    table.boolean('active').defaultTo(true)
    table.timestamps(true, true)
  })
}
exports.down = (knex) => knex.schema.dropTable('users')
```

### Seeds

```bash
npx knex seed:make 01_users
npx knex seed:run
```

## 🔥 Prisma ORM

### Schema определение

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id       Int     @id @default(autoincrement())
  title    String
  content  String?
  author   User    @relation(fields: [authorId], references: [id])
  authorId Int
}

enum Role { USER ADMIN EDITOR }
```

### Типизированные операции

```typescript
// Все операции полностью типизированы!
const user = await prisma.user.create({
  data: { name: 'John', email: 'john@example.com' }
})
// user: { id: number, name: string, email: string, role: Role, ... }

// Include relations
const userWithPosts = await prisma.user.findUnique({
  where: { id: 42 },
  include: { posts: { where: { published: true } } }
})

// Select specific fields
const names = await prisma.user.findMany({
  select: { id: true, name: true }
})
// names: { id: number, name: string }[]
```

## 🔥 Транзакции

### Raw pg

```typescript
const client = await pool.connect()
try {
  await client.query('BEGIN')
  await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [100, fromId])
  await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [100, toId])
  await client.query('COMMIT')
} catch (err) {
  await client.query('ROLLBACK')
  throw err
} finally {
  client.release()  // Обязательно вернуть в пул!
}
```

### Prisma

```typescript
await prisma.$transaction(async (tx) => {
  const from = await tx.account.update({
    where: { id: fromId },
    data: { balance: { decrement: 100 } }
  })
  if (from.balance < 0) throw new Error('Insufficient funds')
  await tx.account.update({
    where: { id: toId },
    data: { balance: { increment: 100 } }
  })
})
```

### Connection Pool Tuning

Формула: `pool_size = (cpu_cores * 2) + effective_spindle_count`

Для SSD на 4 ядрах: ~10 соединений.

### Предотвращение Deadlock

Всегда блокируйте ресурсы в одном порядке:

```typescript
const [id1, id2] = [fromId, toId].sort((a, b) => a - b)
await client.query('SELECT * FROM accounts WHERE id = $1 FOR UPDATE', [id1])
await client.query('SELECT * FROM accounts WHERE id = $1 FOR UPDATE', [id2])
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: Конкатенация SQL

```typescript
// ❌ SQL Injection!
`SELECT * FROM users WHERE name = '${name}'`

// ✅ Параметризованные запросы
pool.query('SELECT * FROM users WHERE name = $1', [name])
```

### Ошибка 2: Не возвращают соединение в пул

```typescript
// ❌ Утечка соединений! Пул быстро исчерпается
const client = await pool.connect()
await client.query(...)
// Забыли client.release()

// ✅ finally блок
try { ... } finally { client.release() }
```

### Ошибка 3: N+1 запросы

```typescript
// ❌ 1 запрос на список + N запросов на связи
const users = await db.getUsers()
for (const user of users) {
  user.posts = await db.getPostsByUserId(user.id) // N запросов!
}

// ✅ JOIN или include
const users = await prisma.user.findMany({ include: { posts: true } })
```

### Ошибка 4: Транзакция без ROLLBACK

```typescript
// ❌ Без catch -- транзакция зависнет
await client.query('BEGIN')
await client.query('UPDATE ...')
await client.query('COMMIT')

// ✅ try/catch/finally
try { BEGIN; ...; COMMIT } catch { ROLLBACK } finally { release }
```

## 💡 Best Practices

1. **Всегда параметризуйте запросы** -- никогда не конкатенируйте
2. **Используйте миграции** для управления схемой (Knex, Prisma)
3. **Connection pool** -- настройте max, idleTimeout, connectionTimeout
4. **Транзакции** -- BEGIN/COMMIT/ROLLBACK с обязательным release
5. **Избегайте N+1** -- используйте JOIN или include
6. **RETURNING** -- возвращайте данные из INSERT/UPDATE
7. **Индексы** -- создавайте для часто фильтруемых/сортируемых колонок
