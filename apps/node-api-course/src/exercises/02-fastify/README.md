# 🔥 Уровень 2: Fastify

## 🎯 Почему Fastify

Fastify -- высокопроизводительный веб-фреймворк для Node.js, ориентированный на скорость и низкие накладные расходы. В бенчмарках Fastify обрабатывает в 2-3 раза больше запросов в секунду, чем Express.

Ключевые отличия от Express:
- **JSON Schema** валидация из коробки (через Ajv)
- **Автоматическая сериализация** ответов (fast-json-stringify)
- **Система плагинов** с инкапсуляцией
- **Lifecycle хуки** для точного контроля обработки запросов
- **TypeScript** поддержка из коробки

```
npm install fastify
```

## 🔥 Маршруты и JSON Schema

### Определение маршрутов

```typescript
import Fastify from 'fastify'

const fastify = Fastify({ logger: true })

// Короткая форма:
fastify.get('/api/users', async (request, reply) => {
  return { users: [] }  // Автоматически сериализуется в JSON
})

// Полная форма с JSON Schema:
fastify.post('/api/users', {
  schema: {
    body: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: { type: 'string', minLength: 2, maxLength: 100 },
        email: { type: 'string', format: 'email' },
        age: { type: 'integer', minimum: 0 }
      },
      additionalProperties: false
    },
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  const { name, email } = request.body
  reply.code(201)
  return { id: 1, name, email }
})
```

📌 **Важно:** Response schema не только валидирует, но и **сериализует** -- лишние поля (password, internal data) автоматически удаляются из ответа. Это и безопасность, и производительность.

### Валидация параметров и query

```typescript
fastify.get('/api/users/:id', {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' }
      }
    },
    querystring: {
      type: 'object',
      properties: {
        fields: { type: 'string' }
      }
    }
  }
}, handler)
```

## 🔥 Плагины и декораторы

### Система плагинов

Fastify построен на плагинах. Каждый плагин -- это изолированный контекст (encapsulated context).

```typescript
import fp from 'fastify-plugin'

// Плагин для подключения к БД
async function dbPlugin(fastify, opts) {
  const pool = new Pool(opts.connectionString)

  // Декоратор -- добавляет свойство к Fastify instance
  fastify.decorate('db', pool)

  // Хук на закрытие приложения
  fastify.addHook('onClose', async () => {
    await pool.end()
  })
}

// fp() пробивает инкапсуляцию -- плагин виден ВЕЗДЕ
export default fp(dbPlugin)
```

### Инкапсуляция

```
fastify.register(dbPlugin)       // global (через fp)
fastify.register(authPlugin)     // global (через fp)

fastify.register(usersRoutes)    // encapsulated
fastify.register(postsRoutes)    // encapsulated
```

Без `fp()` плагин видит только "родительские" декораторы, но не "соседние". Это ключевое отличие от Express middleware.

### Типы декораторов

```typescript
fastify.decorate('config', configObject)         // На instance
fastify.decorateRequest('user', null)             // На каждый Request
fastify.decorateReply('sendError', errorFunction) // На каждый Reply
```

## 🔥 Lifecycle хуки

Fastify предоставляет хуки на каждом этапе жизненного цикла запроса:

```
Request -> onRequest -> preParsing -> preValidation -> preHandler -> Handler
Reply   -> preSerialization -> onSend -> onResponse
Error   -> onError
```

### Примеры использования хуков

```typescript
// Логирование (onRequest)
fastify.addHook('onRequest', async (request, reply) => {
  request.startTime = process.hrtime.bigint()
})

// Аутентификация (preHandler)
fastify.addHook('preHandler', async (request, reply) => {
  const token = request.headers.authorization
  if (!token) {
    reply.code(401).send({ error: 'Unauthorized' })
    return  // Прерывает цепочку!
  }
  request.user = verifyToken(token)
})

// Удаление чувствительных данных (preSerialization)
fastify.addHook('preSerialization', async (request, reply, payload) => {
  if (payload?.password) delete payload.password
  return payload
})

// Метрики (onResponse)
fastify.addHook('onResponse', async (request, reply) => {
  const duration = Number(process.hrtime.bigint() - request.startTime) / 1e6
  metrics.record(request.method, request.url, reply.statusCode, duration)
})
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: Забывают return в хуках

```typescript
// ❌ Хук не прерывает обработку
fastify.addHook('preHandler', async (request, reply) => {
  if (!request.user) {
    reply.code(401).send({ error: 'Unauthorized' })
    // Обработка продолжается!
  }
})

// ✅ return прерывает цепочку
fastify.addHook('preHandler', async (request, reply) => {
  if (!request.user) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }
})
```

### Ошибка 2: Не используют fp() для shared плагинов

```typescript
// ❌ db доступен только внутри этого register
fastify.register(async (instance) => {
  instance.decorate('db', pool)
})
fastify.register(usersRoutes) // usersRoutes НЕ видит db!

// ✅ fp() пробивает инкапсуляцию
fastify.register(fp(async (instance) => {
  instance.decorate('db', pool)
}))
```

### Ошибка 3: Не определяют response schema

```typescript
// ❌ Без response schema -- password утечёт к клиенту!
fastify.get('/api/users/:id', async (req) => {
  return db.getUser(req.params.id) // { id, name, email, password_hash }
})

// ✅ Response schema автоматически фильтрует поля
fastify.get('/api/users/:id', {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: { id: { type: 'integer' }, name: { type: 'string' } }
      }
    }
  }
}, handler)
```

## 💡 Best Practices

1. **Всегда определяйте JSON Schema** для body, params и response
2. **Используйте fp()** для плагинов, которые должны быть глобальными (db, auth, config)
3. **Используйте TypeScript** -- Fastify отлично типизирован
4. **Используйте хуки** вместо middleware-паттерна Express
5. **Не мутируйте request/reply** вне декораторов -- используйте decorateRequest
6. **Включите логирование** через встроенный pino: `Fastify({ logger: true })`
7. **Используйте @fastify/autoload** для автозагрузки плагинов и маршрутов
