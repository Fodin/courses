import { useState } from 'react'

// ============================================
// Задание 4.1: Zod Validation — Решение
// ============================================

export function Task4_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Zod: Валидация запросов ===')
    log.push('')

    // Schema definition
    log.push('--- Определение Zod-схем ---')
    log.push('')
    log.push('import { z } from "zod"')
    log.push('')
    log.push('const createUserSchema = z.object({')
    log.push('  body: z.object({')
    log.push('    name: z.string().min(2).max(100),')
    log.push('    email: z.string().email(),')
    log.push('    age: z.number().int().min(0).max(150).optional(),')
    log.push('    role: z.enum(["user", "admin", "editor"]).default("user"),')
    log.push('    tags: z.array(z.string()).max(10).optional(),')
    log.push('  }),')
    log.push('  params: z.object({')
    log.push('    // пусто для POST')
    log.push('  }),')
    log.push('  query: z.object({')
    log.push('    // пусто для POST')
    log.push('  }),')
    log.push('})')
    log.push('')

    // Simulate validation
    log.push('=== Симуляция валидации ===')
    log.push('')

    // Valid request
    const validBody = { name: 'John Doe', email: 'john@example.com', age: 30, role: 'user' }
    log.push(`>> POST /api/users`)
    log.push(`>> Body: ${JSON.stringify(validBody)}`)
    log.push('   Zod validation: PASSED')
    log.push('   TypeScript type inferred: { name: string, email: string, age?: number, role: "user"|"admin"|"editor" }')
    log.push('<< 201 Created')
    log.push('')

    // Invalid request
    const invalidBody = { name: 'J', email: 'not-email', age: -5, role: 'superadmin' }
    log.push(`>> POST /api/users`)
    log.push(`>> Body: ${JSON.stringify(invalidBody)}`)
    log.push('   Zod validation: FAILED')
    log.push('<< 422 Unprocessable Entity')
    log.push(JSON.stringify({
      error: {
        code: 'VALIDATION_ERROR',
        details: [
          { path: ['body', 'name'], message: 'String must contain at least 2 character(s)' },
          { path: ['body', 'email'], message: 'Invalid email' },
          { path: ['body', 'age'], message: 'Number must be greater than or equal to 0' },
          { path: ['body', 'role'], message: "Invalid enum value. Expected 'user' | 'admin' | 'editor'" },
        ],
      },
    }, null, 2))
    log.push('')

    // Validation middleware
    log.push('--- Middleware для валидации ---')
    log.push('')
    log.push('function validate(schema: z.ZodSchema) {')
    log.push('  return (req, res, next) => {')
    log.push('    const result = schema.safeParse({')
    log.push('      body: req.body,')
    log.push('      params: req.params,')
    log.push('      query: req.query,')
    log.push('    })')
    log.push('    if (!result.success) {')
    log.push('      return res.status(422).json({')
    log.push('        error: formatZodError(result.error)')
    log.push('      })')
    log.push('    }')
    log.push('    req.validated = result.data')
    log.push('    next()')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// Использование:')
    log.push('router.post("/users", validate(createUserSchema), createUser)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Zod Validation</h2>
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
// Задание 4.2: Joi Validation — Решение
// ============================================

export function Task4_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Joi: Валидация с пользовательскими сообщениями ===')
    log.push('')

    // Schema definition
    log.push('--- Определение Joi-схемы ---')
    log.push('')
    log.push('const Joi = require("joi")')
    log.push('')
    log.push('const createUserSchema = Joi.object({')
    log.push('  name: Joi.string().min(2).max(100).required()')
    log.push('    .messages({')
    log.push('      "string.min": "Имя должно быть не менее {#limit} символов",')
    log.push('      "any.required": "Имя обязательно"')
    log.push('    }),')
    log.push('  email: Joi.string().email().required(),')
    log.push('  password: Joi.string().min(8).pattern(/^(?=.*[A-Z])(?=.*[0-9])/)')
    log.push('    .messages({')
    log.push('      "string.pattern.base": "Пароль должен содержать заглавную букву и цифру"')
    log.push('    }),')
    log.push('  confirmPassword: Joi.ref("password"),  // Должен совпадать')
    log.push('  role: Joi.string().valid("user", "admin").default("user"),')
    log.push('  settings: Joi.object({')
    log.push('    theme: Joi.string().valid("light", "dark"),')
    log.push('    notifications: Joi.boolean().default(true)')
    log.push('  }).default()')
    log.push('})')
    log.push('')

    // Conditional validation
    log.push('--- Условная валидация (alternatives) ---')
    log.push('')
    log.push('const paymentSchema = Joi.object({')
    log.push('  type: Joi.string().valid("card", "bank").required(),')
    log.push('  // Разные поля в зависимости от type:')
    log.push('  cardNumber: Joi.when("type", {')
    log.push('    is: "card",')
    log.push('    then: Joi.string().creditCard().required(),')
    log.push('    otherwise: Joi.forbidden()')
    log.push('  }),')
    log.push('  bankAccount: Joi.when("type", {')
    log.push('    is: "bank",')
    log.push('    then: Joi.string().pattern(/^\\d{20}$/).required(),')
    log.push('    otherwise: Joi.forbidden()')
    log.push('  })')
    log.push('})')
    log.push('')

    // Simulate validation
    log.push('=== Симуляция валидации ===')
    log.push('')

    const testCases = [
      {
        body: { name: 'J', email: 'invalid', password: 'weak' },
        errors: [
          'Имя должно быть не менее 2 символов',
          '"email" must be a valid email',
          'Пароль должен содержать заглавную букву и цифру',
        ],
      },
      {
        body: { type: 'card', bankAccount: '12345678901234567890' },
        errors: ['"bankAccount" is not allowed (type=card)', '"cardNumber" is required (type=card)'],
      },
    ]

    for (const tc of testCases) {
      log.push(`>> Body: ${JSON.stringify(tc.body)}`)
      log.push('   Validation: FAILED')
      for (const err of tc.errors) {
        log.push(`   - ${err}`)
      }
      log.push('')
    }

    // Joi vs Zod
    log.push('--- Joi vs Zod ---')
    log.push('')
    log.push('  Joi:')
    log.push('    + Условная валидация (when/alternatives)')
    log.push('    + Пользовательские сообщения из коробки')
    log.push('    + Зрелая библиотека, много возможностей')
    log.push('    - Нет TypeScript-вывода типов')
    log.push('')
    log.push('  Zod:')
    log.push('    + TypeScript-first: z.infer<typeof schema>')
    log.push('    + Маленький размер бандла')
    log.push('    + Composable (pipe, transform)')
    log.push('    - Кастомные сообщения менее удобны')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: Joi Validation</h2>
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
// Задание 4.3: Response DTOs — Решение
// ============================================

export function Task4_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Response DTOs: Сериализация ===')
    log.push('')

    // Problem
    log.push('--- Проблема: утечка внутренних данных ---')
    log.push('')
    log.push('// Без DTO — отправляем объект БД напрямую:')
    const dbUser = {
      id: 42,
      name: 'John',
      email: 'john@example.com',
      password_hash: '$2b$10$abc...',
      internal_notes: 'VIP client',
      stripe_customer_id: 'cus_xyz',
      created_at: '2024-01-15T10:30:00Z',
      __v: 3,
    }
    log.push(`res.json(user)  // ОПАСНО!`)
    log.push(JSON.stringify(dbUser, null, 2))
    log.push('')
    log.push('// password_hash, internal_notes, stripe_customer_id — УТЕЧКА!')
    log.push('')

    // Solution: DTO
    log.push('--- Решение: Data Transfer Object ---')
    log.push('')
    log.push('class UserResponseDTO {')
    log.push('  id: number')
    log.push('  name: string')
    log.push('  email: string')
    log.push('  createdAt: string')
    log.push('')
    log.push('  static fromEntity(user: UserEntity): UserResponseDTO {')
    log.push('    return {')
    log.push('      id: user.id,')
    log.push('      name: user.name,')
    log.push('      email: user.email,')
    log.push('      createdAt: user.created_at  // snake_case -> camelCase')
    log.push('    }')
    log.push('  }')
    log.push('}')
    log.push('')

    const dto = { id: 42, name: 'John', email: 'john@example.com', createdAt: '2024-01-15T10:30:00Z' }
    log.push('Результат сериализации:')
    log.push(JSON.stringify(dto, null, 2))
    log.push('')

    // toJSON pattern
    log.push('--- Паттерн toJSON ---')
    log.push('')
    log.push('// Mongoose/Sequelize: переопределение toJSON')
    log.push('userSchema.set("toJSON", {')
    log.push('  transform: (doc, ret) => {')
    log.push('    delete ret.password_hash')
    log.push('    delete ret.__v')
    log.push('    ret.id = ret._id')
    log.push('    delete ret._id')
    log.push('    return ret')
    log.push('  }')
    log.push('})')
    log.push('')

    // Different DTOs for different contexts
    log.push('--- Разные DTO для разных контекстов ---')
    log.push('')
    log.push('GET /api/users        -> UserListDTO   (id, name, avatar)')
    log.push('GET /api/users/:id    -> UserDetailDTO  (id, name, email, bio, posts)')
    log.push('GET /api/admin/users  -> AdminUserDTO   (id, name, email, role, lastLogin)')
    log.push('')

    const listDto = [{ id: 42, name: 'John', avatar: '/avatars/42.jpg' }]
    const detailDto = { id: 42, name: 'John', email: 'john@example.com', bio: '...', postsCount: 15 }
    const adminDto = { id: 42, name: 'John', email: 'john@example.com', role: 'user', lastLogin: '2024-03-01' }

    log.push('UserListDTO:')
    log.push(JSON.stringify(listDto, null, 2))
    log.push('')
    log.push('UserDetailDTO:')
    log.push(JSON.stringify(detailDto, null, 2))
    log.push('')
    log.push('AdminUserDTO:')
    log.push(JSON.stringify(adminDto, null, 2))

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.3: Response DTOs</h2>
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
