import { useState, type ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.2 — Generic DataList<T>
// Task 2.2 — Generic DataList<T>
// ============================================

// TODO: Объявите интерфейс пропсов DataList (дженерик)
// TODO: Declare the DataList props interface (generic)
// interface DataListProps<T> {
//   data: T[]
//   renderItem: (item: T, index: number) => ReactNode
//   renderEmpty?: () => ReactNode
// }

// TODO: Реализуйте компонент DataList<T>
// TODO: Implement the DataList<T> component
// - Если data пустой и есть renderEmpty — вызовите renderEmpty()
// - If data is empty and renderEmpty exists — call renderEmpty()
// - Если data пустой и нет renderEmpty — покажите "Список пуст"
// - If data is empty and no renderEmpty — show "List is empty"
// - Для каждого элемента вызывайте renderItem(item, index)
// - For each item call renderItem(item, index)
// - В TSX используйте <T,> или <T extends object> чтобы избежать конфликта с JSX
// - In TSX use <T,> or <T extends object> to avoid conflict with JSX

// function DataList<T,>({ data, renderItem, renderEmpty }: DataListProps<T>) { ... }

// ============================================
// Типы данных
// Data types
// ============================================

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

// ============================================
// Начальные данные
// Initial data
// ============================================

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

export function Task2_2() {
  const { t } = useLanguage()

  const [users, setUsers] = useState<User[]>(INITIAL_USERS)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [notifications, setNotifications] =
    useState<Notification[]>(INITIAL_NOTIFICATIONS)

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 2.2 — Generic DataList</h2>

      {/* TODO: Список пользователей */}
      {/* TODO: Users list */}
      {/* Используйте DataList<User> с renderItem, показывающим имя и роль */}
      {/* Use DataList<User> with renderItem showing name and role */}
      {/* renderEmpty должен возвращать сообщение о пустом списке */}
      {/* renderEmpty should return an empty list message */}
      {/* Добавьте кнопку "Очистить" которая вызывает setUsers([]) */}
      {/* Add a "Clear" button that calls setUsers([]) */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0 }}>Пользователи</h3>
          <button onClick={() => setUsers([])} style={{ fontSize: '13px', padding: '4px 12px', cursor: 'pointer' }}>
            Очистить
          </button>
        </div>
        {/* TODO: <DataList data={users} renderItem={...} renderEmpty={...} /> */}
        <p style={{ color: '#9ca3af' }}>Реализуйте DataList выше</p>
      </section>

      {/* TODO: Список товаров */}
      {/* TODO: Products list */}
      {/* renderItem показывает название и цену в рублях (toLocaleString) */}
      {/* renderItem shows name and price in rubles (toLocaleString) */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0 }}>Товары</h3>
          <button onClick={() => setProducts([])} style={{ fontSize: '13px', padding: '4px 12px', cursor: 'pointer' }}>
            Очистить
          </button>
        </div>
        {/* TODO: <DataList data={products} renderItem={...} renderEmpty={...} /> */}
        <p style={{ color: '#9ca3af' }}>Реализуйте DataList выше</p>
      </section>

      {/* TODO: Список уведомлений */}
      {/* TODO: Notifications list */}
      {/* renderItem показывает сообщение и статус прочитанности (read: boolean) */}
      {/* renderItem shows message and read status (read: boolean) */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0 }}>Уведомления</h3>
          <button onClick={() => setNotifications([])} style={{ fontSize: '13px', padding: '4px 12px', cursor: 'pointer' }}>
            Очистить
          </button>
        </div>
        {/* TODO: <DataList data={notifications} renderItem={...} renderEmpty={...} /> */}
        <p style={{ color: '#9ca3af' }}>Реализуйте DataList выше</p>
      </section>
    </div>
  )
}
