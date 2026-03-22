import { useLanguage } from 'src/hooks'

export function Task8_4() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 8.4</h2>
    </div>
  )
}
