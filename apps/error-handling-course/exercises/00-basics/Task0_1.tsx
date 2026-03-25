import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.1: Первый try/catch
// Task 0.1: First try/catch
// ============================================

// TODO: Создайте массив состояний для хранения результатов
// TODO: Create a state array to store results

export function Task0_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.0.1')}</h2>

      {/* TODO: Создайте кнопку, которая запускает примеры */}
      {/* TODO: Create a button that runs examples */}

      {/* TODO: Пример 1 — парсинг корректного JSON через try/catch */}
      {/* TODO: Example 1 — parse valid JSON via try/catch */}

      {/* TODO: Пример 2 — парсинг некорректного JSON, обработка SyntaxError */}
      {/* TODO: Example 2 — parse invalid JSON, handle SyntaxError */}

      {/* TODO: Пример 3 — throw new Error + finally блок */}
      {/* TODO: Example 3 — throw new Error + finally block */}

      {/* TODO: Отобразите результаты на странице */}
      {/* TODO: Display results on the page */}
    </div>
  )
}
