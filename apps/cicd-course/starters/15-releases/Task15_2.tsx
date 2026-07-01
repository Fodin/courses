import { useLanguage } from '@courses/platform'

export function Task15_2() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.15.2.title')}</h2>
      <p>{t('task.15.2.todo')}</p>
    </div>
  )
}
