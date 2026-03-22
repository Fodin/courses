import { useLanguage } from 'src/hooks'

export function Task7_4() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 7.4</h2>
    </div>
  )
}
