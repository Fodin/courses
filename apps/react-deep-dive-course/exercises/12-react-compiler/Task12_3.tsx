import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// Task 12.3: Compiler Output Analysis
//
// Interactive diff viewer: original code (left) vs compiler output (right).
// Your task: click each scope block, understand what is cached, which cache key,
// why these scope boundaries were chosen.
//
// Three components to analyze (tabs):
//
// Component 1 — UserProfile:
//   Original: fullName = firstName + lastName, avatar = getAvatarUrl(id, 'medium'),
//             handleFollow = () => onFollow(id)
//   Compiler scopes:
//     scope 1: fullName  → deps: [firstName, lastName]  → $[0], $[1] → $[2]
//     scope 2: avatar    → dep: [user.id]               → $[3] → $[4]
//     scope 3: handleFollow → deps: [onFollow, user.id] → $[5], reuse $[3] → $[6]
//   Key insight: $[3] (user.id) is reused across scopes — compiler is smart about cell reuse
//
// Component 2 — FilteredTable:
//   Original: filtered = rows.filter(...), total = filtered.length, inline onClick in map
//   Compiler scopes:
//     scope 1: filtered → deps: [rows, filter] → $[0], $[1] → $[2]
//     scope 2: whole JSX → deps: [filtered, onRowClick] → $[3], $[4] → $[5]
//   Key insight: inline onClick() inside .map() depends on r.id from closure —
//   compiler caches the whole JSX as a unit, not each row handler separately
//
// Component 3 — ConditionalWidget:
//   Original: label, handleAction, then early return if data.hidden
//   Compiler scopes:
//     scope 1: label → dep: [isAdmin] → $[0] → $[1]
//     scope 2: handleAction → deps: [onAction, data.id, isAdmin] → $[2], $[3], reuse $[0] → $[4]
//     then: early return
//   Key insight: compiler places ALL scopes BEFORE early return to prevent stale closures
//
// For each component:
//   - Side-by-side: original (left) | compiler output (right)
//   - Clickable scope panels below (click → show deps, cache indices, explanation)
//   - Textarea: write your own annotation (free-form)
//   - "Показать правильный ответ" button
//
// Quiz section (3 questions):
//   Q1: In UserProfile, which $[?] stores the value of fullName? → $[2]
//   Q2: Why is inline onClick in .map() suboptimal? → new fn per item per render
//   Q3: Why does compiler place handleAction BEFORE early return? → avoid stale closure

// ─── TODO: define ComponentExample type ──────────────────────────────────────
// type ComponentExample = { name: string; original: string; compiled: string; scopes: Scope[] }
// type Scope = { id: string; label: string; deps: string[]; cacheIndices: string; description: string }

// ─── TODO: define EXAMPLES array with 3 components ───────────────────────────
// const EXAMPLES: ComponentExample[] = [ ... ]

// ─── TODO: define QUIZ array with 3 questions ────────────────────────────────
// type QuizQuestion = { question: string; options: string[]; correct: number; explanation: string }
// const QUIZ: QuizQuestion[] = [ ... ]

// ─── TODO: implement DiffViewer ───────────────────────────────────────────────
// Two columns: original (left, monospace, light bg) | compiled (right, purple bg)
// function DiffViewer({ example }: { example: ComponentExample }) { ... }

// ─── TODO: implement ScopePanel ──────────────────────────────────────────────
// Clickable scope buttons → expand to show deps + explanation
// function ScopePanel({ scope, isActive, onToggle }: ...) { ... }

// ─── TODO: implement QuizSection ─────────────────────────────────────────────
// 3 questions, multiple choice, show explanation after answer
// Show total score + result message
// function QuizSection() { ... }

// ─── Main component ───────────────────────────────────────────────────────────

export function Task12_3() {
  const { t } = useLanguage()

  // TODO: state for activeTab, activeScope, quizAnswers, showQuizResult

  return (
    <div className="exercise-container">
      <h2>{t('task.12.3')}</h2>

      {/* TODO: tab switcher for 3 components */}
      {/* TODO: DiffViewer for active component */}
      {/* TODO: ScopePanel list for active component */}
      {/* TODO: QuizSection at the bottom */}

      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 10, border: '2px solid #86efac' }}>
        <p>Реализуйте diff viewer с тремя компонентами. Для каждого — кликабельные scope panels
        и итоговый тест из 3 вопросов.</p>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Подсказки:
          <br />· В UserProfile: $[0],$[1] = deps (firstName, lastName), $[2] = value (fullName)
          <br />· В FilteredTable: inline onClick не выносится, весь JSX — один scope
          <br />· В ConditionalWidget: все scopes вычисляются ДО early return (стале-closure prevention)
        </p>
      </div>
    </div>
  )
}
