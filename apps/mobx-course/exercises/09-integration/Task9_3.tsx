import { useLanguage } from 'src/hooks'

export function Task9_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 9.3</h2>
    </div>
  )
}
