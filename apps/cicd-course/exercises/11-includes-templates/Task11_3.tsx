import { useLanguage } from '@courses/platform'

export function Task11_3() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.11.3')}</h2>
      <p>TODO: Выполните задание</p>
    </div>
  )
}
