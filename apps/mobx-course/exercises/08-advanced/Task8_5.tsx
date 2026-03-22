import { useLanguage } from 'src/hooks'

export function Task8_5() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 8.5</h2>
    </div>
  )
}
