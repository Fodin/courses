import { useLanguage } from 'src/hooks'

export function Task7_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 7.3</h2>
    </div>
  )
}
