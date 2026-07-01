import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.1: Квиз — Обработка ошибок
// Task 12.1: Quiz — Error Handling
// ============================================

export function Task12_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.12.1')}</h2>
      <p>Прочитайте теорию и пройдите квиз.</p>
    </div>
  )
}
