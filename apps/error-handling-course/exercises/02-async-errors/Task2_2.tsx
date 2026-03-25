import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.2: async/await обработка
// Task 2.2: async/await Handling
// ============================================

// TODO: Создайте simulateApi(shouldFail: boolean): Promise<{data: string}>
// TODO: Create simulateApi(shouldFail: boolean): Promise<{data: string}>

export function Task2_2() {
  const { t } = useLanguage()

  // TODO: Реализуйте async функцию с try/catch/finally
  // TODO: Implement async function with try/catch/finally

  return (
    <div className="exercise-container">
      <h2>{t('task.2.2')}</h2>
      {/* TODO: Кнопка, индикатор загрузки, результаты */}
    </div>
  )
}
