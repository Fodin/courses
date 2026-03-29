import { useState } from 'react'

// ============================================
// Задание 2.1: Basic EventEmitter — Решение
// ============================================

type Listener = (...args: unknown[]) => void

class SimpleEventEmitter {
  private events: Map<string, Listener[]> = new Map()

  on(event: string, listener: Listener): this {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(listener)
    return this
  }

  off(event: string, listener: Listener): this {
    const listeners = this.events.get(event)
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index !== -1) listeners.splice(index, 1)
    }
    return this
  }

  emit(event: string, ...args: unknown[]): boolean {
    const listeners = this.events.get(event)
    if (!listeners || listeners.length === 0) return false
    listeners.forEach(fn => fn(...args))
    return true
  }

  removeAllListeners(event?: string): this {
    if (event) {
      this.events.delete(event)
    } else {
      this.events.clear()
    }
    return this
  }

  listenerCount(event: string): number {
    return this.events.get(event)?.length ?? 0
  }

  eventNames(): string[] {
    return Array.from(this.events.keys())
  }
}

export function Task2_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const emitter = new SimpleEventEmitter()

    log.push('=== EventEmitter: Basic API ===')
    log.push('')
    log.push('Creating SimpleEventEmitter (browser implementation)')
    log.push('')

    // on + emit
    log.push('--- on() and emit() ---')
    emitter.on('greet', (name: unknown) => {
      log.push(`  Event "greet" fired with: ${name}`)
    })
    emitter.on('greet', (name: unknown) => {
      log.push(`  Second listener: Hello, ${name}!`)
    })
    emitter.emit('greet', 'Node.js')
    log.push(`  Listener count for "greet": ${emitter.listenerCount('greet')}`)

    // off
    log.push('')
    log.push('--- off() ---')
    const tempListener = () => log.push('  This should not appear after off()')
    emitter.on('test', tempListener)
    log.push(`  Added listener. Count: ${emitter.listenerCount('test')}`)
    emitter.off('test', tempListener)
    log.push(`  Removed listener. Count: ${emitter.listenerCount('test')}`)
    const fired = emitter.emit('test')
    log.push(`  emit("test") returned: ${fired} (no listeners)`)

    // removeAllListeners
    log.push('')
    log.push('--- removeAllListeners() ---')
    log.push(`  Event names before: [${emitter.eventNames().join(', ')}]`)
    emitter.removeAllListeners()
    log.push(`  Event names after removeAll: [${emitter.eventNames().join(', ')}]`)

    // Node.js EventEmitter API
    log.push('')
    log.push('=== Node.js EventEmitter Full API ===')
    log.push('')
    log.push('const EventEmitter = require("events")')
    log.push('const emitter = new EventEmitter()')
    log.push('')
    log.push('Methods:')
    log.push('  emitter.on(event, listener)        — add listener')
    log.push('  emitter.addListener(event, listener) — alias for on()')
    log.push('  emitter.once(event, listener)       — listener fires once')
    log.push('  emitter.off(event, listener)        — remove listener')
    log.push('  emitter.removeListener(event, fn)   — alias for off()')
    log.push('  emitter.removeAllListeners([event]) — remove all')
    log.push('  emitter.emit(event, ...args)        — fire event')
    log.push('  emitter.listenerCount(event)        — count listeners')
    log.push('  emitter.eventNames()                — list event names')
    log.push('  emitter.prependListener(event, fn)  — add to beginning')
    log.push('  emitter.prependOnceListener(event, fn)')
    log.push('')
    log.push('Special events:')
    log.push('  "newListener"    — fired when new listener added')
    log.push('  "removeListener" — fired when listener removed')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.1: Basic EventEmitter</h2>
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
// Задание 2.2: Error Events & maxListeners — Решение
// ============================================

