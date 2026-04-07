import { useLanguage } from '@courses/platform'

export function Task9_3() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.9.3')}</h2>
      <p>TODO: Выполните задание</p>
    </div>
  )
}
