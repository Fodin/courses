import { useState, useMemo } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// TODO 1: Объявите интерфейсы Semigroup / Monoid
// и реализуйте Sum, Any, Min, Max (как в задании 9.1)
// ============================================

// interface Semigroup<T> { concat: (a: T, b: T) => T }
// interface Monoid<T> extends Semigroup<T> { empty: T }
// const Sum: Monoid<number> = ...
// const Any: Monoid<boolean> = ...
// const Min: Monoid<number> = ...
// const Max: Monoid<number> = ...

// ============================================
// TODO 2: Реализуйте fold и foldMap
// ============================================

// const fold    = <T,>(M: Monoid<T>, xs: T[]): T => ...
// const foldMap = <A, M,>(monoid: Monoid<M>, f: (a: A) => M, xs: A[]): M => ...

// ============================================
// TODO 3: Объявите тип заказа и начальные данные
//
// type OrderStatus = 'completed' | 'cancelled' | 'pending'
// interface Order {
//   id: number; customer: string; amount: number
//   status: OrderStatus; date: string
// }
//
// Подготовьте массив INITIAL_ORDERS с не менее 10 заказами.
// Убедитесь что есть заказы всех трёх статусов.
// ============================================

// type OrderStatus = 'completed' | 'cancelled' | 'pending'
// interface Order { ... }
// const INITIAL_ORDERS: Order[] = [...]

// ============================================
// TODO 4: Реализуйте функцию генерации случайного заказа
//
// generateOrder() — возвращает новый Order с уникальным id,
// случайным клиентом, суммой (500-15000), статусом и датой.
// ============================================

// let nextId = 13
// function generateOrder(): Order { ... }

export function Task9_2() {
  const { t } = useLanguage()
  // TODO 5: Инициализируйте состояние заказов и фильтров
  // const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)
  // const [filterStatus, setFilterStatus] = useState<Record<OrderStatus, boolean>>({
  //   completed: true, cancelled: true, pending: true,
  // })

  // TODO 6: Вычислите filtered — заказы, прошедшие через фильтр статуса
  // const filtered = useMemo(() => orders.filter(o => filterStatus[o.status]), [...])

  // TODO 7: Вычислите completedOrders — только completed из filtered
  // const completedOrders = useMemo(...)

  // TODO 8: Вычислите 5 агрегатов через foldMap (каждый через useMemo):
  //
  // totalRevenue   = foldMap(Sum, o => o.amount, completedOrders)
  // hasCancelled   = foldMap(Any, o => o.status === 'cancelled', filtered)
  // maxAmount      = foldMap(Max, o => o.amount, filtered)
  // minAmount      = foldMap(Min, o => o.amount, completedOrders)
  // completedCount = foldMap(Sum, o => o.status === 'completed' ? 1 : 0, filtered)
  void useMemo
  void useState

  return (
    <div className="exercise-container">
      <h2>{t('task.9.2')}</h2>

      {/* TODO 9: Кнопки-фильтры для каждого статуса
          Отображают статус и количество заказов этого статуса.
          Клик — переключает filterStatus[status].
          Активные кнопки визуально выделены. */}

      {/* TODO 10: Кнопка "Добавить заказ"
          Вызывает setOrders(prev => [...prev, generateOrder()]) */}

      {/* TODO 11: Дашборд из 5 карточек метрик
          Каждая карточка:
          - Название метрики (например "Выручка (completed)")
          - Значение с форматированием (toLocaleString для чисел)
          - Название используемого моноида (Sum / Any / Max / Min)
          - Формула в виде кода: foldMap(Sum, o => o.amount, completedOrders) */}

      {/* TODO 12: Таблица заказов
          Колонки: ID, Клиент, Сумма, Статус (цветной), Дата
          Отображать только filtered заказы.
          Показать счётчик: "Показано N из M заказов" */}

      <p style={{ color: '#6b7280' }}>Реализуйте фильтры и foldMap-агрегации для отображения дашборда</p>
    </div>
  )
}
