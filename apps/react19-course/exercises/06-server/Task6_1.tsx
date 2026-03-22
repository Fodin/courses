import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.1: Серверные vs клиентские компоненты
// Task 6.1: Server vs Client Components
// ============================================

// TODO: Создайте интерактивный квиз, где пользователь определяет
// какие компоненты серверные, а какие клиентские
// TODO: Create an interactive quiz where the user identifies
// which components are server and which are client

export function Task6_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 6.1</h2>

      {/* TODO: Создайте массив карточек с описанием компонентов */}
      {/* TODO: Для каждой карточки: кнопки "Server" / "Client" */}
      {/* TODO: Показывайте результат после ответа */}
    </div>
  )
}
