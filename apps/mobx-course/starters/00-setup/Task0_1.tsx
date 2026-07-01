import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.1: Первый стор
// Task 0.1: First Store
// ============================================

// TODO: Импортируйте makeAutoObservable из 'mobx'
// TODO: Import makeAutoObservable from 'mobx'

// TODO: Создайте класс CounterStore
// TODO: Create CounterStore class
//   - свойство count = 0
//   - property count = 0
//   - в конструкторе вызовите makeAutoObservable(this)
//   - call makeAutoObservable(this) in constructor
//   - метод increment() — увеличивает count на 1
//   - method increment() — increases count by 1
//   - метод decrement() — уменьшает count на 1
//   - method decrement() — decreases count by 1

export function Task0_1() {
  const { t } = useLanguage()

  // TODO: Создайте экземпляр CounterStore
  // TODO: Create a CounterStore instance

  // TODO: Вызовите increment() 3 раза и decrement() 1 раз
  // TODO: Call increment() 3 times and decrement() once

  // TODO: Выведите store.count в консоль (ожидается 2)
  // TODO: Log store.count to console (expected: 2)

  return (
    <div className="exercise-container">
      <h2>{t('task.0.1')}</h2>

      {/* TODO: Отобразите результат store.count */}
      {/* TODO: Display store.count result */}
      <p>Open DevTools (F12) to check console output</p>
    </div>
  )
}
