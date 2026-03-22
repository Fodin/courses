import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.3: ref cleanup function
// Task 1.3: ref cleanup function
// ============================================

// TODO: Создайте компонент с ref callback, который возвращает cleanup-функцию
// TODO: Create a component with a ref callback that returns a cleanup function

// TODO: В cleanup-функции выполните очистку (например, отмена подписки, логирование)
// TODO: In the cleanup function, perform cleanup (e.g., unsubscribe, logging)

export function Task1_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 1.3</h2>

      {/* TODO: Реализуйте ref callback с cleanup */}
      {/* TODO: Implement ref callback with cleanup */}
    </div>
  )
}
