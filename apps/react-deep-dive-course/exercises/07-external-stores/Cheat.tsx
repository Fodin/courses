// Cheat sheet for Level 7: useSyncExternalStore and external stores

// ─── API overview ─────────────────────────────────────────────────────────────
//
// useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
//
// subscribe(callback: () => void): () => void
//   - Called once on mount (or when subscribe reference changes)
//   - Must return unsubscribe function
//   - Should be STABLE (defined outside component or via useCallback)
//
// getSnapshot(): T
//   - Called during every render to get current store value
//   - Called after each subscribe callback to check if value changed
//   - Must return STABLE reference if value hasn't changed!
//     Object.is(prev, next) === true → no re-render
//     Object.is(prev, next) === false → re-render scheduled
//
// getServerSnapshot(): T (optional)
//   - Used during SSR instead of getSnapshot
//   - Must not access browser APIs (window, navigator, localStorage)
//   - If omitted and component renders on server → hydration error

// ─── Tearing explained ────────────────────────────────────────────────────────
//
// Without useSyncExternalStore (useEffect approach):
//
//   Concurrent render starts:
//     render(ComponentA) → reads store.value = 100
//     [React yields to browser]
//     [store.value changes to 200]
//     render(ComponentB) → reads store.value = 200
//   Result: A shows 100, B shows 200 — TEARING!
//
// With useSyncExternalStore:
//
//   Concurrent render starts:
//     render(ComponentA) → getSnapshot() returns 100
//     [React yields]
//     [subscribe callback fires]
//     React: getSnapshot() now returns 200 ≠ 100
//     React CANCELS concurrent render → starts SYNCHRONOUS render
//     render(ComponentA) → 200
//     render(ComponentB) → 200
//   Result: both show 200 — consistent!

// ─── getSnapshot stability patterns ──────────────────────────────────────────
//
// ✅ Primitives — always safe:
//   const getSnapshot = () => navigator.onLine      // boolean
//   const getSnapshot = () => window.innerWidth     // number
//   const getSnapshot = () => location.pathname     // string
//
// ✅ Store state — safe if store mutates the reference on change:
//   const getSnapshot = () => store.state           // same ref until setState
//
// ❌ New object every call — INFINITE LOOP:
//   const getSnapshot = () => ({ width: window.innerWidth })  // always new!
//
// ✅ Cached object — safe:
//   let cache = { width: window.innerWidth, height: window.innerHeight }
//   const getSnapshot = () => {
//     const w = window.innerWidth, h = window.innerHeight
//     if (cache.width === w && cache.height === h) return cache  // same ref
//     return (cache = { width: w, height: h })                  // new ref only on change
//   }

// ─── subscribe stability ──────────────────────────────────────────────────────
//
// ❌ Inline subscribe — resubscribes on every render:
//   useSyncExternalStore(
//     (cb) => { window.addEventListener('resize', cb); return () => ... },  // new fn!
//     getSnapshot
//   )
//
// ✅ Module-level subscribe — stable, defined once:
//   const subscribe = (cb: () => void) => {
//     window.addEventListener('resize', cb)
//     return () => window.removeEventListener('resize', cb)
//   }
//   useSyncExternalStore(subscribe, getSnapshot)
//
// ✅ useMemo for dynamic subscribe (e.g., query changes):
//   const { subscribe, getSnapshot } = useMemo(() => {
//     const mql = window.matchMedia(query)
//     return {
//       subscribe: (cb) => { mql.addEventListener('change', cb); return () => mql.removeEventListener('change', cb) },
//       getSnapshot: () => mql.matches,
//     }
//   }, [query])

// ─── Mini store pattern ───────────────────────────────────────────────────────
//
// function createStore<T>(initialState: T) {
//   let state = initialState
//   const listeners = new Set<() => void>()
//
//   return {
//     getState: () => state,
//     setState: (next: T | ((prev: T) => T)) => {
//       const nextState = typeof next === 'function' ? next(state) : next
//       if (Object.is(state, nextState)) return    // skip if unchanged
//       state = nextState
//       listeners.forEach(l => l())                // notify all subscribers
//     },
//     subscribe: (listener: () => void) => {
//       listeners.add(listener)
//       return () => listeners.delete(listener)    // return unsubscribe
//     },
//   }
// }
//
// function useStore<T, S>(store, selector?: (s: T) => S) {
//   return useSyncExternalStore(
//     store.subscribe,
//     () => selector ? selector(store.getState()) : store.getState(),
//   )
// }

// ─── localStorage sync ────────────────────────────────────────────────────────
//
// The 'storage' event fires ONLY in OTHER tabs (not the current tab).
// To update subscribers in the current tab after setValue:
//
//   const listeners = new Set<() => void>()
//
//   const setValue = (value: string) => {
//     localStorage.setItem(key, value)
//     listeners.forEach(l => l())  // manually notify current-tab subscribers
//   }
//
//   const subscribe = (callback: () => void) => {
//     const handler = (e: StorageEvent) => { if (e.key === key) callback() }
//     window.addEventListener('storage', handler)   // other tabs
//     listeners.add(callback)                       // current tab
//     return () => {
//       window.removeEventListener('storage', handler)
//       listeners.delete(callback)
//     }
//   }

// ─── useEffect vs useSyncExternalStore ───────────────────────────────────────
//
// useEffect approach:
//   mount → render(initial) → [commit] → effect → setState → render(updated)
//   2 renders on mount
//   Race condition: value may change between mount and effect
//   No tearing protection
//
// useSyncExternalStore:
//   mount → getSnapshot() called during render → render(correct value)
//   1 render on mount
//   No race condition (reads during render, not after)
//   Tearing protection via forced sync re-render

export {}
