import { useLanguage } from '@courses/platform'

export function Task7_3() {
  const { t } = useLanguage()
  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.7.3.title')}</h2>
      <p>{t('task.7.3.todo')}</p>
    </div>
  )
}
