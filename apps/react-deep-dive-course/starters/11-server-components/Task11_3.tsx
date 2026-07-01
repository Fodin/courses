import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Task 11.3: Selective Hydration
//
// Simulate React's Selective Hydration: sections start as "static" (grey),
// then hydrate one by one. In "selective" mode clicking a static section
// makes it hydrate first (with 0.3x time cost), interrupting the normal queue.
//
// Sections (use exactly these values):
//   { id: 'header',   label: 'Header',   baseCost: 1200, color: '#3b82f6' }
//   { id: 'sidebar',  label: 'Sidebar',  baseCost: 800,  color: '#8b5cf6' }
//   { id: 'content',  label: 'Content',  baseCost: 2000, color: '#10b981' }
//   { id: 'comments', label: 'Comments', baseCost: 1500, color: '#f59e0b' }
//
// Section states:
//   'static'    — grey card, pointer-events: none (or overlay for click capture)
//                 In selective mode shows "Нажмите для приоритета"
//   'hydrating' — blue pulsing border (@keyframes pulse with box-shadow),
//                 progress bar 0→100% over baseCost ms
//   'hydrated'  — coloured card, "Интерактивный!", clickable button inside
//
// Two modes:
//   Standard:  Header → Sidebar → Content → Comments (sequential, full baseCost)
//   Selective: same queue, BUT clicking a 'static' section pushes it to front
//              with cost = baseCost * 0.3 (priority, faster hydration)
//
// SectionState shape:
//   { status: HydrationStatus; isPriority: boolean; progress: number (0-100) }
//
// Required UI:
//   1. Button "Стандартная гидрация" — disabled while running
//   2. Button "Selective Hydration"  — disabled while running
//   3. Button "Reset"                — clears all, always available
//   4. Hint banner in selective mode: "Кликните на серую секцию для приоритета"
//   5. Badge "Приоритетный" on sections hydrated via click
//   6. Progress bar inside 'hydrating' card (updates every ~50ms via setInterval)
//   7. Log panel: "[Xms] <event text>" — relative timestamps from run start
//
// IMPORTANT:
//   - Store timeout/interval IDs in useRef arrays; clear them in cleanup and Reset
//   - Progress bar should update smoothly using setInterval(fn, 50) during hydration
//   - After a section is hydrated by priority, continue normal queue (skip it if encountered)

// ─── TODO: define types and constants ────────────────────────────────────────
// type HydrationStatus = 'static' | 'hydrating' | 'hydrated'
// type HydrationMode = 'standard' | 'selective'
// interface HydrationSection { id, label, baseCost, color }
// interface SectionState { status, isPriority, progress }

// ─── TODO: implement hydrateSection helper ───────────────────────────────────
// hydrateSection(id, cost, isPriority, onDone):
//   - set section to 'hydrating'
//   - start setInterval (50ms) to update progress
//   - after cost ms: clearInterval, set to 'hydrated', call onDone()

// ─── TODO: implement runStandard ─────────────────────────────────────────────
// Sequential hydration using recursive "next" callback

// ─── TODO: implement runSelective ────────────────────────────────────────────
// Same queue + priorityQueue (useRef array).
// handlePriorityClick(id): push id to front of priorityQueue if not already queued
// hydrateNext(): check priorityQueue first, then bgQueue

// ─── Main component ───────────────────────────────────────────────────────────

export function Task11_3() {
  const { t } = useLanguage()

  // TODO: useState for sectionStates, mode, running, log
  // TODO: useRef for timers, intervals, activeRef, priorityQueueRef

  return (
    <div className="exercise-container">
      <style>{`
        /* TODO: @keyframes sel-pulse for hydrating state */
      `}</style>
      <h2>{t('task.11.3')}</h2>

      {/* TODO: buttons (Стандартная гидрация / Selective Hydration / Reset) */}
      {/* TODO: hint banner in selective mode */}
      {/* TODO: 2x2 grid of section cards with progress bars and badges */}
      {/* TODO: log panel */}

      <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 10, border: '2px solid #86efac' }}>
        <p>Реализуйте Selective Hydration с приоритетной очередью</p>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Подсказка: используйте useRef для priorityQueueRef и activeRef,
          чтобы избежать stale closure в setTimeout-коллбэках
        </p>
      </div>
    </div>
  )
}
