import { useLanguage } from 'src/hooks'

// Task 4.4

export function Task4_4() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 4.4</h2>
    </div>
  )
}
