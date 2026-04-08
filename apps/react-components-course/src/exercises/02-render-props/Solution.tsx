import { useState, type ReactNode } from 'react'

// ============================================
// Shared types
// ============================================

interface MousePosition {
  x: number
  y: number
}

interface MouseTrackerProps {
  render: (pos: MousePosition) => ReactNode
}

// ============================================
// Task 2.1 Solution — MouseTracker
// ============================================

function MouseTracker({ render }: MouseTrackerProps) {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0 })

  return (
    <div
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      style={{
        width: '100%',
        height: '200px',
        position: 'relative',
        border: '2px dashed #6366f1',
        borderRadius: '8px',
        background: '#f0f0ff',
        overflow: 'hidden',
        cursor: 'crosshair',
      }}
    >
      {render(pos)}
    </div>
  )
}

export function Task2_1_Solution() {
  return (
    <div className="exercise-container">
      <h2>Решение 2.1 — MouseTracker</h2>

      <h3 style={{ marginBottom: '8px' }}>Пример 1: Отображение координат</h3>
      <MouseTracker
        render={({ x, y }) => (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#4338ca',
              pointerEvents: 'none',
            }}
          >
            x: {x}, y: {y}
          </div>
        )}
      />

      <h3 style={{ marginTop: '24px', marginBottom: '8px' }}>
        Пример 2: Tooltip-follower
      </h3>
      <MouseTracker
        render={({ x, y }) => (
          <div
            style={{
              position: 'fixed',
              left: x,
              top: y,
              transform: 'translate(10px, 10px)',
              background: '#4338ca',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '13px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            ({x}, {y})
          </div>
        )}
      />
    </div>
  )
}

// ============================================
// Task 2.2 Solution — Generic DataList<T>
// ============================================

interface DataListProps<T> {
  data: T[]
  renderItem: (item: T, index: number) => ReactNode
  renderEmpty?: () => ReactNode
}

function DataList<T>({ data, renderItem, renderEmpty }: DataListProps<T>) {
  if (data.length === 0) {
    return (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          color: '#9ca3af',
          border: '1px dashed #d1d5db',
          borderRadius: '8px',
        }}
      >
        {renderEmpty ? renderEmpty() : 'Список пуст'}
      </div>
    )
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {data.map((item, index) => (
        <li
          key={index}
          style={{
            borderBottom: '1px solid #e5e7eb',
            padding: '8px 0',
          }}
        >
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  )
}

interface User {
  id: number
  name: string
  role: string
}

interface Product {
  id: number
  title: string
  price: number
}

interface Notification {
  id: number
  message: string
  read: boolean
}

const INITIAL_USERS: User[] = [
  { id: 1, name: 'Алиса Петрова', role: 'Frontend' },
  { id: 2, name: 'Борис Иванов', role: 'Backend' },
  { id: 3, name: 'Виктория Смирнова', role: 'Designer' },
]

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, title: 'Клавиатура Keychron K2', price: 7900 },
  { id: 2, title: 'Мышь Logitech MX Master', price: 5500 },
  { id: 3, title: 'Монитор LG 27"', price: 28000 },
]

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, message: 'Новый комментарий к задаче', read: false },
  { id: 2, message: 'Деплой завершён успешно', read: true },
  { id: 3, message: 'Вам назначено code review', read: false },
]

