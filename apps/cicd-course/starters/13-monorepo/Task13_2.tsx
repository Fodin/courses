import { useLanguage } from '@courses/platform'

export function Task13_2() {
  const { t } = useLanguage()

  // TODO: Выполните задание / TODO: Complete the task

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.13.2')}</h2>
      <p>{t('task.13.2.todo')}</p>
    </div>
  )
}
