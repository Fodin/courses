import { useLanguage } from 'src/hooks'

// Task 5.2

export function Task5_2() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 5.2</h2>
    </div>
  )
}
