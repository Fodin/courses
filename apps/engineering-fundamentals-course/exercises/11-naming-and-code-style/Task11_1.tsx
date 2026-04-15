import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.1: Квиз — Именование и стиль кода
// Task 11.1: Quiz — Naming and Code Style
// ============================================

export function Task11_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.11.1')}</h2>
      <p>Прочитайте теорию и пройдите квиз.</p>
    </div>
  )
}
