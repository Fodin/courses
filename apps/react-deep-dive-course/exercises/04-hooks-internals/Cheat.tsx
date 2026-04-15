/**
 * Cheat.tsx — полное рабочее решение для уровня 4.
 * Используй только для сверки, после того как попробовал сам.
 *
 * Компоненты: Task4_1, Task4_2, Task4_3, Task4_4 (без суффикса _Solution)
 */

import { useState, useEffect, useMemo, useRef } from 'react'

// ─── Task 4.1 ────────────────────────────────────────────────────────────────

type HookNode = {
  name: string
  memoizedState: string
  color: string
}

export function Task4_1() {
  const [count, setCount] = useState(0)
  const [depsDisplay, setDepsDisplay] = useState('[0]')
  const squared = useMemo(() => count * count, [count])

  useEffect(() => {
    setDepsDisplay(`[${count}]`)
  }, [count])

  const hooks: HookNode[] = [
    { name: 'useState', memoizedState: String(count), color: '#3b82f6' },
    { name: 'useEffect', memoizedState: `deps: ${depsDisplay}`, color: '#8b5cf6' },
    { name: 'useMemo', memoizedState: `${count}^2 = ${squared}`, color: '#10b981' },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Hooks Linked List</h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setCount(c => c + 1)}
          style={{
            padding: '10px 24px', borderRadius: '6px', border: 'none',
            background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
          }}
        >
          +1 (count = {count})
        </button>
        <button
          onClick={() => setCount(0)}
          style={{
            padding: '10px 24px', borderRadius: '6px', border: 'none',
            background: '#374151', color: '#fff', cursor: 'pointer', fontSize: '14px',
          }}
        >
          Сброс
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontFamily: 'monospace' }}>
          fiber.memoizedState
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
          {hooks.map((hook, index) => (
            <div key={hook.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  border: `2px solid ${hook.color}`, borderRadius: '8px', padding: '12px 16px',
                  background: '#111827', minWidth: '160px', fontFamily: 'monospace', fontSize: '12px',
                }}
              >
                <div style={{ color: hook.color, fontWeight: 700, marginBottom: '8px', fontSize: '13px' }}>
                  {hook.name}
                </div>
                <div style={{ color: '#9ca3af', marginBottom: '4px' }}>memoizedState:</div>
                <div style={{ color: '#e5e7eb', marginBottom: '8px', fontWeight: 600 }}>{hook.memoizedState}</div>
                <div style={{ color: '#6b7280' }}>
                  next:{' '}
                  {index < hooks.length - 1 ? (
                    <span style={{ color: hook.color }}>Hook</span>
                  ) : (
                    <span style={{ color: '#4b5563' }}>null</span>
                  )}
                </div>
              </div>
              {index < hooks.length - 1 && (
                <div style={{ fontSize: '20px', color: '#4b5563', fontWeight: 700 }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: '16px', borderRadius: '8px', background: '#1a0f0f',
          border: '1px solid #7f1d1d', fontSize: '13px',
        }}
      >
        <div style={{ color: '#f87171', fontWeight: 700, marginBottom: '8px' }}>
          Что будет при условном хуке:
        </div>
        <pre
          style={{
            margin: '0 0 12px', padding: '12px', background: '#111827',
            borderRadius: '6px', color: '#e5e7eb', fontSize: '12px', overflowX: 'auto',
          }}
        >
{`if (isLoggedIn) {
  const [name] = useState('') // Hook[0] при mount
}
const [count] = useState(0)   // Hook[1] при mount

// При isLoggedIn = false (update):
// Hook[0] читается для count -> получает данные useState(name)!`}
        </pre>
        <div style={{ color: '#9ca3af', lineHeight: 1.6 }}>
          React обходит linked list по порядку. Пропуск хука сдвигает все последующие узлы.
        </div>
      </div>
    </div>
  )
}

// ─── Task 4.2 ────────────────────────────────────────────────────────────────

const stateStorage: unknown[] = []
let cursor = 0
let reRenderCallback: (() => void) | null = null

function myUseState<T>(initialValue: T): [T, (newValue: T) => void] {
  const slotIndex = cursor
  cursor++
  if (stateStorage[slotIndex] === undefined) {
    stateStorage[slotIndex] = initialValue
  }
  const currentValue = stateStorage[slotIndex] as T
  const setter = (newValue: T) => {
    stateStorage[slotIndex] = newValue
    if (reRenderCallback) reRenderCallback()
  }
  return [currentValue, setter]
}

export function Task4_2() {
  const [, forceUpdate] = useState(0)
  reRenderCallback = () => forceUpdate(n => n + 1)
  cursor = 0

  const [count, setCount] = myUseState(0)
  const [name, setName] = myUseState('React')

  const names = ['React', 'Vue', 'Angular', 'Svelte']
  const currentName = name as string
  const nextName = names[(names.indexOf(currentName) + 1) % names.length]

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: useState Under the Hood</h2>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div
          style={{
            flex: 1, minWidth: '180px', padding: '20px', borderRadius: '8px',
            background: '#1f2937', textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontFamily: 'monospace' }}>
            stateStorage[0]
          </div>
          <div style={{ fontSize: '48px', fontWeight: 700, color: '#3b82f6', marginBottom: '12px' }}>
            {count as number}
          </div>
          <button
            onClick={() => setCount((count as number) + 1)}
            style={{
              padding: '8px 20px', borderRadius: '6px', border: 'none',
              background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '14px',
            }}
          >
            +1
          </button>
        </div>

        <div
          style={{
            flex: 1, minWidth: '180px', padding: '20px', borderRadius: '8px',
            background: '#1f2937', textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontFamily: 'monospace' }}>
            stateStorage[1]
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#10b981', marginBottom: '12px' }}>
            {currentName}
          </div>
          <button
            onClick={() => setName(nextName)}
            style={{
              padding: '8px 20px', borderRadius: '6px', border: 'none',
              background: '#10b981', color: '#fff', cursor: 'pointer', fontSize: '14px',
            }}
          >
            {nextName}
          </button>
        </div>
      </div>

      <div
        style={{
          padding: '16px', borderRadius: '8px', background: '#111827',
          fontFamily: 'monospace', fontSize: '13px', color: '#9ca3af', lineHeight: 1.8,
        }}
      >
        <div style={{ color: '#4b5563', marginBottom: '4px' }}>// Симуляция fiber.memoizedState</div>
        <div>
          stateStorage:{' '}
          <span style={{ color: '#e5e7eb' }}>
            [{String(stateStorage[0])}, &apos;{String(stateStorage[1])}&apos;]
          </span>
        </div>
        <div>
          cursor после рендера: <span style={{ color: '#f59e0b' }}>{cursor}</span>
          <span style={{ color: '#4b5563' }}> (2 хука = 2 слота)</span>
        </div>
      </div>
    </div>
  )
}

