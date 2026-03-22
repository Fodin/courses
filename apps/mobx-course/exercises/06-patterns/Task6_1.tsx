import { useLanguage } from 'src/hooks'

export function Task6_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 6.1</h2>
    </div>
  )
}
