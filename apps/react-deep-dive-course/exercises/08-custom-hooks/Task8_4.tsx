import { useState, useEffect, useMemo, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Task 8.4: Anti-pattern Gallery (YMNAE Capstone)
//
// Each component below contains a classic YMNAE antipattern.
// For each one:
//   1. Identify the antipattern by name
//   2. Understand WHY it's a problem
//   3. Refactor to the correct approach
//
// The antipattern names to use:
//   "Уведомление родителя из Effect"
//   "Цепочка эффектов"
//   "Ручная подписка через useEffect"
//   "Избыточное состояние"

// ─── Antipattern 1: NotifyParent ──────────────────────────────────────────────
// Problem: onChange is called from useEffect AFTER render — causes extra render,
//          violates React's unidirectional data flow.
// Fix: call onChange directly inside the event handler.

function Toggle({ onChange }: { onChange: (val: boolean) => void }) {
  const [isOn, setIsOn] = useState(false)

  // ❌ TODO: remove this useEffect and call onChange in the click handler instead
  useEffect(() => {
    onChange(isOn)
  }, [isOn, onChange])

  return (
    <button
      onClick={() => setIsOn(v => !v)}
      style={{
        padding: '6px 16px', borderRadius: 6, border: 'none',
        background: isOn ? '#ef4444' : '#22c55e',
        color: 'white', fontWeight: 700, cursor: 'pointer',
      }}
    >
      {isOn ? 'ON' : 'OFF'}
    </button>
  )
}

// ─── Antipattern 2: EffectChain ───────────────────────────────────────────────
// Problem: password → trimmed → error → isValid via 3 useEffects.
//          Each effect triggers a separate render: 4 renders per keystroke!
// Fix: compute trimmed/error/isValid directly during render (no useState, no useEffect).

function PasswordForm() {
  const [password, setPassword] = useState('')
  const renderCount = useRef(0)
  renderCount.current += 1

  // ❌ TODO: remove these 3 states and 3 effects
  // Replace with: const trimmed = ...; const error = ...; const isValid = ...
  const [trimmed, setTrimmed] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(false)

  useEffect(() => { setTrimmed(password.trim()) }, [password])
  useEffect(() => { setError(trimmed.length > 0 && trimmed.length < 8 ? 'Слишком короткий' : '') }, [trimmed])
  useEffect(() => { setIsValid(trimmed.length >= 8 && error === '') }, [trimmed, error])

  return (
    <div>
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Введите пароль..."
        style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13, width: '100%', boxSizing: 'border-box' }}
      />
      <div style={{ marginTop: 4, fontSize: 12 }}>
        {error && <span style={{ color: '#dc2626' }}>{error}</span>}
        {isValid && <span style={{ color: '#16a34a' }}>Пароль подходит</span>}
      </div>
      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
        Рендеров: {renderCount.current} {renderCount.current > 3 ? '(слишком много!)' : ''}
      </div>
    </div>
  )
}

// ─── Antipattern 3: ManualSubscription ───────────────────────────────────────
// Problem: subscribing to window.scroll via useEffect + setState.
//          mount → effect → setState = extra render; tearing risk.
// Fix: useSyncExternalStore with subscribe/getSnapshot defined OUTSIDE the component.

function useScrollY(): number {
  const [y, setY] = useState(0)

  // ❌ TODO: replace with useSyncExternalStore
  useEffect(() => {
    const handler = () => setY(window.scrollY)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return y
}

// ─── Antipattern 4: RedundantState ───────────────────────────────────────────
// Problem: `filtered` is derived from `items` + `query`,
//          but stored in state and synchronized via useEffect.
//          This causes an extra render: query changes → setState(filtered) → render.
// Fix: const filtered = useMemo(() => ..., [items, query])

const ITEMS = ['React', 'Vue', 'Angular', 'Svelte', 'Preact', 'SolidJS', 'Qwik', 'Ember', 'Backbone', 'Mithril']

function ItemList() {
  const [query, setQuery] = useState('')

  // ❌ TODO: remove filtered state and useEffect
  // Replace with: const filtered = useMemo(...)
  const [filtered, setFiltered] = useState(ITEMS)

  useEffect(() => {
    setFiltered(ITEMS.filter(i => i.toLowerCase().includes(query.toLowerCase())))
  }, [query])

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Фильтр..."
        style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13, marginBottom: 6, width: '100%', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {filtered.map(item => (
          <span key={item} style={{ padding: '2px 8px', borderRadius: 12, background: '#dbeafe', color: '#1d4ed8', fontSize: 12, fontWeight: 600 }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Task8_4() {
  const { t } = useLanguage()
  const [toggleLog, setToggleLog] = useState<string[]>([])
  const scrollY = useScrollY()

  // Use useMemo here is fine — it's correct (derived from toggleLog)
  const logText = useMemo(() => toggleLog.slice(0, 5), [toggleLog])

  return (
    <div className="exercise-container">
      <h2>{t('task.8.4')}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Card 1: NotifyParent */}
        <div style={{ padding: 14, borderRadius: 10, border: '2px solid #fca5a5', background: '#fff5f5' }}>
          <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>
            #1 NotifyParent — "Уведомление родителя из Effect"
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>
            Нажми кнопку и смотри лог — onChange вызывается лишний раз (из useEffect)
          </div>
          <Toggle onChange={v => setToggleLog(l => [`onChange(${v})`, ...l])} />
          {logText.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 12, fontFamily: 'monospace', color: '#6b7280' }}>
              {logText.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          )}
          {/* TODO: After fix — onChange should appear in log only ONCE per click, not twice */}
        </div>

        {/* Card 2: EffectChain */}
        <div style={{ padding: 14, borderRadius: 10, border: '2px solid #fcd34d', background: '#fffbeb' }}>
          <div style={{ fontWeight: 700, color: '#d97706', marginBottom: 4 }}>
            #2 EffectChain — "Цепочка эффектов"
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>
            Вводи пароль и смотри счётчик рендеров — он растёт слишком быстро
          </div>
          <PasswordForm />
          {/* TODO: After fix — renderCount should increase by 1 per keystroke, not 4 */}
        </div>

        {/* Card 3: ManualSubscription */}
        <div style={{ padding: 14, borderRadius: 10, border: '2px solid #d8b4fe', background: '#faf5ff' }}>
          <div style={{ fontWeight: 700, color: '#7c3aed', marginBottom: 4 }}>
            #3 ManualSubscription — "Ручная подписка через useEffect"
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>
            Прокрути страницу — scrollY обновляется, но через useEffect+setState (лишний рендер при mount)
          </div>
          <div style={{ fontSize: 13 }}>
            scrollY: <strong>{scrollY}px</strong>
          </div>
          {/* TODO: replace useScrollY implementation with useSyncExternalStore */}
        </div>

        {/* Card 4: RedundantState */}
        <div style={{ padding: 14, borderRadius: 10, border: '2px solid #bae6fd', background: '#f0f9ff' }}>
          <div style={{ fontWeight: 700, color: '#0369a1', marginBottom: 4 }}>
            #4 RedundantState — "Избыточное состояние"
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>
            filtered — вычислимо из items+query, но хранится в state. Исправь через useMemo.
          </div>
          <ItemList />
          {/* TODO: replace useState+useEffect in ItemList with useMemo */}
        </div>

      </div>
    </div>
  )
}
