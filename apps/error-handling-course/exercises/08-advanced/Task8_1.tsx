import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.1: Функциональная обработка ошибок
// Task 8.1: Functional Error Handling
// ============================================

// TODO: Определите Result<T, E> и хелперы ok/err
// TODO: Define Result<T, E> and ok/err helpers

// TODO: Реализуйте map, flatMap, mapError, unwrapOr
// TODO: Implement map, flatMap, mapError, unwrapOr

// TODO: Создайте pipeline: parse → validate → sqrt → double
// TODO: Create pipeline: parse → validate → sqrt → double

export function Task8_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.8.1')}</h2>
      {/* TODO: Input, кнопка вычисления, результат */}
    </div>
  )
}
