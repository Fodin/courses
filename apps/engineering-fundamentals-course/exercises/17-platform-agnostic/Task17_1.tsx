import { useLanguage } from 'src/hooks'

// ============================================
// Задание 17.1: Квиз — Платформенная независимость
// Task 17.1: Quiz — Platform Agnostic
// ============================================

export function Task17_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.17.1')}</h2>
      <p>Прочитайте теорию и пройдите квиз.</p>
    </div>
  )
}
