import { useState } from 'react'

// ============================================
// Задание 5.1: Readable Streams — Решение
// ============================================

export function Task5_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Readable Streams ===')
    log.push('')
    log.push('Readable stream — источник данных, из которого можно читать.')
    log.push('Примеры: fs.createReadStream, http request, process.stdin')
    log.push('')

    log.push('=== Два режима: Flowing vs Paused ===')
    log.push('')
    log.push('┌─────────────┬──────────────────────────┬─────────────────────────┐')
    log.push('│             │ Flowing Mode              │ Paused Mode             │')
    log.push('├─────────────┼──────────────────────────┼─────────────────────────┤')
    log.push('│ Активация   │ stream.on("data", fn)    │ stream.read() вручную   │')
    log.push('│ Поток данных│ Автоматический            │ По запросу              │')
    log.push('│ Контроль    │ Минимальный               │ Полный                  │')
    log.push('│ Использ.    │ Простые случаи            │ Сложная логика          │')
    log.push('└─────────────┴──────────────────────────┴─────────────────────────┘')
    log.push('')

    log.push('=== Flowing Mode (событие "data") ===')
    log.push('')
    log.push('const readable = fs.createReadStream("big-file.txt", {')
    log.push('  encoding: "utf8",')
    log.push('  highWaterMark: 64 * 1024  // 64KB chunks')
    log.push('})')
    log.push('')
    log.push('readable.on("data", (chunk) => {')
    log.push('  console.log("Received chunk:", chunk.length, "bytes")')
    log.push('})')
    log.push('readable.on("end", () => console.log("Done!"))')
    log.push('readable.on("error", (err) => console.error(err))')

    log.push('')
    log.push('=== Paused Mode (stream.read()) ===')
    log.push('')
    log.push('readable.on("readable", () => {')
    log.push('  let chunk')
    log.push('  while ((chunk = readable.read()) !== null) {')
    log.push('    console.log("Read:", chunk.length, "bytes")')
    log.push('  }')
    log.push('})')

    log.push('')
    log.push('=== Переключение режимов ===')
    log.push('')
    log.push('// Flowing → Paused')
    log.push('readable.pause()')
    log.push('')
    log.push('// Paused → Flowing')
    log.push('readable.resume()')

    log.push('')
    log.push('=== Async Iterator (рекомендуется) ===')
    log.push('')
    log.push('for await (const chunk of readable) {')
    log.push('  console.log("Chunk:", chunk.length)')
    log.push('}')
    log.push('// Автоматически обрабатывает end и error!')

    // Simulation
    log.push('')
    log.push('=== Симуляция: Чтение файла чанками ===')
    log.push('')

    const fileContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'
    const chunkSize = 40
    let offset = 0
    let chunkNum = 0

    log.push(`Файл: ${fileContent.length} bytes, highWaterMark: ${chunkSize}`)
    log.push('')

    while (offset < fileContent.length) {
      const chunk = fileContent.slice(offset, offset + chunkSize)
      chunkNum++
      log.push(`  [data] chunk #${chunkNum}: "${chunk}" (${chunk.length} bytes)`)
      offset += chunkSize
    }
    log.push(`  [end] Прочитано ${chunkNum} чанков, всего ${fileContent.length} bytes`)

    log.push('')
    log.push('=== Ключевые события ===')
    log.push('')
    log.push('  "data"     — получен новый чанк данных')
    log.push('  "end"      — все данные прочитаны')
    log.push('  "error"    — произошла ошибка')
    log.push('  "close"    — стрим закрыт')
    log.push('  "readable" — есть данные для read() (paused mode)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Readable Streams</h2>
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
// Задание 5.2: Writable Streams — Решение
// ============================================

export function Task5_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Writable Streams ===')
    log.push('')
    log.push('Writable stream — приёмник данных, в который можно записывать.')
    log.push('Примеры: fs.createWriteStream, http response, process.stdout')
    log.push('')

    log.push('=== Базовая запись ===')
    log.push('')
    log.push('const writable = fs.createWriteStream("output.txt")')
    log.push('')
    log.push('// write() возвращает boolean:')
    log.push('//   true  — внутренний буфер не заполнен, можно писать ещё')
    log.push('//   false — буфер заполнен, нужно подождать "drain"')
    log.push('')
    log.push('const canContinue = writable.write("Hello World\\n")')
    log.push('if (!canContinue) {')
    log.push('  // Ждём пока буфер опустеет')
    log.push('  await new Promise(resolve => writable.once("drain", resolve))')
    log.push('}')

    log.push('')
    log.push('=== writable.end() ===')
    log.push('')
    log.push('// Сигнал о завершении записи')
    log.push('writable.end("Last chunk\\n")')
    log.push('writable.on("finish", () => console.log("All data flushed!"))')
    log.push('')
    log.push('// ⚠️ После end() нельзя вызывать write()!')
    log.push('writable.write("more") // Error: write after end')

    log.push('')
    log.push('=== cork() / uncork() ===')
    log.push('')
    log.push('// cork() — буферизует все write() в памяти')
    log.push('// uncork() — отправляет всё разом (batch)')
    log.push('')
    log.push('writable.cork()')
    log.push('writable.write("line 1\\n")')
    log.push('writable.write("line 2\\n")')
    log.push('writable.write("line 3\\n")')
    log.push('writable.uncork() // Всё записывается одним системным вызовом')
    log.push('')
    log.push('// Или через process.nextTick:')
    log.push('writable.cork()')
    log.push('writable.write("data1")')
    log.push('writable.write("data2")')
    log.push('process.nextTick(() => writable.uncork())')

    // Simulation
    log.push('')
    log.push('=== Симуляция: Запись с отслеживанием буфера ===')
    log.push('')

    const highWaterMark = 100
    let bufferUsed = 0
    const writes = [
      { data: 'Header: Content-Type: application/json\n', size: 38 },
      { data: '{"users": [{"name": "Alice"}, {"name":', size: 37 },
      { data: ' "Bob"}, {"name": "Charlie"}]}\n', size: 31 },
      { data: 'Footer: End of response\n', size: 24 },
    ]

    log.push(`highWaterMark: ${highWaterMark} bytes`)
    log.push('')

    for (const w of writes) {
      bufferUsed += w.size
      const ok = bufferUsed < highWaterMark
      log.push(`  write("${w.data.trim().slice(0, 30)}...")`)
      log.push(`    buffer: ${bufferUsed}/${highWaterMark} bytes → ${ok ? 'true (продолжайте)' : 'false (ждите drain!)'}`)

      if (!ok) {
        log.push('    [drain] буфер очищен')
        bufferUsed = 0
      }
    }

    log.push('')
    log.push('  end()')
    log.push('  [finish] Все данные записаны')

    log.push('')
    log.push('=== Ключевые события ===')
    log.push('')
    log.push('  "drain"    — буфер опустел, можно продолжать write()')
    log.push('  "finish"   — end() вызван и все данные записаны')
    log.push('  "error"    — произошла ошибка записи')
    log.push('  "close"    — стрим закрыт')
    log.push('  "pipe"     — readable.pipe(writable) подключён')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.2: Writable Streams</h2>
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
// Задание 5.3: Transform Streams — Решение
// ============================================

export function Task5_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Transform Streams ===')
    log.push('')
    log.push('Transform stream — одновременно Readable и Writable.')
    log.push('Принимает данные, преобразует и отдаёт дальше.')
    log.push('Примеры: zlib.createGzip(), crypto.createCipheriv()')
    log.push('')

    log.push('=== Создание Transform Stream ===')
    log.push('')
    log.push('const { Transform } = require("stream")')
    log.push('')
    log.push('const upperCase = new Transform({')
    log.push('  transform(chunk, encoding, callback) {')
    log.push('    // this.push() — отправить данные дальше')
    log.push('    this.push(chunk.toString().toUpperCase())')
    log.push('    callback() // обязательно вызвать!')
    log.push('  }')
    log.push('})')
    log.push('')
    log.push('// Использование:')
    log.push('readable.pipe(upperCase).pipe(writable)')

    log.push('')
    log.push('=== Transform с flush() ===')
    log.push('')
    log.push('const counter = new Transform({')
    log.push('  transform(chunk, encoding, callback) {')
    log.push('    this.count = (this.count || 0) + 1')
    log.push('    this.push(chunk)')
    log.push('    callback()')
    log.push('  },')
    log.push('  flush(callback) {')
    log.push('    // Вызывается после всех данных')
    log.push('    this.push(`\\nTotal chunks: ${this.count}`)')
    log.push('    callback()')
    log.push('  }')
    log.push('})')

    log.push('')
    log.push('=== objectMode ===')
    log.push('')
    log.push('// По умолчанию стримы работают с Buffer/string.')
    log.push('// objectMode позволяет передавать JS-объекты.')
    log.push('')
    log.push('const jsonParser = new Transform({')
    log.push('  objectMode: true, // ← включаем object mode')
    log.push('  transform(chunk, encoding, callback) {')
    log.push('    try {')
    log.push('      const obj = JSON.parse(chunk.toString())')
    log.push('      this.push(obj) // передаём объект, не строку')
    log.push('      callback()')
    log.push('    } catch (err) {')
    log.push('      callback(err) // передаём ошибку')
    log.push('    }')
    log.push('  }')
    log.push('})')

    log.push('')
    log.push('=== Цепочки Transform ===')
    log.push('')
    log.push('fs.createReadStream("data.csv")')
    log.push('  .pipe(csvParser)        // CSV → objects')
    log.push('  .pipe(filterTransform)  // filter rows')
    log.push('  .pipe(jsonStringify)    // objects → JSON')
    log.push('  .pipe(gzip)             // compress')
    log.push('  .pipe(fs.createWriteStream("data.json.gz"))')

    // Simulation
    log.push('')
    log.push('=== Симуляция: Цепочка Transform ===')
    log.push('')

    const inputLines = [
      '  hello world  ',
      '  node.js streams  ',
      '  transform pipeline  ',
      '  backpressure demo  ',
    ]

    log.push('Input → Trim → UpperCase → AddPrefix → Output')
    log.push('')

    for (const line of inputLines) {
      const trimmed = line.trim()
      const upper = trimmed.toUpperCase()
      const prefixed = `[LOG] ${upper}`
      log.push(`  "${line}"`)
      log.push(`    → trim    → "${trimmed}"`)
      log.push(`    → upper   → "${upper}"`)
      log.push(`    → prefix  → "${prefixed}"`)
      log.push('')
    }

    log.push('=== objectMode Simulation ===')
    log.push('')

    const jsonLines = [
      '{"name":"Alice","age":30}',
      '{"name":"Bob","age":25}',
      '{"name":"Charlie","age":35}',
    ]

    log.push('JSON strings → Parse → Filter(age > 28) → Output')
    log.push('')

    for (const json of jsonLines) {
      const obj = JSON.parse(json)
      const passed = obj.age > 28
      log.push(`  "${json}"`)
      log.push(`    → parse   → { name: "${obj.name}", age: ${obj.age} }`)
      log.push(`    → filter  → ${passed ? 'PASS' : 'SKIP'}`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.3: Transform Streams</h2>
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
// Задание 5.4: Pipeline — Решение
// ============================================

export function Task5_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== stream.pipeline() ===')
    log.push('')
    log.push('pipeline() — безопасная замена .pipe() с обработкой ошибок.')
    log.push('Автоматически уничтожает все стримы при ошибке в любом звене.')
    log.push('')

    log.push('=== Проблема с .pipe() ===')
    log.push('')
    log.push('// ❌ pipe() не обрабатывает ошибки автоматически')
    log.push('readable.pipe(transform).pipe(writable)')
    log.push('// Если transform выбросит ошибку:')
    log.push('//   - writable останется открытым (утечка!)')
    log.push('//   - readable продолжит читать (waste!)')
    log.push('')
    log.push('// ❌ Нужно подписываться на error каждого стрима')
    log.push('readable.on("error", handleErr)')
    log.push('transform.on("error", handleErr)')
    log.push('writable.on("error", handleErr)')

    log.push('')
    log.push('=== Решение: pipeline() ===')
    log.push('')
    log.push('const { pipeline } = require("stream")')
    log.push('')
    log.push('// Callback стиль:')
    log.push('pipeline(readable, transform, writable, (err) => {')
    log.push('  if (err) console.error("Pipeline failed:", err)')
    log.push('  else console.log("Pipeline succeeded")')
    log.push('})')
    log.push('')
    log.push('// Promise стиль (рекомендуется):')
    log.push('const { pipeline } = require("stream/promises")')
    log.push('')
    log.push('await pipeline(readable, transform, writable)')
    log.push('console.log("Pipeline succeeded")')

    log.push('')
    log.push('=== pipeline с AbortSignal ===')
    log.push('')
    log.push('const ac = new AbortController()')
    log.push('')
    log.push('// Отменить через 5 секунд')
    log.push('setTimeout(() => ac.abort(), 5000)')
    log.push('')
    log.push('try {')
    log.push('  await pipeline(readable, transform, writable, {')
    log.push('    signal: ac.signal')
    log.push('  })')
    log.push('} catch (err) {')
    log.push('  if (err.code === "ABORT_ERR") {')
    log.push('    console.log("Pipeline was aborted")')
    log.push('  }')
    log.push('}')

    log.push('')
    log.push('=== Реальные примеры ===')
    log.push('')
    log.push('// Сжатие файла:')
    log.push('await pipeline(')
    log.push('  fs.createReadStream("input.txt"),')
    log.push('  zlib.createGzip(),')
    log.push('  fs.createWriteStream("input.txt.gz")')
    log.push(')')
    log.push('')
    log.push('// HTTP response с трансформацией:')
    log.push('await pipeline(')
    log.push('  fs.createReadStream("data.csv"),')
    log.push('  csvToJson,')
    log.push('  zlib.createGzip(),')
    log.push('  res // http.ServerResponse is a Writable!')
    log.push(')')

    // Simulation
    log.push('')
    log.push('=== Симуляция: Pipeline с ошибкой ===')
    log.push('')

    const stages = ['ReadStream', 'GzipTransform', 'WriteStream']

    log.push('Сценарий 1: Успешный pipeline')
    log.push('')
    for (let i = 0; i < stages.length; i++) {
      log.push(`  [${stages[i]}] ✅ OK`)
    }
    log.push('  → Pipeline succeeded')

    log.push('')
    log.push('Сценарий 2: Ошибка в transform (pipe)')
    log.push('')
    log.push('  [ReadStream] ✅ OK — продолжает читать (утечка!)')
    log.push('  [GzipTransform] ❌ Error: corrupt data')
    log.push('  [WriteStream] ⚠️ Остаётся открытым (утечка!)')
    log.push('  → Unhandled error, потенциальная утечка ресурсов')

    log.push('')
    log.push('Сценарий 3: Ошибка в transform (pipeline)')
    log.push('')
    log.push('  [ReadStream] ✅ → ❌ destroyed (автоматически)')
    log.push('  [GzipTransform] ❌ Error: corrupt data')
    log.push('  [WriteStream] ✅ → ❌ destroyed (автоматически)')
    log.push('  → Все стримы корректно закрыты, ошибка в callback')

    log.push('')
    log.push('Сценарий 4: Отмена через AbortController')
    log.push('')
    log.push('  [ReadStream] ✅ Reading...')
    log.push('  [AbortSignal] 🛑 abort()')
    log.push('  [ReadStream] ❌ destroyed')
    log.push('  [GzipTransform] ❌ destroyed')
    log.push('  [WriteStream] ❌ destroyed')
    log.push('  → AbortError: pipeline was aborted')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.4: Pipeline</h2>
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
// Задание 5.5: Backpressure — Решение
// ============================================

export function Task5_5_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Backpressure ===')
    log.push('')
    log.push('Backpressure — механизм, который замедляет producer (источник)')
    log.push('когда consumer (приёмник) не успевает обрабатывать данные.')
    log.push('')
    log.push('Без backpressure: данные копятся в памяти → OOM crash!')
    log.push('')

    log.push('=== highWaterMark ===')
    log.push('')
    log.push('// highWaterMark — порог внутреннего буфера (по умолчанию 16KB)')
    log.push('const readable = fs.createReadStream("file.txt", {')
    log.push('  highWaterMark: 64 * 1024 // 64KB')
    log.push('})')
    log.push('')
    log.push('const writable = fs.createWriteStream("out.txt", {')
    log.push('  highWaterMark: 16 * 1024 // 16KB')
    log.push('})')
    log.push('')
    log.push('// Когда буфер Writable заполнен:')
    log.push('//   write() возвращает false')
    log.push('//   Readable автоматически ставится на паузу')
    log.push('//   После "drain" — возобновляется')

    log.push('')
    log.push('=== Ручная обработка backpressure ===')
    log.push('')
    log.push('readable.on("data", (chunk) => {')
    log.push('  const ok = writable.write(chunk)')
    log.push('  if (!ok) {')
    log.push('    // Буфер полон — ставим на паузу')
    log.push('    readable.pause()')
    log.push('  }')
    log.push('})')
    log.push('')
    log.push('writable.on("drain", () => {')
    log.push('  // Буфер опустел — возобновляем')
    log.push('  readable.resume()')
    log.push('})')

    log.push('')
    log.push('=== pipe() обрабатывает backpressure автоматически ===')
    log.push('')
    log.push('// pipe() автоматически вызывает pause/resume')
    log.push('readable.pipe(writable)')
    log.push('')
    log.push('// pipeline() тоже обрабатывает backpressure + ошибки')
    log.push('await pipeline(readable, transform, writable)')

    log.push('')
    log.push('=== Без backpressure (опасно!) ===')
    log.push('')
    log.push('// ❌ Игнорируем возврат write()')
    log.push('readable.on("data", (chunk) => {')
    log.push('  writable.write(chunk) // что если false?')
    log.push('  // Данные копятся в памяти writable!')
    log.push('})')

    // Simulation
    log.push('')
    log.push('=== Симуляция: Producer vs Consumer ===')
    log.push('')

    const hwm = 5
    let buffer = 0
    let paused = false
    const events: string[] = []

    // Simulate fast producer, slow consumer
    const chunks = [
      { action: 'write', size: 2 },
      { action: 'write', size: 2 },
      { action: 'write', size: 2 },
      { action: 'drain', size: 0 },
      { action: 'write', size: 2 },
      { action: 'write', size: 2 },
      { action: 'drain', size: 0 },
      { action: 'write', size: 1 },
      { action: 'end', size: 0 },
    ]

    log.push(`highWaterMark: ${hwm} units`)
    log.push('')

    for (const chunk of chunks) {
      if (chunk.action === 'write') {
        if (paused) {
          events.push(`  ⏸️ [paused] write skipped — waiting for drain`)
          continue
        }
        buffer += chunk.size
        const ok = buffer < hwm
        const bar = '█'.repeat(buffer) + '░'.repeat(Math.max(0, hwm - buffer))
        events.push(`  write(${chunk.size}) → buffer [${bar}] ${buffer}/${hwm} → ${ok ? '✅ ok' : '⛔ full!'}`)
        if (!ok) {
          paused = true
          events.push(`  ⏸️ readable.pause() — backpressure activated`)
        }
      } else if (chunk.action === 'drain') {
        buffer = 0
        paused = false
        const bar = '░'.repeat(hwm)
        events.push(`  [drain] → buffer [${bar}] 0/${hwm}`)
        events.push(`  ▶️ readable.resume() — backpressure released`)
      } else if (chunk.action === 'end') {
        events.push(`  [end] → stream finished`)
      }
    }

    events.forEach(e => log.push(e))

    log.push('')
    log.push('=== Диагностика backpressure ===')
    log.push('')
    log.push('  writable.writableLength     — текущий размер буфера')
    log.push('  writable.writableHighWaterMark — порог')
    log.push('  readable.readableLength     — текущий размер буфера')
    log.push('  readable.readableFlowing    — flowing/paused/null')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.5: Backpressure</h2>
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
