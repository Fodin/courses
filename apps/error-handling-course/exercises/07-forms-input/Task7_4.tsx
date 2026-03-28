import { useState, useRef, type FormEvent } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.4: Доступность ошибок
// Task 7.4: Error Accessibility
// ============================================

// TODO: Используйте aria-required, aria-invalid, aria-describedby, role="alert"
// TODO: Use aria-required, aria-invalid, aria-describedby, role="alert"

// TODO: При submit фокусируйте первое ошибочное поле через ref
// TODO: On submit focus first errored field via ref

export function Task7_4() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.7.4')}</h2>
      {/* TODO: Доступная форма с aria-атрибутами */}
    </div>
  )
}
