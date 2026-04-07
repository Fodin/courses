import { useLanguage } from '@courses/platform'

export function Task8_1() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.8.1')}</h2>
      <p>TODO: Выполните задание</p>
    </div>
  )
}
