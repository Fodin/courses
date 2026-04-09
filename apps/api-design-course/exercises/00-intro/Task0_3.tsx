import { useState } from 'react'

// TODO: Define an interface for an evaluation criterion
// Each criterion: id, name, weight (% out of 100), description,
//   score (1-10), comment, goodExample (code string), badExample? (code string)

// TODO: Create data for at least 5 criteria covering:
// - Consistency (единый стиль / unified naming style)
// - Predictability (предсказуемость / predictability)
// - HTTP semantics (правильные методы и статус-коды / correct methods and status codes)
// - Documentation (документация / documentation)
// - One more: versioning / pagination / rate limiting
// Use a REAL public API for scores and examples (GitHub, Stripe, etc.)
// Make sure weights sum to 100

export function Task0_3() {
  // TODO: State to track which criteria are expanded
  // Hint: useState<Set<string>>(new Set())

  // TODO: State for the self-check "mark as done" button

  // TODO: Compute the weighted total score
  // Formula: sum of (score * weight / 10) / total weight * 100

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>Анализ API</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Разбор реального публичного API по критериям качества.
      </p>

      {/* TODO: Summary card showing:
           - The name of the API you're analyzing
           - Weighted total score (e.g. 85/100)
           - Quick stats: number of criteria, how many scored 9-10, how many 7-8
      */}

      {/* TODO: "Развернуть все критерии" button */}

      {/* TODO: Map over criteria and render each as a collapsible card:
           Header (always visible):
           - Score badge (colored: green ≥9, orange ≥7, red <7)
           - Criterion name + weight
           - Description (one line)
           - Expand/collapse arrow

           Body (visible when expanded):
           - Comment/explanation text
           - ✅ Good example (code block)
           - ⚠️ Bad/old example (code block) — optional
      */}

      {/* TODO: Self-check block:
           - Title: "Self-check: проанализируйте API самостоятельно"
           - Description: choose any public API and rate it on the same criteria
           - List of criteria with "___/10" placeholders
           - "Отметить как выполнено" button that changes to "✅ Выполнено" when clicked
      */}
    </div>
  )
}
