import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.1: Основы action
// Task 2.1: Action basics
// ============================================

// TODO: Импортируйте configure, makeAutoObservable из 'mobx'
// TODO: Импортируйте observer из 'mobx-react-lite'

// TODO: Вызовите configure({ enforceActions: 'always' })

// TODO: Создайте класс CounterStore:
//   - поле count = 0
//   - массив history: number[] = []
//   - makeAutoObservable(this) в конструкторе
//   - метод increment() — this.count += 1, this.history.push(this.count)
//   - метод decrement() — this.count -= 1, this.history.push(this.count)
//   - метод reset() — сбросить count и history

// TODO: Создайте инстанс стора

// TODO: Оберните компонент в observer
export function Task2_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 2.1: action basics</h2>
      {/* TODO: Добавьте отображение count, кнопки +1/-1/Reset и history */}
    </div>
  )
}