// ─── Task 4.3 ────────────────────────────────────────────────────────────────

type TimerVariant = 'bug' | 'functional' | 'ref'

function TimerCol({
  title,
  accentColor,
  borderColor,
  bg,
  numColor,
  variant,
  description,
}: {
  title: string
  accentColor: string
  borderColor: string
  bg: string
  numColor: string
  variant: TimerVariant
  description: string
}) {
  const [count, setCount] = useState(0)
  const [running, setRunning] = useState(false)
  const countRef = useRef(0)
  countRef.current = count

  useEffect(() => {
    if (!running) return
    let id: ReturnType<typeof setInterval>

    if (variant === 'bug') {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      id = setInterval(() => { setCount(count + 1) }, 1000)
    } else if (variant === 'functional') {
      id = setInterval(() => { setCount(prev => prev + 1) }, 1000)
    } else {
      id = setInterval(() => { setCount(countRef.current + 1) }, 1000)
    }

    return () => clearInterval(id)
  }, [running]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ flex: 1, minWidth: '180px', padding: '20px', borderRadius: '8px', background: bg, border: `2px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ fontWeight: 700, color: accentColor, fontSize: '14px' }}>{title}</div>
      <div style={{ fontSize: '56px', fontWeight: 700, color: numColor, textAlign: 'center', lineHeight: 1 }}>{count}</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setRunning(r => !r)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: running ? '#374151' : accentColor, color: '#fff', cursor: 'pointer', fontSize: '13px' }}>
          {running ? 'Стоп' : 'Старт'}
        </button>
        <button onClick={() => { setRunning(false); setCount(0) }} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', background: '#374151', color: '#9ca3af', cursor: 'pointer', fontSize: '13px' }}>
          Сброс
        </button>
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5, borderTop: `1px solid ${borderColor}`, paddingTop: '8px' }}>
        {description}
      </div>
    </div>
  )
}

export function Task4_3() {
  return (
    <div className="exercise-container">
      <h2>Задание 4.3: The Closure Trap</h2>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <TimerCol
          title="Баг: stale closure"
          accentColor="#ef4444" borderColor="#7f1d1d" bg="#1a0f0f" numColor="#f87171"
          variant="bug"
          description="setCount(count + 1) — count = 0 навсегда в замыкании. Счётчик застревает на 1."
        />
        <TimerCol
          title="Functional updater"
          accentColor="#10b981" borderColor="#14532d" bg="#0f1a0f" numColor="#4ade80"
          variant="functional"
          description="setCount(prev => prev + 1) — React передаёт актуальный prev из очереди."
        />
        <TimerCol
          title="useRef solution"
          accentColor="#3b82f6" borderColor="#1e3a5f" bg="#0f1318" numColor="#60a5fa"
          variant="ref"
          description="countRef.current обновляется при каждом рендере. setInterval читает всегда актуальное значение."
        />
      </div>

      <div style={{ padding: '16px', borderRadius: '8px', background: '#111827', fontSize: '13px', color: '#9ca3af', lineHeight: 1.7 }}>
        <strong style={{ color: '#e5e7eb' }}>Почему баг:</strong> useEffect с [] запускается один раз — замыкание захватывает count = 0.
        setInterval живёт в этом старом замыкании и всегда видит 0.
      </div>
    </div>
  )
}

// ─── Task 4.4 ────────────────────────────────────────────────────────────────

function BadCard({ firstName, lastName }: { firstName: string; lastName: string }) {
  const rc = useRef(0)
  rc.current++
  const [fullName, setFullName] = useState('')
  useEffect(() => { setFullName(firstName + ' ' + lastName) }, [firstName, lastName])
  return (
    <div style={{ padding: '16px', borderRadius: '8px', background: '#1a0f0f', border: '1px solid #7f1d1d', flex: 1, minWidth: '220px' }}>
      <div style={{ color: '#f87171', fontWeight: 700, marginBottom: '12px', fontSize: '13px' }}>Плохой вариант</div>
      <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>useState + useEffect</div>
      <div style={{ fontSize: '20px', color: '#e5e7eb', marginBottom: '12px', minHeight: '28px' }}>
        {fullName || <span style={{ color: '#4b5563' }}>(пусто при первом рендере)</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '6px', background: '#2d1010' }}>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>Рендеров:</span>
        <span style={{ fontSize: '24px', fontWeight: 700, color: '#f87171' }}>{rc.current}</span>
        <span style={{ fontSize: '11px', color: '#7f1d1d', marginLeft: '4px' }}>+2 за изменение</span>
      </div>
    </div>
  )
}

function GoodCard({ firstName, lastName }: { firstName: string; lastName: string }) {
  const rc = useRef(0)
  rc.current++
  const fullName = firstName + ' ' + lastName
  return (
    <div style={{ padding: '16px', borderRadius: '8px', background: '#0f1a0f', border: '1px solid #14532d', flex: 1, minWidth: '220px' }}>
      <div style={{ color: '#4ade80', fontWeight: 700, marginBottom: '12px', fontSize: '13px' }}>Хороший вариант</div>
      <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
        const fullName = first + &apos; &apos; + last
      </div>
      <div style={{ fontSize: '20px', color: '#e5e7eb', marginBottom: '12px', minHeight: '28px' }}>{fullName}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '6px', background: '#0a1f10' }}>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>Рендеров:</span>
        <span style={{ fontSize: '24px', fontWeight: 700, color: '#4ade80' }}>{rc.current}</span>
        <span style={{ fontSize: '11px', color: '#14532d', marginLeft: '4px' }}>+1 за изменение</span>
      </div>
    </div>
  )
}

export function Task4_4() {
  const [firstName, setFirstName] = useState('Иван')
  const [lastName, setLastName] = useState('Иванов')

  return (
    <div className="exercise-container">
      <h2>Задание 4.4: Computed During Render</h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Имя</label>
          <input value={firstName} onChange={e => setFirstName(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Фамилия</label>
          <input value={lastName} onChange={e => setLastName(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: '#e5e7eb', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <BadCard firstName={firstName} lastName={lastName} />
        <GoodCard firstName={firstName} lastName={lastName} />
      </div>

      <div style={{ padding: '16px', borderRadius: '8px', background: '#111827', fontSize: '13px', color: '#9ca3af', lineHeight: 1.7 }}>
        <strong style={{ color: '#e5e7eb' }}>Плохой вариант — 2 рендера:</strong>
        <br />
        1. Изменился firstName → рендер #1 (fullName ещё старый)
        <br />
        2. useEffect → setFullName → рендер #2 (fullName обновлён)
        <br />
        <br />
        <strong style={{ color: '#e5e7eb' }}>Хороший вариант — 1 рендер:</strong>{' '}
        fullName вычисляется прямо в рендере и уже правильный.
      </div>
    </div>
  )
}
