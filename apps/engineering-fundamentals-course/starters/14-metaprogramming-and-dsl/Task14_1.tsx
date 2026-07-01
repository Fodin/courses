import { useLanguage } from 'src/hooks'

// ============================================
// Задание 14.1: Квиз — Метапрограммирование и DSL
// Task 14.1: Quiz — Metaprogramming and DSL
// ============================================

export function Task14_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.14.1')}</h2>
      <p>Прочитайте теорию и пройдите квиз.</p>
    </div>
  )
}
