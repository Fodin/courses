import { useLanguage } from '@courses/platform'

export function Task16_4() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.16.4.title')}</h2>
      <p>{t('task.16.4.todo')}</p>
    </div>
  )
}
