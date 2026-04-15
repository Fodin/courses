// Cheat sheet for Level 5: useEffect Lifecycle & Pitfalls

// ─── Effect execution timeline ────────────────────────────────────────────────
//
//   render() → commit (DOM mutations) → useLayoutEffect → browser paint → useEffect
//
// Cleanup order on re-render:
//   useLayoutEffect cleanup (N) → useLayoutEffect callback (N+1)
//   useEffect cleanup (N)       → useEffect callback (N+1)

// ─── Dependency array ────────────────────────────────────────────────────────
//
// No deps:    runs after every render
// []:         runs only after mount (cleanup on unmount)
// [a, b]:     runs when a or b changes (compared via Object.is)
//
// Object.is edge cases:
//   Object.is(NaN, NaN) === true   (unlike ===)
//   Object.is(+0, -0) === false    (unlike ===)
//
// Objects/functions are NEW every render — {} !== {} via Object.is!
//   → stabilize with useMemo / useCallback / move outside component

// ─── Golden Rule (You Might Not Need an Effect) ───────────────────────────────
//
// "Because the component is shown"   → useEffect
// "Because the user did something"   → Event Handler
//
// Use Effect for:
//   ✅ Subscriptions (WebSocket, EventSource, addEventListener)
//   ✅ Timers (setInterval, setTimeout) that persist across renders
//   ✅ DOM measurements after render (or use useLayoutEffect)
//   ✅ Analytics on page view / mount
//   ✅ Data fetching (with cleanup for race conditions)
//
// Do NOT use Effect for:
//   ❌ POST requests triggered by user action → Event Handler
//   ❌ Notifying parent → call onChange in the event handler
//   ❌ Derived state (computed from props/state) → compute during render
//   ❌ Effect chains (A → setB → setC → setD) → single event handler

// ─── Effect Chains — problem & fix ───────────────────────────────────────────
//
// ❌ 4 renders instead of 1:
// useEffect(() => { setB(fn(a)) }, [a])
// useEffect(() => { setC(fn(b)) }, [b])
// useEffect(() => { setD(fn(c)) }, [c])
//
// ✅ 1 render:
// function handleAction(newA) {
//   const newB = fn(newA)
//   const newC = fn(newB)
//   setA(newA); setB(newB); setC(newC)  // React 18: all batched → 1 render
// }

// ─── Race Condition — fix via ignore flag ────────────────────────────────────
//
// useEffect(() => {
//   let ignore = false
//   fetch(`/api/search?q=${query}`)
//     .then(r => r.json())
//     .then(data => { if (!ignore) setResults(data) })
//   return () => { ignore = true }
// }, [query])

// ─── Race Condition — fix via AbortController ────────────────────────────────
//
// useEffect(() => {
//   const controller = new AbortController()
//   fetch(`/api/search?q=${query}`, { signal: controller.signal })
//     .then(r => r.json())
//     .then(data => setResults(data))
//     .catch(err => { if (err.name !== 'AbortError') setError(err) })
//   return () => controller.abort()
// }, [query])

// ─── Notify parent — Event Handler, not Effect ───────────────────────────────
//
// ❌ Two renders + unstable deps risk:
// useEffect(() => { onChange(internalState) }, [internalState, onChange])
//
// ✅ One render:
// function handleClick() {
//   const next = !isOn
//   setIsOn(next)
//   onChange(next)  // synchronous, same event
// }

// ─── StrictMode double-invoke ────────────────────────────────────────────────
//
// In development, React intentionally runs: mount → cleanup → mount
// This verifies that your cleanup is idempotent.
// If double-invoke breaks your component — fix the cleanup!
//
// ✅ Idempotent:
// useEffect(() => {
//   const ws = connect(url)
//   return () => ws.disconnect()  // cleanup fully undoes the effect
// }, [url])

export {}
