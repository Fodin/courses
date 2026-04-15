import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Task 12.2: Rules of React
//
// Four components — some violate Rules of React, so React Compiler can't optimize them.
// Identify violators, explain why, and implement the fixed version.
//
// Component A — MutatingList:
//   Props: items: string[]
//   Bug: calls items.push('extra') in render — mutates props!
//   Effect: list grows on every render
//   Compiler: will NOT optimize
//
// Component B — TimestampKey:
//   Props: events: string[]
//   Bug: uses Date.now() as key in .map() — new key every render
//   Effect: all DOM elements are remounted on every render
//   Compiler: will NOT optimize
//
// Component C — RefReader:
//   Props: counterRef: React.RefObject<number>
//   Bug: reads counterRef.current in render output
//   Effect: UI never updates when ref changes (no re-render triggered)
//   Compiler: will NOT optimize
//
// Component D — PureTransform:
//   Props: values: number[]
//   Correct: computes sum, max, min purely without mutations
//   Compiler: CAN optimize
//
// For each component:
//   - "Принудительный рендер" button (force re-render with same state)
//   - Render counter display
//   - Label: "Compiler: оптимизирует / НЕ оптимизирует"
//   - Red panel for violations, green panel for clean components
//
// For each violator:
//   - "Показать исправление" button reveals fixed code + explanation
//
// Fixes:
//   A: const list = [...items, 'extra']  — copy, not mutation
//   B: key={idx} or key={event.id}  — stable key
//   C: useState + useEffect with setInterval  — display from state not ref

// ─── TODO: implement ViolationBadge ──────────────────────────────────────────
// function ViolationBadge({ canOptimize }: { canOptimize: boolean }) { ... }

// ─── TODO: implement ComponentCard wrapper ────────────────────────────────────
// function ComponentCard({ label, canOptimize, violationKey, renderCount, onForceRender, children }) { ... }

// ─── TODO: implement Component A — MutatingList ──────────────────────────────
// (show the bug visually: list grows on each force-render)

// ─── TODO: implement Component B — TimestampKey ──────────────────────────────
// (track how many DOM remounts happen)

// ─── TODO: implement Component C — RefReader ─────────────────────────────────
// (use useEffect + setInterval to increment counterRef, show stale display vs real value)

// ─── TODO: implement Component D — PureTransform ─────────────────────────────
// (sum, max, min — purely computed)

// ─── Main component ───────────────────────────────────────────────────────────

export function Task12_2() {
  const { t } = useLanguage()

  // TODO: separate render counters for each component: renderA, renderB, renderC, renderD
  // TODO: state for itemsAVersion (tracks how many times push was simulated)
  // TODO: counterRef for component C, actualValue state, useEffect with interval

  return (
    <div className="exercise-container">
      <h2>{t('task.12.2')}</h2>

      {/* TODO: render 2x2 grid of ComponentCard instances */}
      {/* Each card wraps the buggy component */}
      {/* Each card shows violation badge, render count, force-render button */}
      {/* Each violator card has "Показать исправление" button */}

      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 10, border: '2px solid #86efac' }}>
        <p>Реализуйте 4 компонента (A–Г). Определите какие нарушают Rules of React.</p>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Подсказки:
          <br />· Компонент А: items.push() в рендере — мутирует входные данные
          <br />· Компонент Б: Date.now() как ключ — нестабильный вывод
          <br />· Компонент В: ref.current в рендере — мутируемое значение
          <br />· Компонент Г: чистые вычисления — compiler оптимизирует
        </p>
      </div>
    </div>
  )
}
