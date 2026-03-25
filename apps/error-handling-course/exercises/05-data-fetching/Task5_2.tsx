import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.2: API ошибки
// Task 5.2: API Errors
// ============================================

// TODO: Создайте class ApiError extends Error { status, code, details }
// TODO: Create class ApiError extends Error { status, code, details }

// TODO: Создайте simulateApiCall с разными ответами (200, 403, 404, 500)
// TODO: Create simulateApiCall with different responses (200, 403, 404, 500)

export function Task5_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.5.2')}</h2>
      {/* TODO: Тестирование эндпоинтов с отображением ошибок */}
    </div>
  )
}
