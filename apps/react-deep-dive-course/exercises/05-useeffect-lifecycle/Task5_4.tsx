import { useState, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// Task 5.4: Race Condition Fix (You Might Not Need an Effect)
// A search component with a simulated API that has random delays.
// When the user types quickly, responses arrive out of order — race condition!
//
// Build THREE variants:
//   1. Bug variant — no cleanup, shows stale results
//   2. ignore flag fix — cleanup sets ignore = true
//   3. AbortController fix — cleanup calls controller.abort()

// ─── Shared mock data & API ───────────────────────────────────────────────────

const MOCK_FRUITS = [
  'Apple', 'Apricot', 'Avocado', 'Banana', 'Blueberry', 'Blackberry',
  'Cherry', 'Coconut', 'Cranberry', 'Dragon fruit', 'Elderberry', 'Fig',
  'Grape', 'Guava', 'Kiwi', 'Lemon', 'Lime', 'Lychee', 'Mango', 'Melon',
  'Orange', 'Papaya', 'Peach', 'Pear', 'Pineapple', 'Plum', 'Pomegranate',
  'Raspberry', 'Strawberry', 'Tangerine', 'Watermelon',
]

// Simulated fetch with random delay (200–1700ms) and AbortController support
// signal.abort() → throws DOMException('Aborted', 'AbortError')
async function fakeFetch(
  query: string,
  options?: { signal?: AbortSignal }
): Promise<string[]> {
  const delay = Math.random() * 1400 + 300
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, delay)
    if (options?.signal) {
      options.signal.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
      })
    }
  })
  if (options?.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
  return MOCK_FRUITS.filter(f => f.toLowerCase().includes(query.toLowerCase()))
}

// ─── Log entry type ───────────────────────────────────────────────────────────

type FetchLog = {
  id: number
  query: string
  status: 'done' | 'ignored' | 'aborted'
  delay: number
}

let reqId = 0

// ─── Variant 1: Bug — Race Condition (TODO: implement) ────────────────────────

function RaceBugSearch() {
  // TODO: query, results, loading state
  // TODO: log state (FetchLog[])
  // TODO: lastResultQuery state (to detect mismatch)

  // TODO: useEffect watching [query]
  //   - call fakeFetch(query)
  //   - on resolve: setResults, setLoading, setLastResultQuery, push to log
  //   - NO cleanup — that's the bug!

  // TODO: detect hasMismatch: lastResultQuery !== query && results.length > 0

  return (
    <SearchColumn
      title="Баг: Race Condition"
      titleColor="#ef4444"
      query={''}        // TODO: pass real query
      results={[]}      // TODO: pass real results
      loading={false}   // TODO: pass real loading
      log={[]}          // TODO: pass real log
      hasMismatch={false}
      lastResultQuery={''}
      onQueryChange={() => {}}
      onClearLog={() => {}}
    />
  )
}

// ─── Variant 2: Fix — ignore flag (TODO: implement) ──────────────────────────

function IgnoreFlagSearch() {
  // TODO: same state as Variant 1 (no lastResultQuery needed)

  // TODO: useEffect watching [query]
  //   let ignore = false
  //   call fakeFetch(query)
  //   on resolve: if (!ignore) { setResults, setLoading, push 'done' to log }
  //               else push 'ignored' to log
  //   return () => { ignore = true }

  return (
    <SearchColumn
      title="Фикс: ignore flag"
      titleColor="#10b981"
      query={''}
      results={[]}
      loading={false}
      log={[]}
      hasMismatch={false}
      lastResultQuery={''}
      onQueryChange={() => {}}
      onClearLog={() => {}}
    />
  )
}

// ─── Variant 3: Fix — AbortController (TODO: implement) ──────────────────────

function AbortSearch() {
  // TODO: same state as Variant 2

  // TODO: useEffect watching [query]
  //   const controller = new AbortController()
  //   call fakeFetch(query, { signal: controller.signal })
  //   on resolve: setResults, setLoading, push 'done' to log
  //   on catch (AbortError): push 'aborted' to log
  //   return () => controller.abort()

  return (
    <SearchColumn
      title="Фикс: AbortController"
      titleColor="#3b82f6"
      query={''}
      results={[]}
      loading={false}
      log={[]}
      hasMismatch={false}
      lastResultQuery={''}
      onQueryChange={() => {}}
      onClearLog={() => {}}
    />
  )
}

