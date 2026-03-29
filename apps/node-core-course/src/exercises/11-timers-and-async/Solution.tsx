import { useState } from 'react'

// ============================================
// Задание 11.1: Timer Internals — Решение
// ============================================

export function Task11_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== setTimeout / setInterval / setImmediate ===')
    log.push('')

    log.push('// setTimeout — выполнить через N мс (минимум 1мс)')
    log.push('const timer = setTimeout(() => {')
    log.push('  console.log("Executed after ~100ms")')
    log.push('}, 100)')
    log.push('')

    log.push('// setInterval — повторять каждые N мс')
    log.push('const interval = setInterval(() => {')
    log.push('  console.log("Tick")')
    log.push('}, 1000)')
    log.push('')

    log.push('// setImmediate — выполнить в следующей итерации Event Loop (Check phase)')
    log.push('setImmediate(() => {')
    log.push('  console.log("Immediate")')
    log.push('})')
    log.push('')

    // Simulating execution order
    log.push('=== Порядок выполнения ===')
    log.push('')

    const order: string[] = []
    order.push('1. console.log("sync")')
    order.push('2. process.nextTick(() => log("nextTick"))')
    order.push('3. Promise.resolve().then(() => log("promise"))')
    order.push('4. setImmediate(() => log("immediate"))')
    order.push('5. setTimeout(() => log("timeout"), 0)')
    log.push('Код:')
    order.forEach(line => log.push('  ' + line))
    log.push('')
    log.push('Порядок вывода:')
    log.push('  sync')
    log.push('  nextTick')
    log.push('  promise')
    log.push('  timeout (или immediate — в main module порядок не гарантирован)')
    log.push('  immediate (или timeout)')
    log.push('')
    log.push('Внутри I/O callback:')
    log.push('  immediate ВСЕГДА перед timeout')
    log.push('')

    // ref/unref
    log.push('=== ref() / unref() ===')
    log.push('')
    log.push('// unref() — таймер НЕ удерживает процесс от завершения')
    log.push('const timer = setTimeout(() => {}, 60000)')
    log.push('timer.unref()  // процесс завершится, не дожидаясь таймера')
    log.push('')
    log.push('// ref() — возвращает обычное поведение')
    log.push('timer.ref()  // процесс будет ждать таймер')
    log.push('')
    log.push('// Типичное использование: heartbeat, который не блокирует завершение')
    log.push('const heartbeat = setInterval(() => {')
    log.push('  sendHeartbeat()')
    log.push('}, 30000)')
    log.push('heartbeat.unref()  // не мешает процессу завершиться')
    log.push('')

    // Timer coalescing
    log.push('=== Timer Coalescing (оптимизация) ===')
    log.push('')
    log.push('// libuv группирует таймеры с близкими timeout в одну проверку')
    log.push('// Это снижает нагрузку на систему')
    log.push('')
    log.push('setTimeout(fn1, 100)')
    log.push('setTimeout(fn2, 101)')
    log.push('setTimeout(fn3, 102)')
    log.push('// → libuv может проверить все три за одну итерацию')
    log.push('')

    // hasRef
    log.push('=== hasRef() — проверка состояния ===')
    log.push('')
    log.push('const t = setTimeout(() => {}, 1000)')
    log.push('t.hasRef()  // true')
    log.push('t.unref()')
    log.push('t.hasRef()  // false')
    log.push('')

    // refresh
    log.push('=== refresh() — перезапуск таймера ===')
    log.push('')
    log.push('const timeout = setTimeout(() => {')
    log.push('  console.log("Inactivity!")')
    log.push('}, 5000)')
    log.push('')
    log.push('// При каждом действии пользователя перезапускаем')
    log.push('onUserActivity(() => {')
    log.push('  timeout.refresh()  // сброс таймера без clearTimeout + новый setTimeout')
    log.push('})')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.1: Timer Internals</h2>
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
// Задание 11.2: AbortController — Решение
// ============================================

export function Task11_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== AbortController & AbortSignal ===')
    log.push('')
    log.push('// AbortController — механизм отмены асинхронных операций')
    log.push('const controller = new AbortController()')
    log.push('const { signal } = controller')
    log.push('')

    // Basic usage
    log.push('=== Отмена fetch-запроса ===')
    log.push('')
    log.push('const controller = new AbortController()')
    log.push('')
    log.push('fetch("https://api.example.com/data", {')
    log.push('  signal: controller.signal')
    log.push('})')
    log.push('.then(res => res.json())')
    log.push('.catch(err => {')
    log.push('  if (err.name === "AbortError") {')
    log.push('    console.log("Request was cancelled")')
    log.push('  }')
    log.push('})')
    log.push('')
    log.push('// Через 5 секунд отменяем')
    log.push('setTimeout(() => controller.abort(), 5000)')
    log.push('')

    // Cancellable setTimeout
    log.push('=== Отменяемый setTimeout (Node.js 16+) ===')
    log.push('')
    log.push('const { setTimeout: sleep } = require("timers/promises")')
    log.push('')
    log.push('const ac = new AbortController()')
    log.push('')
    log.push('try {')
    log.push('  await sleep(10000, "result", { signal: ac.signal })')
    log.push('} catch (err) {')
    log.push('  if (err.name === "AbortError") {')
    log.push('    console.log("Timer cancelled")')
    log.push('  }')
    log.push('}')
    log.push('')

    // abort reason
    log.push('=== abort() с причиной (reason) ===')
    log.push('')
    log.push('controller.abort("User cancelled")  // строка')
    log.push('controller.abort(new Error("Timeout"))  // Error')
    log.push('')
    log.push('signal.reason  // → "User cancelled" или Error объект')
    log.push('signal.aborted // → true')
    log.push('')

    // AbortSignal.timeout
    log.push('=== AbortSignal.timeout() — автоматическая отмена ===')
    log.push('')
    log.push('// Создаёт signal, который автоматически abort через N мс')
    log.push('const signal = AbortSignal.timeout(5000)')
    log.push('')
    log.push('await fetch(url, { signal })')
    log.push('// Автоматически отменится через 5 секунд')
    log.push('')

    // AbortSignal.any — composition
    log.push('=== AbortSignal.any() — композиция сигналов (Node.js 20+) ===')
    log.push('')
    log.push('const userCancel = new AbortController()')
    log.push('const timeout = AbortSignal.timeout(30000)')
    log.push('')
    log.push('// Отмена произойдёт при ЛЮБОМ из сигналов')
    log.push('const combined = AbortSignal.any([')
    log.push('  userCancel.signal,')
    log.push('  timeout')
    log.push('])')
    log.push('')
    log.push('await fetch(url, { signal: combined })')
    log.push('')

    // Event listener
    log.push('=== Реакция на отмену ===')
    log.push('')
    log.push('signal.addEventListener("abort", () => {')
    log.push('  console.log("Aborted!", signal.reason)')
    log.push('  // Cleanup: закрыть соединения, освободить ресурсы')
    log.push('})')
    log.push('')
    log.push('// Или проверка в цикле:')
    log.push('for (const item of items) {')
    log.push('  signal.throwIfAborted()  // бросает если aborted')
    log.push('  await processItem(item)')
    log.push('}')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.2: AbortController</h2>
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
// Задание 11.3: Async Iterators — Решение
// ============================================

