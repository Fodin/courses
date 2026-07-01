import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.2: Custom Error классы
// Task 1.2: Custom Error Classes
// ============================================

// TODO: Создайте класс ValidationError extends Error с полем field: string
// TODO: Create class ValidationError extends Error with field: string

// TODO: Создайте класс HttpError extends Error с полем statusCode: number
// TODO: Create class HttpError extends Error with statusCode: number

// TODO: Создайте класс NotFoundError extends HttpError (statusCode = 404)
// TODO: Create class NotFoundError extends HttpError (statusCode = 404)

export function Task1_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.1.2')}</h2>

      {/* TODO: Кнопка запуска и демонстрация instanceof цепочки */}
      {/* TODO: Run button and instanceof chain demonstration */}
    </div>
  )
}
