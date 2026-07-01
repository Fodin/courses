import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.1: makeAutoObservable
// Task 1.1: makeAutoObservable
// ============================================

// TODO: Импортируйте makeAutoObservable из 'mobx'
// TODO: Импортируйте observer из 'mobx-react-lite'

// TODO: Создайте класс TemperatureStore:
//   - поле celsius = 0
//   - makeAutoObservable(this) в конструкторе
//   - метод setCelsius(value: number)
//   - геттер fahrenheit: celsius * 9/5 + 32
//   - геттер description: 'Freezing' (<0) / 'Cold' (<15) / 'Comfortable' (<25) / 'Hot'

// TODO: Создайте инстанс стора

// TODO: Оберните компонент в observer
export function Task1_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 1.1: makeAutoObservable</h2>
      {/* TODO: Добавьте input для celsius и отображение fahrenheit + description */}
    </div>
  )
}
