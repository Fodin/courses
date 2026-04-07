import { useLanguage } from '@courses/platform'

export function Task16_2() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.16.2.title')}</h2>
      <p>{t('task.16.2.todo')}</p>
    </div>
  )
}
