import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.3: Type-safe ошибки
// Task 3.3: Type-safe Errors
// ============================================

// TODO: Определите AppErrorCode union и TypedError<C> interface
// TODO: Define AppErrorCode union and TypedError<C> interface

// TODO: Специализируйте ValidationErr и NotFoundErr
// TODO: Specialize ValidationErr and NotFoundErr

// TODO: Создайте handleAppError(error: AppErr): string
// TODO: Create handleAppError(error: AppErr): string

export function Task3_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.3.3')}</h2>
      {/* TODO: Демонстрация обработки 5 разных ошибок */}
    </div>
  )
}
