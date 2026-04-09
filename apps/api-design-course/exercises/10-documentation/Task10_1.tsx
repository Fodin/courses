import { useState } from 'react'

// TODO: Define interface DocCriteria with fields:
//   id: string, title: string, category: string,
//   importance: 'critical' | 'high' | 'medium',
//   why: string, bad: string, good: string, checked: boolean

// TODO: Create INITIAL_CRITERIA array with 12 entries:
//   1. id: 'getting-started', category: 'Структура / Structure', importance: 'critical'
//      title: 'Getting Started / Быстрый старт'
//      why: first working request in 5 minutes
//      bad/good: contrast examples
//
//   2. id: 'auth', category: 'Безопасность / Security', importance: 'critical'
//      title: 'Аутентификация и авторизация / Authentication & Authorization'
//
//   3. id: 'endpoint-reference', category: 'Reference', importance: 'critical'
//      title: 'Полный справочник endpoints / Full Endpoints Reference'
//
//   4. id: 'request-examples', category: 'Примеры / Examples', importance: 'critical'
//      title: 'Примеры запросов (cURL + SDK) / Request Examples (cURL + SDK)'
//
//   5. id: 'response-examples', category: 'Примеры / Examples', importance: 'high'
//      title: 'Примеры ответов с реальными данными / Response Examples with Real Data'
//
//   6. id: 'errors', category: 'Ошибки / Errors', importance: 'critical'
//      title: 'Справочник кодов ошибок / Error Codes Reference'
//
//   7. id: 'rate-limits', category: 'Ограничения / Limits', importance: 'high'
//      title: 'Rate limits и квоты / Rate Limits & Quotas'
//
//   8. id: 'pagination', category: 'Reference', importance: 'high'
//      title: 'Пагинация и фильтрация / Pagination & Filtering'
//
//   9. id: 'changelog', category: 'Версионирование / Versioning', importance: 'medium'
//      title: 'Changelog и история версий / Changelog & Version History'
//
//   10. id: 'sdk', category: 'SDK', importance: 'high'
//       title: 'SDK и библиотеки / SDK & Libraries'
//
//   11. id: 'sandbox', category: 'Инструменты / Tools', importance: 'high'
//       title: 'Песочница / тестовая среда / Sandbox / Test Environment'
//
//   12. id: 'interactive', category: 'Инструменты / Tools', importance: 'medium'
//       title: 'Интерактивная песочница (Try it out) / Interactive Sandbox (Try it out)'

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
      <h2 style={{ marginBottom: '0.25rem' }}>Анатомия хорошей документации / Anatomy of Good Documentation</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        12 критериев, которые отличают выдающуюся документацию от посредственной / 12 criteria that distinguish outstanding documentation from mediocre
      </p>

      {/* TODO: Progress bar block / Прогресс-бар
           Background: #f1f5f9, border-radius: 8px, padding: 1rem
           Header: label "Чеклист документации / Documentation checklist" + "{checked} / {total} ({progress}%)"
           Progress fill: width = progress%, color #6366f1 (or #16a34a at 100%)
           At 100%: show success message */}

      {/* TODO: Category filter buttons / Кнопки фильтрации по категориям
           Pill shape (border-radius: 20px)
           Active: background #6366f1, white text
           Inactive: background #e2e8f0, grey text */}

      {/* TODO: Criteria list / Список критериев
           For each criterion in filtered:
           - Outer container: border, rounded, overflow hidden
           - Header row (clickable): checkbox, title, importance badge, expand arrow
             Checked state: background #f0fdf4, title strikethrough + gray
           - Expanded details (shown when activeId === c.id):
             * Blue info block: "Почему важно: ... / Why it matters: ..."
             * Two-column grid: "Плохо / Bad" (red code) | "Хорошо / Good" (green code)
             * Code blocks: bg #1e293b, pre-wrap */}
    </div>
  )
}
