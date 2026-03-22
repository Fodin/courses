import { useLanguage } from 'src/hooks'

export function Task6_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 6.3</h2>
    </div>
  )
}
