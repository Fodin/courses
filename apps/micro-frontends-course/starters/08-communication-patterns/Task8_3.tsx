// Task 8.3 — Communication Pattern Selector
// Build an interactive quiz where the student selects the best MFE communication
// pattern for each of 6 real-world scenarios, then gets detailed feedback.

// TODO: Implement the pattern selector with the following structure:
//
// PATTERNS (5 options):
//   - 'custom-events'  → "Custom Events (pub/sub)"          color: #1565c0
//   - 'shared-state'   → "Shared State (Zustand/Redux)"     color: #2e7d32
//   - 'url-storage'    → "URL / localStorage"               color: #6a1b9a
//   - 'props-shell'    → "Props через Shell"                color: #e65100
//   - 'orchestrator'   → "Orchestrator Pattern"             color: #880e4f
//
// SCENARIOS (6 items, each with):
//   - id, title, description
//   - correct: PatternId (correct answer)
//   - correctExplanation: why this pattern is right
//   - badPattern: PatternId (common wrong choice)
//   - badExplanation: why that pattern is a mistake here
//
// Example scenarios:
//   1. Каталог добавляет товар в корзину → correct: 'custom-events'
//   2. Корзина отображает счётчик в шапке → correct: 'shared-state'
//   3. Профиль обновляет язык для всех MFE → correct: 'url-storage'
//   4. Shell передаёт токен авторизации → correct: 'props-shell'
//   5. Checkout и Payment: многошаговый процесс → correct: 'orchestrator'
//   6. Аналитика собирает события из всех MFE → correct: 'custom-events'
//
// STATE:
//   - selectedScenario: Scenario — current scenario (initial: SCENARIOS[0])
//   - userChoice: PatternId | null — selected pattern
//   - showResult: boolean — show feedback after check
//
// BEHAVIORS:
//
// handleScenarioChange(id):
//   - Find scenario by id
//   - Reset userChoice to null
//   - Reset showResult to false
//
// handleCheck():
//   - Set showResult = true (only if userChoice !== null)
//
// handleNext():
//   - Go to next scenario (wraps around)
//   - Reset userChoice and showResult
//
// UI LAYOUT:
//
// 1. SCENARIO SELECTOR (row of buttons):
//    - Each button shows: "{id}. {first 3 words}..."
//    - Active: dark blue border/bg, bold
//    - Inactive: grey border, normal weight
//
// 2. SCENARIO CARD (blue bordered, indigo bg):
//    - Title: "Сценарий {id}: {title}"
//    - Description text
//
// 3. PATTERN BUTTONS (flex wrap):
//    - Each pattern as button
//    - Selected: colored border + light bg + bold text
//    - Unselected: grey border
//
// 4. "Проверить" button (shown when choice selected, hidden when result shown)
//
// 5. RESULT BLOCK (shown after Проверить):
//    a) Verdict banner:
//       - Correct: green background "Верно!"
//       - Wrong: red background "Неверно. Правильный ответ: {pattern label}"
//    b) Correct answer card (green border):
//       - "Почему {correct pattern}?"
//       - correctExplanation text
//    c) Anti-pattern card (orange border):
//       - "Почему не стоит использовать {badPattern}?"
//       - badExplanation text
//    d) Cheat sheet (2-column grid, white cards with colored left border):
//       - Each pattern: label + "when to use" one-liner
//    e) "Следующий сценарий →" button (indigo)
//
// All styles must be inline (no CSS files, no CSS modules)

export function Task8_3() {
  return <div>Task 8.3</div>
}
