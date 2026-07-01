import { useLanguage } from '@courses/platform'

export function Task10_3() {
  const { t } = useLanguage()

  // TODO: Выполните задание / TODO: Complete the task

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.10.3')}</h2>
      <p>{t('task.10.3.todo')}</p>
    </div>
  )
}
