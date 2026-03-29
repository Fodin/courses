# 🔥 Level 1: Express Basics

## 🎯 Why Express

Express is the most popular HTTP framework for Node.js. It's minimalistic, unopinionated, and provides a thin abstraction layer over the `http` module.

## 🔥 Routing

```typescript
import express from 'express'
const app = express()

app.get('/api/users', (req, res) => res.json([]))
app.post('/api/users', (req, res) => res.status(201).json(user))
app.put('/api/users/:id', (req, res) => res.json(updated))
app.delete('/api/users/:id', (req, res) => res.status(204).end())
```

### Route Parameters and Query
```typescript
// /api/users/42 -> req.params.id === '42'
// /api/users?page=2 -> req.query.page === '2'
```

### express.Router
```typescript
const router = Router()
router.get('/', getUsers)
router.get('/:id', getUserById)
app.use('/api/users', router)
```

## 🔥 Middleware

Middleware is a function with access to `req`, `res`, and `next`. They execute sequentially in registration order.

```typescript
app.use(express.json())
app.use(cors())
app.use(requestLogger)
app.use('/api', authMiddleware)
app.use('/api', apiRouter)
app.use(errorHandler)  // Always last!
```

## 🔥 Error Handling

Express identifies error middleware by **4 arguments** (mandatory!):

```typescript
function errorHandler(err, req, res, next) {
  res.status(err.statusCode || 500).json({ error: err.message })
}
```

### Async Error Wrapper (Express 4 doesn't catch async errors!)
```typescript
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
```

## 🔥 Template Engines (EJS)

```typescript
app.set('view engine', 'ejs')
app.get('/users', async (req, res) => {
  res.render('users/list', { title: 'Users', users })
})
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: Wrong middleware order
```typescript
// ❌ errorHandler before routes
app.use(errorHandler)
app.use('/api', router)

// ✅ errorHandler always last
app.use('/api', router)
app.use(errorHandler)
```

### Mistake 2: 3 arguments in error middleware
```typescript
// ❌ Express won't recognize it (needs 4 args!)
app.use((err, req, res) => { ... })

// ✅ Must have 4 arguments
app.use((err, req, res, next) => { ... })
```

### Mistake 3: Not parsing body
```typescript
// ❌ req.body === undefined
// ✅ app.use(express.json())
```

## 💡 Best Practices

1. Structure code with Router -- one file per resource
2. Always use asyncHandler for async handlers in Express 4
3. Middleware order: parsing -> CORS -> logging -> auth -> routes -> 404 -> errors
4. Type req.params and req.query with generics or Zod
5. Don't send stack traces in production
6. Use express.json() with limit: `express.json({ limit: '100kb' })`