export function Task11_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Async Iterators & for-await-of ===')
    log.push('')

    // Basic async iterator
    log.push('=== Базовый async итератор ===')
    log.push('')
    log.push('// Объект с Symbol.asyncIterator')
    log.push('const asyncRange = {')
    log.push('  from: 1,')
    log.push('  to: 5,')
    log.push('  [Symbol.asyncIterator]() {')
    log.push('    let current = this.from')
    log.push('    const last = this.to')
    log.push('    return {')
    log.push('      async next() {')
    log.push('        await new Promise(r => setTimeout(r, 100))')
    log.push('        if (current <= last) {')
    log.push('          return { value: current++, done: false }')
    log.push('        }')
    log.push('        return { done: true }')
    log.push('      }')
    log.push('    }')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('for await (const num of asyncRange) {')
    log.push('  console.log(num)  // 1, 2, 3, 4, 5 (с паузой 100мс)')
    log.push('}')
    log.push('')

    // Async generators
    log.push('=== Async Generators (async function*) ===')
    log.push('')
    log.push('async function* fetchPages(url) {')
    log.push('  let page = 1')
    log.push('  while (true) {')
    log.push('    const res = await fetch(`${url}?page=${page}`)')
    log.push('    const data = await res.json()')
    log.push('    if (data.items.length === 0) return')
    log.push('    yield data.items')
    log.push('    page++')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('for await (const items of fetchPages("/api/users")) {')
    log.push('  console.log(`Got ${items.length} users`)')
    log.push('}')
    log.push('')

    // Readable streams as async iterators
    log.push('=== Streams как async iterators ===')
    log.push('')
    log.push('const fs = require("fs")')
    log.push('')
    log.push('// Readable stream — уже async iterable!')
    log.push('const stream = fs.createReadStream("file.txt", { encoding: "utf8" })')
    log.push('')
    log.push('for await (const chunk of stream) {')
    log.push('  console.log(`Chunk: ${chunk.length} bytes`)')
    log.push('}')
    log.push('// Stream автоматически закрывается после завершения')
    log.push('')

    // readline
    log.push('// Построчное чтение файла:')
    log.push('const readline = require("readline")')
    log.push('const rl = readline.createInterface({')
    log.push('  input: fs.createReadStream("log.txt")')
    log.push('})')
    log.push('')
    log.push('for await (const line of rl) {')
    log.push('  console.log(line)')
    log.push('}')
    log.push('')

    // events.on async iterator
    log.push('=== events.on() — EventEmitter как async iterator ===')
    log.push('')
    log.push('const { on } = require("events")')
    log.push('const { EventEmitter } = require("events")')
    log.push('')
    log.push('const emitter = new EventEmitter()')
    log.push('')
    log.push('// on() возвращает AsyncIterator')
    log.push('async function processEvents() {')
    log.push('  const ac = new AbortController()')
    log.push('')
    log.push('  // Автоматически завершится при abort')
    log.push('  for await (const [data] of on(emitter, "data", {')
    log.push('    signal: ac.signal')
    log.push('  })) {')
    log.push('    console.log("Event:", data)')
    log.push('    if (data === "stop") {')
    log.push('      ac.abort()')
    log.push('    }')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// Генерируем события')
    log.push('emitter.emit("data", "hello")')
    log.push('emitter.emit("data", "world")')
    log.push('emitter.emit("data", "stop")')
    log.push('')

    // Pipeline with async iterators
    log.push('=== Pipeline с async iterators ===')
    log.push('')
    log.push('async function* filterLines(source) {')
    log.push('  for await (const chunk of source) {')
    log.push('    const lines = chunk.split("\\n")')
    log.push('    for (const line of lines) {')
    log.push('      if (line.includes("ERROR")) {')
    log.push('        yield line + "\\n"')
    log.push('      }')
    log.push('    }')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('const { pipeline } = require("stream/promises")')
    log.push('await pipeline(')
    log.push('  fs.createReadStream("app.log"),')
    log.push('  filterLines,')
    log.push('  fs.createWriteStream("errors.log")')
    log.push(')')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.3: Async Iterators</h2>
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
