import { useState } from 'react'

// TODO: Implement API Review — Find 15 Problems / Ревью API: найди 15 проблем
//
// Show a "bad" Shop API spec and let the user find all 15 problems.
//
// State needed:
//   problems: Array<{ id, category, found, fixed }> — 15 items, all false initially
//   showSpec: boolean (true) — toggle for the spec code block
//   activeCategory: string | null — filter problems by category
//
// The bad spec (as a string constant) contains these categories of issues: / Плохая спецификация содержит проблемы следующих категорий:
//   URL Design (3): verbs in URLs, inconsistent casing, duplicate endpoints
//   HTTP Methods (2): POST for delete, GET that mutates data
//   Status Codes (1): 200 OK on errors
//   Data Model (3): mixed naming conventions, price as string, date not ISO 8601
//   Pagination (1): no pagination on list endpoint
//   Search/Filter (1): POST for search
//   Versioning (1): no /v1/ prefix
//   Errors (1): no machine-readable error code
//   Rate Limiting (1): no rate limit headers documented
//
// UI:
//   - Score dashboard: 3 cards (found/total, fixed/total, progress %)
//   - Toggle spec visibility
//   - Category filter pills (All + 9 categories)
//   - Problem cards:
//       checkbox to mark "found"
//       category badge (colored)
//       title
//       "Show fix" button → expands bad/good code comparison
//
// Celebration block when found === 15 && fixed === 15 / Блок празднования, когда все найдены и исправлены
//
// Category colors: URL Design #6366f1, HTTP Methods #22c55e, Status Codes #ef4444,
//                  Data Model #f59e0b, Pagination #8b5cf6, etc.

export function Task14_2() {
  // TODO: useState for problems (15 items with found: false, fixed: false)
  // TODO: useState for showSpec (true), activeCategory (null)

  // TODO: toggleFound(id), toggleFixed(id)
  // TODO: foundCount, fixedCount computed
  // TODO: filteredProblems based on activeCategory

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>API Review: найди 15 проблем / API Review: Find 15 Problems</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Перед тобой реальная (плохая) спецификация Shop API. Найди все проблемы — отмечай найденные,
        смотри исправления. / Here is a real (bad) Shop API spec. Find all problems — mark found ones, view fixes.
      </p>

      {/* TODO: Score dashboard (3 cards with progress bars) / Панель очков (3 карточки с прогрессом) */}

      {/* TODO: Toggle spec button + spec code block / Кнопка показа спецификации + блок кода */}

      {/* TODO: Category filter pills / Фильтр по категориям */}

      {/* TODO: Problems list / Список проблем */}
      {/* Each problem: checkbox | category badge | title | "Show fix" button */}
      {/* Expanded: description + bad/good code comparison */}

      {/* TODO: Celebration block (when all found and fixed) / Блок празднования (когда всё найдено и исправлено) */}
    </div>
  )
}
