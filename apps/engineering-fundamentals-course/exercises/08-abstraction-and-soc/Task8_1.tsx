import { useLanguage } from 'src/hooks'

export function Task8_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.8.1')}</h2>
      <p>Прочитайте теорию и пройдите квиз.</p>
    </div>
  )
}
