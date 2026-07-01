import { useLanguage } from 'src/hooks'

// ============================================
// Задание 18.1: Квиз — AI-assisted инженерия
// Task 18.1: Quiz — AI-assisted Engineering
// ============================================

export function Task18_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.18.1')}</h2>
      <p>Прочитайте теорию и пройдите квиз.</p>
    </div>
  )
}
