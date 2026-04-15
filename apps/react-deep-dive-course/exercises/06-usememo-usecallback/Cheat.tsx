// Cheat sheet for Level 6: useMemo and useCallback internals

// ─── Hook node structure ──────────────────────────────────────────────────────
//
// useMemo stores a tuple in memoizedState:
//   hook.memoizedState = [value, deps]
//
// useCallback stores a tuple too (the function itself, not result):
//   hook.memoizedState = [callback, deps]
//
// useCallback(fn, deps) === useMemo(() => fn, deps)

// ─── mountMemo vs updateMemo ──────────────────────────────────────────────────
//
// mountMemo (first render):
//   const value = factory()                // always calls factory
//   hook.memoizedState = [value, deps]
//   return value
//
// updateMemo (re-renders):
//   const [prevValue, prevDeps] = hook.memoizedState
//   if (areHookInputsEqual(nextDeps, prevDeps)) return prevValue  // cache hit
//   const nextValue = factory()            // cache miss — recalculate
//   hook.memoizedState = [nextValue, nextDeps]
//   return nextValue

// ─── areHookInputsEqual ───────────────────────────────────────────────────────
//
// for (let i = 0; i < deps.length; i++) {
//   if (!Object.is(nextDeps[i], prevDeps[i])) return false
// }
// return true
//
// Uses Object.is, not ===:
//   Object.is(NaN, NaN) === true   ← stable, won't recalculate
//   Object.is(+0, -0) === false    ← rare edge case

// ─── YMNAE: useMemo vs useEffect for derived state ───────────────────────────
//
// ❌ 2 renders — antipattern:
// const [visible, setVisible] = useState(items)
// useEffect(() => { setVisible(items.filter(isActive)) }, [items])
//   Render 1: items changed → Effect runs → setState(visible)
//   Render 2: visible updated
//
// ✅ 1 render:
// const visible = useMemo(() => items.filter(isActive), [items])
//   Computed during render → no extra render

// ─── Referential equality + React.memo ───────────────────────────────────────
//
// React.memo(Child) uses shallowEqual on props → Object.is per prop value
//
// ❌ Breaks React.memo:
// <Child style={{ color: 'red' }} onClick={() => doSomething()} />
//   Every render → new object, new function → Object.is → false → re-render
//
// ✅ Fixes React.memo:
// const style = useMemo(() => ({ color: 'red' }), [])
// const handleClick = useCallback(() => doSomething(), [])
// <Child style={style} onClick={handleClick} />
//   Same reference → Object.is → true → bail out (no re-render)

// ─── When NOT to memoize ──────────────────────────────────────────────────────
//
// ❌ Primitive computation:
//   const count = useMemo(() => items.length, [items])
//   → overhead of deps comparison > O(1) .length
//
// ❌ useState setter (already stable):
//   const stableSet = useCallback(setValue, [setValue])  // pointless
//
// ❌ Child without React.memo:
//   useCallback(onClick, []) // stabilizes reference, but Child re-renders anyway
//
// ✅ Expensive computation (sort, filter, transform 1000+ items):
//   const sorted = useMemo(() => bigArray.sort(compareFn), [bigArray])
//
// ✅ Object/function as prop for React.memo child:
//   const config = useMemo(() => ({ ...defaults, ...overrides }), [overrides])
//
// ✅ Object/function as dep in useEffect:
//   const query = useMemo(() => ({ page, search }), [page, search])
//   useEffect(() => { fetch(query) }, [query])  // stable reference → no infinite loop

// ─── Measure before memoizing ────────────────────────────────────────────────
//
// console.time('computation')
// const result = expensiveComputation()
// console.timeEnd('computation')
//
// Rule of thumb:
//   < 0.1 ms → don't memoize
//   0.1–1 ms → consider context (how often does this component re-render?)
//   > 1 ms   → memoize

// ─── Context value — common mistake ──────────────────────────────────────────
//
// ❌ All consumers re-render on every Provider render:
// <Ctx.Provider value={{ user, setUser }}>
//
// ✅ Consumers only re-render when user or setUser changes:
// const value = useMemo(() => ({ user, setUser }), [user, setUser])
// <Ctx.Provider value={value}>

export {}
