import { useLanguage } from 'src/hooks'

// Task 5.4

export function Task5_4() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 5.4</h2>
    </div>
  )
}
