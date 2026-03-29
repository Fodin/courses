# 🔥 Уро��ень 11: Тестирование API

## 🎯 Три уровня тестирования

1. **Unit тесты** -- изолированное тестирование функций/сервисов с моками
2. **Integration тесты** -- полный цикл запроса через supertest
3. **Test Database** -- управление тестовой БД, fixtures, factories

## 🔥 Пирамида тестирования

```
        /  E2E  \        Медленные, хрупкие, мало
       / Integr. \       Средние по скорости, надёжные
      /   Unit    \      Быстрые, много, изолированные
```

| Тип | Скорость | Надёжность | Покрытие |
|---|---|---|---|
| Unit | Мгновенно (~1-5 мс) | Высокая (изолированы) | Логика сервисов |
| Integration | Средне (~20-100 мс) | Средняя | HTTP + middleware + DB |
| E2E | Медленно (~1-10 с) | Низкая (хрупкие) | Весь стек |

## 🔥 Unit Testing с Vitest

### Мокирование зависимостей

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

class UserService {
  constructor(private db: Database, private mailer: Mailer) {}

  async createUser(data: CreateUserDTO) {
    const user = await this.db.users.create(data)
    await this.mailer.sendWelcome(user.email)
    return user
  }
}

describe('UserService', () => {
  let service: UserService
  let mockDb: any
  let mockMailer: any

  beforeEach(() => {
    mockDb = {
      users: {
        create: vi.fn().mockResolvedValue({
          id: 1, name: 'Alice', email: 'alice@test.com'
        }),
        findById: vi.fn()
      }
    }
    mockMailer = {
      sendWelcome: vi.fn().mockResolvedValue(true)
    }
    service = new UserService(mockDb, mockMailer)
  })

  it('creates user and sends welcome email', async () => {
    const result = await service.createUser({
      name: 'Alice', email: 'alice@test.com'
    })

    expect(result.id).toBe(1)
    expect(mockDb.users.create).toHaveBeenCalledWith({
      name: 'Alice', email: 'alice@test.com'
    })
    expect(mockMailer.sendWelcome).toHaveBeenCalledWith('alice@test.com')
    expect(mockMailer.sendWelcome).toHaveBeenCalledTimes(1)
  })
})
```

### Тестирование обработчиков

```typescript
// Mock req/res
const mockReq = (overrides = {}) => ({
  params: {}, query: {}, body: {},
  ...overrides
}) as unknown as Request

const mockRes = () => {
  const res = {} as Response
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

it('returns 404 when user not found', async () => {
  vi.spyOn(UserService, 'findById').mockResolvedValue(null)
  const req = mockReq({ params: { id: '999' } })
  const res = mockRes()

  await getUserHandler(req, res)

  expect(res.status).toHaveBeenCalledWith(404)
  expect(res.json).toHaveBeenCalledWith({ error: 'User not found' })
})
```

### Стратегии мокирования

```typescript
// vi.fn() -- создать мок-функцию
const fn = vi.fn().mockReturnValue(42)

// vi.spyOn() -- шпионить за существующим методом
const spy = vi.spyOn(obj, 'method').mockResolvedValue(data)

// vi.mock() -- замокать весь модуль
vi.mock('../services/email', () => ({
  sendEmail: vi.fn().mockResolvedValue(true)
}))

// afterEach -- сбросить моки
afterEach(() => {
  vi.restoreAllMocks()
})
```

## 🔥 Integration Tests с Supertest

### Полный цикл запроса

```typescript
import request from 'supertest'
import { app } from '../app'

describe('POST /api/users', () => {
  it('creates a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Alice', email: 'alice@test.com', password: 'secret123' })
      .set('Content-Type', 'application/json')
      .expect(201)
      .expect('Content-Type', /json/)

    expect(res.body).toMatchObject({
      id: expect.any(Number),
      name: 'Alice',
      email: 'alice@test.com'
    })
    expect(res.body).not.toHaveProperty('password')
  })

  it('returns 400 for invalid data', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: '' })
      .expect(400)

    expect(res.body.errors).toBeDefined()
  })

  it('returns 409 for duplicate email', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'Alice', email: 'dup@test.com', password: 'secret' })
      .expect(201)

    await request(app)
      .post('/api/users')
      .send({ name: 'Bob', email: 'dup@test.com', password: 'secret' })
      .expect(409)
  })
})
```

### Тесты с аутентификацией

```typescript
describe('GET /api/users (with auth)', () => {
  let token: string

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'admin' })
    token = res.body.token
  })

  it('returns users list with valid token', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('returns 401 without token', async () => {
    await request(app)
      .get('/api/users')
      .expect(401)
  })
})
```

## 🔥 Test Database

### Глобальная настройка

```typescript
// vitest.config.ts
export default defineConfig({
  globalSetup: './tests/global-setup.ts',
  setupFiles: ['./tests/setup.ts']
})

