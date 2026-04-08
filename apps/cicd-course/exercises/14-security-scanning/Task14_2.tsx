import { useLanguage } from '@courses/platform'

export function Task14_2() {
  const { t } = useLanguage()

  // TODO: Выполните задание / TODO: Complete the task

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.14.2.title')}</h2>
      <p>{t('task.14.2.todo')}</p>
    </div>
  )
}
