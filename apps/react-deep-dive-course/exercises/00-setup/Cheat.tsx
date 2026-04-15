/**
 * Cheat.tsx — полное рабочее решение для уровня 0.
 * Используй только для сверки, после того как попробовал сам.
 *
 * Компоненты: Task0_1, Task0_2, Task0_3 (без суффикса _Solution)
 */

import { useState, useEffect, useRef, Profiler } from 'react'
import type { ProfilerOnRenderCallback } from 'react'

// ─── Task 0.1 ────────────────────────────────────────────────────────────────

type Phase = {
  id: string
  label: string
  description: string
  color: string
}

const PHASES: Phase[] = [
  {
    id: 'trigger',
    label: 'Trigger',
    description:
      'React получает сигнал об обновлении: вызван setState, dispatch или произошёл первичный mount. ' +
      'Ничего не трогается — React просто планирует работу через scheduler.',
    color: '#3b82f6',
  },
  {
    id: 'render',
    label: 'Render',
    description:
      'React вызывает функции компонентов и получает JSX — описание того, как должен выглядеть UI. ' +
      'Никакой DOM в этот момент не трогается. Render — это вызов функции, а не рисование.',
    color: '#8b5cf6',
  },
  {
    id: 'commit',
    label: 'Commit',
    description:
      'React сравнивает новое виртуальное дерево со старым и применяет минимально необходимые изменения к реальному DOM. ' +
      'Только после этого браузер перерисовывает страницу.',
    color: '#10b981',
  },
]

export function Task0_1() {
  const [activeId, setActiveId] = useState<string>(PHASES[0].id)

  const activePhase = PHASES.find(p => p.id === activeId) ?? PHASES[0]

  return (
    <div className="exercise-container">
      <h2>Задание 0.1: Диаграмма Trigger / Render / Commit</h2>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '24px 0',
          flexWrap: 'wrap',
        }}
      >
        {PHASES.map((phase, index) => {
          const isActive = phase.id === activeId
          return (
            <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setActiveId(phase.id)}
                style={{
                  padding: '16px 24px',
                  borderRadius: '8px',
                  border: isActive ? `3px solid ${phase.color}` : '3px solid transparent',
                  background: isActive ? phase.color : '#374151',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: isActive ? 700 : 400,
                  cursor: 'pointer',
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? `0 0 16px ${phase.color}66` : 'none',
                  minWidth: '110px',
                }}
              >
                {phase.label}
              </button>
              {index < PHASES.length - 1 && (
                <span style={{ fontSize: '24px', color: '#6b7280' }}>→</span>
              )}
            </div>
          )
        })}
      </div>

      <div
        style={{
          padding: '20px',
          borderRadius: '8px',
          borderLeft: `4px solid ${activePhase.color}`,
          background: '#1f2937',
          color: '#e5e7eb',
          lineHeight: 1.6,
          minHeight: '80px',
        }}
      >
        <strong style={{ color: activePhase.color }}>{activePhase.label}:</strong>{' '}
        {activePhase.description}
      </div>

      <p style={{ marginTop: '12px', fontSize: '13px', color: '#6b7280' }}>
        Кликни на любую фазу, чтобы увидеть её описание
      </p>
    </div>
  )
}

// ─── Task 0.2 ────────────────────────────────────────────────────────────────

