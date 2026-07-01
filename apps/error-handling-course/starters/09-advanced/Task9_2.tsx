import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.2: Тестирование ошибок
// Task 9.2: Testing Errors
// ============================================

// TODO: Создайте test(name, fn) и expect(value) с toBe, toThrow, toThrowType
// TODO: Create test(name, fn) and expect(value) with toBe, toThrow, toThrowType

// TODO: Напишите минимум 6 тестов для функций с throw
// TODO: Write at least 6 tests for functions that throw

export function Task9_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.9.2')}</h2>
      {/* TODO: Кнопка запуска тестов и визуальный отчёт */}
    </div>
  )
}
