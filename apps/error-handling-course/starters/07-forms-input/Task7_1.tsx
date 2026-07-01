import { useState, type FormEvent } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.1: Ошибки валидации
// Task 7.1: Validation Errors
// ============================================

// TODO: Определите ValidationErrors = { [field: string]: string[] }
// TODO: Define ValidationErrors = { [field: string]: string[] }

// TODO: Реализуйте validate(data) с правилами для name, email, age
// TODO: Implement validate(data) with rules for name, email, age

export function Task7_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.7.1')}</h2>
      {/* TODO: Форма с 3 полями и inline ошибками */}
    </div>
  )
}
