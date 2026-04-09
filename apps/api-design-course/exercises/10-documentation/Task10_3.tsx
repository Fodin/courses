import { useState } from 'react'

// TODO: Define interface ApiEvaluation with fields:
//   api: string, url: string, color: string, tagline: string,
//   scores: Record<string, number>,   // criterion id → score 1-10
//   comments: Record<string, string>  // criterion id → explanation

// TODO: Define CRITERIA_KEYS array — 10 criteria objects: { id: string, label: string }
//   ids: 'getting-started', 'auth', 'reference', 'examples', 'errors',
//        'interactive', 'sdk', 'sandbox', 'changelog', 'search'
//   labels in Russian (e.g. 'Getting Started', 'Аутентификация / Authentication', ...)

// TODO: Create EVALUATIONS array with 3 entries:
//
//   1. api: 'Stripe', color: '#635bff'
//      tagline: 'Золотой стандарт документации API / Gold Standard of API Documentation'
//      scores: mostly 9-10 across all criteria
//      comments: specific observations about Stripe docs quality
//
//   2. api: 'GitHub', color: '#24292f'
//      tagline: 'Подробно, но немного перегружено / Detailed but slightly overloaded'
//      scores: mix of 6-9
//      comments: specific observations about GitHub docs
//
//   3. api: 'Twitter/X', color: '#1da1f2'
//      tagline: 'Хорошая документация с нюансами / Good documentation with nuances'
//      scores: mix of 4-8
//      comments: specific observations about Twitter/X docs

// TODO: Define SCORE_COLOR(score: number): string
//   9-10 → '#16a34a' (green)
//   7-8  → '#d97706' (amber)
//   5-6  → '#dc2626' (red)
//   <5   → '#991b1b' (dark red)

export function Task10_3() {
  // TODO: activeApi state — string (default 'Stripe')
  // TODO: expandedCriterion state — string | null
  // TODO: showAll state — boolean (default false)

  // TODO: Find evaluation from EVALUATIONS where e.api === activeApi
  // TODO: Compute totalScore — average of all scores, rounded

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1000px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Оценка реальных API / Real API Evaluation</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Применяем критерии из задания 10.1 к реальным публичным API — Stripe, GitHub, Twitter/X / Applying criteria from task 10.1 to real public APIs — Stripe, GitHub, Twitter/X
      </p>

      {/* TODO: API selector — 3 buttons with evaluation.color border/bg when active / Селектор API
           On click: setActiveApi + setExpandedCriterion(null) */}

      {/* TODO: Summary card / Итоговая карточка
           Border: 2px solid evaluation.color, bg #f8fafc
           Left: large totalScore number with SCORE_COLOR, "/10" subtitle
           Right: API name (bold), tagline (gray), link to url
           Layout: flexbox with gap */}

      {/* TODO: Scores grid — auto-fill columns, min 180px / Сетка оценок
           For each criterion in CRITERIA_KEYS:
             Card: white bg, border, rounded, cursor pointer
             Header row: criterion label | score (SCORE_COLOR)
             Mini progress bar: width = score*10%, SCORE_COLOR
             When expanded (expandedCriterion === criterion.id):
               Show evaluation.comments[criterion.id] in gray text */}

      {/* TODO: "Показать сравнение / Show Comparison" toggle button / Кнопка переключения сравнения
           When showAll: render comparison table
           Table: criteria as rows, 3 APIs as columns
           Tool headers: colored with evaluation.color + white text
           Last row: total average for each API
           Color each score cell with SCORE_COLOR */}
    </div>
  )
}
