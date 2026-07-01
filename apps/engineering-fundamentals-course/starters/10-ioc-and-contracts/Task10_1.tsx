import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.1: Квиз — Инверсия управления и контракты
// Task 10.1: Quiz — IoC and Contracts
// ============================================

export function Task10_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.10.1')}</h2>
      <p>Прочитайте теорию и пройдите квиз.</p>
    </div>
  )
}
