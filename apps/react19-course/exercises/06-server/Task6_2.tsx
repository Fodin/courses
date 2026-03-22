import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.2: Директива 'use client'
// Task 6.2: 'use client' Directive
// ============================================

// TODO: Создайте визуальное дерево компонентов
// и определите, где нужна директива 'use client'
// TODO: Create a visual component tree
// and determine where 'use client' directive is needed

export function Task6_2() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 6.2</h2>

      {/* TODO: Визуализируйте дерево компонентов */}
      {/* TODO: Позвольте пользователю отметить клиентские границы */}
      {/* TODO: Покажите правильные ответы */}
    </div>
  )
}
