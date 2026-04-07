import { useLanguage } from '@courses/platform'

export function Task15_1() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.15.1.title')}</h2>
      <p>{t('task.15.1.todo')}</p>
    </div>
  )
}
