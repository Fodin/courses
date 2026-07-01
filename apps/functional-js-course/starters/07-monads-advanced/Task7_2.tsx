import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// TODO 1: Реализуйте класс Task<T>
//
// Task — ленивая обёртка над () => Promise<T>.
// Ничего не запускается до явного вызова .run().
// ============================================

// class Task<T> {
//   constructor(private fork: () => Promise<T>) {}
//
//   // Поднимает значение в Task
//   static of<T>(value: T): Task<T> {
//     return new Task(() => Promise.resolve(value))
//   }
//
//   // Трансформирует результат, НЕ запуская fork
//   map<U>(fn: (value: T) => U): Task<U> {
//     return new Task(() => this.fork().then(fn))
//   }
//
//   // Цепочка Task-шагов, НЕ запуская fork
//   flatMap<U>(fn: (value: T) => Task<U>): Task<U> {
//     return new Task(() => this.fork().then(v => fn(v).run()))
//   }
//
//   // ТОЛЬКО здесь запускается асинхронная операция
//   run(): Promise<T> {
//     return this.fork()
//   }
//
//   // Запускает все Task параллельно
//   static parallel<T>(tasks: Task<T>[]): Task<T[]> {
//     return new Task(() => Promise.all(tasks.map(t => t.run())))
//   }
// }

// ============================================
// TODO 2: Создайте три Task с имитацией задержки
//
// Используйте new Task(() => new Promise<T>(resolve => setTimeout(() => resolve(result), ms)))
// ============================================

// const fetchUsers: Task<string> = new Task(() =>
//   new Promise(resolve => setTimeout(() => resolve('[Alice, Bob, Carol]'), 800))
// )
//
// const fetchProducts: Task<string> = new Task(() =>
//   new Promise(resolve => setTimeout(() => resolve('[Widget, Gadget]'), 500))
// )
//
// const fetchOrders: Task<string> = new Task(() =>
//   new Promise(resolve => setTimeout(() => resolve('[#1001, #1002, #1003]'), 1200))
// )

// ============================================
// TODO 3: Реализуйте режим Sequential
//
// flatMap-цепочка: задачи выполняются одна за другой
// Ожидаемое время: 800 + 500 + 1200 = ~2500ms
//
// fetchUsers
//   .flatMap(users => fetchProducts
//     .flatMap(products => fetchOrders
//       .map(orders => [users, products, orders])))
//   .run()
// ============================================

// ============================================
// TODO 4: Реализуйте режим Parallel
//
// Task.parallel: все три Task одновременно
// Ожидаемое время: max(800, 500, 1200) = ~1200ms
//
// Task.parallel([fetchUsers, fetchProducts, fetchOrders]).run()
// ============================================

export function Task7_2() {
  const { t } = useLanguage()
  const [mode, setMode] = useState<'sequential' | 'parallel'>('sequential')
  const [running, setRunning] = useState(false)
  void mode
  void setMode
  void running
  void setRunning

  return (
    <div className="exercise-container">
      <h2>{t('task.7.2')}</h2>

      {/* TODO 5: Добавьте переключатель режимов Sequential / Parallel */}

      {/* TODO 6: Добавьте блок с кодом для каждого режима:
          Sequential — вложенный flatMap
          Parallel   — Task.parallel([...]) */}

      {/* TODO 7: Добавьте кнопку "Запустить"
          При нажатии запускает соответствующий пайплайн
          и измеряет реальное время выполнения */}

      {/* TODO 8: Добавьте анимированный таймлайн
          Три полоски (по одной на каждый Task), растущие в реальном времени.
          В Sequential режиме — полоски друг за другом.
          В Parallel режиме — все три одновременно. */}

      {/* TODO 9: После завершения покажите:
          - Общее время выполнения
          - Результаты каждого Task */}
    </div>
  )
}
