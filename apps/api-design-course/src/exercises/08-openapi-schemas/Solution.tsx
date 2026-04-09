import { useState } from 'react'

// ============================================
// Задание 8.1: Визуализатор $ref
// ============================================

interface SchemaNode {
  id: string
  label: string
  color: string
  refs: string[]
  yaml: string
}

const SCHEMA_NODES: SchemaNode[] = [
  {
    id: 'User',
    label: 'User',
    color: '#6366f1',
    refs: ['Address'],
    yaml: `User:
  type: object
  required: [id, name, email, address]
  properties:
    id:
      type: string
      format: uuid
    name:
      type: string
    email:
      type: string
      format: email
    address:
      $ref: "#/components/schemas/Address"`,
  },
  {
    id: 'Address',
    label: 'Address',
    color: '#0ea5e9',
    refs: [],
    yaml: `Address:
  type: object
  required: [street, city, country]
  properties:
    street:
      type: string
      example: "Тверская, 1"
    city:
      type: string
      example: "Москва"
    country:
      type: string
      example: "RU"
    postalCode:
      type: string
      example: "125009"`,
  },
  {
    id: 'Order',
    label: 'Order',
    color: '#10b981',
    refs: ['User', 'OrderItem'],
    yaml: `Order:
  type: object
  required: [id, user, items, total, status]
  properties:
    id:
      type: string
      format: uuid
    user:
      $ref: "#/components/schemas/User"
    items:
      type: array
      items:
        $ref: "#/components/schemas/OrderItem"
    total:
      type: number
      format: float
      example: 1499.99
    status:
      type: string
      enum: [pending, paid, shipped, delivered, cancelled]`,
  },
  {
    id: 'OrderItem',
    label: 'OrderItem',
    color: '#f59e0b',
    refs: ['Product'],
    yaml: `OrderItem:
  type: object
  required: [product, quantity, price]
  properties:
    product:
      $ref: "#/components/schemas/Product"
    quantity:
      type: integer
      minimum: 1
    price:
      type: number
      format: float
      description: Цена на момент заказа`,
  },
  {
    id: 'Product',
    label: 'Product',
    color: '#ec4899',
    refs: [],
    yaml: `Product:
  type: object
  required: [id, name, price]
  properties:
    id:
      type: string
      format: uuid
    name:
      type: string
      example: "Ноутбук Pro 15"
    price:
      type: number
      format: float
      example: 89999.00
    inStock:
      type: boolean
      default: true`,
  },
]

