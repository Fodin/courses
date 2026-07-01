import { useState } from 'react'

// TODO: Define a BadExample interface with fields:
// id, title, category, bad (string), good (string),
// problems (string[]), fixes (string[])

// TODO: Create an array of at least 5 bad JSON examples covering:
// - Mixed camelCase/snake_case field naming
// - Missing pagination metadata in collections
// - Excessive nesting (wrapper hell)
// - Inconsistent error formats across endpoints
// - Unix timestamps instead of ISO 8601
// Each example must include: title, category, bad JSON, good JSON,
// list of problems, list of fixes

// TODO: Extract unique categories from the examples array

export function Task4_1() {
  // TODO: Track expanded example id (number | null), default null
  // TODO: Track active category filter (string | null), default null

  // TODO: Filter examples by active category

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Трансформатор JSON-ответов</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Найдите проблему в каждом ответе и нажмите «Показать исправление».
      </p>

      {/* TODO: Render category filter buttons (+ "Все" button)
           Active filter highlighted; clicking active deselects it */}

      {/* TODO: For each filtered example render a card:
           - Red header with category label and title (❌ prefix)
           - "Показать исправление" / "Скрыть" toggle button
           - Bad JSON in a <pre> block with red syntax highlight
           - List of problems in red
           - When expanded: good JSON in green + list of fixes (✅ prefix) */}
    </div>
  )
}