export function Task0_2() {
  const renderCount = useRef(0)
  const [commitCount, setCommitCount] = useState(0)
  const [trigger, setTrigger] = useState(0)
  const [sameValue, setSameValue] = useState(0)

  renderCount.current++

  useEffect(() => {
    setCommitCount(c => c + 1)
  })

  return (
    <div className="exercise-container">
      <h2>Задание 0.2: Render ≠ DOM update</h2>

      <div style={{ display: 'flex', gap: '24px', margin: '24px 0', flexWrap: 'wrap' }}>
        <div
          style={{
            flex: 1,
            minWidth: '160px',
            padding: '20px',
            borderRadius: '8px',
            background: '#1f2937',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>
            Render (вызовов функции)
          </div>
          <div style={{ fontSize: '48px', fontWeight: 700, color: '#8b5cf6' }}>
            {renderCount.current}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: '160px',
            padding: '20px',
            borderRadius: '8px',
            background: '#1f2937',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>
            Commit (обновлений DOM)
          </div>
          <div style={{ fontSize: '48px', fontWeight: 700, color: '#10b981' }}>
            {commitCount}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <button
          onClick={() => setTrigger(n => n + 1)}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            background: '#3b82f6',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Force re-render
        </button>

        <button
          onClick={() => setSameValue(0)}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            background: '#6b7280',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Same value setState (0 → 0)
        </button>
      </div>

      <div
        style={{
          padding: '16px',
          borderRadius: '8px',
          background: '#111827',
          fontSize: '13px',
          color: '#9ca3af',
          lineHeight: 1.7,
        }}
      >
        <strong style={{ color: '#e5e7eb' }}>Что наблюдаем:</strong>
        <br />
        "Force re-render" всегда увеличивает оба счётчика.
        <br />
        "Same value setState" — Render может случиться, но Commit не произойдёт. Render ≠ DOM update.
      </div>

      <span style={{ display: 'none' }}>{trigger}{sameValue}</span>
    </div>
  )
}

// ─── Task 0.3 ────────────────────────────────────────────────────────────────

type RenderRecord = {
  phase: string
  actualDuration: number
  baseDuration: number
  startTime: number
  commitTime: number
}

function SlowComponent({ value }: { value: number }) {
  const start = performance.now()
  while (performance.now() - start < 2) {
    // busy wait ~2ms
  }
  return (
    <div
      style={{
        padding: '12px 20px',
        borderRadius: '6px',
        background: '#1f2937',
        color: '#e5e7eb',
        fontFamily: 'monospace',
      }}
    >
      SlowComponent value: <strong>{value}</strong>
    </div>
  )
}

export function Task0_3() {
  const renders = useRef<RenderRecord[]>([])
  const [value, setValue] = useState(0)
  const [, forceUpdate] = useState(0)

  const handleRender: ProfilerOnRenderCallback = (
    _id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    renders.current.push({ phase, actualDuration, baseDuration, startTime, commitTime })
    forceUpdate(n => n + 1)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.3: Profiler API — замеряем рендеры</h2>

      <Profiler id="slow-component" onRender={handleRender}>
        <SlowComponent value={value} />
      </Profiler>

      <div style={{ display: 'flex', gap: '12px', margin: '20px 0', flexWrap: 'wrap' }}>
        <button
          onClick={() => setValue(v => v + 1)}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            background: '#3b82f6',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Обновить значение
        </button>
        <button
          onClick={() => setValue(value)}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            background: '#6b7280',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Тот же value (возможный bailout)
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
            fontFamily: 'monospace',
          }}
        >
          <thead>
            <tr style={{ background: '#1f2937' }}>
              {['#', 'Phase', 'Actual (ms)', 'Base (ms)'].map(col => (
                <th
                  key={col}
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    color: '#9ca3af',
                    fontWeight: 600,
                    borderBottom: '1px solid #374151',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renders.current.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '20px 16px', color: '#6b7280', textAlign: 'center' }}>
                  Данных пока нет...
                </td>
              </tr>
            ) : (
              renders.current.map((r, i) => (
                <tr
                  key={i}
                  style={{
                    background: i % 2 === 0 ? '#111827' : '#1a2332',
                    borderBottom: '1px solid #1f2937',
                  }}
                >
                  <td style={{ padding: '8px 16px', color: '#6b7280' }}>{i + 1}</td>
                  <td style={{ padding: '8px 16px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: r.phase === 'mount' ? '#1e3a5f' : '#2d1b4e',
                        color: r.phase === 'mount' ? '#60a5fa' : '#a78bfa',
                      }}
                    >
                      {r.phase}
                    </span>
                  </td>
                  <td style={{ padding: '8px 16px', color: '#f59e0b' }}>
                    {r.actualDuration.toFixed(2)}
                  </td>
                  <td style={{ padding: '8px 16px', color: '#e5e7eb' }}>
                    {r.baseDuration.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
        actualDuration — реальное время рендера с мемоизацией. baseDuration — оценка без оптимизаций.
      </p>
    </div>
  )
}
