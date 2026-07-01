import { useLanguage } from 'src/hooks'

// ============================================
// Задание 13.1: Квиз — Конкурентность и асинхронность
// Task 13.1: Quiz — Concurrency and Async
// ============================================

export function Task13_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.13.1')}</h2>
      <p>Прочитайте теорию и пройдите квиз.</p>
    </div>
  )
}
