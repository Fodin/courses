import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.3: Отображение ошибок
// Task 6.3: Error Display
// ============================================

// TODO: Реализуйте 3 паттерна: inline, сводка, toast
// TODO: Implement 3 patterns: inline, summary, toast

export function Task6_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.6.3')}</h2>
      {/* TODO: 3 кнопки для демонстрации разных паттернов */}
    </div>
  )
}
