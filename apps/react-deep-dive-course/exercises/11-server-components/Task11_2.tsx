import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Task 11.2: Streaming Simulator
//
// Simulate chunked streaming of a page with 4 sections.
// Each section goes through: idle → waiting → loading → ready.
// Sections become "ready" with staggered delays, mimicking Transfer-Encoding: chunked.
//
// Sections (use exactly these values):
//   { id: 'header',   label: 'Header',   delay: 0,    color: '#3b82f6' }
//   { id: 'hero',     label: 'Hero',     delay: 800,  color: '#8b5cf6' }
//   { id: 'content',  label: 'Content',  delay: 1800, color: '#10b981' }
//   { id: 'comments', label: 'Comments', delay: 3200, color: '#f59e0b' }
//
// Section states:
//   'idle'    — initial, grey placeholder, no animation
//   'waiting' — grey placeholder, text "Ожидание..."
//   'loading' — shimmer animation (CSS @keyframes), text "Получен чанк..."
//   'ready'   — coloured card with section label and delay info
//
// Transition sequence per section:
//   At section.delay ms  → switch to 'loading'
//   At section.delay + 400ms → switch to 'ready'
//
// Required UI:
//   1. Button "Запустить streaming" — disabled while running
//   2. Button "↺ Повторить" — appears only after all sections are 'ready'
//   3. Button "Сброс" — always available, resets to 'idle'
//   4. Progress bar: width = (readyCount / total) * 100%, CSS transition on width
//   5. Counter: "Получено X/4 чанков"
//   6. Log panel (dark background): entries "[Xms] → chunk: SectionName (получен)"
//      Time is relative to the start of streaming (Date.now() - startTime).
//
// IMPORTANT: useEffect cleanup must clear all setTimeout IDs on unmount.

// ─── TODO: define Section type and SECTIONS array ────────────────────────────

// ─── TODO: implement streaming logic ─────────────────────────────────────────
// startStreaming():
//   - set all sections to 'waiting'
//   - setRunning(true), clear log
//   - for each section: schedule two setTimeout calls (loading, ready)
//   - after max delay + 400ms: setRunning(false), setDone(true)
//
// handleReset():
//   - clearAll timers
//   - reset statuses to 'idle', running=false, done=false, log=[]

// ─── Main component ───────────────────────────────────────────────────────────

export function Task11_2() {
  const { t } = useLanguage()

  // TODO: useState for statuses, running, done, log
  // TODO: useRef for timers array and start timestamp

  return (
    <div className="exercise-container">
      <style>{`
        /* TODO: add @keyframes shimmer for loading state */
      `}</style>
      <h2>{t('task.11.2')}</h2>

      {/* TODO: buttons row (Запустить / Повторить / Сброс) */}
      {/* TODO: progress bar + counter */}
      {/* TODO: 2x2 grid of section cards */}
      {/* TODO: log panel */}

      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 10, border: '2px solid #86efac' }}>
        <p>Реализуйте streaming с 4 секциями и shimmer-анимацией</p>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Подсказка: используйте useRef для хранения массива таймеров и очистки в cleanup
        </p>
      </div>
    </div>
  )
}
