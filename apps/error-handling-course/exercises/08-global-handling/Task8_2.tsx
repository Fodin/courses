import { useState, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.2: Сервис логирования
// Task 8.2: Logging Service
// ============================================

// TODO: Создайте class ErrorLogger с error(), warn(), info(), subscribe(), clear()
// TODO: Create class ErrorLogger with error(), warn(), info(), subscribe(), clear()

export function Task8_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.8.2')}</h2>
      {/* TODO: Кнопки логирования и таблица логов */}
    </div>
  )
}
