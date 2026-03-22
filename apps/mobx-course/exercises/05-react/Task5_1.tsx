import { useLanguage } from 'src/hooks'

// Task 5.1

export function Task5_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 5.1</h2>
    </div>
  )
}
