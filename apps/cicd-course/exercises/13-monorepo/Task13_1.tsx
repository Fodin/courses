import { useLanguage } from '@courses/platform'

export function Task13_1() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.13.1')}</h2>
      <p>TODO: Выполните задание</p>
    </div>
  )
}
