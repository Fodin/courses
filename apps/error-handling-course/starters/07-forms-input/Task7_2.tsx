import { useState, type FormEvent } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.2: Серверные ошибки
// Task 7.2: Server Errors
// ============================================

// TODO: Создайте simulateServerValidation с ошибками для admin и @test.com
// TODO: Create simulateServerValidation with errors for admin and @test.com

export function Task7_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.7.2')}</h2>
      {/* TODO: Форма с серверной валидацией */}
    </div>
  )
}
