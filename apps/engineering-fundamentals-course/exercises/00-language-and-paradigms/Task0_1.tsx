import { useLanguage } from 'src/hooks'

export function Task0_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.0.1')}</h2>
      <p>Прочитайте теорию и пройдите квиз.</p>
    </div>
  )
}
