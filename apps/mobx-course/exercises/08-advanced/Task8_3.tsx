import { useLanguage } from 'src/hooks'

export function Task8_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 8.3</h2>
    </div>
  )
}