// global-setup.ts -- выполняется ОДИН раз
export async function setup() {
  await client.query('CREATE DATABASE test_db')
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: TEST_DB_URL }
  })
}

export async function teardown() {
  await client.query('DROP DATABASE test_db')
}
```

### Очистка между тестами

```typescript
// setup.ts -- выполняется перед каждым тестовым файлом
beforeEach(async () => {
  // Очистка в правильном порядке (FK constraints)
  await prisma.$transaction([
    prisma.comment.deleteMany(),
    prisma.post.deleteMany(),
    prisma.user.deleteMany()
  ])
})

afterAll(async () => {
  await prisma.$disconnect()
})
```

### Factories

```typescript
function createUserFactory(overrides: Partial<User> = {}) {
  return {
    name: `user-${randomUUID().slice(0, 8)}`,
    email: `${randomUUID().slice(0, 8)}@test.com`,
    password: await hash('password123', 10),
    role: 'user' as const,
    ...overrides
  }
}

async function seedTestData() {
  const admin = await prisma.user.create({
    data: createUserFactory({ role: 'admin', name: 'Admin' })
  })
  const user = await prisma.user.create({
    data: createUserFactory({ name: 'Test User' })
  })
  return { admin, user }
}

// Использование
it('admin can delete any post', async () => {
  const { admin, post } = await seedTestData()
  const token = generateToken(admin)

  await request(app)
    .delete(`/api/posts/${post.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
})
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: Тесты зависят друг от друга

```typescript
// ❌ Тест 2 зависит от данных теста 1
it('creates user', async () => { /* создаёт user */ })
it('gets created user', async () => { /* ожидает user из теста 1 */ })

// ✅ Каждый тест независим
it('gets user by id', async () => {
  const user = await createUser({ name: 'Alice' })  // свои данные
  const res = await request(app).get(`/api/users/${user.id}`)
  expect(res.body.name).toBe('Alice')
})
```

### Ошибка 2: Не очищают БД между тестами

```typescript
// ❌ Данные накапливаются, тесты ломаются в случайном порядке
describe('users', () => { /* без beforeEach cleanup */ })

// ✅ Очистка перед каждым тестом
beforeEach(async () => {
  await prisma.user.deleteMany()
})
```

### Ошибка 3: Мокают всё подряд

```typescript
// ❌ Мок скрывает реальные баги
vi.mock('../db', () => ({
  query: vi.fn().mockResolvedValue([{ id: 1 }])
}))
// Если запрос неправильный -- тест всё равно пройдёт!

// ✅ Integration тесты с реальной БД
const res = await request(app).get('/api/users')
// Реальный SQL, реальная валидация, реальные ошибки
```

### Ошибка 4: Тестируют имплементацию, а не поведение

```typescript
// ❌ Тестирует вызов конкретного метода
expect(db.query).toHaveBeenCalledWith('SELECT ...')

// ✅ Тестирует результат
expect(res.body).toMatchObject({ name: 'Alice' })
expect(res.status).toBe(200)
```

## 💡 Best Practices

1. **Unit тесты** для бизнес-логики сервисов (быстро, изолированно)
2. **Integration тесты** для API endpoints (supertest + реальная БД)
3. **Очистка** БД перед каждым тестом (beforeEach)
4. **Factories** вместо хардкод-данных (рандомные email/name)
5. **Независимость** -- каждый тест создаёт свои данные
6. **CI-совместимость** -- тестовая БД через Docker Compose
7. **Не мокайте БД** в integration тестах -- используйте test database
