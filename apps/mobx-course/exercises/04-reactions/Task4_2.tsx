import { useLanguage } from 'src/hooks'

// Task 4.2

export function Task4_2() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 4.2</h2>
    </div>
  )
}
