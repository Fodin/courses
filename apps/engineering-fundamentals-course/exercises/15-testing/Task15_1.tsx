import { useLanguage } from 'src/hooks'

// ============================================
// Задание 15.1: Квиз — Тестирование
// Task 15.1: Quiz — Testing
// ============================================

export function Task15_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.15.1')}</h2>
      <p>Прочитайте теорию и пройдите квиз.</p>
    </div>
  )
}
