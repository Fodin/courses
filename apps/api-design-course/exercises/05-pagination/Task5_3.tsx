import { useState } from 'react'

// TODO: Define interface Scenario with fields: / TODO: Определить интерфейс Scenario с полями:
//   id: number
//   title: string
//   description: string
//   requirements: string[]
//   wrongAnswer: { type: 'offset' | 'cursor', label: string, reason: string }
//   correctAnswer: {
//     type: 'offset' | 'cursor'
//     label: string
//     params: string       ← example URL
//     justification: string[]
//     responseExample: string
//   }

// TODO: Create SCENARIOS array with 3 scenarios: / TODO: Создать массив SCENARIOS с 3 сценариями:
//   1. "Лента новостей" — correct: cursor
//      (posts added constantly, infinite scroll, stability required)
//   2. "Админ-панель заказов" — correct: offset
//      (page navigation, jump to page N, show total count)
//   3. "Бесконечный скролл товаров" — correct: cursor
//      (products added/removed, no page buttons, no duplicates)
//   For each scenario include wrongAnswer (the incorrect choice) with explanation
//   and correctAnswer with justification (4+ reasons) and responseExample JSON string
//   1. "Лента новостей" — правильно: cursor
//      (посты добавляются постоянно, бесконечная прокрутка, требуется стабильность)
//   2. "Админ-панель заказов" — правильно: offset
//      (навигация по страницам, переход на страницу N, показ общего количества)
//   3. "Бесконечный скролл товаров" — правильно: cursor
//      (товары добавляются/удаляются, нет кнопок страниц, нет дубликатов)
//   Для каждого сценария включить wrongAnswer (неверный выбор) с объяснением
//   и correctAnswer с обоснованием (4+ причин) и responseExample в виде JSON-строки

export function Task5_3() {
  // TODO: openScenario state: number | null (which scenario card is open)
  // TODO: Состояние openScenario: number | null (какая карточка сценария открыта)
  // TODO: selectedAnswers state: Record<number, 'offset' | 'cursor' | null>
  // TODO: Состояние selectedAnswers: Record<number, 'offset' | 'cursor' | null>
  // TODO: showResult state: Record<number, boolean>
  // TODO: Состояние showResult: Record<number, boolean>

  // TODO: handleSelect(scenarioId, type) — sets selected answer if not yet revealed
  // TODO: Реализовать handleSelect(scenarioId, type) — устанавливает выбранный ответ, если результат ещё не показан
  // TODO: handleCheck(scenarioId) — reveals result and opens the scenario card
  // TODO: Реализовать handleCheck(scenarioId) — показывает результат и открывает карточку сценария

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Проектирование пагинации: self-check</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Для каждого сценария выберите подходящий тип пагинации, затем проверьте себя.
      </p>

      {/* TODO: Map over SCENARIOS and render a card for each:
           Card structure:
           - Border: green if correct, red if wrong, gray if not yet revealed
           - Clickable header: title + description + expand/collapse indicator
             (show ✅ or ❌ icon after reveal)

           When card is open (openScenario === scenario.id):
           - Requirements list
           - If not revealed: two choice buttons (offset / cursor) + "Проверить" button
             (Проверить disabled until an option is selected)
           - If revealed:
             * If wrong: red block with wrongAnswer.label and wrongAnswer.reason
             * Green block with:
               - correctAnswer.label
               - example URL (dark monospace block)
               - justification list
             * Pre block with responseExample JSON */}
      {/* TODO: Пройтись по SCENARIOS и отрисовать карточку для каждого:
           Структура карточки:
           - Рамка: зелёная если верно, красная если неверно, серая если ещё не показано
           - Кликабельный заголовок: title + description + индикатор раскрытия
             (показать ✅ или ❌ после раскрытия результата)

           Когда карточка открыта (openScenario === scenario.id):
           - Список требований
           - Если результат не показан: две кнопки выбора (offset / cursor) + кнопка "Проверить"
             ("Проверить" неактивна, пока не выбран вариант)
           - Если результат показан:
             * Если неверно: красный блок с wrongAnswer.label и wrongAnswer.reason
             * Зелёный блок с:
               - correctAnswer.label
               - пример URL (тёмный моноширинный блок)
               - список обоснований
             * Блок pre с responseExample JSON */}
    </div>
  )
}
