import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Task 9.1: Batching Explorer
//
// Show that React 18 batches setState calls in all contexts:
// event handlers, setTimeout, and Promise.then — all result in 1 render.
//
// Render counter: increment a useRef in the component body (not in useEffect!).
// This gives an accurate count of how many times the function is called.

// ─── TODO: implement BatchingExplorer ────────────────────────────────────────
//
// 1. Three separate useState: counterA, counterB, counterC (start at 0)
// 2. useRef for render count — increment in the component body
// 3. useRef array for render log (timestamp per render, keep last 10)
// 4. useRef for lastTrigger label (which button was pressed)
//
// Button 1 — "Event Handler":
//   directly call setCounterA, setCounterB, setCounterC in one handler
//   → React batches → 1 render
//
// Button 2 — "setTimeout":
//   wrap the three setStates in setTimeout(() => { ... }, 0)
//   → React 18 still batches → 1 render
//
// Button 3 — "Promise.then":
//   wrap in Promise.resolve().then(() => { ... })
//   → React 18 still batches → 1 render
//
// Button 4 — "Сбросить":
//   reset all counters, renderCount.current = 0, renderLog.current = []
//
// Display:
//   - Large render counter
//   - Three colored counter cards (A, B, C)
//   - Render log with timestamps

export function Task9_1() {
  const { t } = useLanguage()

  // TODO: add state for counterA, counterB, counterC
  // TODO: add refs for renderCount, renderLog, lastTrigger

  // TODO: increment renderCount.current here (in component body, not useEffect)
  // TODO: push to renderLog.current here

  // TODO: implement handleEventHandler
  // TODO: implement handleSetTimeout
  // TODO: implement handlePromise
  // TODO: implement handleReset

  return (
    <div className="exercise-container">
      <h2>{t('task.9.1')}</h2>

      {/* TODO: render counter display */}
      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 10, border: '2px solid #86efac', marginBottom: 20 }}>
        <p>Render counter will appear here</p>
      </div>

      {/* TODO: three counter cards */}

      {/* TODO: four buttons */}

      {/* TODO: render log */}
    </div>
  )
}
