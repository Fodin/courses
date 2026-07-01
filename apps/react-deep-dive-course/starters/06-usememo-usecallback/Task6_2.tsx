import { useState, useMemo, useCallback, useRef, memo } from 'react'
import { useLanguage } from 'src/hooks'

// Task 6.2: Referential Equality Trap
//
// Child is wrapped in React.memo. Parent passes style (object) and onClick (function).
// Currently both are created inline → new reference every render → React.memo does nothing.
//
// The render counter on Child proves it: Child re-renders on every Parent render.
//
// Your task:
//   1. Wrap `style` in useMemo (stable object reference)
//   2. Wrap `onClick` in useCallback (stable function reference)
//   3. After the fix, Child should render ONLY once (on mount)

type ChildProps = {
  style: React.CSSProperties
  onClick: () => void
  label: string
}

// Do NOT modify this component — it's correctly wrapped in memo
const ChildComponent = memo(function ChildComponent({ style, onClick, label }: ChildProps) {
  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div style={{ ...style, borderRadius: 8, border: '1px solid #d1d5db', padding: 12 }}>
      <div style={{ marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div style={{ marginBottom: 8, fontSize: 13, color: '#6b7280' }}>
        Рендеров Child:{' '}
        <strong style={{ color: renderCount.current > 1 ? '#ef4444' : '#16a34a' }}>
          {renderCount.current}
        </strong>
        {renderCount.current > 1 && ' ← React.memo не работает!'}
        {renderCount.current === 1 && ' ← React.memo работает!'}
      </div>
      <button
        onClick={onClick}
        style={{ padding: '4px 10px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
      >
        Action
      </button>
    </div>
  )
})

export function Task6_2() {
  const { t } = useLanguage()

  const parentRenderCount = useRef(0)
  parentRenderCount.current += 1

  const [parentCount, setParentCount] = useState(0)
  const [childActionCount, setChildActionCount] = useState(0)

  // TODO: replace the inline style with useMemo
  // The style object doesn't depend on any state → deps = []
  const unstableStyle = { background: '#faf5ff' } // ❌ new object every render

  // TODO: replace the inline onClick with useCallback
  // Use functional updater so deps can be []
  const unstableClick = () => setChildActionCount(c => c + 1) // ❌ new function every render

  return (
    <div className="exercise-container">
      <h2>{t('task.6.2')}</h2>

      <div style={{ marginBottom: 16, padding: '8px 12px', background: '#f0f9ff', borderRadius: 8 }}>
        <strong>Parent рендеров:</strong> {parentRenderCount.current}
        {'  '}
        <strong>Child actions:</strong> {childActionCount}
      </div>

      <button
        onClick={() => setParentCount(c => c + 1)}
        style={{ marginBottom: 20, padding: '8px 16px', background: '#f59e0b', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
      >
        Trigger Parent Re-render (count: {parentCount})
      </button>

      {/* Pass the unstable props to Child — fix them above */}
      <ChildComponent
        style={unstableStyle}
        onClick={unstableClick}
        label="Child (React.memo)"
      />

      <div style={{ marginTop: 16, padding: '10px 14px', background: '#fef3c7', borderRadius: 8, fontSize: 13 }}>
        ⚠️ Нажми кнопку несколько раз. Счётчик Child растёт? Значит React.memo не работает.<br />
        Исправь style и onClick — счётчик Child должен остаться на 1.
      </div>
    </div>
  )
}
