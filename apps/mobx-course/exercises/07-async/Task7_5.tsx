import { useLanguage } from 'src/hooks'

export function Task7_5() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 7.5</h2>
    </div>
  )
}
