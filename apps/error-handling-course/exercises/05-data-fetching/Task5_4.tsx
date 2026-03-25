import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.4: Восстановление загрузки
// Task 5.4: Fetch Recovery
// ============================================

// TODO: Создайте функцию, успешную с 3-й попытки
// TODO: Create function that succeeds on 3rd attempt

// TODO: Реализуйте retry с визуализацией прогресса
// TODO: Implement retry with progress visualization

export function Task5_4() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.5.4')}</h2>
      {/* TODO: Кнопка, прогресс попыток, результат */}
    </div>
  )
}
