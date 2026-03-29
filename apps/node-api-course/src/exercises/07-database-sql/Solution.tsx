import { useState } from 'react'

// ============================================
// Задание 7.1: Raw pg — Решение
// ============================================

export function Task7_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== PostgreSQL: Raw pg драйвер ===')
    log.push('')

    // Pool setup
    log.push('--- Настройка Pool ---')
    log.push('')
    log.push('const { Pool } = require("pg")')
    log.push('')
    log.push('const pool = new Pool({')
    log.push('  host: process.env.DB_HOST,')
    log.push('  port: 5432,')
    log.push('  database: "myapp",')
    log.push('  user: process.env.DB_USER,')
    log.push('  password: process.env.DB_PASSWORD,')
    log.push('  max: 20,             // Макс. соединений в пуле')
    log.push('  idleTimeoutMillis: 30000,  // Время жизни idle-соединения')
    log.push('  connectionTimeoutMillis: 5000')
    log.push('})')
    log.push('')

    // Parameterized queries
    log.push('--- Параметризованные запросы ---')
    log.push('')
    log.push('// ОПАСНО: SQL injection!')
    log.push('const BAD = `SELECT * FROM users WHERE id = ${userId}`')
    log.push('')
    log.push('// БЕЗОПАСНО: параметризованный запрос')
    log.push('const result = await pool.query(')
    log.push('  "SELECT * FROM users WHERE id = $1",')
    log.push('  [userId]')
    log.push(')')
    log.push('')

    // Simulate CRUD
    log.push('=== Симуляция CRUD операций ===')
    log.push('')

    log.push('--- SELECT (Read) ---')
    log.push('pool.query("SELECT id, name, email FROM users WHERE active = $1 ORDER BY name LIMIT $2", [true, 10])')
    log.push('')
    log.push('Result:')
    log.push(JSON.stringify({
      rows: [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
      ],
      rowCount: 2,
      command: 'SELECT',
    }, null, 2))
    log.push('')

    log.push('--- INSERT (Create) ---')
    log.push('pool.query(')
    log.push('  "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email",')
    log.push('  ["John", "john@example.com"]')
    log.push(')')
    log.push('')
    log.push('Result: { rows: [{ id: 42, name: "John", email: "john@example.com" }], rowCount: 1 }')
    log.push('')

    log.push('--- UPDATE ---')
    log.push('pool.query(')
    log.push('  "UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *",')
    log.push('  ["John Doe", 42]')
    log.push(')')
    log.push('')

    log.push('--- DELETE ---')
    log.push('pool.query("DELETE FROM users WHERE id = $1", [42])')
    log.push('Result: { rowCount: 1, command: "DELETE" }')
    log.push('')

    // Error handling
    log.push('--- Обработка ошибок pg ---')
    log.push('')
    log.push('try {')
    log.push('  await pool.query(...)')
    log.push('} catch (err) {')
    log.push('  if (err.code === "23505") // unique_violation')
    log.push('    -> 409 Conflict "Email already exists"')
    log.push('  if (err.code === "23503") // foreign_key_violation')
    log.push('    -> 422 "Referenced entity not found"')
    log.push('  if (err.code === "42P01") // undefined_table')
    log.push('    -> 500 Internal Server Error')
    log.push('}')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.1: Raw pg</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 7.2: Knex — Решение
// ============================================

