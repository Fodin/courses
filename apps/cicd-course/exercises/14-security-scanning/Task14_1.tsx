import { useLanguage } from '@courses/platform'

export function Task14_1() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.14.1.title')}</h2>
      <p>{t('task.14.1.todo')}</p>
    </div>
  )
}
