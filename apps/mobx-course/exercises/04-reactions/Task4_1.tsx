import { useLanguage } from 'src/hooks'

// Task 4.1

export function Task4_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 4.1</h2>
    </div>
  )
}
