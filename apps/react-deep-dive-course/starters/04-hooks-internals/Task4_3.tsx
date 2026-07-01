import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Task 4.3: The Closure Trap
// Demonstrate the stale closure bug and implement two fixes.
//
// Each render creates a new closure with a new `count` value.
// Callbacks registered in useEffect with [] capture the closure at mount time —
// they see count = 0 forever. This is called a "stale closure".

// ─── Version 1: Bug (Stale Closure) ──────────────────────────────────────────

function BugTimer() {
  const [count, setCount] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return

    // TODO: set up setInterval that calls setCount(count + 1) every second
    // Observe: count will always be 0 in the closure — timer gets stuck at 1

    // TODO: return cleanup function that clears the interval
  }, [running])
  // Note: intentionally NOT adding count to deps to demonstrate the bug

  return (
    <div
      style={{
        flex: 1,
        minWidth: '180px',
        padding: '20px',
        borderRadius: '8px',
        background: '#1a0f0f',
        border: '2px solid #7f1d1d',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ fontWeight: 700, color: '#ef4444', fontSize: '14px' }}>Баг: stale closure</div>
      <div style={{ fontSize: '56px', fontWeight: 700, color: '#f87171', textAlign: 'center', lineHeight: 1 }}>
        {count}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setRunning(r => !r)}
          style={{
            flex: 1, padding: '8px', borderRadius: '6px', border: 'none',
            background: running ? '#374151' : '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '13px',
          }}
        >
          {running ? 'Стоп' : 'Старт'}
        </button>
        <button
          onClick={() => { setRunning(false); setCount(0) }}
          style={{
            padding: '8px 12px', borderRadius: '6px', border: 'none',
            background: '#374151', color: '#9ca3af', cursor: 'pointer', fontSize: '13px',
          }}
        >
          Сброс
        </button>
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5, borderTop: '1px solid #7f1d1d', paddingTop: '8px' }}>
        {/* TODO: add explanation of why this gets stuck */}
      </div>
    </div>
  )
}

// ─── Version 2: Fix via Functional Updater ────────────────────────────────────

function FunctionalTimer() {
  const [count, setCount] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return

    // TODO: set up setInterval that calls setCount(prev => prev + 1)
    // The functional updater receives the current value from React's update queue —
    // no closure capture needed.

    // TODO: return cleanup function
  }, [running])

  return (
    <div
      style={{
        flex: 1,
        minWidth: '180px',
        padding: '20px',
        borderRadius: '8px',
        background: '#0f1a0f',
        border: '2px solid #14532d',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ fontWeight: 700, color: '#10b981', fontSize: '14px' }}>Functional updater</div>
      <div style={{ fontSize: '56px', fontWeight: 700, color: '#4ade80', textAlign: 'center', lineHeight: 1 }}>
        {count}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setRunning(r => !r)}
          style={{
            flex: 1, padding: '8px', borderRadius: '6px', border: 'none',
            background: running ? '#374151' : '#10b981', color: '#fff', cursor: 'pointer', fontSize: '13px',
          }}
        >
          {running ? 'Стоп' : 'Старт'}
        </button>
        <button
          onClick={() => { setRunning(false); setCount(0) }}
          style={{
            padding: '8px 12px', borderRadius: '6px', border: 'none',
            background: '#374151', color: '#9ca3af', cursor: 'pointer', fontSize: '13px',
          }}
        >
          Сброс
        </button>
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5, borderTop: '1px solid #14532d', paddingTop: '8px' }}>
        {/* TODO: add explanation of why functional updater works */}
      </div>
    </div>
  )
}

// ─── Version 3: Fix via useRef ────────────────────────────────────────────────

function RefTimer() {
  const [count, setCount] = useState(0)
  const [running, setRunning] = useState(false)

  // TODO: create a ref to track the latest count
  // Update it to `count` on every render

  useEffect(() => {
    if (!running) return

    // TODO: set up setInterval that reads countRef.current for the latest value
    // The ref object persists across renders — .current is always up to date

    // TODO: return cleanup function
  }, [running])

  return (
    <div
      style={{
        flex: 1,
        minWidth: '180px',
        padding: '20px',
        borderRadius: '8px',
        background: '#0f1318',
        border: '2px solid #1e3a5f',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ fontWeight: 700, color: '#3b82f6', fontSize: '14px' }}>useRef solution</div>
      <div style={{ fontSize: '56px', fontWeight: 700, color: '#60a5fa', textAlign: 'center', lineHeight: 1 }}>
        {count}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setRunning(r => !r)}
          style={{
            flex: 1, padding: '8px', borderRadius: '6px', border: 'none',
            background: running ? '#374151' : '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '13px',
          }}
        >
          {running ? 'Стоп' : 'Старт'}
        </button>
        <button
          onClick={() => { setRunning(false); setCount(0) }}
          style={{
            padding: '8px 12px', borderRadius: '6px', border: 'none',
            background: '#374151', color: '#9ca3af', cursor: 'pointer', fontSize: '13px',
          }}
        >
          Сброс
        </button>
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5, borderTop: '1px solid #1e3a5f', paddingTop: '8px' }}>
        {/* TODO: add explanation of why useRef works */}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Task4_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.4.3')}</h2>

      {/* TODO: render all three timer columns side by side */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <BugTimer />
        <FunctionalTimer />
        <RefTimer />
      </div>

      {/* TODO: add explanation panel at the bottom explaining:
        - Why the bug happens (stale closure, snapshot behavior)
        - How functional updater bypasses the closure
        - How useRef avoids the problem */}
    </div>
  )
}
