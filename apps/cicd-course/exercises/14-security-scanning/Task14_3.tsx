import { useLanguage } from '@courses/platform'

export function Task14_3() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.14.3.title')}</h2>
      <p>{t('task.14.3.todo')}</p>
    </div>
  )
}
