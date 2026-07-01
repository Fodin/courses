import { useLanguage } from '@courses/platform'

export function Task7_1() {
  const { t } = useLanguage()
  return (
    <div style={{ padding: '1rem' }}>
      <h2>{t('task.7.1.title')}</h2>
      <p>{t('task.7.1.todo')}</p>
      {/* TODO: Complete the exercise / TODO: Выполните задание */}
    </div>
  )
}
