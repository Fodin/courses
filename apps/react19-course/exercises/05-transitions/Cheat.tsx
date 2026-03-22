// ============================================
// Level 5: useTransition & Suspense — Hints
// ============================================

// Task 5.1: useTransition + isPending
// ------------------------------------
// 1. const [isPending, startTransition] = useTransition()
// 2. Wrap state updates in startTransition(() => setState(newValue))
// 3. isPending is true while the transition is processing
// 4. Use isPending to show a loading indicator (opacity, spinner, etc.)
// 5. The old UI remains interactive while the new content renders
// 6. Great for tab switching with heavy content

// Task 5.2: Async Transitions (React 19)
// ----------------------------------------
// 1. In React 19, startTransition accepts async functions
// 2. startTransition(async () => { const data = await fetch(...); setState(data) })
// 3. isPending stays true until the async function completes
// 4. No need for separate loading state — isPending covers it
// 5. Error boundaries catch errors thrown in async transitions

// Task 5.3: Suspense with Navigation
// ------------------------------------
// 1. Use React.lazy() to code-split page components
// 2. Wrap the page content in <Suspense fallback={<Loading />}>
// 3. Use useTransition when changing the active page
// 4. startTransition(() => setCurrentPage('about'))
// 5. The old page stays visible (with isPending styling) until the new one loads
// 6. Suspense fallback shows only on first load, not during transitions

// Task 5.4: useDeferredValue initialValue (React 19)
// ----------------------------------------------------
// 1. New in React 19: useDeferredValue accepts a second argument — initialValue
// 2. const deferredQuery = useDeferredValue(query, '')
// 3. On initial render, deferredQuery is '' (the initialValue)
// 4. Then React immediately schedules a re-render with the actual value
// 5. Useful for showing a placeholder/empty state before results
// 6. Compare: isStale = deferredQuery !== query (to show loading indicator)

export {}
