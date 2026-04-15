import { useLanguage } from 'src/hooks'

export function Task1_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.1.1')}</h2>
      <p>Прочитайте теорию и пройдите квиз.</p>
    </div>
  )
}
