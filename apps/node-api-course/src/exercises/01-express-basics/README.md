# 🔥 Уровень 1: Основы Express

## 🎯 Почему Express

Express -- самый популярный HTTP-фреймворк для Node.js. Он минималистичный, ненавязчивый и предоставляет тонкий слой абстракции поверх модуля `http`. Express не диктует архитектуру -- он даёт инструменты для маршрутизации, middleware и обработки запросов.

```
npm install express @types/express
```

## 🔥 Маршрутизация

### Базовые маршруты

```typescript
import express from 'express'
const app = express()

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'John' }])
})

app.post('/api/users', (req, res) => {
  const user = createUser(req.body)
  res.status(201).json(user)
})

app.put('/api/users/:id', (req, res) => {
  const user = updateUser(parseInt(req.params.id), req.body)
  res.json(user)
})

app.delete('/api/users/:id', (req, res) => {
  deleteUser(parseInt(req.params.id))
  res.status(204).end()
})
```

### Параметры маршрута (req.params)

```typescript
// /api/users/42 -> req.params.id === '42'
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id)
  // ...
})

// /api/users/42/posts/7 -> req.params = { userId: '42', postId: '7' }
app.get('/api/users/:userId/posts/:postId', (req, res) => {
  // ...
})
```

### Query Parameters (req.query)

```typescript
// /api/users?page=2&limit=10&sort=name
app.get('/api/users', (req, res) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 20
  const sort = req.query.sort as string || 'id'
  // ...
})
```

### express.Router -- модульная маршрутизация

```typescript
// routes/users.ts
import { Router } from 'express'
const router = Router()

router.get('/', getUsers)       // GET /api/users
router.get('/:id', getUserById) // GET /api/users/:id
router.post('/', createUser)    // POST /api/users
router.put('/:id', updateUser)  // PUT /api/users/:id
router.delete('/:id', deleteUser) // DELETE /api/users/:id

export default router

// app.ts
import usersRouter from './routes/users'
import postsRouter from './routes/posts'

app.use('/api/users', usersRouter)
app.use('/api/posts', postsRouter)
```

📌 **Важно:** Router изолирует маршруты в модули. Префикс (`/api/users`) задаётся при подключении, а внутри Router'а пути относительные.

## 🔥 Middleware

Middleware -- это функция, которая имеет доступ к `req`, `res` и `next`. Middleware выполняются **последовательно** в порядке регистрации.

```typescript
function myMiddleware(req, res, next) {
  // 1. Выполнить логику (логирование, проверка, модификация req)
  console.log(`${req.method} ${req.url}`)

  // 2. Передать управление следующему middleware
  next()

  // 3. (опционально) Код после next() выполняется после обработчика
}
```

### Порядок выполнения

```typescript
app.use(express.json())         // 1. Парсинг JSON body
app.use(cors())                 // 2. CORS заголовки
app.use(requestLogger)          // 3. Логирование
app.use('/api', authMiddleware) // 4. Аутентификация (только /api/*)
app.use('/api', apiRouter)      // 5. Маршруты API
app.use(express.static('public')) // 6. Статические файлы
app.use(notFoundHandler)        // 7. 404 для всех остальных
app.use(errorHandler)           // 8. Обработка ошибок (4 аргумента!)
```

### Middleware на уровне маршрута

```typescript
// Один middleware:
app.get('/api/admin', isAdmin, adminHandler)

// Цепочка middleware:
app.post('/api/posts',
  authMiddleware,
  validateBody(createPostSchema),
  rateLimiter,
  createPost
)
```

## 🔥 Обработка ошибок

### Error-handling middleware

Express определяет error middleware по **4 аргументам** (обязательно!):

```typescript
function errorHandler(
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.error(err.stack)

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message }
    })
  }

  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' }
  })
}
```

### Пользовательские ошибки

```typescript
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message)
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}
```

### Async Error Wrapper

📌 Express 4 **не ловит** ошибки из async-функций автоматически!

```typescript
// ❌ Ошибка улетит в unhandled rejection
app.get('/api/users', async (req, res) => {
  const users = await db.getUsers() // Если упадёт...
  res.json(users)
})

// ✅ Обёртка для async handlers:
const asyncHandler = (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)

app.get('/api/users', asyncHandler(async (req, res) => {
  const users = await db.getUsers() // Ошибка попадёт в errorHandler
  res.json(users)
}))
```

💡 В Express 5 (beta) async ошибки ловятся автоматически.

## 🔥 Шаблонизаторы (EJS)

Express поддерживает серверный рендеринг HTML через шаблонизаторы.

```typescript
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/users', async (req, res) => {
  const users = await getUsers()
  res.render('users/list', { title: 'Users', users })
})
```

### Синтаксис EJS

```html
<%= variable %>          <!-- Вывод с экранированием -->
<%- rawHtml %>           <!-- Без экранирования (опасно!) -->
<% if (users.length) { %>  <!-- Логика -->
  <ul>
  <% users.forEach(u => { %>
    <li><%= u.name %></li>
  <% }) %>
  </ul>
<% } %>
<%- include('partials/header') %>  <!-- Подключение partial -->
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: Порядок middleware

```typescript
// ❌ errorHandler зарегистрирован ДО маршрутов
app.use(errorHandler)
app.use('/api', apiRouter)  // Ошибки не попадут в errorHandler!

// ✅ errorHandler всегда ПОСЛЕДНИЙ
app.use('/api', apiRouter)
app.use(errorHandler)
```

### Ошибка 2: 3 аргумента в error middleware

```typescript
// ❌ Express не распознает как error middleware (нужно 4 аргумента!)
app.use((err, req, res) => { ... })

// ✅ Обязательно 4 аргумента, даже если next не используется
app.use((err, req, res, next) => { ... })
```

### Ошибка 3: Не парсят body

```typescript
// ❌ req.body === undefined
app.post('/api/users', (req, res) => {
  console.log(req.body) // undefined!
})

// ✅ Нужен middleware для парсинга
app.use(express.json())           // Для application/json
app.use(express.urlencoded({ extended: true })) // Для form data
```

### Ошибка 4: Async ошибки не перехватываются

```typescript
// ❌ Unhandled promise rejection
app.get('/api/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users')
  res.json(users)
})

// ✅ Используйте asyncHandler
app.get('/api/users', asyncHandler(async (req, res) => {
  const users = await db.query('SELECT * FROM users')
  res.json(users)
}))
```

## 💡 Best Practices

1. **Структурируйте код** через Router -- один файл на ресурс
2. **Всегда используйте asyncHandler** для async обработчиков в Express 4
3. **Порядок middleware**: парсинг -> CORS -> логирование -> аутентификация -> маршруты -> 404 -> ошибки
4. **Типизируйте** req.params и req.query через generics или Zod
5. **Не отправляйте стэктрейсы** в production -- только в development
6. **Используйте express.json()** с лимитом: `express.json({ limit: '100kb' })`
7. **Группируйте маршруты** логически: `/api/v1/users`, `/api/v1/posts`
