import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.1: Result тип
// Task 4.1: Result Type
// ============================================

// TODO: Определите type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }
// TODO: Define type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }

// TODO: Создайте хелперы ok(value) и err(error)
// TODO: Create helpers ok(value) and err(error)

// TODO: Реализуйте safeDivide, safeParseInt, safeJsonParse
// TODO: Implement safeDivide, safeParseInt, safeJsonParse

export function Task4_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.4.1')}</h2>
      {/* TODO: Демонстрация Result-функций и цепочка операций */}
    </div>
  )
}
