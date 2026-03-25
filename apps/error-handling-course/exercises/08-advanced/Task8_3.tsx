import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.3: Финальный проект — Todo
// Task 8.3: Final Project — Todo
// ============================================

// TODO: Создайте AppError с кодами ошибок
// TODO: Create AppError with error codes

// TODO: Симулируйте API: list, add, toggle, delete
// TODO: Simulate API: list, add, toggle, delete
// - Пустой текст → VALIDATION
// - >5 задач → LIMIT_EXCEEDED
// - 20% шанс → SERVER_ERROR
// - Нет задачи → NOT_FOUND

// TODO: Создайте Todo UI с полной обработкой ошибок
// TODO: Create Todo UI with full error handling

export function Task8_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.8.3')}</h2>
      {/* TODO: Input, список задач, ошибки, loading */}
    </div>
  )
}
