import { useState } from 'react'

// ============================================
// Задание 9.1: OpenAPI → TypeScript
// ============================================

interface MappingExample {
  id: string
  label: string
  openapi: string
  typescript: string
  description: string
}

const MAPPING_EXAMPLES: MappingExample[] = [
  {
    id: 'simple',
    label: 'Простая модель',
    description: 'Базовые типы: string, number, boolean, integer → number',
    openapi: `components:
  schemas:
    User:
      type: object
      required:
        - id
        - name
        - email
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
          minLength: 1
        email:
          type: string
          format: email
        age:
          type: integer
          minimum: 0
        isActive:
          type: boolean`,
    typescript: `export interface User {
  id: string        // format: uuid
  name: string      // minLength: 1
  email: string     // format: email
  age?: number      // integer → number
  isActive?: boolean
}`,
  },
  {
    id: 'enum',
    label: 'Enum',
    description: 'OpenAPI enum превращается в TypeScript union type из строковых литералов',
    openapi: `components:
  schemas:
    OrderStatus:
      type: string
      enum:
        - pending
        - processing
        - shipped
        - delivered
        - cancelled

    Order:
      type: object
      required: [id, status]
      properties:
        id:
          type: string
        status:
          $ref: '#/components/schemas/OrderStatus'
        priority:
          type: string
          enum:
            - low
            - medium
            - high`,
    typescript: `export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: string
  status: OrderStatus
  priority?: 'low' | 'medium' | 'high'
}`,
  },
  {
    id: 'array',
    label: 'Массивы',
    description: 'type: array + items → TypeScript Array<T> или T[]',
    openapi: `components:
  schemas:
    ProductList:
      type: object
      required: [items, total]
      properties:
        items:
          type: array
          items:
            $ref: '#/components/schemas/Product'
        tags:
          type: array
          items:
            type: string
        scores:
          type: array
          items:
            type: number
          minItems: 1
          maxItems: 10`,
    typescript: `export interface ProductList {
  items: Product[]
  total: number
  tags?: string[]
  scores?: number[]
  // minItems/maxItems — только runtime,
  // в TypeScript не выражаются
}`,
  },
  {
    id: 'nested',
    label: 'Вложенные объекты',
    description: '$ref на другую схему → ссылка на соответствующий TypeScript interface',
    openapi: `components:
  schemas:
    Address:
      type: object
      required: [street, city]
      properties:
        street:
          type: string
        city:
          type: string
        country:
          type: string
          default: "RU"

    UserProfile:
      type: object
      required: [id, address]
      properties:
        id:
          type: string
          format: uuid
        address:
          $ref: '#/components/schemas/Address'
        billingAddress:
          $ref: '#/components/schemas/Address'`,
    typescript: `export interface Address {
  street: string
  city: string
  country?: string  // default: "RU"
}

export interface UserProfile {
  id: string
  address: Address
  billingAddress?: Address
}`,
  },
  {
    id: 'oneof',
    label: 'oneOf → Union type',
    description: 'oneOf / anyOf превращается в TypeScript union type (|)',
    openapi: `components:
  schemas:
    Notification:
      oneOf:
        - $ref: '#/components/schemas/EmailNotification'
        - $ref: '#/components/schemas/SmsNotification'
        - $ref: '#/components/schemas/PushNotification'

    EmailNotification:
      type: object
      required: [type, to, subject]
      properties:
        type:
          type: string
          enum: [email]
        to:
          type: string
          format: email
        subject:
          type: string`,
    typescript: `export type Notification =
  | EmailNotification
  | SmsNotification
  | PushNotification

export interface EmailNotification {
  type: 'email'
  to: string     // format: email
  subject: string
}

// Discriminated union — TypeScript сужает тип
// по полю type автоматически`,
  },
  {
    id: 'allof',
    label: 'allOf → Intersection type',
    description: 'allOf превращается в TypeScript intersection type (&) — аналог "наследования"',
    openapi: `components:
  schemas:
    BaseEntity:
      type: object
      required: [id, createdAt, updatedAt]
      properties:
        id:
          type: string
          format: uuid
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    Product:
      allOf:
        - $ref: '#/components/schemas/BaseEntity'
        - type: object
          required: [name, price]
          properties:
            name:
              type: string
            price:
              type: number`,
    typescript: `export interface BaseEntity {
  id: string        // format: uuid
  createdAt: string // format: date-time
  updatedAt: string // format: date-time
}

// Вариант 1: intersection type
export type Product = BaseEntity & {
  name: string
  price: number
}

// Вариант 2: extends (зависит от генератора)
export interface Product extends BaseEntity {
  name: string
  price: number
}`,
  },
]