export function Task2_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Error Events & maxListeners ===')
    log.push('')
    log.push('📌 The "error" event is SPECIAL in Node.js:')
    log.push('   If emitted without a listener, Node.js throws and crashes!')
    log.push('')
    log.push('=== Error Event Behavior ===')
    log.push('')
    log.push('// ❌ No error listener → process crashes!')
    log.push('const emitter = new EventEmitter()')
    log.push('emitter.emit("error", new Error("boom"))')
    log.push('// throws Error: boom — UNCAUGHT!')
    log.push('')
    log.push('// ✅ With error listener → handled gracefully')
    log.push('emitter.on("error", (err) => {')
    log.push('  console.error("Caught:", err.message)')
    log.push('})')
    log.push('emitter.emit("error", new Error("boom"))')
    log.push('// Caught: boom')

    // Simulate error handling
    log.push('')
    log.push('=== Simulation: Error Handling ===')
    const emitter = new SimpleEventEmitter()

    // Without error listener
    log.push('')
    log.push('Without error listener:')
    const hasListeners = emitter.emit('error', new Error('test'))
    log.push(`  emit("error") returned: ${hasListeners}`)
    log.push('  In Node.js: this would CRASH the process!')

    // With error listener
    emitter.on('error', (err: unknown) => {
      log.push(`  Caught error: ${(err as Error).message}`)
    })
    log.push('')
    log.push('With error listener:')
    emitter.emit('error', new Error('handled gracefully'))

    log.push('')
    log.push('=== maxListeners Warning ===')
    log.push('')
    log.push('By default, EventEmitter warns if > 10 listeners on one event.')
    log.push('This helps detect memory leaks.')
    log.push('')
    log.push('// Default: 10 listeners max')
    log.push('emitter.setMaxListeners(20) // change for this emitter')
    log.push('EventEmitter.defaultMaxListeners = 20 // change globally')
    log.push('emitter.setMaxListeners(0) // unlimited (⚠️ use carefully)')
    log.push('')
    log.push('// Warning message:')
    log.push('// MaxListenersExceededWarning: Possible EventEmitter memory leak')
    log.push('// detected. 11 "data" listeners added.')

    // Simulate maxListeners
    log.push('')
    log.push('=== Simulation: maxListeners ===')
    const maxListeners = 10
    for (let i = 1; i <= 12; i++) {
      emitter.on('data', () => {})
      if (i === maxListeners + 1) {
        log.push(`  ⚠️ Warning at listener #${i}: Possible memory leak!`)
        log.push(`  Current "data" listeners: ${emitter.listenerCount('data')}`)
      }
    }

    log.push('')
    log.push('=== Common Memory Leak Pattern ===')
    log.push('')
    log.push('// ❌ Adding listener in a loop/request handler')
    log.push('app.get("/api", (req, res) => {')
    log.push('  db.on("error", handleError) // NEW listener per request!')
    log.push('  // After 1000 requests → 1000 listeners!')
    log.push('})')
    log.push('')
    log.push('// ✅ Add listener once, outside the handler')
    log.push('db.on("error", handleError)')
    log.push('app.get("/api", (req, res) => { ... })')
    log.push('')
    log.push('// ✅ Or use once()')
    log.push('app.get("/api", (req, res) => {')
    log.push('  db.once("error", handleError)')
    log.push('})')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.2: Error Events & maxListeners</h2>
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
// Задание 2.3: once() & Async Iterator — Решение
// ============================================

export function Task2_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== once() & Async Iterator ===')
    log.push('')
    log.push('📌 once() — listener that fires only once, then auto-removes')
    log.push('')
    log.push('=== emitter.once() ===')
    log.push('')
    log.push('const emitter = new EventEmitter()')
    log.push('emitter.once("connect", () => {')
    log.push('  console.log("Connected!")')
    log.push('})')
    log.push('emitter.emit("connect") // "Connected!"')
    log.push('emitter.emit("connect") // nothing — listener removed')

    // Simulate once()
    log.push('')
    log.push('=== Simulation: once() ===')
    const emitter = new SimpleEventEmitter()
    let onceCount = 0
    const onceListener = () => {
      onceCount++
      log.push(`  once listener fired (count: ${onceCount})`)
      emitter.off('signal', onceListener)
    }
    emitter.on('signal', onceListener)
    emitter.emit('signal')
    emitter.emit('signal')
    log.push(`  Total fires: ${onceCount} (should be 1)`)

    log.push('')
    log.push('=== events.once() — Promise-based ===')
    log.push('')
    log.push('const { once } = require("events")')
    log.push('')
    log.push('async function connectToDb() {')
    log.push('  const client = new DbClient()')
    log.push('  client.connect()')
    log.push('  await once(client, "connected")')
    log.push('  console.log("DB ready!")')
    log.push('}')
    log.push('')
    log.push('// With error handling:')
    log.push('try {')
    log.push('  await once(client, "connected")')
    log.push('} catch (err) {')
    log.push('  // If "error" event fires before "connected"')
    log.push('  console.error("Connection failed:", err)')
    log.push('}')

    log.push('')
    log.push('=== events.on() — Async Iterator ===')
    log.push('')
    log.push('const { on } = require("events")')
    log.push('')
    log.push('async function processEvents() {')
    log.push('  const emitter = new EventEmitter()')
    log.push('')
    log.push('  // Async iterator from events')
    log.push('  for await (const [data] of on(emitter, "data")) {')
    log.push('    console.log("Received:", data)')
    log.push('    if (data === "done") break')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// With AbortSignal:')
    log.push('const ac = new AbortController()')
    log.push('setTimeout(() => ac.abort(), 5000) // timeout after 5s')
    log.push('')
    log.push('try {')
    log.push('  for await (const [data] of on(emitter, "data", {')
    log.push('    signal: ac.signal')
    log.push('  })) {')
    log.push('    console.log(data)')
    log.push('  }')
    log.push('} catch (err) {')
    log.push('  if (err.name === "AbortError") {')
    log.push('    console.log("Iteration aborted")')
    log.push('  }')
    log.push('}')

    log.push('')
    log.push('=== Practical Example: HTTP Server with once() ===')
    log.push('')
    log.push('const server = http.createServer()')
    log.push('server.listen(3000)')
    log.push('await once(server, "listening")')
    log.push('console.log("Server ready on port 3000")')
    log.push('')
    log.push('=== Practical Example: Reading Lines with on() ===')
    log.push('')
    log.push('const rl = readline.createInterface({ input: process.stdin })')
    log.push('for await (const line of rl) {')
    log.push('  console.log("User typed:", line)')
    log.push('}')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.3: once() & Async Iterator</h2>
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
