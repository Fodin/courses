// Cheat sheet for Level 8: Custom Hooks — Patterns and Antipatterns

// ─── useDebounce ──────────────────────────────────────────────────────────────
//
// function useDebounce<T>(value: T, delay: number): T {
//   const [debounced, setDebounced] = useState(value)
//
//   useEffect(() => {
//     const timer = setTimeout(() => setDebounced(value), delay)
//     return () => clearTimeout(timer)  // CRITICAL: cancel previous timer
//   }, [value, delay])
//
//   return debounced
// }
//
// Without cleanup: every keystroke creates a timer that fires → setState N times.
// With cleanup: each new effect cancels the previous timer → setState once after pause.

// ─── usePrevious ─────────────────────────────────────────────────────────────
//
// function usePrevious<T>(value: T): T | undefined {
//   const ref = useRef<T>()
//
//   useEffect(() => {
//     ref.current = value
//   })  // NO deps array: runs after every render
//
//   return ref.current  // returns value from PREVIOUS render
// }
//
// Timeline:
//   Render 1 (value=0): ref.current=undefined → returns undefined; [commit] effect: ref=0
//   Render 2 (value=1): ref.current=0 → returns 0; [commit] effect: ref=1
//
// Why useRef not useState?
//   - useRef mutation does not trigger a re-render
//   - useState would cause an extra render on every update

// ─── useLatestCallback (closure trap solution) ────────────────────────────────
//
// function useLatestCallback<T extends Function>(callback: T): T {
//   const ref = useRef<T>(callback)
//
//   useEffect(() => {
//     ref.current = callback  // always up-to-date, no deps
//   })
//
//   return useCallback((...args) => ref.current(...args), []) as T
//   //                                                    ^^ stable ref!
// }
//
// Usage with setInterval:
//   const tick = useLatestCallback(() => {
//     console.log(count)  // always sees current count, not closure value
//   })
//   useEffect(() => {
//     const id = setInterval(tick, 1000)  // tick is stable, interval created once
//     return () => clearInterval(id)
//   }, [tick])
//
// This is the pattern behind React RFC: useEffectEvent

// ─── Hook Composition: layered hooks ─────────────────────────────────────────
//
// useDataTable(data, fields, pageSize)
//   ├── useFilter(data, fields)   → filtered (useMemo, case-insensitive)
//   ├── useSort(filtered, key)    → sorted   (useMemo, [...data].sort())
//   └── usePagination(total, ps)  → page, totalPages, next, prev, reset
//
// Key: useEffect to reset pagination when query changes:
//   useEffect(() => { pagination.reset() }, [query])
//
// Order matters: filter FIRST, then sort, then paginate.
// If you sort before filter, filtered results won't respect pagination correctly.

// ─── YMNAE: 4 antipatterns summary ───────────────────────────────────────────
//
// 1. Notifying parent from Effect
//    ❌ useEffect(() => { onChange(value) }, [value, onChange])
//    ✅ const toggle = () => { setValue(v => !v); onChange(!value) }
//
// 2. Effect chain (A→B→C via effects)
//    ❌ useEffect(() => setB(transform(a)), [a])
//       useEffect(() => setC(validate(b)), [b])
//    ✅ const b = transform(a)   // compute during render
//       const c = validate(b)
//
// 3. Manual subscription via useEffect
//    ❌ useEffect(() => { window.addEventListener('scroll', cb); return () => ... }, [])
//    ✅ useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
//
// 4. Redundant state (derived data in useState)
//    ❌ const [filtered, setFiltered] = useState(items)
//       useEffect(() => setFiltered(items.filter(fn)), [items, query])
//    ✅ const filtered = useMemo(() => items.filter(fn), [items, query])

// ─── Hook design checklist ────────────────────────────────────────────────────
//
// ✅ Single responsibility (one job per hook)
// ✅ Explicit params (no hidden context dependencies)
// ✅ Encapsulated interface (no raw setState returned)
// ✅ Correct cleanup in all useEffects
// ✅ useMemo for derived data (not useState+useEffect)
// ✅ Browser events via useSyncExternalStore, not useEffect+setState
// ✅ Notify parent in event handlers, not Effects
//
// ❌ God hook (does too many things)
// ❌ Hidden context dependency
// ❌ Leaked setState
// ❌ Missing clearTimeout/clearInterval/removeEventListener
// ❌ Effect chain for derived state
// ❌ useRef+forceUpdate instead of useState (reimplementing primitives)

export {}