export function Task9_1_Solution() {
  const [activeId, setActiveId] = useState<string>('simple')
  const active = MAPPING_EXAMPLES.find(e => e.id === activeId)!

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1100px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>OpenAPI → TypeScript</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Как типы OpenAPI-спецификации превращаются в TypeScript-интерфейсы при генерации кода
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {MAPPING_EXAMPLES.map(ex => (
          <button
            key={ex.id}
            onClick={() => setActiveId(ex.id)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '6px',
              border: activeId === ex.id ? '2px solid #6366f1' : '2px solid #e2e8f0',
              background: activeId === ex.id ? '#6366f1' : '#fff',
              color: activeId === ex.id ? '#fff' : '#374151',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <div
        style={{
          background: '#fefce8',
          border: '1px solid #fde68a',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          fontSize: '0.875rem',
          color: '#92400e',
        }}
      >
        💡 {active.description}
      </div>

      {/* Split view */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* OpenAPI */}
        <div>
          <div
            style={{
              background: '#0f172a',
              borderRadius: '10px 10px 0 0',
              padding: '0.6rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                background: '#10b981',
                borderRadius: '4px',
                padding: '0.15rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.05em',
              }}
            >
              YAML
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>openapi.yaml</span>
          </div>
          <pre
            style={{
              margin: 0,
              background: '#1e293b',
              borderRadius: '0 0 10px 10px',
              padding: '1rem',
              fontSize: '0.8rem',
              lineHeight: 1.7,
              color: '#e2e8f0',
              overflow: 'auto',
              minHeight: '280px',
            }}
          >
            {active.openapi}
          </pre>
        </div>

        {/* TypeScript */}
        <div>
          <div
            style={{
              background: '#0f172a',
              borderRadius: '10px 10px 0 0',
              padding: '0.6rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                background: '#3b82f6',
                borderRadius: '4px',
                padding: '0.15rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.05em',
              }}
            >
              TS
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>api.d.ts (сгенерировано)</span>
          </div>
          <pre
            style={{
              margin: 0,
              background: '#1e293b',
              borderRadius: '0 0 10px 10px',
              padding: '1rem',
              fontSize: '0.8rem',
              lineHeight: 1.7,
              color: '#93c5fd',
              overflow: 'auto',
              minHeight: '280px',
            }}
          >
            {active.typescript}
          </pre>
        </div>
      </div>

      {/* Mapping reference */}
      <div
        style={{
          marginTop: '1.5rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
        }}
      >
        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151', marginBottom: '0.75rem' }}>
          Таблица маппинга типов
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.8rem' }}>
          {[
            ['type: string', 'string'],
            ['type: integer', 'number'],
            ['type: number', 'number'],
            ['type: boolean', 'boolean'],
            ['type: array + items: T', 'T[]'],
            ['type: object', 'interface {}'],
            ['enum: [a, b]', "'a' | 'b'"],
            ['oneOf: [A, B]', 'A | B'],
            ['allOf: [A, B]', 'A & B'],
            ['anyOf: [A, B]', 'A | B | (A & B)'],
            ['required: [x]', 'x: T (обязательное)'],
            ['без required', 'x?: T (опциональное)'],
          ].map(([openapi, ts]) => (
            <div
              key={openapi}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#fff',
                border: '1px solid #f1f5f9',
                borderRadius: '6px',
                padding: '0.4rem 0.6rem',
              }}
            >
              <code style={{ color: '#10b981', fontSize: '0.75rem', flex: 1 }}>{openapi}</code>
              <span style={{ color: '#94a3b8' }}>→</span>
              <code style={{ color: '#3b82f6', fontSize: '0.75rem', flex: 1 }}>{ts}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 9.2: Сравнение инструментов
// ============================================

interface Tool {
  id: string
  name: string
  tagline: string
  color: string
  generates: string[]
  pros: string[]
  cons: string[]
  command: string
  output: string
}

const TOOLS: Tool[] = [
  {
    id: 'openapi-generator',
    name: 'openapi-generator',
    tagline: 'Универсальный генератор (50+ языков)',
    color: '#10b981',
    generates: [
      'TypeScript interfaces + enums',
      'API-клиенты (fetch, axios, angular)',
      'React Query хуки (опционально)',
      'Документация, серверные стабы',
    ],
    pros: [
      'Поддержка 50+ языков и фреймворков',
      'Гибкие Mustache-шаблоны — кастомизация любого вывода',
      'Активное сообщество, частые обновления',
      'Единый инструмент для всей команды (фронт + бэк)',
    ],
    cons: [
      'Требует Java (JRE) или Docker — тяжёлая зависимость',
      'Сложная конфигурация для нестандартных случаев',
      'Сгенерированный код бывает "многословным"',
      'Медленнее нативных JS/TS инструментов',
    ],
    command: `npx @openapitools/openapi-generator-cli generate \\
  -i openapi.yaml \\
  -g typescript-fetch \\
  -o src/api/generated \\
  --additional-properties=typescriptThreePlus=true`,
    output: `// src/api/generated/models/User.ts
export interface User {
  id: string
  name: string
  email: string
  age?: number
}

// src/api/generated/apis/UsersApi.ts
export class UsersApi extends BaseAPI {
  async getUser(id: string): Promise<User> {
    const response = await this.request({
      path: \`/users/\${id}\`,
      method: 'GET',
    })
    return response.json()
  }
}`,
  },
  {
    id: 'openapi-typescript',
    name: 'openapi-typescript',
    tagline: 'Лёгкий, только типы, npm-native',
    color: '#3b82f6',
    generates: [
      'TypeScript types (только типы, без runtime)',
      'Строго типизированные пути и методы',
      'Поддержка openapi-fetch для типобезопасных запросов',
    ],
    pros: [
      'Нет зависимости от Java — чистый Node.js',
      'Очень быстрый (< 1 сек для большинства спек)',
      'Генерирует только типы — нет лишнего кода',
      'Отличная интеграция с openapi-fetch',
    ],
    cons: [
      'Только TypeScript, только типы',
      'Нет генерации хуков (нужен openapi-fetch отдельно)',
      'Меньше кастомизации по сравнению с openapi-generator',
    ],
    command: `npx openapi-typescript openapi.yaml \\
  -o src/api/schema.d.ts`,
    output: `// src/api/schema.d.ts (автогенерат)
export interface paths {
  '/users/{id}': {
    get: {
      parameters: { path: { id: string } }
      responses: {
        200: { content: { 'application/json': components['schemas']['User'] } }
        404: { content: { 'application/json': components['schemas']['Error'] } }
      }
    }
  }
}

export interface components {
  schemas: {
    User: { id: string; name: string; email: string }
    Error: { code: string; message: string }
  }
}`,
  },
  {
    id: 'orval',
    name: 'orval',
    tagline: 'React Query / SWR / Axios интеграция',
    color: '#8b5cf6',
    generates: [
      'React Query / SWR хуки',
      'Axios-клиенты с типами',
      'MSW-моки для тестирования',
      'Zod/Yup схемы валидации',
    ],
    pros: [
      'Готовые useQuery/useMutation хуки из коробки',
      'Генерация MSW-моков — тесты без бэкенда',
      'Гибкий конфиг orval.config.ts',
      'Поддержка множества выходных форматов',
    ],
    cons: [
      'Ориентирован на React-экосистему',
      'Чуть больше конфигурации для старта',
      'Зависит от выбранного HTTP-клиента',
    ],
    command: `# orval.config.ts
export default defineConfig({
  petstore: {
    input: './openapi.yaml',
    output: {
      mode: 'tags-split',
      target: 'src/api/generated',
      client: 'react-query',
      mock: true,
    },
  },
})

# Запуск
npx orval`,
    output: `// src/api/generated/users.ts (автогенерат)
export const useGetUser = (id: string) =>
  useQuery({
    queryKey: ['getUser', id],
    queryFn: () => getUser(id),
  })

export const useCreateUser = () =>
  useMutation({
    mutationFn: (data: CreateUserDto) => createUser(data),
  })

// src/api/generated/users.msw.ts
export const getUserMock = (): User => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
})`,
  },
]

export function Task9_2_Solution() {
  const [activeTool, setActiveTool] = useState<string>('openapi-typescript')
  const [showTable, setShowTable] = useState<boolean>(false)
  const tool = TOOLS.find(t => t.id === activeTool)!

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1100px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Сравнение инструментов генерации</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Три основных инструмента для генерации TypeScript-кода из OpenAPI-спецификации
      </p>

      {/* Tool selector */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {TOOLS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              border: `2px solid ${activeTool === t.id ? t.color : '#e2e8f0'}`,
              background: activeTool === t.id ? t.color : '#fff',
              color: activeTool === t.id ? '#fff' : '#374151',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {t.name}
          </button>
        ))}
        <button
          onClick={() => setShowTable(!showTable)}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '10px',
            border: `2px solid ${showTable ? '#f59e0b' : '#e2e8f0'}`,
            background: showTable ? '#fef3c7' : '#fff',
            color: showTable ? '#92400e' : '#374151',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
        >
          {showTable ? 'Скрыть таблицу' : 'Таблица сравнения'}
        </button>
      </div>

      {/* Comparison table */}
      {showTable && (
        <div
          style={{
            marginBottom: '1.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  Критерий
                </th>
                {TOOLS.map(t => (
                  <th
                    key={t.id}
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'center',
                      borderBottom: '1px solid #e2e8f0',
                      color: t.color,
                      fontWeight: 700,
                    }}
                  >
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Runtime зависимость', 'Java / Docker', 'Node.js', 'Node.js'],
                ['Генерирует хуки', '⚠️ опционально', '❌ нет', '✅ да'],
                ['Генерирует моки', '❌ нет', '❌ нет', '✅ да'],
                ['Скорость генерации', '🐢 медленно', '⚡ быстро', '⚡ быстро'],
                ['Кастомизация', '✅ Mustache', '⚠️ ограничена', '✅ конфиг'],
                ['Размер npm', '~10 MB', '~2 MB', '~5 MB'],
                ['Поддержка языков', '50+', 'только TS', 'только JS/TS'],
                ['Идеально для', 'multi-lang команды', 'типы + openapi-fetch', 'React Query/SWR'],
              ].map(([label, ...vals]) => (
                <tr key={label} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.6rem 1rem', color: '#374151', fontWeight: 500 }}>{label}</td>
                  {vals.map((v, i) => (
                    <td key={i} style={{ padding: '0.6rem 1rem', textAlign: 'center', color: '#64748b' }}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tool detail */}
      <div style={{ border: `2px solid ${tool.color}20`, borderRadius: '12px', overflow: 'hidden' }}>
        {/* Header */}
        <div
          style={{
            background: `${tool.color}15`,
            borderBottom: `1px solid ${tool.color}30`,
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: tool.color }}>{tool.name}</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.2rem' }}>{tool.tagline}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {tool.generates.map(g => (
              <span
                key={g}
                style={{
                  background: '#fff',
                  border: `1px solid ${tool.color}40`,
                  borderRadius: '6px',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.75rem',
                  color: '#374151',
                }}
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Pros / Cons */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#10b981', marginBottom: '0.5rem' }}>
                  ✅ Плюсы
                </div>
                {tool.pros.map(p => (
                  <div
                    key={p}
                    style={{
                      fontSize: '0.8rem',
                      color: '#374151',
                      padding: '0.3rem 0',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    {p}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#ef4444', marginBottom: '0.5rem' }}>
                  ❌ Минусы
                </div>
                {tool.cons.map(c => (
                  <div
                    key={c}
                    style={{
                      fontSize: '0.8rem',
                      color: '#374151',
                      padding: '0.3rem 0',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Command + Output */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem', fontWeight: 600 }}>
                Команда
              </div>
              <pre
                style={{
                  margin: 0,
                  background: '#1e293b',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '0.72rem',
                  color: '#a3e635',
                  overflow: 'auto',
                  lineHeight: 1.6,
                }}
              >
                {tool.command}
              </pre>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem', fontWeight: 600 }}>
                Пример вывода (фрагмент)
              </div>
              <pre
                style={{
                  margin: 0,
                  background: '#1e293b',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '0.72rem',
                  color: '#93c5fd',
                  overflow: 'auto',
                  lineHeight: 1.6,
                }}
              >
                {tool.output}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 9.3: Настройка генерации
// ============================================

interface ChecklistItem {
  id: string
  step: number
  title: string
  description: string
  code: string
  lang: string
}

const SETUP_STEPS: ChecklistItem[] = [
  {
    id: 'install',
    step: 1,
    title: 'Установить openapi-typescript',
    description: 'Добавить пакет как dev-зависимость',
    code: `npm install -D openapi-typescript
# или если используете openapi-fetch для HTTP-запросов:
npm install openapi-fetch
npm install -D openapi-typescript`,
    lang: 'bash',
  },
  {
    id: 'script',
    step: 2,
    title: 'Добавить скрипт в package.json',
    description: 'Прописать команду генерации в scripts для воспроизводимости',
    code: `{
  "scripts": {
    "generate:api": "openapi-typescript openapi.yaml -o src/api/schema.d.ts",
    "generate:api:remote": "openapi-typescript https://api.example.com/openapi.json -o src/api/schema.d.ts",
    "dev": "npm run generate:api && vite"
  }
}`,
    lang: 'json',
  },
  {
    id: 'gitignore',
    step: 3,
    title: 'Решить: коммитить ли сгенерированные файлы?',
    description: 'Два подхода: коммитить (стабильно, видны diff) или игнорировать (генерация в CI)',
    code: `# Вариант A: генерировать в CI, игнорировать в git
# .gitignore
src/api/schema.d.ts

# Вариант B: коммитить (рекомендуется для небольших команд)
# — не добавлять в .gitignore
# — добавить в pre-commit хук:
# npm run generate:api && git add src/api/schema.d.ts`,
    lang: 'bash',
  },
  {
    id: 'client',
    step: 4,
    title: 'Создать типизированный клиент',
    description: 'Использовать сгенерированные типы с openapi-fetch или обычным fetch',
    code: `// src/api/client.ts
import createClient from 'openapi-fetch'
import type { paths } from './schema.d.ts'

export const apiClient = createClient<paths>({
  baseUrl: 'https://api.example.com',
})

// Теперь запросы полностью типизированы:
const { data, error } = await apiClient.GET('/users/{id}', {
  params: { path: { id: 'abc-123' } },
  // TypeScript знает: id должен быть string
})

// data: User | undefined (автоматически!)
// error: Error | undefined`,
    lang: 'typescript',
  },
  {
    id: 'usage',
    step: 5,
    title: 'Использование в React компоненте',
    description: 'Пример с React Query + сгенерированными типами',
    code: `// src/components/UserProfile.tsx
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { components } from '../api/schema.d.ts'

// Тип берём прямо из сгенерированной схемы
type User = components['schemas']['User']

function UserProfile({ id }: { id: string }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/users/{id}', {
        params: { path: { id } },
      })
      if (error) throw new Error(error.message)
      return data  // тип: User (из схемы)
    },
  })

  if (isLoading) return <div>Загрузка...</div>
  return <div>{user?.name}</div>  // автокомплит работает!
}`,
    lang: 'typescript',
  },
  {
    id: 'ci',
    step: 6,
    title: 'Настроить CI/CD пайплайн',
    description: 'Автоматическая регенерация при обновлении спецификации',
    code: `# .github/workflows/generate-api.yml
name: Generate API types

on:
  # Срабатывает когда обновляется спека
  push:
    paths:
      - 'openapi.yaml'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run generate:api
      - name: Commit updated types
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'chore: regenerate API types'
          file_pattern: 'src/api/schema.d.ts'`,
    lang: 'yaml',
  },
]

const LANG_COLORS: Record<string, string> = {
  bash: '#a3e635',
  json: '#fbbf24',
  typescript: '#93c5fd',
  yaml: '#f0abfc',
}

export function Task9_3_Solution() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [activeStep, setActiveStep] = useState<string>('install')

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const activeItem = SETUP_STEPS.find(s => s.id === activeStep)!
  const progress = Math.round((checked.size / SETUP_STEPS.length) * 100)

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1100px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Настройка генерации типов</h2>
      <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Пошаговая инструкция: от установки openapi-typescript до CI/CD пайплайна
      </p>

      {/* Progress bar */}
      <div
        style={{
          background: '#f1f5f9',
          borderRadius: '999px',
          height: '8px',
          marginBottom: '0.5rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: progress === 100 ? '#10b981' : '#6366f1',
            borderRadius: '999px',
            transition: 'width 0.3s',
          }}
        />
      </div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>
        {checked.size} из {SETUP_STEPS.length} шагов выполнено
        {progress === 100 && ' 🎉 Настройка завершена!'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.25rem' }}>
        {/* Checklist */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1rem',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
            ШАГИ НАСТРОЙКИ
          </div>
          {SETUP_STEPS.map(step => (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activeStep === step.id ? '#6366f115' : 'transparent',
                border: activeStep === step.id ? '1px solid #6366f130' : '1px solid transparent',
                marginBottom: '0.25rem',
                transition: 'all 0.15s',
              }}
            >
              {/* Checkbox */}
              <div
                onClick={e => { e.stopPropagation(); toggle(step.id) }}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: `2px solid ${checked.has(step.id) ? '#10b981' : '#cbd5e1'}`,
                  background: checked.has(step.id) ? '#10b981' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {checked.has(step.id) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: checked.has(step.id) ? '#94a3b8' : '#1e293b',
                    textDecoration: checked.has(step.id) ? 'line-through' : 'none',
                  }}
                >
                  {step.step}. {step.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Step detail */}
        <div>
          <div
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {/* Step header */}
            <div
              style={{
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#6366f1',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  flexShrink: 0,
                }}
              >
                {activeItem.step}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{activeItem.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.1rem' }}>{activeItem.description}</div>
              </div>
              <button
                onClick={() => toggle(activeItem.id)}
                style={{
                  marginLeft: 'auto',
                  padding: '0.4rem 1rem',
                  borderRadius: '8px',
                  border: `1px solid ${checked.has(activeItem.id) ? '#10b98140' : '#e2e8f0'}`,
                  background: checked.has(activeItem.id) ? '#f0fdf4' : '#fff',
                  color: checked.has(activeItem.id) ? '#10b981' : '#64748b',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {checked.has(activeItem.id) ? '✅ Готово' : 'Отметить выполненным'}
              </button>
            </div>

            {/* Code */}
            <div>
              <div
                style={{
                  background: '#0f172a',
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    background: LANG_COLORS[activeItem.lang] + '30',
                    color: LANG_COLORS[activeItem.lang],
                    borderRadius: '4px',
                    padding: '0.1rem 0.5rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  {activeItem.lang.toUpperCase()}
                </span>
              </div>
              <pre
                style={{
                  margin: 0,
                  background: '#1e293b',
                  padding: '1.25rem',
                  fontSize: '0.8rem',
                  lineHeight: 1.7,
                  color: LANG_COLORS[activeItem.lang] || '#e2e8f0',
                  overflow: 'auto',
                  minHeight: '200px',
                }}
              >
                {activeItem.code}
              </pre>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            {SETUP_STEPS.findIndex(s => s.id === activeStep) > 0 && (
              <button
                onClick={() => {
                  const idx = SETUP_STEPS.findIndex(s => s.id === activeStep)
                  setActiveStep(SETUP_STEPS[idx - 1].id)
                }}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  color: '#374151',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                ← Назад
              </button>
            )}
            {SETUP_STEPS.findIndex(s => s.id === activeStep) < SETUP_STEPS.length - 1 && (
              <button
                onClick={() => {
                  const idx = SETUP_STEPS.findIndex(s => s.id === activeStep)
                  toggle(activeStep)
                  setActiveStep(SETUP_STEPS[idx + 1].id)
                }}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  border: '1px solid #6366f1',
                  background: '#6366f1',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Отметить и продолжить →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div
        style={{
          marginTop: '1.5rem',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
        }}
      >
        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0369a1', marginBottom: '0.5rem' }}>
          📌 Рекомендации по workflow
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.8rem', color: '#374151' }}>
          <div>
            <strong>Маленькая команда:</strong> коммитить schema.d.ts в git — проще, diff виден в PR.
          </div>
          <div>
            <strong>Большая команда:</strong> генерировать в CI, публиковать как npm-пакет — все берут одну версию.
          </div>
          <div>
            <strong>Монорепо:</strong> выделить пакет @company/api-types, версионировать вместе с backend.
          </div>
        </div>
      </div>
    </div>
  )
}
