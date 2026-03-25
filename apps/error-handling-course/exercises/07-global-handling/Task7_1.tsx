import { useState, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.1: window.onerror
// Task 7.1: window.onerror
// ============================================

// TODO: useEffect с addEventListener('error') и addEventListener('unhandledrejection')
// TODO: useEffect with addEventListener('error') and addEventListener('unhandledrejection')

export function Task7_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.7.1')}</h2>
      {/* TODO: Кнопки для триггера глобальных ошибок и промисов */}
    </div>
  )
}
