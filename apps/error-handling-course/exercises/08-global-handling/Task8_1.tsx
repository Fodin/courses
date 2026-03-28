import { useState, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.1: window.onerror
// Task 8.1: window.onerror
// ============================================

// TODO: useEffect с addEventListener('error') и addEventListener('unhandledrejection')
// TODO: useEffect with addEventListener('error') and addEventListener('unhandledrejection')

export function Task8_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.8.1')}</h2>
      {/* TODO: Кнопки для триггера глобальных ошибок и промисов */}
    </div>
  )
}