export function Task2_2_Solution() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [notifications, setNotifications] =
    useState<Notification[]>(INITIAL_NOTIFICATIONS)

  return (
    <div className="exercise-container">
      <h2>Решение 2.2 — Generic DataList</h2>

      <section style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <h3 style={{ margin: 0 }}>Пользователи</h3>
          <button
            onClick={() => setUsers([])}
            style={{ fontSize: '13px', padding: '4px 12px', cursor: 'pointer' }}
          >
            Очистить
          </button>
        </div>
        <DataList
          data={users}
          renderItem={(user) => (
            <div style={{ display: 'flex', gap: '12px' }}>
              <strong>{user.name}</strong>
              <span
                style={{
                  background: '#e0e7ff',
                  color: '#4338ca',
                  borderRadius: '4px',
                  padding: '0 8px',
                  fontSize: '13px',
                }}
              >
                {user.role}
              </span>
            </div>
          )}
          renderEmpty={() => (
            <span>Нет пользователей — добавьте первого!</span>
          )}
        />
      </section>

      <section style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <h3 style={{ margin: 0 }}>Товары</h3>
          <button
            onClick={() => setProducts([])}
            style={{ fontSize: '13px', padding: '4px 12px', cursor: 'pointer' }}
          >
            Очистить
          </button>
        </div>
        <DataList
          data={products}
          renderItem={(product) => (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{product.title}</span>
              <strong style={{ color: '#059669' }}>
                {product.price.toLocaleString('ru-RU')} ₽
              </strong>
            </div>
          )}
          renderEmpty={() => <span>Каталог пуст</span>}
        />
      </section>

      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <h3 style={{ margin: 0 }}>Уведомления</h3>
          <button
            onClick={() => setNotifications([])}
            style={{ fontSize: '13px', padding: '4px 12px', cursor: 'pointer' }}
          >
            Очистить
          </button>
        </div>
        <DataList
          data={notifications}
          renderItem={(notif) => (
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                opacity: notif.read ? 0.5 : 1,
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: notif.read ? '#9ca3af' : '#ef4444',
                  flexShrink: 0,
                }}
              />
              <span>{notif.message}</span>
              <span
                style={{ marginLeft: 'auto', fontSize: '12px', color: '#9ca3af' }}
              >
                {notif.read ? 'прочитано' : 'новое'}
              </span>
            </div>
          )}
          renderEmpty={() => <span>Все уведомления обработаны</span>}
        />
      </section>
    </div>
  )
}

// ============================================
// Task 2.3 Solution — Toggle with render prop
// ============================================

interface ToggleRenderProps {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

interface ToggleProps {
  defaultOpen?: boolean
  render: (props: ToggleRenderProps) => ReactNode
}

function Toggle({ defaultOpen = false, render }: ToggleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const actions: ToggleRenderProps = {
    isOpen,
    toggle: () => setIsOpen((v) => !v),
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }

  return <>{render(actions)}</>
}

export function Task2_3_Solution() {
  return (
    <div className="exercise-container">
      <h2>Решение 2.3 — Toggle</h2>

      <section style={{ marginBottom: '32px' }}>
        <h3>Dropdown-меню</h3>
        <Toggle
          render={({ isOpen, toggle }) => (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onClick={toggle}
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                Меню {isOpen ? '▲' : '▼'}
              </button>
              {isOpen && (
                <ul
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    listStyle: 'none',
                    padding: '4px 0',
                    minWidth: '140px',
                    zIndex: 10,
                  }}
                >
                  {['Профиль', 'Настройки', 'Выйти'].map((item) => (
                    <li
                      key={item}
                      style={{ padding: '8px 16px', cursor: 'pointer' }}
                      onClick={toggle}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        />
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h3>Modal trigger</h3>
        <Toggle
          render={({ isOpen, open, close }) => (
            <>
              <button
                onClick={open}
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  background: '#0ea5e9',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                Открыть модалку
              </button>
              {isOpen && (
                <div
                  onClick={close}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '32px',
                      maxWidth: '400px',
                      width: '90%',
                      position: 'relative',
                    }}
                  >
                    <button
                      onClick={close}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#9ca3af',
                      }}
                    >
                      ×
                    </button>
                    <h3 style={{ margin: '0 0 12px' }}>Заголовок модалки</h3>
                    <p style={{ color: '#6b7280' }}>
                      Содержимое модального окна. Кликните за пределами или на
                      кнопку × чтобы закрыть.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        />
      </section>

      <section>
        <h3>Expandable section (аккордеон)</h3>
        {[
          {
            title: 'Что такое render prop?',
            body: 'Паттерн, при котором компонент получает функцию через пропс и вызывает её для рендера части своего UI.',
          },
          {
            title: 'Когда использовать render props вместо хуков?',
            body: 'Когда компонент управляет DOM-областью или нужно несколько функций рендера — renderItem, renderEmpty, renderHeader.',
          },
          {
            title: 'Можно ли использовать хуки внутри render callback?',
            body: 'Нет — callback не является компонентом React. Вынесите логику с хуками в отдельный компонент.',
          },
        ].map((item, i) => (
          <Toggle
            key={i}
            render={({ isOpen, toggle }) => (
              <div
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  marginBottom: '4px',
                }}
              >
                <div
                  onClick={toggle}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  <span>{item.title}</span>
                  <span style={{ color: '#9ca3af' }}>{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && (
                  <p
                    style={{
                      margin: '0 0 12px',
                      color: '#6b7280',
                      lineHeight: 1.6,
                    }}
                  >
                    {item.body}
                  </p>
                )}
              </div>
            )}
          />
        ))}
      </section>
    </div>
  )
}
