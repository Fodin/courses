import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.2: setFocus, resetField, getFieldState
// Task 11.2: setFocus, resetField, getFieldState
// ============================================

// TODO: Создайте форму входа с использованием setFocus, resetField и getFieldState
// TODO: Create a login form using setFocus, resetField and getFieldState
//
// 1. При загрузке — автоматический фокус на первое поле через setFocus
// 1. On mount — auto-focus first field via setFocus
//
// 2. Кнопка resetField для сброса отдельного поля (email)
// 2. resetField button to reset individual field (email)
//
// 3. Кнопка getFieldState для показа состояния поля (isDirty, isTouched, error)
// 3. getFieldState button to show field state (isDirty, isTouched, error)
//
// 4. Используйте useFormState в дочернем компоненте для изоляции ререндеров
// 4. Use useFormState in a child component to isolate rerenders
//
// 5. Покажите счётчик ререндеров формы
// 5. Show form render counter

export function Task11_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.11.2')}</h2>

      {/* TODO: Реализуйте форму здесь */}
      {/* TODO: Implement form here */}
    </div>
  )
}
