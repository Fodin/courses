import { useLanguage } from 'src/hooks'

// Задание 2.2: runInAction
// Task 2.2: runInAction

// TODO: Создайте стор с async методом
// TODO: После await оберните обновления в runInAction

export function Task2_2() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 2.2: runInAction</h2>
    </div>
  )
}
