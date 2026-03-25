import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.2: Discriminated unions
// Task 3.2: Discriminated Unions
// ============================================

// TODO: Определите AsyncState<T> с вариантами idle | loading | success | error
// TODO: Define AsyncState<T> with variants idle | loading | success | error

// TODO: Создайте renderState(state) обрабатывающую все варианты
// TODO: Create renderState(state) handling all variants

export function Task3_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.3.2')}</h2>
      {/* TODO: Кнопка загрузки и отображение состояния */}
    </div>
  )
}
