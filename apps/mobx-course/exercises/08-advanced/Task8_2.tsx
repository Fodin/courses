import { useLanguage } from 'src/hooks'

export function Task8_2() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 8.2</h2>
    </div>
  )
}
