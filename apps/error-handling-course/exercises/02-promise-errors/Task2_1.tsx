import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.1: Promise rejection
// Task 2.1: Promise Rejection
// ============================================

export function Task2_1() {
  const { t } = useLanguage()

  // TODO: Создайте промис с reject через setTimeout
  // TODO: Create a promise with reject via setTimeout

  // TODO: Обработайте через .then().catch()
  // TODO: Handle via .then().catch()

  // TODO: Покажите Promise.reject и цепочку промисов
  // TODO: Show Promise.reject and promise chain

  return (
    <div className="exercise-container">
      <h2>{t('task.2.1')}</h2>
      {/* TODO: Кнопка и результаты */}
    </div>
  )
}
