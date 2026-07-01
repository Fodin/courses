import { useLanguage } from '@courses/platform'

export function Task17_1() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.17.1.title')}</h2>
      <p>{t('task.17.1.todo')}</p>
    </div>
  )
}
