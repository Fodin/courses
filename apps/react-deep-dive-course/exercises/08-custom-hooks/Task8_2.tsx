import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// Task 8.2: usePrevious and useLatestCallback
//
// Part A: usePrevious<T>(value: T): T | undefined
//   - Store value in useRef
//   - Update ref in useEffect WITHOUT deps array (runs after every render)
//   - Return ref.current (which holds the PREVIOUS render's value)
//   - Key: useRef doesn't trigger re-render when updated
//
// Part B: useLatestCallback<T extends Function>(callback: T): T
//   - Store callback in useRef
//   - Update ref in useEffect WITHOUT deps array
//   - Return a STABLE wrapper via useCallback((...args) => ref.current(...args), [])
//   - This solves closure trap in setInterval without recreating the interval

// ─── Part A: usePrevious ──────────────────────────────────────────────────────

function usePrevious<T>(value: T): T | undefined {
  // TODO: implement usePrevious
  // 1. const ref = useRef<T>()
  // 2. useEffect(() => { ref.current = value })  // no deps!
  // 3. return ref.current
  void value
  return undefined
}

// ─── Part B: useLatestCallback ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useLatestCallback<T extends (...args: any[]) => any>(callback: T): T {
  // TODO: implement useLatestCallback
  // 1. const ref = useRef<T>(callback)
  // 2. useEffect(() => { ref.current = callback })  // no deps!
  // 3. return useCallback((...args) => ref.current(...args), []) as T
  return callback
}

// ─── Demo Component ──────────────────────────────────────────────────────────

export function Task8_2() {
  const { t } = useLanguage()

  // Part A demo
  const [count, setCount] = useState(0)
  const prev = usePrevious(count)

  // Part B demo
  const [intervalCount, setIntervalCount] = useState(0)
  const logRef = useRef<string[]>([])
  const [, forceRender] = useState(0)

  // useLatestCallback: interval sees the actual intervalCount
  const tick = useLatestCallback(() => {
    logRef.current = [`count=${intervalCount}`, ...logRef.current].slice(0, 6)
    forceRender(c => c + 1)
  })

  useEffect(() => {
    const id = setInterval(tick, 1500)
    return () => clearInterval(id)
  }, [tick])

  return (
    <div className="exercise-container">
      <h2>{t('task.8.2')}</h2>

      {/* Part A */}
      <div style={{
        padding: 16,
        borderRadius: 10,
        border: '2px solid #bae6fd',
        background: '#f0f9ff',
        marginBottom: 16,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 12, color: '#0369a1' }}>
          Часть A: usePrevious
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 12, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6b7280' }}>предыдущее</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#94a3b8' }}>{prev ?? '—'}</div>
          </div>
          <div style={{ fontSize: 24, color: '#cbd5e1' }}>→</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6b7280' }}>текущее</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#0284c7' }}>{count}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button
            onClick={() => setCount(c => c - 1)}
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none',
              background: '#e0f2fe', color: '#0369a1', fontWeight: 700, fontSize: 18, cursor: 'pointer',
            }}
          >−</button>
          <button
            onClick={() => setCount(c => c + 1)}
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none',
              background: '#0284c7', color: 'white', fontWeight: 700, fontSize: 18, cursor: 'pointer',
            }}
          >+</button>
        </div>

        {/* TODO: verify — after first mount `prev` should be undefined.
            After clicking + once, prev=0 and count=1. */}
      </div>

      {/* Part B */}
      <div style={{
        padding: 16,
        borderRadius: 10,
        border: '2px solid #d8b4fe',
        background: '#faf5ff',
      }}>
        <div style={{ fontWeight: 700, marginBottom: 12, color: '#7c3aed' }}>
          Часть B: useLatestCallback (closure trap решение)
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 13 }}>intervalCount:</span>
          <strong style={{ fontSize: 18, color: '#7c3aed' }}>{intervalCount}</strong>
          <button
            onClick={() => setIntervalCount(c => c + 1)}
            style={{
              marginLeft: 'auto', padding: '4px 12px', borderRadius: 6,
              border: 'none', background: '#7c3aed', color: 'white',
              fontWeight: 600, cursor: 'pointer', fontSize: 13,
            }}
          >+1</button>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 4 }}>
            Лог setInterval (каждые 1.5s):
          </div>
          <div style={{
            background: '#1e293b', borderRadius: 6, padding: 8,
            fontSize: 12, color: '#86efac', minHeight: 80, fontFamily: 'monospace',
          }}>
            {logRef.current.length === 0
              ? <span style={{ color: '#475569' }}>ожидание первого тика...</span>
              : logRef.current.map((l, i) => <div key={i}>{l}</div>)
            }
          </div>
        </div>

        {/* TODO: click +1 several times, then wait for interval tick.
            The log should show the CURRENT intervalCount, not the initial 0.
            Without useLatestCallback it would always show count=0 (closure trap). */}
      </div>
    </div>
  )
}
