import { useLanguage } from 'src/hooks'

// Task 5.3

export function Task5_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 5.3</h2>
    </div>
  )
}
