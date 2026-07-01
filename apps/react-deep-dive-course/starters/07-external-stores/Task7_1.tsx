import { useState, useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { useLanguage } from 'src/hooks'

// Task 7.1: Manual Subscription → useSyncExternalStore
//
// The component below uses the "antipattern" approach: useMediaQueryV1
// subscribes to window.matchMedia via useEffect + setState.
// Problems:
//   1. Extra render on mount (useEffect fires after render → setState → second render)
//   2. Tearing risk in Concurrent Mode
//   3. No SSR support (window.matchMedia throws on server)
//
// Your task: implement useMediaQueryV2(query) using useSyncExternalStore.
// Then render both side-by-side with a render counter to prove the difference.

// ─── V1: useEffect + useState (given — do not change) ──────────────────────

function useMediaQueryV1(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

// ─── V2: useSyncExternalStore (TODO) ───────────────────────────────────────

// TODO: implement useMediaQueryV2(query: string): boolean
//
// Steps:
//   1. Use useMemo to create { subscribe, getSnapshot } for the given query
//      - subscribe(callback): calls mql.addEventListener('change', callback)
//                             returns () => mql.removeEventListener('change', callback)
//      - getSnapshot(): returns mql.matches (boolean — safe, no infinite loop)
//   2. Call useSyncExternalStore(subscribe, getSnapshot, () => false)
//      The third arg is getServerSnapshot — returns false for SSR
//   3. When query changes, useMemo recreates subscribe/getSnapshot → React resubscribes

function useMediaQueryV2(_query: string): boolean {
  // TODO: implement this hook
  return false
}

// ─── Demo Components ────────────────────────────────────────────────────────

function MediaQueryV1Demo({ query }: { query: string }) {
  const renderCount = useRef(0)
  renderCount.current += 1
  const matches = useMediaQueryV1(query)

  return (
    <div style={{
      padding: 14,
      borderRadius: 8,
      border: '2px solid #fca5a5',
      background: '#fff5f5',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: '#dc2626' }}>
        V1: useEffect + useState (антипаттерн)
      </div>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 10 }}>
        Наблюдай: при mount рендерится ДВАЖДЫ (видно по счётчику)
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: 12, height: 12, borderRadius: '50%',
          background: matches ? '#16a34a' : '#9ca3af',
        }} />
        <span>
          {query}: <strong>{String(matches)}</strong>
        </span>
        <span style={{
          marginLeft: 'auto',
          fontSize: 13,
          fontWeight: 600,
          color: '#dc2626',
        }}>
          Рендеров: {renderCount.current}
        </span>
      </div>
    </div>
  )
}

function MediaQueryV2Demo({ query }: { query: string }) {
  const renderCount = useRef(0)
  renderCount.current += 1
  const matches = useMediaQueryV2(query)

  return (
    <div style={{
      padding: 14,
      borderRadius: 8,
      border: '2px solid #86efac',
      background: '#f0fdf4',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: '#15803d' }}>
        V2: useSyncExternalStore (твоя реализация)
      </div>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 10 }}>
        Цель: при mount — ОДИН рендер. Проверяй счётчик!
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          width: 12, height: 12, borderRadius: '50%',
          background: matches ? '#16a34a' : '#9ca3af',
        }} />
        <span>
          {query}: <strong>{String(matches)}</strong>
        </span>
        <span style={{
          marginLeft: 'auto',
          fontSize: 13,
          fontWeight: 600,
          color: '#15803d',
        }}>
          Рендеров: {renderCount.current}
        </span>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function Task7_1() {
  const { t } = useLanguage()
  const [query, setQuery] = useState('(max-width: 768px)')

  const queries = [
    '(max-width: 768px)',
    '(prefers-color-scheme: dark)',
    '(min-width: 1024px)',
  ]

  return (
    <div className="exercise-container">
      <h2>{t('task.7.1')}</h2>

      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Выбери медиа-запрос:</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {queries.map(q => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                background: query === q ? '#3b82f6' : 'white',
                color: query === q ? 'white' : '#374151',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'monospace',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        <MediaQueryV1Demo query={query} />
        <MediaQueryV2Demo query={query} />
      </div>

      {/* TODO: после реализации useMediaQueryV2 проверь:
          1. При первом рендере V2 должен показывать Рендеров: 1 (не 2!)
          2. При смене query оба обновляются
          3. При изменении viewport (DevTools → мобильная эмуляция) оба показывают одно значение
      */}
    </div>
  )
}
