import { useState, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.4: Мониторинг ошибок
// Task 8.4: Error Monitoring
// ============================================

// TODO: Создайте class ErrorMonitor с report(error, extra?)
// TODO: Create class ErrorMonitor with report(error, extra?)

export function Task8_4() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.8.4')}</h2>
      {/* TODO: Симуляция ошибок и отображение отчётов */}
    </div>
  )
}
