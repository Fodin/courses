// Cheat sheet for Level 9: Batching and flushSync

// ─── Task 9.1: Batching Explorer ─────────────────────────────────────────────
//
// Render counter pattern (accurate — runs every render):
//
//   const renderCount = useRef(0)
//   renderCount.current += 1  // in component body, NOT in useEffect
//
// React 18 batches in ALL contexts:
//
//   // Event handler — always batched (even React 17)
//   const handleEvent = () => {
//     setA(v => v + 1)
//     setB(v => v + 1)   // → 1 render total
//     setC(v => v + 1)
//   }
//
//   // setTimeout — batched in React 18 (was NOT batched in React 17)
//   const handleTimeout = () => {
//     setTimeout(() => {
//       setA(v => v + 1)
//       setB(v => v + 1)  // → 1 render in React 18, 3 renders in React 17
//       setC(v => v + 1)
//     }, 0)
//   }
//
//   // Promise.then — batched in React 18 (was NOT batched in React 17)
//   const handlePromise = () => {
//     Promise.resolve().then(() => {
//       setA(v => v + 1)
//       setB(v => v + 1)  // → 1 render in React 18, 3 renders in React 17
//       setC(v => v + 1)
//     })
//   }

// ─── Task 9.2: flushSync Demo ─────────────────────────────────────────────────
//
// import { flushSync } from 'react-dom'  ← NOT from 'react'!
//
// Problem (scroll before DOM update):
//   setMessages(prev => [...prev, newMsg])
//   listRef.current.scrollTop = listRef.current.scrollHeight
//   // scrollHeight is stale — new message not in DOM yet
//
// Solution (scroll after DOM update):
//   flushSync(() => {
//     setMessages(prev => [...prev, newMsg])
//   })
//   // flushSync forces React to apply the update synchronously
//   listRef.current.scrollTop = listRef.current.scrollHeight
//   // scrollHeight is correct — new message IS in the DOM
//
// Rule: use flushSync only when you need to read/measure the DOM
// immediately after a state update. It's rare. Do not overuse.

// ─── Task 9.3: Batching vs Cascade ───────────────────────────────────────────
//
// BATCHING (1 render):
//   const handleStart = () => {
//     setStep(1)
//     setProgress(100)    // all three batched → 1 render
//     setStatus('done')
//   }
//
// CASCADE (3+ renders):
//   const handleStart = () => { setStep(1) }   // render 1
//
//   useEffect(() => {
//     if (step === 1) setProgress(100)           // render 2
//   }, [step])
//
//   useEffect(() => {
//     if (progress === 100 && step === 1) {
//       setStatus('done')                         // render 3
//     }
//   }, [progress, step])
//
// When is cascade justified?
//   ✅ Next state depends on an async operation (fetch, animation, DOM measurement)
//   ❌ Next state can be computed synchronously from the previous one
//
// Measuring elapsed time for cascade:
//   const startTime = useRef(0)
//   // in handleStart:
//   startTime.current = performance.now()
//   setStep(1)
//   // in the final useEffect:
//   elapsed.current = (performance.now() - startTime.current).toFixed(3) + ' мс'

// ─── Batching mental model ────────────────────────────────────────────────────
//
// React 18 collects all setState calls within one "task" (microtask or
// macrotask) and flushes them in a single pass — one render, one commit.
//
// Timeline:
//   [click] → setA → setB → setC → [end of task] → render(A,B,C) → commit
//
// vs cascade:
//   [click] → setA → render(A) → commit → useEffect → setB → render(B)
//           → commit → useEffect → setC → render(C) → commit
//
// Key insight: the cascade pattern creates multiple paint opportunities
// where the UI can be in an intermediate (inconsistent) state.

export {}
