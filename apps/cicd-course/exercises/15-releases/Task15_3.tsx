import { useLanguage } from '@courses/platform'

export function Task15_3() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.15.3.title')}</h2>
      <p>{t('task.15.3.todo')}</p>
    </div>
  )
}
