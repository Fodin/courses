import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.3: Promise.allSettled
// Task 2.3: Promise.allSettled
// ============================================

// TODO: Создайте fetchUser(id), которая для id=3 возвращает reject
// TODO: Create fetchUser(id) that returns reject for id=3

export function Task2_3() {
  const { t } = useLanguage()

  // TODO: Покажите Promise.all, Promise.allSettled, Promise.race, Promise.any
  // TODO: Show Promise.all, Promise.allSettled, Promise.race, Promise.any

  return (
    <div className="exercise-container">
      <h2>{t('task.2.3')}</h2>
      {/* TODO: Кнопка и результаты */}
    </div>
  )
}
