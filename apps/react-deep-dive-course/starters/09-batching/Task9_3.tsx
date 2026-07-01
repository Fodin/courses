import { useState, useRef, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// Task 9.3: Batching vs Cascade
//
// Two panels side by side — same end result, very different render counts.
//
// LEFT — Batching:
//   One click → setState({ step, progress, status }) all at once
//   Result: 1 render
//
// RIGHT — Cascade (useEffect chain):
//   One click → setStep(1)                        ← render 1
//   useEffect[step] fires → setProgress(100)      ← render 2
//   useEffect[progress] fires → setStatus('done') ← render 3
//   Result: 3+ renders for the same outcome

// ─── TODO: implement BatchingPanel ───────────────────────────────────────────
//
// State: step (number), progress (number), status ('idle' | 'running' | 'done')
// useRef: renderCount, renderLog (TimedLog[]), elapsed (string)
//
// handleStart():
//   const t0 = performance.now()
//   // set all three in a single expression / single handler
//   setState({ step: 1, progress: 100, status: 'done' })
//   elapsed.current = (performance.now() - t0).toFixed(3) + ' мс'
//
// Display: render count, progress bar (width = progress%), status, elapsed, log

function BatchingPanel() {
  const { t } = useLanguage()

  // TODO: add state and refs

  // TODO: increment renderCount and push to renderLog in component body

  const handleStart = () => {
    // TODO: set step, progress, status in one handler — 1 render
  }

  const handleReset = () => {
    // TODO: reset everything
  }

  return (
    <div style={{ flex: 1, border: '2px solid #3b82f6', borderRadius: 10, padding: 16 }}>
      <h3 style={{ color: '#1e40af', marginTop: 0 }}>Batching</h3>
      {/* TODO: render count */}
      {/* TODO: progress bar */}
      {/* TODO: status and elapsed */}
      {/* TODO: Start / Reset buttons */}
      {/* TODO: render log */}
    </div>
  )
}

// ─── TODO: implement CascadePanel ────────────────────────────────────────────
//
// State: step, progress, status — separate useState for each
// useRef: renderCount, renderLog, elapsed, startTime
//
// handleStart():
//   startTime.current = performance.now()
//   setStep(1)   // only this — triggers the cascade
//
// Cascade useEffects:
//   useEffect(() => { if (step === 1) setProgress(100) }, [step])
//   useEffect(() => {
//     if (progress === 100 && step === 1) {
//       setStatus('done')
//       elapsed.current = (performance.now() - startTime.current).toFixed(3) + ' мс'
//     }
//   }, [progress, step])
//
// Each useEffect causes a separate render — watch the render count grow to 3+

function CascadePanel() {
  const { t } = useLanguage()

  // TODO: add state: step, progress, status (three separate useStates)
  // TODO: add refs: renderCount, renderLog, elapsed, startTime

  // TODO: increment renderCount and push to renderLog in component body

  // TODO: useEffect for step → setProgress
  // TODO: useEffect for progress → setStatus + measure elapsed

  const handleStart = () => {
    // TODO: only setStep(1) — let effects handle the rest
  }

  const handleReset = () => {
    // TODO: reset all state and refs
  }

  return (
    <div style={{ flex: 1, border: '2px solid #ef4444', borderRadius: 10, padding: 16 }}>
      <h3 style={{ color: '#b91c1c', marginTop: 0 }}>Cascade (useEffect-цепочка)</h3>
      {/* TODO: render count */}
      {/* TODO: progress bar */}
      {/* TODO: status and elapsed */}
      {/* TODO: Start / Reset buttons */}
      {/* TODO: render log */}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Task9_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.9.3')}</h2>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>
        Нажмите "Запустить" в обеих панелях. Батчинг даёт 1 рендер,
        каскад useEffect — 3+ рендеров для того же результата.
      </p>

      <div style={{ display: 'flex', gap: 16 }}>
        <BatchingPanel />
        <CascadePanel />
      </div>
    </div>
  )
}
