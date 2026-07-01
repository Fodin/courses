import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Task 5.2: Event Handler vs Effect (You Might Not Need an Effect)
// Four scenario cards. Two are implemented incorrectly.
// Find the bugs and fix them using the Golden Rule:
//   "Because the component is shown" → Effect
//   "Because the user did something" → Event Handler

// The four scenarios:
//   1. Welcome Banner — analytics.track on mount
//   2. Like Button    — POST /api/likes on click  [INCORRECT]
//   3. Live Chat      — WebSocket subscription
//   4. Settings Form  — save to localStorage on Save button  [INCORRECT]

type ScenarioStatus = 'unknown' | 'correct' | 'incorrect'

// TODO: define the Scenario type with fields:
//   id, title, description, badCode, goodCode,
//   isCorrect, explanation (why correct), wrongExplanation (why wrong)

// TODO: define the SCENARIOS array with all 4 scenarios
//   - Scenario 1 (isCorrect: true): analytics in useEffect with []
//   - Scenario 2 (isCorrect: false): POST in useEffect watching [liked, postId]
//   - Scenario 3 (isCorrect: true): WebSocket in useEffect with cleanup
//   - Scenario 4 (isCorrect: false): localStorage.setItem in useEffect watching [theme]

export function Task5_2() {
  const { t } = useLanguage()

  // TODO: statuses state: Record<number, ScenarioStatus> — initially all 'unknown'
  // TODO: revealed state: Record<number, boolean> — tracks which solutions are shown

  // TODO: handleCheck(id, guess) — compare guess to scenario.isCorrect, update status
  // TODO: handleReveal(id) — mark scenario as revealed

  return (
    <div className="exercise-container">
      <h2>{t('task.5.2')}</h2>

      {/* TODO: render Golden Rule banner */}

      {/* TODO: map over SCENARIOS and render a card for each:
            - header: scenario number + title + status badge (if not 'unknown')
            - code block: show badCode (or goodCode if revealed)
            - controls (if status === 'unknown'):
                "Эта реализация правильная?" + Yes/No buttons
            - result (if status !== 'unknown'):
                explanation text
                "Показать правильный код" button (only for incorrect scenarios) */}
    </div>
  )
}
