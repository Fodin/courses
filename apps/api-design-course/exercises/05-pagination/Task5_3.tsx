import { useState } from 'react'

// TODO: Define interface Scenario with fields:
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

// TODO: Create SCENARIOS array with 3 scenarios:
//   1. "Лента новостей" — correct: cursor
//      (posts added constantly, infinite scroll, stability required)
//   2. "Админ-панель заказов" — correct: offset
//      (page navigation, jump to page N, show total count)
//   3. "Бесконечный скролл товаров" — correct: cursor
//      (products added/removed, no page buttons, no duplicates)
//   For each scenario include wrongAnswer (the incorrect choice) with explanation
//   and correctAnswer with justification (4+ reasons) and responseExample JSON string

export function Task5_3() {
  // TODO: openScenario state: number | null (which scenario card is open)
  // TODO: selectedAnswers state: Record<number, 'offset' | 'cursor' | null>
  // TODO: showResult state: Record<number, boolean>

  // TODO: handleSelect(scenarioId, type) — sets selected answer if not yet revealed
  // TODO: handleCheck(scenarioId) — reveals result and opens the scenario card

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
    </div>
  )
}
