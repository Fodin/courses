import { useLanguage } from '@courses/platform'

export function Task7_4() {
  const { t } = useLanguage()
  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.7.4.title')}</h2>
      <p>{t('task.7.4.todo')}</p>
      {/* TODO: Complete the exercise / TODO: Выполните задание */}
    </div>
  )
}
