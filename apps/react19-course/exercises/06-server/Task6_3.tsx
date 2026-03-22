import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.3: Server Actions
// Task 6.3: Server Actions
// ============================================

// TODO: Создайте форму, которая использует паттерн server action
// (симуляция через async функцию)
// TODO: Create a form that uses the server action pattern
// (simulation via async function)

export function Task6_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 6.3</h2>

      {/* TODO: Создайте async функцию-action */}
      {/* TODO: Передайте её в <form action={...}> */}
      {/* TODO: Обработайте FormData и покажите результат */}
    </div>
  )
}
