import { useLanguage } from '@courses/platform'

export function Task8_2() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.8.2')}</h2>
      <p>TODO: Выполните задание</p>
    </div>
  )
}