// ─── Shared SearchColumn UI (already implemented — use as-is) ─────────────────

const STATUS_COLORS: Record<FetchLog['status'], string> = {
  done: '#10b981',
  ignored: '#f59e0b',
  aborted: '#ef4444',
}

const STATUS_LABELS: Record<FetchLog['status'], string> = {
  done: 'готово',
  ignored: 'проигнорирован',
  aborted: 'отменён',
}

type SearchColumnProps = {
  title: string
  titleColor: string
  query: string
  results: string[]
  loading: boolean
  log: FetchLog[]
  hasMismatch: boolean
  lastResultQuery: string
  onQueryChange: (q: string) => void
  onClearLog: () => void
}

function SearchColumn({
  title,
  titleColor,
  query,
  results,
  loading,
  log,
  hasMismatch,
  lastResultQuery,
  onQueryChange,
  onClearLog,
}: SearchColumnProps) {
  return (
    <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ fontWeight: 700, color: titleColor, fontSize: '14px' }}>{title}</div>

      <input
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        placeholder="Поиск фрукта..."
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: `1px solid ${titleColor}66`,
          background: '#1f2937',
          color: '#e5e7eb',
          fontSize: '14px',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />

      {hasMismatch && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            background: '#1a0f0f',
            border: '1px solid #ef4444',
            fontSize: '12px',
            color: '#f87171',
          }}
        >
          Race condition! Показано для "{lastResultQuery}", в поле "{query}"
        </div>
      )}

      <div
        style={{
          minHeight: '120px',
          padding: '10px',
          borderRadius: '6px',
          background: '#111827',
          border: '1px solid #1f2937',
        }}
      >
        {loading ? (
          <div style={{ color: '#4b5563', fontSize: '13px' }}>Загрузка...</div>
        ) : results.length === 0 ? (
          <div style={{ color: '#374151', fontSize: '13px' }}>
            {query ? 'Ничего не найдено' : 'Введите запрос'}
          </div>
        ) : (
          results.slice(0, 8).map(r => (
            <div key={r} style={{ fontSize: '13px', color: '#e5e7eb', padding: '2px 0' }}>{r}</div>
          ))
        )}
      </div>

      <div style={{ borderRadius: '6px', background: '#0f172a', border: '1px solid #1f2937', overflow: 'hidden' }}>
        <div
          style={{
            padding: '6px 10px',
            background: '#1f2937',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '11px', color: '#6b7280' }}>Лог запросов</span>
          <button
            onClick={onClearLog}
            style={{ fontSize: '10px', color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            очистить
          </button>
        </div>
        <div style={{ maxHeight: '140px', overflowY: 'auto', padding: '6px 10px' }}>
          {log.length === 0 ? (
            <div style={{ fontSize: '11px', color: '#374151' }}>пусто</div>
          ) : (
            log.slice().reverse().map((entry, i) => (
              <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px', fontSize: '11px' }}>
                <span style={{ color: STATUS_COLORS[entry.status], minWidth: '80px' }}>
                  {STATUS_LABELS[entry.status]}
                </span>
                <span style={{ color: '#6b7280' }}>"{entry.query}"</span>
                <span style={{ color: '#374151', marginLeft: 'auto' }}>{Math.round(entry.delay)}ms</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function Task5_4() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.5.4')}</h2>

      <div
        style={{
          padding: '12px 16px',
          borderRadius: '8px',
          background: '#1e3a5f',
          border: '1px solid #1d4ed8',
          marginBottom: '20px',
          fontSize: '13px',
          color: '#93c5fd',
          lineHeight: 1.5,
        }}
      >
        Реализуй три варианта компонента поиска. Набери быстро несколько букв —
        в колонке "Баг" могут появиться устаревшие результаты. Колонки с фиксами должны
        всегда показывать актуальные результаты.
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <RaceBugSearch />
        <IgnoreFlagSearch />
        <AbortSearch />
      </div>
    </div>
  )
}
