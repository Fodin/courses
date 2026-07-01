import { useState, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.3: Loading/Error/Success
// Task 6.3: Loading/Error/Success
// ============================================

// TODO: Определите FetchState<T> = idle | loading | success | error
// TODO: Define FetchState<T> = idle | loading | success | error

// TODO: Создайте хук useFetch<T>(fetchFn) => { state, execute }
// TODO: Create hook useFetch<T>(fetchFn) => { state, execute }

export function Task6_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.6.3')}</h2>
      {/* TODO: Кнопка загрузки и отображение всех 4 состояний */}
    </div>
  )
}
