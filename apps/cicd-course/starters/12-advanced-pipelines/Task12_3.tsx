import { useLanguage } from '@courses/platform'

export function Task12_3() {
  const { t } = useLanguage()

  // TODO: Выполните задание / TODO: Complete the task

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.12.3')}</h2>
      <p>{t('task.12.3.todo')}</p>
    </div>
  )
}
