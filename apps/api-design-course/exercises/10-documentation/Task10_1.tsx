import { useState } from 'react'

// TODO: Define interface DocCriteria with fields:
//   id: string, title: string, category: string,
//   importance: 'critical' | 'high' | 'medium',
//   why: string, bad: string, good: string, checked: boolean

// TODO: Create INITIAL_CRITERIA array with 12 entries:
//   1. id: 'getting-started', category: 'Структура', importance: 'critical'
//      title: 'Getting Started / Быстрый старт'
//      why: first working request in 5 minutes
//      bad/good: contrast examples
//
//   2. id: 'auth', category: 'Безопасность', importance: 'critical'
//      title: 'Аутентификация и авторизация'
//
//   3. id: 'endpoint-reference', category: 'Reference', importance: 'critical'
//      title: 'Полный справочник endpoints'
//
//   4. id: 'request-examples', category: 'Примеры', importance: 'critical'
//      title: 'Примеры запросов (cURL + SDK)'
//
//   5. id: 'response-examples', category: 'Примеры', importance: 'high'
//      title: 'Примеры ответов с реальными данными'
//
//   6. id: 'errors', category: 'Ошибки', importance: 'critical'
//      title: 'Справочник кодов ошибок'
//
//   7. id: 'rate-limits', category: 'Ограничения', importance: 'high'
//      title: 'Rate limits и квоты'
//
//   8. id: 'pagination', category: 'Reference', importance: 'high'
//      title: 'Пагинация и фильтрация'
//
//   9. id: 'changelog', category: 'Версионирование', importance: 'medium'
//      title: 'Changelog и история версий'
//
//   10. id: 'sdk', category: 'SDK', importance: 'high'
//       title: 'SDK и библиотеки'
//
//   11. id: 'sandbox', category: 'Инструменты', importance: 'high'
//       title: 'Песочница / тестовая среда'
//
//   12. id: 'interactive', category: 'Инструменты', importance: 'medium'
//       title: 'Интерактивная песочница (Try it out)'

// TODO: Define IMPORTANCE_COLORS — map 'critical', 'high', 'medium'
//   to { bg: string, color: string, label: string }

export function Task10_1() {
  // TODO: criteria state — useState<DocCriteria[]>(INITIAL_CRITERIA)
  // TODO: activeId state — string | null (which criterion is expanded)
  // TODO: filterCategory state — string (default 'Все')

  // TODO: Compute checked count, total, progress (%)
  // TODO: Compute categories array: ['Все', ...unique categories]
  // TODO: Compute filtered list based on filterCategory

  // TODO: toggle(id) — flip .checked for matching criterion

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1000px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Анатомия хорошей документации</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        12 критериев, которые отличают выдающуюся документацию от посредственной
      </p>

      {/* TODO: Progress bar block
           Background: #f1f5f9, border-radius: 8px, padding: 1rem
           Header: label "Чеклист документации" + "{checked} / {total} ({progress}%)"
           Progress fill: width = progress%, color #6366f1 (or #16a34a at 100%)
           At 100%: show success message */}

      {/* TODO: Category filter buttons
           Pill shape (border-radius: 20px)
           Active: background #6366f1, white text
           Inactive: background #e2e8f0, grey text */}

      {/* TODO: Criteria list
           For each criterion in filtered:
           - Outer container: border, rounded, overflow hidden
           - Header row (clickable): checkbox, title, importance badge, expand arrow
             Checked state: background #f0fdf4, title strikethrough + gray
           - Expanded details (shown when activeId === c.id):
             * Blue info block: "Почему важно: ..."
             * Two-column grid: "Плохо" (red code) | "Хорошо" (green code)
             * Code blocks: bg #1e293b, pre-wrap */}
    </div>
  )
}
