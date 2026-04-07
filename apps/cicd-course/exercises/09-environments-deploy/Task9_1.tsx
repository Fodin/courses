import { useLanguage } from '@courses/platform'

export function Task9_1() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.9.1')}</h2>
      <p>TODO: Выполните задание</p>
    </div>
  )
}
