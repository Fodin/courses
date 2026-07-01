import { useState, useEffect, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Task 4.4: Computed During Render (YMNAE — You Might Not Await Effect)
// Refactor the antipattern: useState + useEffect for derived values.
//
// If a value is fully determined by other state/props — it's a derived value,
// not independent state. Compute it during render, not in an effect.

// ─── Bad Version (given — do not change) ────────────────────────────────────

function BadUserCard({
  firstName,
  lastName,
}: {
  firstName: string
  lastName: string
}) {
  const renderCount = useRef(0)
  renderCount.current++

  // Antipattern: derived value stored in state, updated via useEffect
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName)
  }, [firstName, lastName])

  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '8px',
        background: '#1a0f0f',
        border: '1px solid #7f1d1d',
        flex: 1,
        minWidth: '220px',
      }}
    >
      <div style={{ color: '#f87171', fontWeight: 700, marginBottom: '12px', fontSize: '13px' }}>
        Плохой вариант
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
        useState + useEffect
      </div>
      <div style={{ fontSize: '20px', color: '#e5e7eb', marginBottom: '12px', minHeight: '28px' }}>
        {fullName || <span style={{ color: '#4b5563' }}>(пусто при первом рендере)</span>}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '6px',
          background: '#2d1010',
        }}
      >
        <span style={{ fontSize: '12px', color: '#6b7280' }}>Рендеров:</span>
        <span style={{ fontSize: '24px', fontWeight: 700, color: '#f87171' }}>
          {renderCount.current}
        </span>
        <span style={{ fontSize: '11px', color: '#7f1d1d', marginLeft: '4px' }}>
          +2 за изменение
        </span>
      </div>
    </div>
  )
}

// ─── Good Version (implement this) ───────────────────────────────────────────

function GoodUserCard({
  firstName,
  lastName,
}: {
  firstName: string
  lastName: string
}) {
  const renderCount = useRef(0)
  renderCount.current++

  // TODO: compute fullName directly during render — no useState, no useEffect
  // const fullName = ...

  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '8px',
        background: '#0f1a0f',
        border: '1px solid #14532d',
        flex: 1,
        minWidth: '220px',
      }}
    >
      <div style={{ color: '#4ade80', fontWeight: 700, marginBottom: '12px', fontSize: '13px' }}>
        Хороший вариант
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
        {/* TODO: update this label to show the correct pattern */}
        const fullName = ?
      </div>
      <div style={{ fontSize: '20px', color: '#e5e7eb', marginBottom: '12px', minHeight: '28px' }}>
        {/* TODO: render fullName */}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '6px',
          background: '#0a1f10',
        }}
      >
        <span style={{ fontSize: '12px', color: '#6b7280' }}>Рендеров:</span>
        <span style={{ fontSize: '24px', fontWeight: 700, color: '#4ade80' }}>
          {renderCount.current}
        </span>
        <span style={{ fontSize: '11px', color: '#14532d', marginLeft: '4px' }}>
          +1 за изменение
        </span>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Task4_4() {
  const { t } = useLanguage()

  const [firstName, setFirstName] = useState('Иван')
  const [lastName, setLastName] = useState('Иванов')

  return (
    <div className="exercise-container">
      <h2>{t('task.4.4')}</h2>

      {/* Input fields for first and last name */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Имя
          </label>
          <input
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #374151',
              background: '#1f2937',
              color: '#e5e7eb',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            Фамилия
          </label>
          <input
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #374151',
              background: '#1f2937',
              color: '#e5e7eb',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Both cards side by side */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <BadUserCard firstName={firstName} lastName={lastName} />
        <GoodUserCard firstName={firstName} lastName={lastName} />
      </div>

      {/* TODO: add explanation panel explaining:
        - Why BadUserCard renders twice (render #1 with stale fullName, then useEffect fires setFullName, render #2)
        - Why GoodUserCard renders once (fullName computed in render #1, already correct)
        - The rule: derived values should be computed during render, not stored as state */}
    </div>
  )
}
