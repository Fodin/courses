import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.1: async/await обработка
// Task 3.1: async/await Handling
// ============================================

// TODO: Создайте simulateApi(shouldFail: boolean): Promise<{data: string}>
// TODO: Create simulateApi(shouldFail: boolean): Promise<{data: string}>

export function Task3_1() {
  const { t } = useLanguage()

  // TODO: Реализуйте async функцию с try/catch/finally
  // TODO: Implement async function with try/catch/finally

  return (
    <div className="exercise-container">
      <h2>{t('task.3.1')}</h2>
      {/* TODO: Кнопка, индикатор загрузки, результаты */}
    </div>
  )
}
