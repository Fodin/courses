import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.4: Type guards для ошибок
// Task 1.4: Type Guards for Errors
// ============================================

// TODO: Напишите isError(value: unknown): value is Error
// TODO: Write isError(value: unknown): value is Error

// TODO: Напишите isApiError для объектов { error: { code, message } }
// TODO: Write isApiError for objects { error: { code, message } }

// TODO: Напишите getErrorMessage(error: unknown): string
// TODO: Write getErrorMessage(error: unknown): string

export function Task1_4() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.1.4')}</h2>

      {/* TODO: Протестируйте type guards на разных значениях */}
      {/* TODO: Test type guards on different values */}
    </div>
  )
}
