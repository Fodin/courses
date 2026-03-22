import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.2: Пошаговая миграция
// Task 8.2: Step-by-Step Migration
// ============================================

// TODO: Перепишите компонент с forwardRef, useContext,
// ручным form handling на React 19 API
// TODO: Rewrite a component with forwardRef, useContext,
// manual form handling to React 19 APIs

export function Task8_2() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 8.2</h2>

      {/* TODO: Замените forwardRef на ref as prop */}
      {/* TODO: Замените useContext на use() */}
      {/* TODO: Замените ручной onSubmit на useActionState */}
    </div>
  )
}