export function Task8_1_Solution() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = SCHEMA_NODES.find(n => n.id === selectedId) ?? null

  // Определяем, кто ссылается на выбранный узел
  const referencedBy = selectedId
    ? SCHEMA_NODES.filter(n => n.refs.includes(selectedId)).map(n => n.id)
    : []

  const getNodeStyle = (node: SchemaNode): React.CSSProperties => {
    const isSelected = node.id === selectedId
    const isRef = selectedId ? node.refs.includes(selectedId) : false
    const isReferencedBy = referencedBy.includes(node.id)

    return {
      padding: '0.6rem 1rem',
      borderRadius: '10px',
      border: `2px solid ${isSelected ? node.color : isRef || isReferencedBy ? node.color + '80' : '#e2e8f0'}`,
      background: isSelected ? node.color : isRef ? node.color + '15' : isReferencedBy ? node.color + '10' : 'white',
      color: isSelected ? 'white' : '#1e293b',
      cursor: 'pointer',
      fontWeight: isSelected ? 700 : 600,
      fontSize: '0.9rem',
      fontFamily: 'monospace',
      transition: 'all 0.15s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      userSelect: 'none',
    }
  }

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Визуализатор $ref</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Кликните по схеме, чтобы увидеть её определение и связи с другими схемами.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Левая колонка: граф */}
        <div>
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem', fontWeight: 600 }}
            >
              SCHEMAS / components/schemas
            </div>

            {/* Узлы */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {SCHEMA_NODES.map(node => (
                <div
                  key={node.id}
                  onClick={() => setSelectedId(prev => (prev === node.id ? null : node.id))}
                  style={getNodeStyle(node)}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: node.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ flex: 1 }}>{node.label}</span>
                  {node.refs.length > 0 && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        background: node.id === selectedId ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                        color: node.id === selectedId ? 'white' : '#64748b',
                        padding: '2px 7px',
                        borderRadius: '99px',
                      }}
                    >
                      {node.refs.length === 1 ? '1 $ref' : `${node.refs.length} $ref`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Легенда связей */}
          {selectedId && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: '#fefce8',
                border: '1px solid #fde047',
                borderRadius: '8px',
                fontSize: '0.82rem',
                color: '#713f12',
              }}
            >
              {selected && selected.refs.length > 0 && (
                <div style={{ marginBottom: referencedBy.length > 0 ? '0.5rem' : 0 }}>
                  <strong>{selectedId}</strong> ссылается на:{' '}
                  {selected.refs.map((r, i) => (
                    <span key={r}>
                      <code
                        style={{
                          background: '#fef9c3',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          fontWeight: 700,
                        }}
                      >
                        {r}
                      </code>
                      {i < selected.refs.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
              {referencedBy.length > 0 && (
                <div>
                  На <strong>{selectedId}</strong> ссылаются:{' '}
                  {referencedBy.map((r, i) => (
                    <span key={r}>
                      <code
                        style={{
                          background: '#fef9c3',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          fontWeight: 700,
                        }}
                      >
                        {r}
                      </code>
                      {i < referencedBy.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
              {selected && selected.refs.length === 0 && referencedBy.length === 0 && (
                <span>Схема не ссылается на другие схемы и не используется в других схемах.</span>
              )}
            </div>
          )}
        </div>

        {/* Правая колонка: YAML */}
        <div>
          {selected ? (
            <div
              style={{
                border: `2px solid ${selected.color}`,
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: selected.color,
                  color: 'white',
                  padding: '0.6rem 1rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>#/components/schemas/{selected.id}</span>
              </div>
              <div
                style={{
                  background: '#0f172a',
                  padding: '1rem',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: '#e2e8f0',
                  whiteSpace: 'pre',
                  overflowX: 'auto',
                  lineHeight: 1.6,
                  minHeight: '200px',
                }}
              >
                {selected.yaml}
              </div>
            </div>
          ) : (
            <div
              style={{
                height: '100%',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
                border: '2px dashed #e2e8f0',
                borderRadius: '12px',
                color: '#94a3b8',
                textAlign: 'center',
                padding: '2rem',
                fontSize: '0.9rem',
              }}
            >
              👈 Нажмите на схему слева, чтобы увидеть её YAML-определение
            </div>
          )}
        </div>
      </div>

      {/* Инфо-блок */}
      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          fontSize: '0.82rem',
          color: '#0c4a6e',
        }}
      >
        💡 <strong>$ref</strong> позволяет переиспользовать схему в любом месте спецификации. Вместо
        копирования определения — один источник истины:{' '}
        <code style={{ background: '#e0f2fe', padding: '1px 5px', borderRadius: '3px' }}>
          $ref: "#/components/schemas/User"
        </code>
      </div>
    </div>
  )
}

// ============================================
// Задание 8.2: Рефакторинг спецификации
// ============================================

const SPEC_BEFORE = `paths:
  /orders:
    get:
      summary: Список заказов
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: string
                      format: uuid
                    total:
                      type: number
                    status:
                      type: string
                      enum: [pending, paid, shipped]
        "401":
          description: Не авторизован
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: string
                  message:
                    type: string
        "500":
          description: Ошибка сервера
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: string
                  message:
                    type: string

  /orders/{id}:
    get:
      summary: Получить заказ
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    format: uuid
                  total:
                    type: number
                  status:
                    type: string
                    enum: [pending, paid, shipped]
        "401":
          description: Не авторизован
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: string
                  message:
                    type: string
        "404":
          description: Заказ не найден
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: string
                  message:
                    type: string
        "500":
          description: Ошибка сервера
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: string
                  message:
                    type: string`

const SPEC_AFTER = `components:
  schemas:
    Order:
      type: object
      properties:
        id:
          type: string
          format: uuid
        total:
          type: number
        status:
          type: string
          enum: [pending, paid, shipped]
    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string

  responses:
    Unauthorized:
      description: Не авторизован
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
    NotFound:
      description: Ресурс не найден
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
    ServerError:
      description: Ошибка сервера
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"

paths:
  /orders:
    get:
      summary: Список заказов
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Order"
        "401":
          $ref: "#/components/responses/Unauthorized"
        "500":
          $ref: "#/components/responses/ServerError"

  /orders/{id}:
    get:
      summary: Получить заказ
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Order"
        "401":
          $ref: "#/components/responses/Unauthorized"
        "404":
          $ref: "#/components/responses/NotFound"
        "500":
          $ref: "#/components/responses/ServerError"`

const BEFORE_LINES = SPEC_BEFORE.split('\n').length
const AFTER_LINES = SPEC_AFTER.split('\n').length
const SAVED = BEFORE_LINES - AFTER_LINES

interface DuplicateBlock {
  id: string
  label: string
  description: string
  occurrences: number
  refactored: string
}

const DUPLICATES: DuplicateBlock[] = [
  {
    id: 'order-schema',
    label: 'Order schema',
    description: 'Схема заказа повторяется в GET /orders и GET /orders/{id}',
    occurrences: 2,
    refactored: '$ref: "#/components/schemas/Order"',
  },
  {
    id: 'error-schema',
    label: 'Error schema',
    description: 'Схема ошибки повторяется в 401, 404, 500 ответах',
    occurrences: 4,
    refactored: '$ref: "#/components/schemas/Error"',
  },
  {
    id: '401-response',
    label: '401 Unauthorized',
    description: 'Одинаковый 401-ответ в каждом endpoint',
    occurrences: 2,
    refactored: '$ref: "#/components/responses/Unauthorized"',
  },
  {
    id: '500-response',
    label: '500 ServerError',
    description: 'Одинаковый 500-ответ в каждом endpoint',
    occurrences: 2,
    refactored: '$ref: "#/components/responses/ServerError"',
  },
]

export function Task8_2_Solution() {
  const [refactored, setRefactored] = useState<string[]>([])
  const [view, setView] = useState<'before' | 'after'>('before')

  const allDone = refactored.length === DUPLICATES.length

  const toggle = (id: string) => {
    setRefactored(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1000px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Рефакторинг спецификации</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Найдите дублирование в спецификации и вынесите повторяющиеся блоки в{' '}
        <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '3px' }}>
          components
        </code>
        .
      </p>

      {/* Счётчик экономии */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            padding: '0.5rem 0.9rem',
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ color: '#dc2626', fontWeight: 700 }}>До:</span>{' '}
          <span style={{ color: '#374151' }}>{BEFORE_LINES} строк</span>
        </div>
        <span style={{ color: '#94a3b8' }}>→</span>
        <div
          style={{
            padding: '0.5rem 0.9rem',
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ color: '#16a34a', fontWeight: 700 }}>После:</span>{' '}
          <span style={{ color: '#374151' }}>{AFTER_LINES} строк</span>
        </div>
        <div
          style={{
            padding: '0.5rem 0.9rem',
            background: '#f0f9ff',
            border: '1px solid #7dd3fc',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#0284c7',
          }}
        >
          Экономия: -{SAVED} строк
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          {(['before', 'after'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: `2px solid ${view === v ? '#6366f1' : '#e2e8f0'}`,
                background: view === v ? '#6366f1' : 'white',
                color: view === v ? 'white' : '#374151',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: view === v ? 700 : 400,
              }}
            >
              {v === 'before' ? 'До' : 'После'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1rem' }}>
        {/* Чеклист дублирования */}
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            НАЙТИ И ВЫНЕСТИ В COMPONENTS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {DUPLICATES.map(dup => {
              const done = refactored.includes(dup.id)
              return (
                <div
                  key={dup.id}
                  onClick={() => toggle(dup.id)}
                  style={{
                    padding: '0.65rem 0.75rem',
                    border: `2px solid ${done ? '#86efac' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: done ? '#f0fdf4' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{done ? '✅' : '⬜'}</span>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        color: done ? '#16a34a' : '#1e293b',
                        fontFamily: 'monospace',
                      }}
                    >
                      {dup.label}
                    </span>
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: '0.7rem',
                        background: '#fef2f2',
                        color: '#dc2626',
                        padding: '1px 6px',
                        borderRadius: '99px',
                        fontWeight: 600,
                      }}
                    >
                      ×{dup.occurrences}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '1.5rem' }}>
                    {dup.description}
                  </div>
                  {done && (
                    <div
                      style={{
                        marginTop: '0.35rem',
                        marginLeft: '1.5rem',
                        fontFamily: 'monospace',
                        fontSize: '0.72rem',
                        color: '#0284c7',
                        background: '#e0f2fe',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'inline-block',
                      }}
                    >
                      {dup.refactored}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {allDone && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                background: '#f0fdf4',
                border: '2px solid #86efac',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '0.85rem',
                color: '#16a34a',
                fontWeight: 700,
              }}
            >
              Отличная работа! Все дубликаты устранены.
            </div>
          )}
        </div>

        {/* YAML */}
        <div
          style={{
            background: '#0f172a',
            borderRadius: '10px',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '0.78rem',
            color: '#e2e8f0',
            whiteSpace: 'pre',
            overflowX: 'auto',
            overflowY: 'auto',
            lineHeight: 1.6,
            maxHeight: '500px',
          }}
        >
          {view === 'before' ? SPEC_BEFORE : SPEC_AFTER}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 8.3: Проектирование схем
// ============================================

interface SchemaExample {
  id: string
  title: string
  description: string
  color: string
  category: 'base' | 'composition' | 'generic' | 'reusable'
  yaml: string
}

const SCHEMA_EXAMPLES: SchemaExample[] = [
  {
    id: 'product',
    title: 'Product',
    description: 'Базовая схема товара с обязательными полями',
    color: '#6366f1',
    category: 'base',
    yaml: `Product:
  type: object
  required: [id, name, price, category]
  properties:
    id:
      type: string
      format: uuid
    name:
      type: string
      minLength: 1
      maxLength: 200
    description:
      type: string
    price:
      type: number
      format: float
      minimum: 0
    category:
      $ref: "#/components/schemas/Category"
    inStock:
      type: boolean
      default: true
    images:
      type: array
      items:
        type: string
        format: uri`,
  },
  {
    id: 'category',
    title: 'Category',
    description: 'Категория товара с рекурсивной ссылкой на родителя',
    color: '#0ea5e9',
    category: 'base',
    yaml: `Category:
  type: object
  required: [id, name]
  properties:
    id:
      type: string
      format: uuid
    name:
      type: string
    slug:
      type: string
      example: "electronics"
    parent:
      $ref: "#/components/schemas/Category"
      description: Родительская категория (рекурсия)`,
  },
  {
    id: 'user',
    title: 'User',
    description: 'Профиль пользователя с адресом',
    color: '#10b981',
    category: 'base',
    yaml: `User:
  type: object
  required: [id, name, email]
  properties:
    id:
      type: string
      format: uuid
    name:
      type: string
    email:
      type: string
      format: email
    phone:
      type: string
      pattern: "^\\\\+[1-9]\\\\d{1,14}$"
    addresses:
      type: array
      items:
        $ref: "#/components/schemas/Address"`,
  },
  {
    id: 'order',
    title: 'Order',
    description: 'Заказ с позициями и статусом',
    color: '#f59e0b',
    category: 'base',
    yaml: `Order:
  type: object
  required: [id, userId, items, total, status, createdAt]
  properties:
    id:
      type: string
      format: uuid
    userId:
      type: string
      format: uuid
    items:
      type: array
      minItems: 1
      items:
        $ref: "#/components/schemas/OrderItem"
    total:
      type: number
      format: float
    shippingAddress:
      $ref: "#/components/schemas/Address"
    status:
      type: string
      enum: [pending, paid, shipped, delivered, cancelled]
    createdAt:
      type: string
      format: date-time`,
  },
  {
    id: 'order-item',
    title: 'OrderItem',
    description: 'Позиция в заказе',
    color: '#ec4899',
    category: 'base',
    yaml: `OrderItem:
  type: object
  required: [productId, quantity, unitPrice]
  properties:
    productId:
      type: string
      format: uuid
    productName:
      type: string
      description: Снимок названия на момент заказа
    quantity:
      type: integer
      minimum: 1
    unitPrice:
      type: number
      format: float
      description: Цена за единицу на момент заказа`,
  },
  {
    id: 'address',
    title: 'Address',
    description: 'Адрес доставки или профиля',
    color: '#8b5cf6',
    category: 'base',
    yaml: `Address:
  type: object
  required: [street, city, country]
  properties:
    street:
      type: string
    city:
      type: string
    region:
      type: string
    postalCode:
      type: string
    country:
      type: string
      description: ISO 3166-1 alpha-2
      example: "RU"`,
  },
  {
    id: 'paginated',
    title: 'PaginatedResponse<T>',
    description: 'Generic-паттерн через allOf для пагинации',
    color: '#14b8a6',
    category: 'generic',
    yaml: `# Базовая мета-информация пагинации
PaginationMeta:
  type: object
  required: [total, page, limit, totalPages]
  properties:
    total:
      type: integer
      description: Всего записей
    page:
      type: integer
      description: Текущая страница (1-based)
    limit:
      type: integer
      description: Записей на странице
    totalPages:
      type: integer
    hasNextPage:
      type: boolean
    hasPrevPage:
      type: boolean

# Конкретная реализация для Product
PaginatedProducts:
  allOf:
    - $ref: "#/components/schemas/PaginationMeta"
    - type: object
      required: [data]
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/Product"

# Аналогично для Order
PaginatedOrders:
  allOf:
    - $ref: "#/components/schemas/PaginationMeta"
    - type: object
      required: [data]
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/Order"`,
  },
  {
    id: 'composition',
    title: 'allOf / oneOf / anyOf',
    description: 'Примеры всех трёх операторов композиции',
    color: '#f97316',
    category: 'composition',
    yaml: `# allOf — расширение базовой схемы (наследование)
ProductWithReviews:
  allOf:
    - $ref: "#/components/schemas/Product"
    - type: object
      properties:
        avgRating:
          type: number
          format: float
          minimum: 0
          maximum: 5
        reviewsCount:
          type: integer

# oneOf — ровно одна из схем (полиморфизм)
PaymentMethod:
  oneOf:
    - $ref: "#/components/schemas/CardPayment"
    - $ref: "#/components/schemas/CryptoPayment"
    - $ref: "#/components/schemas/BankTransfer"
  discriminator:
    propertyName: type
    mapping:
      card: "#/components/schemas/CardPayment"
      crypto: "#/components/schemas/CryptoPayment"
      bank: "#/components/schemas/BankTransfer"

# anyOf — одна или несколько из схем
SearchFilter:
  anyOf:
    - $ref: "#/components/schemas/PriceFilter"
    - $ref: "#/components/schemas/CategoryFilter"
    - $ref: "#/components/schemas/RatingFilter"`,
  },
]

const CATEGORY_LABELS: Record<string, string> = {
  base: 'Базовые схемы',
  composition: 'Композиция',
  generic: 'Generic-паттерн',
  reusable: 'Переиспользуемые',
}

const CATEGORY_COLORS: Record<string, string> = {
  base: '#6366f1',
  composition: '#f97316',
  generic: '#14b8a6',
  reusable: '#8b5cf6',
}

export function Task8_3_Solution() {
  const [selectedId, setSelectedId] = useState<string>('product')

  const selected = SCHEMA_EXAMPLES.find(s => s.id === selectedId)!

  const categories = Array.from(new Set(SCHEMA_EXAMPLES.map(s => s.category)))

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1000px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Проектирование схем: e-commerce API</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Эталонные переиспользуемые схемы для интернет-магазина. Изучите паттерны allOf, oneOf,
        anyOf и generic-пагинацию.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1rem' }}>
        {/* Навигация по схемам */}
        <div>
          {categories.map(cat => (
            <div key={cat} style={{ marginBottom: '0.75rem' }}>
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: CATEGORY_COLORS[cat],
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.35rem',
                  paddingLeft: '0.25rem',
                }}
              >
                {CATEGORY_LABELS[cat]}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {SCHEMA_EXAMPLES.filter(s => s.category === cat).map(schema => (
                  <button
                    key={schema.id}
                    onClick={() => setSelectedId(schema.id)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      border: `2px solid ${selectedId === schema.id ? schema.color : '#e2e8f0'}`,
                      borderRadius: '8px',
                      background: selectedId === schema.id ? schema.color + '15' : 'white',
                      color: selectedId === schema.id ? schema.color : '#374151',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'monospace',
                      fontWeight: selectedId === schema.id ? 700 : 400,
                      fontSize: '0.82rem',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: schema.color,
                        flexShrink: 0,
                      }}
                    />
                    {schema.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Детали схемы */}
        <div>
          <div
            style={{
              border: `2px solid ${selected.color}`,
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '0.75rem',
            }}
          >
            <div
              style={{
                background: selected.color,
                color: 'white',
                padding: '0.65rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{selected.title}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  background: 'rgba(255,255,255,0.25)',
                  padding: '2px 8px',
                  borderRadius: '99px',
                }}
              >
                {CATEGORY_LABELS[selected.category]}
              </span>
            </div>
            <div
              style={{
                padding: '0.6rem 1rem',
                background: selected.color + '08',
                borderBottom: `1px solid ${selected.color}30`,
                fontSize: '0.83rem',
                color: '#374151',
              }}
            >
              {selected.description}
            </div>
            <div
              style={{
                background: '#0f172a',
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                color: '#e2e8f0',
                whiteSpace: 'pre',
                overflowX: 'auto',
                lineHeight: 1.6,
                maxHeight: '420px',
                overflowY: 'auto',
              }}
            >
              {selected.yaml}
            </div>
          </div>

          {/* Пояснение по категории */}
          {selected.category === 'composition' && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                borderRadius: '8px',
                fontSize: '0.82rem',
                color: '#9a3412',
              }}
            >
              <strong>allOf</strong> — объединяет все схемы (как пересечение / наследование).{' '}
              <strong>oneOf</strong> — ровно одна схема подходит (полиморфизм с discriminator).{' '}
              <strong>anyOf</strong> — одна или несколько схем подходят (гибкая фильтрация).
            </div>
          )}
          {selected.category === 'generic' && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: '#f0fdfa',
                border: '1px solid #99f6e4',
                borderRadius: '8px',
                fontSize: '0.82rem',
                color: '#134e4a',
              }}
            >
              OpenAPI не поддерживает generics напрямую, но паттерн{' '}
              <strong>allOf + базовая мета-схема</strong> позволяет переиспользовать структуру
              пагинации для любой коллекции.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
