import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.4: Retry паттерн
// Task 2.4: Retry Pattern
// ============================================

// TODO: Создайте нестабильную API-функцию (успех с 3-й попытки)
// TODO: Create unstable API function (succeeds on 3rd attempt)

// TODO: Реализуйте async function retry<T>(fn, options): Promise<T>
// TODO: Implement async function retry<T>(fn, options): Promise<T>

export function Task2_4() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.2.4')}</h2>
      {/* TODO: Кнопка, прогресс retry в реальном времени, результат */}
    </div>
  )
}
