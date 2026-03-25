import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.1: Встроенные типы ошибок
// Task 1.1: Built-in Error Types
// ============================================

export function Task1_1() {
  const { t } = useLanguage()

  // TODO: Создайте состояние для результатов
  // TODO: Create state for results

  // TODO: Создайте функцию demonstrateErrors, которая:
  // TODO: Create demonstrateErrors function that:
  // 1. Провоцирует TypeError (вызов метода на null)
  // 1. Triggers TypeError (calling method on null)
  // 2. Провоцирует RangeError (new Array(-1))
  // 2. Triggers RangeError (new Array(-1))
  // 3. Провоцирует SyntaxError (JSON.parse)
  // 3. Triggers SyntaxError (JSON.parse)
  // 4. Провоцирует URIError (decodeURIComponent('%'))
  // 4. Triggers URIError (decodeURIComponent('%'))
  // 5. Проверяет instanceof цепочку
  // 5. Checks instanceof chain

  return (
    <div className="exercise-container">
      <h2>{t('task.1.1')}</h2>

      {/* TODO: Кнопка запуска и отображение результатов */}
      {/* TODO: Run button and results display */}
    </div>
  )
}
