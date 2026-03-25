import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.2: Объект Error и его свойства
// Task 0.2: The Error Object and Its Properties
// ============================================

// TODO: Определите интерфейс ErrorInfo с полями name, message, stack
// TODO: Define ErrorInfo interface with name, message, stack fields

export function Task0_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.0.2')}</h2>

      {/* TODO: Кнопка "Исследовать Error" — создаёт Error и показывает name, message, stack */}
      {/* TODO: "Inspect Error" button — creates Error and shows name, message, stack */}

      {/* TODO: Кнопка "Создать разные ошибки" — создаёт Error, TypeError, RangeError, SyntaxError, ReferenceError, URIError */}
      {/* TODO: "Create different errors" button — creates Error, TypeError, RangeError, SyntaxError, ReferenceError, URIError */}

      {/* TODO: Отобразите свойства ошибки и таблицу типов */}
      {/* TODO: Display error properties and types table */}
    </div>
  )
}
