import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.1: Ошибки fetch
// Task 5.1: Fetch Errors
// ============================================

export function Task5_1() {
  const { t } = useLanguage()

  // TODO: Покажите 3 типа ошибок fetch: HTTP не-ok, сетевая, парсинг JSON
  // TODO: Show 3 types of fetch errors: HTTP non-ok, network, JSON parsing

  return (
    <div className="exercise-container">
      <h2>{t('task.5.1')}</h2>
      {/* TODO: Кнопка и результаты */}
    </div>
  )
}
