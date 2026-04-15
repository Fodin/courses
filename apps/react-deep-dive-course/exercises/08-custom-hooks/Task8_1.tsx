import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Task 8.1: useDebounce
//
// Implement the useDebounce<T>(value, delay) hook.
// It should return the debounced value — updated only after
// the user stops changing `value` for `delay` milliseconds.
//
// Key requirement: useEffect MUST return () => clearTimeout(timer)
// Without cleanup each keystroke creates a timer that fires,
// completely defeating the purpose of debounce.

// ─── TODO: implement useDebounce ──────────────────────────────────────────────

function useDebounce<T>(value: T, _delay: number): T {
  // TODO: implement this hook
  // 1. useState for the debounced value (initialize with `value`)
  // 2. useEffect with setTimeout → setDebounced(value)
  // 3. Return cleanup: () => clearTimeout(timer)
  // 4. Deps array: [value, _delay]
  return value // remove this line after implementation
}

// ─── Demo Component ──────────────────────────────────────────────────────────

export function Task8_1() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [delay, setDelay] = useState(400)
  const debounced = useDebounce(input, delay)

  // Track how many times the debounced value actually updates
  const setStateCount = useRef(0)
  const prevDebounced = useRef('')
  if (prevDebounced.current !== debounced) {
    setStateCount.current += 1
    prevDebounced.current = debounced
  }

  const isPending = input !== debounced

  return (
    <div className="exercise-container">
      <h2>{t('task.8.1')}</h2>

      {/* TODO: after implementing useDebounce, test:
          1. Type quickly — setStateCount should NOT grow on every keystroke
          2. Stop typing — after `delay` ms debounced should update
          3. When `input === debounced` border should be green (not amber) */}

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: 14 }}>
          Задержка: <span style={{ color: '#3b82f6' }}>{delay}ms</span>
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {[200, 400, 800].map(d => (
            <button
              key={d}
              onClick={() => setDelay(d)}
              style={{
                padding: '4px 12px',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                background: delay === d ? '#3b82f6' : 'white',
                color: delay === d ? 'white' : '#374151',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {d}ms
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Введите текст быстро..."
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 8,
            border: `2px solid ${isPending ? '#f59e0b' : '#d1d5db'}`,
            fontSize: 15,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ padding: 14, borderRadius: 8, border: '2px solid #fca5a5', background: '#fff5f5' }}>
          <div style={{ fontSize: 12, color: '#dc2626', fontWeight: 700, marginBottom: 6 }}>Live value</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            {input || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>пусто</span>}
          </div>
        </div>
        <div style={{
          padding: 14,
          borderRadius: 8,
          border: `2px solid ${isPending ? '#fcd34d' : '#86efac'}`,
          background: isPending ? '#fffbeb' : '#f0fdf4',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: isPending ? '#92400e' : '#15803d' }}>
            Debounced {isPending && '⏳'}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            {debounced || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>пусто</span>}
          </div>
        </div>
      </div>

      <div style={{
        padding: '10px 14px',
        background: '#f8fafc',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 13,
      }}>
        <span style={{ color: '#6b7280' }}>setState вызовов (debounced):</span>
        <span style={{ fontWeight: 800, fontSize: 20, color: '#3b82f6' }}>{setStateCount.current}</span>
      </div>
    </div>
  )
}
