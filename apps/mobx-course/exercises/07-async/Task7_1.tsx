import { useLanguage } from 'src/hooks'

export function Task7_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 7.1</h2>
    </div>
  )
}
