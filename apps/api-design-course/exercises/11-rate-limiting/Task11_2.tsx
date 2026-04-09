import { useState } from 'react'

// TODO: Implement Exponential Backoff with Jitter visualizer
//
// Parameters (all controlled via sliders/checkbox):
//   baseDelay: number (100–5000ms, default 1000)
//   maxDelay: number (1000–60000ms, default 32000)
//   maxRetries: number (1–8, default 5)
//   jitter: boolean (default true)
//   successAt: number (2|3|4|5 — attempt number when request succeeds)
//
// RetryAttempt interface:
//   attempt: number
//   delay: number          — pure exponential delay (no jitter)
//   jitteredDelay: number  — delay * random(0.5, 1.0) if jitter, else delay
//   status: '429' | 'ok' | 'pending'
//
// Key functions:
//   calcDelay(attempt, base, max): min(max, base * 2^(attempt-1))
//   addJitter(delay): delay * (0.5 + Math.random() * 0.5)
//   buildAttempts(): build RetryAttempt[] up to successAt
//
// Timeline rendering:
//   Each attempt row: circle with number | delay bar (width proportional) | delay label | status badge
//   Delay bar width: Math.max(20, Math.min(200, delay / maxDelay * 200))
//   Colors: jitter=true → #f59e0b bar, false → #6366f1 bar
//
// Comparison cards:
//   "Без jitter": totalTimeNoJitter (sum of .delay), red background, thundering herd warning
//   "С jitter": totalTimeJitter (sum of .jitteredDelay), green background
//
// simulate():
//   setAttempts([])
//   buildAttempts() → schedule each with setTimeout
//   accumulate delay / 20 + i * 200 (ms) for animation speed
//
// Helper msToLabel(ms): '0мс' | 'Xмс' | 'X.Xс'

export function Task11_2() {
  // TODO: useState for all parameters and attempts/running state

  // TODO: buildAttempts function

  // TODO: simulate function with animated setTimeout reveals

  // TODO: msToLabel helper

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Конструктор Retry-стратегии</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Exponential backoff с jitter — правильная реакция клиента на 429
      </p>

      {/* TODO: 2×2 settings grid:
           Row 1: baseDelay slider | maxDelay slider
           Row 2: maxRetries slider | jitter checkbox */}

      {/* TODO: "Succeed on attempt" button group (#2, #3, #4, #5) */}

      {/* TODO: Timeline preview (pre-built, updates on param change) */}

      {/* TODO: Comparison cards: "Без jitter" (red) | "С jitter" (green) */}

      {/* TODO: Simulate button */}

      {/* TODO: Terminal-style animated log (bg #1e293b) */}

      {/* TODO: Formula explanation block */}
    </div>
  )
}
