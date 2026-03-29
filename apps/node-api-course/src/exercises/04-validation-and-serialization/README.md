# 🔥 Уровень 4: Валидация и сериализация

## 🎯 Зачем валидировать входящие данные

Валидация -- первая линия обороны API. Без неё любые данные от клиента попадут в бизнес-логику и базу данных. Это приводит к:
- SQL/NoSQL инъекциям
- Невалидным данным в БД
- Неожиданным ошибкам в runtime
- Проблемам безопасности

📌 **Правило:** никогда не доверяйте данным от клиента. Валидируйте всё: body, params, query, headers.

## 🔥 Zod -- TypeScript-first валидация

Zod -- это библиотека валидации с автоматическим выводом TypeScript-типов.

```typescript
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150).optional(),
  role: z.enum(['user', 'admin', 'editor']).default('user'),
  tags: z.array(z.string()).max(10).optional(),
})

// Автоматический вывод типа!
type CreateUserInput = z.infer<typeof createUserSchema>
// { name: string, email: string, age?: number, role: 'user'|'admin'|'editor', tags?: string[] }
```

### Валидация

```typescript
// safeParse -- не бросает ошибку
const result = createUserSchema.safeParse(req.body)
if (!result.success) {
  return res.status(422).json({ error: formatError(result.error) })
}
const validatedData = result.data  // Типизированные данные
```

### Middleware для Express

```typescript
function validate<T extends z.ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    })
    if (!result.success) {
      return res.status(422).json({
        error: {
          code: 'VALIDATION_ERROR',
          details: result.error.issues.map(i => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
      })
    }
    Object.assign(req, result.data)
    next()
  }
}

// Использование:
router.post('/users', validate(createUserEndpointSchema), createUser)
```

### Продвинутые паттерны Zod

```typescript
// Трансформации
const dateSchema = z.string().transform(s => new Date(s))

// Refinement (кастомная валидация)
const passwordSchema = z.string()
  .min(8)
  .refine(p => /[A-Z]/.test(p), 'Must contain uppercase letter')
  .refine(p => /[0-9]/.test(p), 'Must contain number')

// Pipe (compose)
const numberString = z.string().pipe(z.coerce.number().int().positive())

// Discriminated unions
const eventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('click'), x: z.number(), y: z.number() }),
  z.object({ type: z.literal('scroll'), offset: z.number() }),
])
```

## 🔥 Joi -- зрелая валидация

Joi -- давно существующая библиотека с богатыми возможностями условной валидации.

```typescript
const Joi = require('joi')

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
    .messages({ 'string.min': 'Имя минимум {#limit} символов' }),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[A-Z])(?=.*[0-9])/)
    .messages({ 'string.pattern.base': 'Нужна заглавная буква и цифра' }),
  confirmPassword: Joi.ref('password'),
})

// Условная валидация
const paymentSchema = Joi.object({
  type: Joi.string().valid('card', 'bank').required(),
  cardNumber: Joi.when('type', {
    is: 'card',
    then: Joi.string().creditCard().required(),
    otherwise: Joi.forbidden()
  })
})
```

## 🔥 Response DTOs

DTO (Data Transfer Object) -- паттерн преобразования данных БД в формат API-ответа.

### Проблема

```typescript
// Объект из БД содержит чувствительные данные:
const user = await db.getUser(42)
// { id, name, email, password_hash, stripe_id, internal_notes, ... }

res.json(user)  // УТЕЧКА password_hash и других полей!
```

### Решение: DTO

```typescript
class UserResponseDTO {
  static fromEntity(user: UserEntity) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,  // snake_case -> camelCase
    }
  }
}

res.json({ data: UserResponseDTO.fromEntity(user) })
```

### Разные DTO для разных контекстов

```typescript
// Список: минимум данных
UserListDTO    -> { id, name, avatar }

// Детали: больше данных
UserDetailDTO  -> { id, name, email, bio, postsCount }

// Админка: полная информация
AdminUserDTO   -> { id, name, email, role, lastLogin, isBlocked }
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: Валидация только на клиенте

```typescript
// ❌ Клиентскую валидацию легко обойти (Postman, curl)
// Серверная валидация ОБЯЗАТЕЛЬНА

// ✅ Валидация на сервере — единственный источник правды
router.post('/users', validate(schema), handler)
```

### Ошибка 2: Отсутствие DTO — отправка объекта БД напрямую

```typescript
// ❌ password_hash утечёт!
res.json(await db.getUser(id))

// ✅ Используйте DTO
res.json(UserDTO.fromEntity(await db.getUser(id)))
```

### Ошибка 3: Статус 400 для всех ошибок валидации

```typescript
// ❌ 400 для всего
res.status(400).json({ error: 'Validation failed' })

// ✅ Используйте правильные коды
// 400 -- невалидный синтаксис запроса
// 422 -- валидный синтаксис, но невалидные данные
```

### Ошибка 4: Нет валидации params и query

```typescript
// ❌ Валидируют только body
// /api/users/abc -- id должен быть числом!

// ✅ Валидируйте всё
const schema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.object({ page: z.coerce.number().optional() }),
  body: z.object({ ... }),
})
```

## 💡 Best Practices

1. **Валидируйте body, params и query** -- не только body!
2. **Используйте Zod** для TypeScript проектов -- автоматический вывод типов
3. **Разделяйте схемы** на create/update -- update обычно partial
4. **Используйте DTO** для каждого endpoint -- разные контексты, разные поля
5. **Кэшируйте скомпилированные схемы** (Ajv, Joi) для производительности
6. **Возвращайте детали ошибок** -- path + message для каждого поля
7. **coerce** для query/params -- они приходят как строки
