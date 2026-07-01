import { useLanguage } from 'src/hooks'

// ============================================
// Задание 16.1: Квиз — Рефакторинг и код-ревью
// Task 16.1: Quiz — Refactoring and Code Review
// ============================================

export function Task16_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.16.1')}</h2>
      <p>Прочитайте теорию и пройдите квиз.</p>
    </div>
  )
}
