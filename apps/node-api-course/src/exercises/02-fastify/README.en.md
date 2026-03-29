# 🔥 Level 2: Fastify

## 🎯 Why Fastify

Fastify is a high-performance web framework for Node.js focused on speed and low overhead. In benchmarks, Fastify handles 2-3x more requests per second than Express.

Key differences from Express:
- **JSON Schema** validation built-in (via Ajv)
- **Automatic response serialization** (fast-json-stringify)
- **Plugin system** with encapsulation
- **Lifecycle hooks** for precise request handling control
- **TypeScript** support out of the box

## 🔥 Routes and JSON Schema

```typescript
fastify.post('/api/users', {
  schema: {
    body: {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        name: { type: 'string', minLength: 2 },
        email: { type: 'string', format: 'email' }
      },
      additionalProperties: false
    },
    response: {
      201: {
        type: 'object',
        properties: { id: { type: 'integer' }, name: { type: 'string' } }
      }
    }
  }
}, handler)
```

Response schema automatically removes extra fields (password, internal data) from responses.

## 🔥 Plugins and Decorators

```typescript
import fp from 'fastify-plugin'

async function dbPlugin(fastify, opts) {
  const pool = new Pool(opts.connectionString)
  fastify.decorate('db', pool)
}
export default fp(dbPlugin)  // fp() breaks encapsulation -- visible everywhere
```

## 🔥 Lifecycle Hooks

```
Request -> onRequest -> preParsing -> preValidation -> preHandler -> Handler
Reply   -> preSerialization -> onSend -> onResponse
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: Forgetting return in hooks
```typescript
// ❌ Hook doesn't stop processing
fastify.addHook('preHandler', async (request, reply) => {
  if (!request.user) reply.code(401).send({ error: 'Unauthorized' })
})
// ✅ return stops the chain
if (!request.user) return reply.code(401).send({ error: 'Unauthorized' })
```

### Mistake 2: Not using fp() for shared plugins
### Mistake 3: Missing response schema (data leak risk)

## 💡 Best Practices

1. Always define JSON Schema for body, params, and response
2. Use fp() for global plugins (db, auth, config)
3. Use hooks instead of Express middleware pattern
4. Enable built-in logging: `Fastify({ logger: true })`
