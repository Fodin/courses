import { useState, useTransition } from 'react'
import { useLanguage } from 'src/hooks'

// Task 10.2: Transition vs Sync Update
//
// Create two search panels side by side: SyncSearch (left) and TransitionSearch (right).
// Both filter a list of 8000 items as the user types.
//
// Setup (outside component — created ONCE):
//   const ALL_ITEMS = Array.from({ length: 8000 }, (_, i) => {
//     const words = ['React', 'Fiber', 'Hook', 'State', 'Effect', ...]
//     return `${words[i % words.length]}Item_${i}`
//   })
//
//   function filterItems(items: string[], query: string): string[] {
//     if (!query) return items.slice(0, 50)
//     return items.filter(item => item.toLowerCase().includes(query.toLowerCase()))
//   }
//
// SyncSearch:
//   onChange: setQuery(q) + setResults(filterItems(ALL_ITEMS, q))
//   // Both updates are synchronous → heavy filter blocks the main thread
//
// TransitionSearch:
//   const [isPending, startTransition] = useTransition()
//   onChange:
//     setQuery(q)                                    // sync — keeps input responsive
//     startTransition(() => setResults(filter(...))) // interruptible
//   Show isPending in the input UI (opacity, "обновляется..." text)
//
// FpsMonitor (optional but recommended):
//   Use requestAnimationFrame loop in useEffect to measure frame rate.
//   Display current FPS with color coding: ≥50 green, 30-50 yellow, <30 red.
//
// Expected behavior:
//   SyncSearch:       fast typing → UI freezes, FPS drops
//   TransitionSearch: fast typing → input stays responsive, FPS stays high

// ─── TODO: generate ALL_ITEMS (8000 elements, outside component) ─────────────

// const ALL_ITEMS = ...

// ─── TODO: implement filterItems ─────────────────────────────────────────────

// function filterItems(items: string[], query: string): string[] { ... }

// ─── TODO: implement FpsMonitor ──────────────────────────────────────────────

// function FpsMonitor() { ... }

// ─── TODO: implement SyncSearch ──────────────────────────────────────────────

// function SyncSearch() { ... }

// ─── TODO: implement TransitionSearch ────────────────────────────────────────

// function TransitionSearch() { ... }

// ─── Main component ───────────────────────────────────────────────────────────

export function Task10_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.10.2')}</h2>

      {/* TODO: render SyncSearch and TransitionSearch side by side */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{
          flex: 1,
          padding: 16,
          borderRadius: 10,
          border: '2px solid #fca5a5',
          background: '#fff',
        }}>
          <p style={{ color: '#9ca3af' }}>SyncSearch — реализуйте здесь</p>
        </div>
        <div style={{
          flex: 1,
          padding: 16,
          borderRadius: 10,
          border: '2px solid #86efac',
          background: '#fff',
        }}>
          <p style={{ color: '#9ca3af' }}>TransitionSearch — реализуйте здесь</p>
        </div>
      </div>
    </div>
  )
}
