import { useLanguage } from '@courses/platform'

export function Task7_2() {
  const { t } = useLanguage()
  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.7.2.title')}</h2>
      <p>{t('task.7.2.todo')}</p>
    </div>
  )
}
