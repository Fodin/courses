import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.2: React Codemod
// Task 0.2: React Codemod
// ============================================

// TODO: Создайте компонент, демонстрирующий паттерны, которые codemod автоматически заменяет
// TODO: Create a component demonstrating patterns that codemod automatically replaces

// TODO: Покажите примеры "до" и "после" для каждого codemod-преобразования
// TODO: Show "before" and "after" examples for each codemod transformation

export function Task0_2() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 0.2</h2>

      {/* TODO: Покажите список codemod-преобразований с примерами */}
      {/* TODO: Show list of codemod transformations with examples */}
    </div>
  )
}
