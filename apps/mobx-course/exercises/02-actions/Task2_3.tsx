import { useLanguage } from 'src/hooks'

// Задание 2.3: Bound actions
// Task 2.3: Bound Actions

// TODO: Передайте метод стора как callback
// TODO: Используйте autoBind: true в makeAutoObservable

export function Task2_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 2.3: Bound Actions</h2>
    </div>
  )
}
