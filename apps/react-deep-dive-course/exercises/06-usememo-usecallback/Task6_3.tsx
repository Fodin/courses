import { useState, useMemo } from 'react'
import { useLanguage } from 'src/hooks'

// Task 6.3: Memoization Cost-Benefit
//
// Benchmark three variants of computation:
//   1. No memoization — expensive sort+filter on 10k items every render
//   2. useMemo on cheap — items.length wrapped in useMemo
//   3. useMemo on expensive — sort+filter wrapped in useMemo
//
// "Trigger Re-render" button changes only `tick` (not items).
// After a re-render: variant 1 recalculates (slow), variants 2 and 3 use cache (fast).
//
// Goal: prove that memoizing cheap operations adds overhead, not savings.

type Item = {
  id: number
  value: number
  active: boolean
}

function generateItems(count: number): Item[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    value: Math.floor(Math.random() * 1000),
    active: Math.random() > 0.5,
  }))
}

export function Task6_3() {
  const { t } = useLanguage()

  const [tick, setTick] = useState(0)

  // TODO: create items once via useMemo with empty deps []
  // generateItems(10_000) — expensive, should run only once
  const items: Item[] = [] // Replace this line

  // ─── Variant 1: No memoization ───────────────────────────────────────────
  // TODO: measure time via performance.now(), then filter + sort + slice
  // This should recalculate on EVERY render (even when only tick changes)
  const time1 = 0 // Replace with actual measurement
  const expensiveResult: Item[] = [] // Replace with actual computation

  // ─── Variant 2: useMemo on cheap computation ──────────────────────────────
  // TODO: wrap items.length in useMemo with deps [items]
  // Measure time inside the factory
  // After "Trigger Re-render": deps [items] didn't change → cache returned
  const cheapMemo = 0 // Replace with useMemo
  const time2 = 0 // Track time of FIRST computation only

  // ─── Variant 3: useMemo on expensive computation ─────────────────────────
  // TODO: wrap the full filter + sort + slice in useMemo with deps [items]
  // Measure time inside the factory
  // After "Trigger Re-render": deps [items] didn't change → cache returned
  const expensiveMemo: Item[] = [] // Replace with useMemo
  const time3 = 0 // Track time of FIRST computation only

  return (
    <div className="exercise-container">
      <h2>{t('task.6.3')}</h2>

      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => setTick(t => t + 1)}
          style={{ padding: '8px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
        >
          Trigger Re-render #{tick}
        </button>
        <span style={{ color: '#6b7280', fontSize: 13 }}>
          Изменяет только tick, не items
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ padding: 14, borderRadius: 8, border: '1px solid #fca5a5', background: '#fafafa' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>❌ Без мемоизации</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>filter + sort(10k) каждый рендер</div>
          {/* TODO: show time1 here */}
          <div>Время: <strong>{time1} ms</strong></div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
            Топ-5: {expensiveResult.slice(0, 5).map(i => i.value).join(', ')}
          </div>
        </div>

        <div style={{ padding: 14, borderRadius: 8, border: '1px solid #fcd34d', background: '#fafafa' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>⚠️ useMemo на дешёвом</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>items.length в useMemo</div>
          {/* TODO: show time2 (first render) and "≈ 0 ms (кэш)" for subsequent */}
          <div>Первый рендер: <strong>{time2} ms</strong></div>
          <div>Результат: {cheapMemo} items</div>
        </div>

        <div style={{ padding: 14, borderRadius: 8, border: '1px solid #86efac', background: '#fafafa' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>✅ useMemo на дорогом</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>filter + sort в useMemo</div>
          {/* TODO: show time3 (first render) and "≈ 0 ms (кэш)" for subsequent */}
          <div>Первый рендер: <strong>{time3} ms</strong></div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
            Топ-5: {expensiveMemo.slice(0, 5).map(i => i.value).join(', ')}
          </div>
        </div>
      </div>

      {/* TODO: add a conclusion block explaining the results */}
    </div>
  )
}
