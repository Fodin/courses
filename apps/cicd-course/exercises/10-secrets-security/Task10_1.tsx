import { useLanguage } from '@courses/platform'

export function Task10_1() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.10.1')}</h2>
      <p>TODO: Выполните задание</p>
    </div>
  )
}
