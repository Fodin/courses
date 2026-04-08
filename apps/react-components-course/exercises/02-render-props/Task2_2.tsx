import { useState, type ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.2 — Generic DataList<T>
// ============================================

// TODO: Объявите интерфейс пропсов DataList (дженерик)
// interface DataListProps<T> {
//   data: T[]
//   renderItem: (item: T, index: number) => ReactNode
//   renderEmpty?: () => ReactNode
// }

// TODO: Реализуйте компонент DataList<T>
// - Если data пустой и есть renderEmpty — вызовите renderEmpty()
// - Если data пустой и нет renderEmpty — покажите "Список пуст"
// - Для каждого элемента вызывайте renderItem(item, index)
// - В TSX используйте <T,> или <T extends object> чтобы избежать конфликта с JSX

// function DataList<T,>({ data, renderItem, renderEmpty }: DataListProps<T>) { ... }

// ============================================
// Типы данных
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

      {/* TODO: Список пользователей
          Используйте DataList<User> с renderItem, показывающим имя и роль
          renderEmpty должен возвращать сообщение о пустом списке
          Добавьте кнопку "Очистить" которая вызывает setUsers([])
      */}
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

      {/* TODO: Список товаров
          renderItem показывает название и цену в рублях (toLocaleString)
      */}
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

      {/* TODO: Список уведомлений
          renderItem показывает сообщение и статус прочитанности (read: boolean)
      */}
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
