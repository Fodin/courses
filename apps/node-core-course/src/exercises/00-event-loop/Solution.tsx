import { useState } from 'react'

// ============================================
// Задание 0.1: Event Loop Phases — Решение
// ============================================

export function Task0_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Event Loop Phases in Node.js ===')
    log.push('')
    log.push('Node.js Event Loop has 6 phases (libuv):')
    log.push('  1. Timers        — executes setTimeout/setInterval callbacks')
    log.push('  2. Pending I/O   — executes I/O callbacks deferred to next iteration')
    log.push('  3. Idle/Prepare  — internal use only')
    log.push('  4. Poll          — retrieves new I/O events, executes I/O callbacks')
    log.push('  5. Check         — executes setImmediate() callbacks')
    log.push('  6. Close         — executes close event callbacks (e.g. socket.on("close"))')
    log.push('')
    log.push('Between each phase: microtask queues are drained')
    log.push('  - process.nextTick queue (highest priority)')
    log.push('  - Promise microtask queue')
    log.push('')
    log.push('=== Code Example ===')
    log.push('setTimeout(() => console.log("timeout"), 0)')
    log.push('setImmediate(() => console.log("immediate"))')
    log.push('process.nextTick(() => console.log("nextTick"))')
    log.push('Promise.resolve().then(() => console.log("promise"))')
    log.push('console.log("sync")')
    log.push('')
    log.push('=== Execution Order ===')
    log.push('1. "sync"       — synchronous code runs first')
    log.push('2. "nextTick"   — nextTick queue drained before any phase')
    log.push('3. "promise"    — Promise microtasks drained after nextTick')
    log.push('4. "timeout"    — Timers phase (setTimeout with 0ms)')
    log.push('5. "immediate"  — Check phase (setImmediate)')
    log.push('')
    log.push('⚠️ Note: setTimeout(fn, 0) vs setImmediate order is')
    log.push('   NON-DETERMINISTIC when called from main module.')
    log.push('   Inside an I/O callback, setImmediate always fires first.')
    log.push('')
    log.push('=== Inside I/O callback ===')
    log.push('fs.readFile("file.txt", () => {')
    log.push('  setTimeout(() => console.log("timeout"), 0)')
    log.push('  setImmediate(() => console.log("immediate"))')
    log.push('})')
    log.push('// Always: "immediate" then "timeout"')
    log.push('// Because: after Poll phase, Check phase runs next')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.1: Event Loop Phases</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 0.2: Microtasks vs Macrotasks — Решение
// ============================================

export function Task0_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Microtasks vs Macrotasks ===')
    log.push('')
    log.push('📌 Macrotasks (Task Queue):')
    log.push('  - setTimeout / setInterval')
    log.push('  - setImmediate (Node.js)')
    log.push('  - I/O operations')
    log.push('  - UI rendering (browser)')
    log.push('')
    log.push('📌 Microtasks (Microtask Queue):')
    log.push('  - Promise.then / catch / finally')
    log.push('  - process.nextTick (Node.js — own queue, higher priority)')
    log.push('  - queueMicrotask()')
    log.push('  - MutationObserver (browser)')
    log.push('')
    log.push('🔥 KEY RULE: After each macrotask, ALL microtasks are drained')
    log.push('   before the next macrotask executes.')
    log.push('')
    log.push('=== Example 1: Basic Priority ===')
    log.push('console.log("1")')
    log.push('setTimeout(() => console.log("2"), 0)')
    log.push('Promise.resolve().then(() => console.log("3"))')
    log.push('console.log("4")')
    log.push('')
    log.push('Output: 1, 4, 3, 2')
    log.push('  "1" — sync')
    log.push('  "4" — sync')
    log.push('  "3" — microtask (Promise) runs before macrotask')
    log.push('  "2" — macrotask (setTimeout)')
    log.push('')
    log.push('=== Example 2: Nested Microtasks ===')
    log.push('setTimeout(() => console.log("timeout1"), 0)')
    log.push('Promise.resolve()')
    log.push('  .then(() => {')
    log.push('    console.log("promise1")')
    log.push('    return Promise.resolve()')
    log.push('  })')
    log.push('  .then(() => console.log("promise2"))')
    log.push('setTimeout(() => console.log("timeout2"), 0)')
    log.push('')
    log.push('Output: promise1, promise2, timeout1, timeout2')
    log.push('  All chained promises resolve before any setTimeout.')

    // Actually demonstrate with real microtasks in the browser
    const actualLog: string[] = [...log]
    actualLog.push('')
    actualLog.push('=== Live Browser Demo ===')

    const order: string[] = []
    const p = Promise.resolve()

    setTimeout(() => {
      order.push('macro: setTimeout')
    }, 0)

    p.then(() => {
      order.push('micro: Promise.then')
    })

    queueMicrotask(() => {
      order.push('micro: queueMicrotask')
    })

    order.push('sync: inline code')

    // Use setTimeout to show results after all tasks complete
    setTimeout(() => {
      actualLog.push('Actual execution order:')
      order.forEach((item, idx) => {
        actualLog.push(`  ${idx + 1}. ${item}`)
      })
      setResults([...actualLog])
    }, 50)

    setResults(actualLog)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.2: Microtasks vs Macrotasks</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 0.3: nextTick Starvation — Решение
// ============================================

