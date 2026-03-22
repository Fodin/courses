import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.3: Финальный рефакторинг — Todo App
// Task 8.3: Final Refactoring — Todo App
// ============================================

// TODO: Перепишите Todo App с React 18 на React 19
// используя все новые API: use(), useActionState,
// useOptimistic, ref as prop, document metadata
// TODO: Rewrite Todo App from React 18 to React 19
// using all new APIs

export function Task8_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 8.3</h2>

      {/* TODO: Создайте полноценное Todo приложение на React 19 */}
      {/* TODO: Используйте useActionState для добавления задач */}
      {/* TODO: Используйте useOptimistic для мгновенного отклика */}
      {/* TODO: Используйте <title> для отображения счётчика */}
    </div>
  )
}
