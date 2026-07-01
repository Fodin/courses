import { useState } from 'react'

// Task 0.2: MFE Readiness Audit
//
// Build a quiz-style audit form that calculates a "readiness index"
// and gives recommendations based on the user's project context.
//
// Requirements:
// 1. Display 8 questions about the user's current project:
//    - Number of teams working on the frontend (0-3 pts)
//    - Desired deploy frequency (0-3 pts)
//    - Frequency of merge conflicts (0-3 pts)
//    - Main bundle size (0-3 pts)
//    - CI pipeline duration (0-3 pts)
//    - Shared state coupling level (0-3 pts)
//    - Need for different tech stacks (0-3 pts)
//    - Team autonomy level (0-3 pts)
// 2. Each question: radio buttons with 4 options. Each option has a 0-3 weight.
// 3. Progress bar showing answered / total.
// 4. "Получить результат" button — enabled only when all questions answered.
// 5. Result section:
//    - Readiness index 0-100% (sum / maxSum * 100)
//    - Color-coded recommendation:
//        < 30%  → green  → "Монолит подходит"
//        30-60% → orange → "Рассмотрите Partial Decomposition"
//        > 60%  → blue   → "Пора переходить на MFE"
//    - Short explanation text for the recommendation
//    - Per-category score breakdown (bar chart per category)
//    - "Пройти снова" button
// 6. When result is shown, display explanation for each selected option.
//
// Tips:
// - answers state: Record<questionId, number> — maps question id to chosen weight
// - categories: 'Организация', 'Деплой', 'Разработка', 'Производительность', 'Архитектура'
// - Group questions by category for the breakdown chart

// TODO: Define AuditQuestion interface:
// { id, text, hint, category, options: { label, value (0-3), explanation }[] }

// TODO: Create AUDIT_QUESTIONS array with 8 questions (see requirements above)

export function Task0_2() {
  // TODO: useState for answers: Record<string, number>
  // TODO: useState for showResult: boolean

  // TODO: Compute answeredCount, totalScore, maxScore, readinessIndex

  // TODO: getRecommendation(index) → { level, color, bg, text, icon }

  // TODO: Compute categoryScores: Record<category, { total, max }>

  return (
    <div className="exercise-container" style={{ padding: '1.5rem' }}>
      <h2>Аудит готовности к MFE</h2>

      {/* TODO: Progress bar */}

      {/* TODO: Map over AUDIT_QUESTIONS, render each as a card with:
          - Category label (small, uppercase)
          - Question number + text
          - Hint text (italic, muted)
          - Radio options (highlight selected)
          - When result shown: display explanation for selected option
      */}

      {/* TODO: Submit button (disabled if not all answered) */}

      {/* TODO: Result section (visible when showResult && all answered):
          - Icon + readiness index % + level label
          - Recommendation text
          - Category breakdown bars
          - "Пройти снова" button
      */}
    </div>
  )
}
