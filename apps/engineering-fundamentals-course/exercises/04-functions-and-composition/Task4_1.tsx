import { useLanguage } from 'src/hooks'

export function Task4_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.4.1')}</h2>
      <p>Прочитайте теорию и пройдите квиз.</p>
    </div>
  )
}