export function Task7_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Knex: Query Builder ===')
    log.push('')

    // Setup
    log.push('--- Настройка Knex ---')
    log.push('')
    log.push('const knex = require("knex")({')
    log.push('  client: "pg",')
    log.push('  connection: process.env.DATABASE_URL,')
    log.push('  pool: { min: 2, max: 10 }')
    log.push('})')
    log.push('')

    // Query examples
    log.push('--- Query Builder ---')
    log.push('')

    const queries = [
      {
        desc: 'SELECT с фильтрацией',
        knex: 'knex("users").select("id", "name", "email").where("active", true).orderBy("name").limit(10)',
        sql: 'SELECT id, name, email FROM users WHERE active = true ORDER BY name LIMIT 10',
      },
      {
        desc: 'INSERT',
        knex: 'knex("users").insert({ name: "John", email: "john@e.com" }).returning("*")',
        sql: "INSERT INTO users (name, email) VALUES ('John', 'john@e.com') RETURNING *",
      },
      {
        desc: 'JOIN',
        knex: 'knex("posts").join("users", "posts.author_id", "users.id").select("posts.*", "users.name as author")',
        sql: 'SELECT posts.*, users.name as author FROM posts JOIN users ON posts.author_id = users.id',
      },
      {
        desc: 'WHERE complex',
        knex: 'knex("users").where("age", ">=", 18).whereIn("role", ["admin", "editor"]).whereNotNull("email")',
        sql: "SELECT * FROM users WHERE age >= 18 AND role IN ('admin', 'editor') AND email IS NOT NULL",
      },
    ]

    for (const q of queries) {
      log.push(`  ${q.desc}:`)
      log.push(`  Knex: ${q.knex}`)
      log.push(`  SQL:  ${q.sql}`)
      log.push('')
    }

    // Migrations
    log.push('--- Миграции ---')
    log.push('')
    log.push('npx knex migrate:make create_users')
    log.push('')
    log.push('// migrations/20240315_create_users.js')
    log.push('exports.up = function(knex) {')
    log.push('  return knex.schema.createTable("users", (table) => {')
    log.push('    table.increments("id").primary()')
    log.push('    table.string("name", 100).notNullable()')
    log.push('    table.string("email").unique().notNullable()')
    log.push('    table.string("password_hash").notNullable()')
    log.push('    table.enum("role", ["user", "admin", "editor"]).defaultTo("user")')
    log.push('    table.boolean("active").defaultTo(true)')
    log.push('    table.timestamps(true, true)  // created_at, updated_at')
    log.push('  })')
    log.push('}')
    log.push('')
    log.push('exports.down = (knex) => knex.schema.dropTable("users")')
    log.push('')

    // Seeds
    log.push('--- Seeds ---')
    log.push('')
    log.push('npx knex seed:make 01_users')
    log.push('')
    log.push('exports.seed = async function(knex) {')
    log.push('  await knex("users").del()')
    log.push('  await knex("users").insert([')
    log.push('    { name: "Admin", email: "admin@example.com", role: "admin" },')
    log.push('    { name: "John", email: "john@example.com", role: "user" }')
    log.push('  ])')
    log.push('}')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.2: Knex</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 7.3: Prisma — Решение
// ============================================

export function Task7_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Prisma ORM ===')
    log.push('')

    // Schema
    log.push('--- Prisma Schema (schema.prisma) ---')
    log.push('')
    log.push('model User {')
    log.push('  id        Int      @id @default(autoincrement())')
    log.push('  email     String   @unique')
    log.push('  name      String')
    log.push('  role      Role     @default(USER)')
    log.push('  posts     Post[]')
    log.push('  profile   Profile?')
    log.push('  createdAt DateTime @default(now())')
    log.push('  updatedAt DateTime @updatedAt')
    log.push('}')
    log.push('')
    log.push('model Post {')
    log.push('  id        Int      @id @default(autoincrement())')
    log.push('  title     String')
    log.push('  content   String?')
    log.push('  published Boolean  @default(false)')
    log.push('  author    User     @relation(fields: [authorId], references: [id])')
    log.push('  authorId  Int')
    log.push('}')
    log.push('')
    log.push('enum Role { USER ADMIN EDITOR }')
    log.push('')

    // CRUD operations
    log.push('--- Типизированные CRUD операции ---')
    log.push('')

    log.push('// Create')
    log.push('const user = await prisma.user.create({')
    log.push('  data: { name: "John", email: "john@example.com" }')
    log.push('})')
    log.push('// TypeScript знает: user.id: number, user.name: string ...')
    log.push('')

    log.push('// Find with relations')
    log.push('const user = await prisma.user.findUnique({')
    log.push('  where: { id: 42 },')
    log.push('  include: {')
    log.push('    posts: { where: { published: true }, orderBy: { createdAt: "desc" } },')
    log.push('    profile: true')
    log.push('  }')
    log.push('})')
    log.push('')

    log.push('Результат:')
    log.push(JSON.stringify({
      id: 42,
      name: 'John',
      email: 'john@example.com',
      role: 'USER',
      posts: [
        { id: 1, title: 'First Post', published: true },
        { id: 3, title: 'Third Post', published: true },
      ],
      profile: { bio: 'Developer', avatar: '/avatars/42.jpg' },
    }, null, 2))
    log.push('')

    log.push('// Pagination')
    log.push('const users = await prisma.user.findMany({')
    log.push('  skip: 20,')
    log.push('  take: 10,')
    log.push('  where: { role: "USER" },')
    log.push('  orderBy: { createdAt: "desc" },')
    log.push('  select: { id: true, name: true, email: true }')
    log.push('})')
    log.push('')

    log.push('// Upsert')
    log.push('await prisma.user.upsert({')
    log.push('  where: { email: "john@example.com" },')
    log.push('  update: { name: "John Updated" },')
    log.push('  create: { name: "John", email: "john@example.com" }')
    log.push('})')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.3: Prisma</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 7.4: Транзакции и пулинг — Решение
