import { useLanguage } from 'src/hooks'

// Task 4.3

export function Task4_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 4.3</h2>
    </div>
  )
}