export function Task0_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== process.nextTick Starvation ===')
    log.push('')
    log.push('process.nextTick callbacks run BEFORE any I/O or timers.')
    log.push('If nextTick recursively schedules itself, it "starves" the event loop.')
    log.push('')
    log.push('=== Starvation Example (DANGEROUS) ===')
    log.push('function starve() {')
    log.push('  process.nextTick(starve) // infinite recursion in microtask queue')
    log.push('}')
    log.push('starve()')
    log.push('setTimeout(() => console.log("never reached"), 0)')
    log.push('')
    log.push('Result: setTimeout callback NEVER fires!')
    log.push('  The event loop never advances past the nextTick queue.')
    log.push('')
    log.push('=== Why It Happens ===')
    log.push('Event Loop iteration:')
    log.push('  1. Drain nextTick queue → but it keeps growing!')
    log.push('  2. Drain Promise queue → never reached')
    log.push('  3. Timers phase → never reached')
    log.push('  4. Poll phase → never reached (I/O starved)')
    log.push('')
    log.push('=== Fix: Use setImmediate Instead ===')
    log.push('function noStarve() {')
    log.push('  setImmediate(noStarve) // scheduled in Check phase')
    log.push('}')
    log.push('noStarve()')
    log.push('setTimeout(() => console.log("I can run!"), 100)')
    log.push('')
    log.push('Result: setTimeout fires normally!')
    log.push('  setImmediate runs once per event loop iteration,')
    log.push('  allowing other phases (Timers, Poll) to execute.')
    log.push('')
    log.push('=== Simulation: Limited nextTick Depth ===')

    // Simulate limited nextTick behavior
    let nextTickCount = 0
    let immediateCount = 0
    const maxIterations = 5

    // Simulate nextTick starvation (limited)
    log.push('')
    log.push('Simulating 5 recursive nextTick calls:')
    for (let i = 0; i < maxIterations; i++) {
      nextTickCount++
      log.push(`  nextTick #${nextTickCount} executed — I/O blocked`)
    }
    log.push('  ...setTimeout still waiting...')
    log.push('  ...I/O callbacks still waiting...')
    log.push('')
    log.push('Simulating 5 recursive setImmediate calls:')
    for (let i = 0; i < maxIterations; i++) {
      immediateCount++
      log.push(`  setImmediate #${immediateCount} executed — other phases can run between each`)
    }
    log.push('  setTimeout and I/O can fire between iterations!')
    log.push('')
    log.push('=== Best Practice ===')
    log.push('✅ Use setImmediate() for recursive async work')
    log.push('✅ Use process.nextTick() only for small, non-recursive tasks')
    log.push('❌ Never recursively call process.nextTick()')
    log.push('📌 Node.js has --max-tick-depth (removed in v0.12)')
    log.push('📌 Modern Node.js: no built-in protection against nextTick starvation')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.3: nextTick Starvation</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 0.4: Real-world Ordering Puzzle — Решение
// ============================================

export function Task0_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Complex Async Ordering Puzzle ===')
    log.push('')
    log.push('Predict the output order:')
    log.push('')
    log.push('console.log("A")')
    log.push('')
    log.push('setTimeout(() => {')
    log.push('  console.log("B")')
    log.push('  Promise.resolve().then(() => console.log("C"))')
    log.push('}, 0)')
    log.push('')
    log.push('Promise.resolve().then(() => {')
    log.push('  console.log("D")')
    log.push('  process.nextTick(() => console.log("E"))')
    log.push('})')
    log.push('')
    log.push('process.nextTick(() => {')
    log.push('  console.log("F")')
    log.push('  Promise.resolve().then(() => console.log("G"))')
    log.push('})')
    log.push('')
    log.push('setImmediate(() => {')
    log.push('  console.log("H")')
    log.push('  process.nextTick(() => console.log("I"))')
    log.push('})')
    log.push('')
    log.push('console.log("J")')
    log.push('')
    log.push('=== Step-by-step Analysis ===')
    log.push('')
    log.push('Phase 0: Synchronous execution')
    log.push('  → "A" (first sync statement)')
    log.push('  → "J" (second sync statement)')
    log.push('  Queued: setTimeout→B, Promise→D, nextTick→F, setImmediate→H')
    log.push('')
    log.push('Between phases: Drain microtask queues')
    log.push('  nextTick queue first:')
    log.push('  → "F" (nextTick callback)')
    log.push('    Queues: Promise→G')
    log.push('  Promise queue next:')
    log.push('  → "D" (Promise.then callback)')
    log.push('    Queues: nextTick→E')
    log.push('  → "G" (Promise from F)')
    log.push('  Drain nextTick again:')
    log.push('  → "E" (nextTick from D)')
    log.push('')
    log.push('Timers phase:')
    log.push('  → "B" (setTimeout callback)')
    log.push('    Queues: Promise→C')
    log.push('  Drain microtasks:')
    log.push('  → "C" (Promise from B)')
    log.push('')
    log.push('Check phase:')
    log.push('  → "H" (setImmediate callback)')
    log.push('    Queues: nextTick→I')
    log.push('  Drain microtasks:')
    log.push('  → "I" (nextTick from H)')
    log.push('')
    log.push('=== Final Output Order ===')
    log.push('A → J → F → D → G → E → B → C → H → I')
    log.push('')
    log.push('=== Key Takeaways ===')
    log.push('1. Sync code always runs first')
    log.push('2. nextTick drains before Promise microtasks')
    log.push('3. All microtasks drain between each event loop phase')
    log.push('4. Microtasks scheduled during microtask processing')
    log.push('   are drained in the same "between-phases" window')
    log.push('5. Timers phase runs before Check phase')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.4: Real-world Ordering Puzzle</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
