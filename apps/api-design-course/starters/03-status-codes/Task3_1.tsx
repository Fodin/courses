import { useState } from 'react'

// TODO: Define a StatusCode interface with fields:
// code, name, description, whenToUse, example, group (number 1-5)

// TODO: Create an array of status codes covering all groups:
// 1xx: 100, 101
// 2xx: 200, 201, 204, 206
// 3xx: 301, 302, 304
// 4xx: 400, 401, 403, 404, 405, 409, 410, 422, 429
// 5xx: 500, 502, 503, 504

// TODO: Define groupConfig — a record mapping group number (1-5) to:
// { label: string, color: string, bg: string, border: string }
// Example: 2 -> { label: '2xx Успех / Success', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' }

export function Task3_1() {
  // TODO: Track selected group filter (number | null), default null (= all)
  // Hint: useState<number | null>(null)

  // TODO: Track search query (string), default ''

  // TODO: Track expanded code (number | null), default null

  // TODO: Filter statusCodes by selected group and search query
  // Search should match: code (as string), name, description

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Справочник статус-кодов HTTP</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Нажмите на карточку — узнайте, когда использовать код и пример из реальной жизни.
      </p>

      {/* TODO: Render group filter buttons (1xx–5xx + "Все")
           Active filter gets colored background (from groupConfig)
           Clicking active filter deselects it (sets to null) */}

      {/* TODO: Render search input
           Filters codes by number, name, or description */}

      {/* TODO: Render codes grouped by group number
           For each group: show a header with group label (from groupConfig)
           For each code: render a card that expands on click
           Expanded card shows: whenToUse + example */}

      {/* TODO: If filtered list is empty, show "Ничего не найдено" message */}
    </div>
  )
}
