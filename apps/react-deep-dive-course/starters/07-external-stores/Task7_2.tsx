import { useRef, useSyncExternalStore, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// Task 7.2: Build a Mini Store
//
// Implement createStore(initialState) and useStore(store, selector?) from scratch.
// Then use them in a counter app with two independent subscribers:
//   - Counter: shows count, has Increment button
//   - DoubleCounter: shows count * 2, read-only
//
// Both should re-render exactly ONCE per state change (verify via render counters).

// ─── Type definitions ────────────────────────────────────────────────────────

type Listener = () => void

type Store<T> = {
  getState: () => T
  setState: (next: T | ((prev: T) => T)) => void
  subscribe: (listener: Listener) => () => void
}

// ─── TODO: implement createStore ─────────────────────────────────────────────
//
// createStore<T>(initialState: T): Store<T>
//
// Requirements:
//   - Store current state in a local variable
//   - Keep listeners in a Set<Listener>
//   - getState(): return current state
//   - setState(next): if next is function → call it with current state
//                     use Object.is to check if state actually changed
//                     if changed → update state, notify all listeners
//   - subscribe(listener): add listener to Set, return () => Set.delete(listener)

function createStore<T>(initialState: T): Store<T> {
  // TODO: implement
  let _state = initialState
  void _state // remove this line when implementing

  return {
    getState: () => {
      // TODO
      return initialState
    },
    setState: (_next) => {
      // TODO
    },
    subscribe: (_listener) => {
      // TODO
      return () => {}
    },
  }
}

// ─── TODO: implement useStore ─────────────────────────────────────────────────
//
// useStore<T, S>(store: Store<T>, selector?: (state: T) => S): S
//
// Requirements:
//   - Use useSyncExternalStore inside
//   - If selector is provided → return selector(store.getState())
//   - If no selector → return entire state
//   - getSnapshot must be stable (useCallback or define outside component)

function useStore<T, S = T>(
  _store: Store<T>,
  _selector?: (state: T) => S
): S {
  // TODO: implement using useSyncExternalStore
  // Hint:
  //   return useSyncExternalStore(
  //     store.subscribe,
  //     () => selector ? selector(store.getState()) : store.getState() as unknown as S,
  //   )
  return undefined as unknown as S
}

// ─── Global store ─────────────────────────────────────────────────────────────

const counterStore = createStore({ count: 0 })

// ─── Subscriber components ────────────────────────────────────────────────────

function CounterSubscriber() {
  const renderCount = useRef(0)
  renderCount.current += 1

  // TODO: use useStore to read only count (selector: s => s.count)
  const count = 0 // Replace with useStore call

  return (
    <div style={{
      padding: 14,
      borderRadius: 8,
      border: '2px solid #bae6fd',
      background: '#f0f9ff',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: '#0369a1' }}>
        Counter
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, color: '#0284c7', marginBottom: 12 }}>
        {count}
      </div>
      <button
        onClick={() => counterStore.setState(s => ({ count: s.count + 1 }))}
        style={{
          padding: '8px 20px',
          background: '#0284c7',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Increment
      </button>
      <div style={{ marginTop: 10, fontSize: 12, color: '#6b7280' }}>
        Рендеров: <strong style={{ color: '#0369a1' }}>{renderCount.current}</strong>
        <span style={{ marginLeft: 8, color: '#9ca3af' }}>
          (должно быть N, не N*2)
        </span>
      </div>
    </div>
  )
}

function DoubleCounterSubscriber() {
  const renderCount = useRef(0)
  renderCount.current += 1

  // TODO: use useStore to read count * 2 (selector: s => s.count * 2)
  const doubled = 0 // Replace with useStore call

  return (
    <div style={{
      padding: 14,
      borderRadius: 8,
      border: '2px solid #d8b4fe',
      background: '#faf5ff',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: '#7c3aed' }}>
        DoubleCounter (count * 2)
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, color: '#7c3aed', marginBottom: 12 }}>
        {doubled}
      </div>
      <div style={{ fontSize: 13, color: '#6b7280' }}>
        Только читает store, кнопки нет
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: '#6b7280' }}>
        Рендеров: <strong style={{ color: '#7c3aed' }}>{renderCount.current}</strong>
        <span style={{ marginLeft: 8, color: '#9ca3af' }}>
          (должно совпадать с Counter)
        </span>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function Task7_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.7.2')}</h2>

      <div style={{
        marginBottom: 16,
        padding: '10px 14px',
        background: '#fffbeb',
        borderRadius: 8,
        border: '1px solid #fcd34d',
        fontSize: 13,
        color: '#92400e',
      }}>
        Реализуй createStore и useStore, затем подключи компоненты к counterStore.
        Нажимай Increment — оба компонента должны обновляться синхронно,
        каждый по 1 рендеру.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <CounterSubscriber />
        <DoubleCounterSubscriber />
      </div>

      {/* TODO: самопроверка:
          1. При первом рендере оба компонента показывают count=0, doubled=0
          2. После нажатия Increment: count=1, doubled=2, каждый сделал ровно 1 рендер
          3. Вызов counterStore.setState(s => ({ count: s.count })) не должен вызывать ре-рендер
             (Object.is — значения те же, listeners не уведомляются)
      */}
    </div>
  )
}
