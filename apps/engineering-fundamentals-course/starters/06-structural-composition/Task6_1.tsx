import { useLanguage } from 'src/hooks'

export function Task6_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.6.1')}</h2>
      <p>Прочитайте теорию и пройдите квиз.</p>
    </div>
  )
}