// ============================================

export function Task7_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Транзакции и Connection Pooling ===')
    log.push('')

    // Transaction patterns
    log.push('--- Паттерны транзакций ---')
    log.push('')
    log.push('// pg: ручные транзакции')
    log.push('const client = await pool.connect()')
    log.push('try {')
    log.push('  await client.query("BEGIN")')
    log.push('  await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [100, fromId])')
    log.push('  await client.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [100, toId])')
    log.push('  await client.query("INSERT INTO transfers (...) VALUES (...)")')
    log.push('  await client.query("COMMIT")')
    log.push('} catch (err) {')
    log.push('  await client.query("ROLLBACK")')
    log.push('  throw err')
    log.push('} finally {')
    log.push('  client.release()  // ВАЖНО: вернуть соединение в пул!')
    log.push('}')
    log.push('')

    // Simulate transfer
    log.push('=== Симуляция банковского перевода ===')
    log.push('')
    log.push('BEGIN')
    log.push('  [1] UPDATE accounts SET balance = 1000 - 100 = 900 WHERE id = 1')
    log.push('  [2] UPDATE accounts SET balance = 500 + 100 = 600 WHERE id = 2')
    log.push('  [3] INSERT INTO transfers (from, to, amount) VALUES (1, 2, 100)')
    log.push('COMMIT')
    log.push('')
    log.push('Все 3 операции выполнены атомарно!')
    log.push('')

    // Prisma transactions
    log.push('--- Prisma: $transaction ---')
    log.push('')
    log.push('// Interactive transaction:')
    log.push('await prisma.$transaction(async (tx) => {')
    log.push('  const from = await tx.account.update({')
    log.push('    where: { id: 1 },')
    log.push('    data: { balance: { decrement: 100 } }')
    log.push('  })')
    log.push('  if (from.balance < 0) throw new Error("Insufficient funds")')
    log.push('  await tx.account.update({')
    log.push('    where: { id: 2 },')
    log.push('    data: { balance: { increment: 100 } }')
    log.push('  })')
    log.push('})')
    log.push('')

    // Connection pool tuning
    log.push('--- Connection Pool Tuning ---')
    log.push('')
    log.push('  Формула: pool_size = (cpu_cores * 2) + disk_spindles')
    log.push('  Для SSD на 4-ядерном CPU: ~10 соединений')
    log.push('')

    const poolMetrics = [
      { metric: 'max', value: '20', desc: 'Макс. соединений' },
      { metric: 'min', value: '5', desc: 'Мин. соединений (keep warm)' },
      { metric: 'idle timeout', value: '30s', desc: 'Время до закрытия idle' },
      { metric: 'connection timeout', value: '5s', desc: 'Таймаут подключения' },
      { metric: 'query timeout', value: '30s', desc: 'Таймаут запроса' },
    ]

    for (const m of poolMetrics) {
      log.push(`  ${m.metric.padEnd(20)} ${m.value.padEnd(6)} // ${m.desc}`)
    }
    log.push('')

    // Deadlocks
    log.push('--- Deadlock предотвращение ---')
    log.push('')
    log.push('// Deadlock: TX1 locks A, waits B. TX2 locks B, waits A.')
    log.push('')
    log.push('// Решение: всегда блокируйте ресурсы в одном порядке!')
    log.push('const [id1, id2] = [fromId, toId].sort((a, b) => a - b)')
    log.push('// SELECT ... WHERE id = $1 FOR UPDATE')
    log.push('// SELECT ... WHERE id = $2 FOR UPDATE')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.4: Транзакции и пулинг</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
