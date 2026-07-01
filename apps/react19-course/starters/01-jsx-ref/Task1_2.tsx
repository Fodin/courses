import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.2: ref как prop
// Task 1.2: ref as prop
// ============================================

// TODO: Создайте компонент FancyInput, который принимает ref как обычный prop
// TODO: Create a FancyInput component that accepts ref as a regular prop

// TODO: НЕ используйте forwardRef — ref теперь обычный prop в React 19
// TODO: Do NOT use forwardRef — ref is now a regular prop in React 19

export function Task1_2() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 1.2</h2>

      {/* TODO: Создайте FancyInput и используйте ref для фокуса */}
      {/* TODO: Create FancyInput and use ref for focusing */}
    </div>
  )
}
