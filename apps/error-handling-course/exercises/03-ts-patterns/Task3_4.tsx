import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.4: Exhaustive handling
// Task 3.4: Exhaustive Handling
// ============================================

// TODO: Создайте assertNever(value: never): never
// TODO: Create assertNever(value: never): never

// TODO: Определите Shape union type (circle, rectangle, triangle)
// TODO: Define Shape union type (circle, rectangle, triangle)

// TODO: Реализуйте calculateArea(shape) с assertNever в default
// TODO: Implement calculateArea(shape) with assertNever in default

export function Task3_4() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.3.4')}</h2>
      {/* TODO: Вычисление и отображение площадей */}
    </div>
  )
}
