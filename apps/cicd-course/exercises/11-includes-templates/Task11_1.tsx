import { useLanguage } from '@courses/platform'

export function Task11_1() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.11.1')}</h2>
      <p>TODO: Выполните задание</p>
    </div>
  )
}
