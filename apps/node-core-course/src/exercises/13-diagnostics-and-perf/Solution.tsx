import { useState } from 'react'

// ============================================
// Задание 13.1: perf_hooks — Решение
// ============================================

export function Task13_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== perf_hooks — Performance API ===')
    log.push('')
    log.push('const { performance, PerformanceObserver } = require("perf_hooks")')
    log.push('')

    // performance.now()
    log.push('=== performance.now() — высокоточный таймер ===')
    log.push('')
    log.push('const start = performance.now()')
    log.push('doSomething()')
    log.push('const duration = performance.now() - start')
    log.push('console.log(`Duration: ${duration.toFixed(2)}ms`)')
    log.push('// Duration: 12.34ms')
    log.push('')
    log.push('// Точность: микросекунды (в отличие от Date.now() — миллисекунды)')
    log.push('// Монотонный: не зависит от изменений системного времени')
    log.push('')

    // performance.mark & measure
    log.push('=== Marks & Measures ===')
    log.push('')
    log.push('// Marks — именованные точки во времени')
    log.push('performance.mark("start-db-query")')
    log.push('await db.query("SELECT * FROM users")')
    log.push('performance.mark("end-db-query")')
    log.push('')
    log.push('// Measure — вычисление длительности между marks')
    log.push('performance.measure("db-query", "start-db-query", "end-db-query")')
    log.push('')
    log.push('// Получение результа��ов')
    log.push('const entries = performance.getEntriesByName("db-query")')
    log.push('console.log(entries[0].duration) // 45.23ms')
    log.push('')
    log.push('// Очистка')
    log.push('performance.clearMarks()')
    log.push('performance.clearMeasures()')
    log.push('')

    // PerformanceObserver
    log.push('=== PerformanceObserver — реактивный мониторинг ===')
    log.push('')
    log.push('const obs = new PerformanceObserver((list) => {')
    log.push('  const entries = list.getEntries()')
    log.push('  entries.forEach((entry) => {')
    log.push('    console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`)')
    log.push('  })')
    log.push('})')
    log.push('')
    log.push('// Наблюдаем за measures')
    log.push('obs.observe({ entryTypes: ["measure"] })')
    log.push('')
    log.push('// Или за всеми типами:')
    log.push('// entryTypes: ["mark", "measure", "function", "gc", "http"]')
    log.push('')

    // timerify
    log.push('=== performance.timerify() — автоизмерение функций ===')
    log.push('')
    log.push('function heavyComputation(n) {')
    log.push('  let sum = 0')
    log.push('  for (let i = 0; i < n; i++) sum += i')
    log.push('  return sum')
    log.push('}')
    log.push('')
    log.push('const timerified = performance.timerify(heavyComputation)')
    log.push('')
    log.push('// Observer для function entries')
    log.push('const obs = new PerformanceObserver((list) => {')
    log.push('  console.log(list.getEntries()[0].duration)')
    log.push('})')
    log.push('obs.observe({ entryTypes: ["function"] })')
    log.push('')
    log.push('timerified(1000000)')
    log.push('// Observer автоматически получит: 2.45ms')
    log.push('')

    // GC monitoring
    log.push('=== Мониторинг Garbage Collection ===')
    log.push('')
    log.push('// Запуск: node --expose-gc app.js')
    log.push('')
    log.push('const obs = new PerformanceObserver((list) => {')
    log.push('  list.getEntries().forEach((entry) => {')
    log.push('    console.log(`GC: ${entry.kind} - ${entry.duration.toFixed(2)}ms`)')
    log.push('    // kind: 1=Scavenge(minor), 2=Mark-Sweep(major), 4=Incremental, 8=Weak')
    log.push('  })')
    log.push('})')
    log.push('obs.observe({ entryTypes: ["gc"] })')
    log.push('')

    // Real-world example
    log.push('=== Практический пример: API timing ===')
    log.push('')
    log.push('async function handleRequest(req, res) {')
    log.push('  const reqId = crypto.randomUUID()')
    log.push('  performance.mark(`${reqId}-start`)')
    log.push('')
    log.push('  performance.mark(`${reqId}-db-start`)')
    log.push('  const data = await db.query(sql)')
    log.push('  performance.mark(`${reqId}-db-end`)')
    log.push('')
    log.push('  performance.mark(`${reqId}-end`)')
    log.push('')
    log.push('  performance.measure(`${reqId}-db`, `${reqId}-db-start`, `${reqId}-db-end`)')
    log.push('  performance.measure(`${reqId}-total`, `${reqId}-start`, `${reqId}-end`)')
    log.push('')
    log.push('  res.json(data)')
    log.push('}')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.1: perf_hooks</h2>
      <button onClick={runExample}>Запу��тить</button>
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
// Задание 13.2: Memory Profiling — Решение
// ============================================

export function Task13_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Memory Profiling в Node.js ===')
    log.push('')

    // process.memoryUsage
    log.push('=== process.memoryUsage() ===')
    log.push('')
    log.push('const mem = process.memoryUsage()')
    log.push('{')
    log.push('  rss: 45_678_592,        // Resident Set Size — полный объём RAM')
    log.push('  heapTotal: 18_612_224,   // V8 heap — выделено')
    log.push('  heapUsed: 16_789_012,    // V8 heap — использу��тся')
    log.push('  external: 1_234_567,     // C++ объекты (Buffer и т.д.)')
    log.push('  arrayBuffers: 456_789    // ArrayBuffer и SharedArrayBuffer')
    log.push('}')
    log.push('')
    log.push('// Человекочитаемый формат:')
    log.push('const formatMB = (bytes) => (bytes / 1024 / 1024).toFixed(2) + " MB"')
    log.push('console.log("Heap used:", formatMB(mem.heapUsed))  // "16.01 MB"')
    log.push('')

    // Tracking memory over time
    log.push('=== Отслеживание утечек памяти ===')
    log.push('')
    log.push('// Периодическое логирование')
    log.push('setInterval(() => {')
    log.push('  const { heapUsed, rss } = process.memoryUsage()')
    log.push('  console.log(`Heap: ${formatMB(heapUsed)}, RSS: ${formatMB(rss)}`)')
    log.push('}, 10000)')
    log.push('')
    log.push('// Признаки утечки:')
    log.push('// 📈 heapUsed постоянно растёт без снижения')
    log.push('// 📈 rss только увеличивается')
    log.push('// 📈 GC не уменьшает потребление')
    log.push('')

    // Common memory leaks
    log.push('=== Типичные утечки памяти ===')
    log.push('')
    log.push('// 1. Глобальные массивы/Map без ограничения')
    log.push('❌ const cache = new Map()  // растёт бесконечно')
    log.push('✅ Используйте LRU-кеш с ограничением размера')
    log.push('')
    log.push('// 2. EventEmitter listeners')
    log.push('❌ emitter.on("data", handler)  // без removeListener')
    log.push('✅ emitter.once() или removeListener при cleanup')
    log.push('')
    log.push('// 3. Closures, удерживающие большие объекты')
    log.push('❌ function processData(hugeData) {')
    log.push('     return () => hugeData.length  // closure держит hugeData')
    log.push('   }')
    log.push('✅ Извлеките нужные данные до создания closure')
    log.push('')
    log.push('// 4. Незакрытые streams и timers')
    log.push('❌ setInterval(fn, 1000)  // без clearInterval')
    log.push('✅ Сохраняйте ссылку и очищайте при завершении')
    log.push('')

    // Manual GC
    log.push('=== Ручной GC (для диагностики) ===')
    log.push('')
    log.push('// Запуск: node --expose-gc app.js')
    log.push('')
    log.push('const before = process.memoryUsage().heapUsed')
    log.push('global.gc()  // принудительный GC')
    log.push('const after = process.memoryUsage().heapUsed')
    log.push('')
    log.push('console.log(`Freed: ${formatMB(before - after)}`)')
    log.push('// Если мало освободилось — возможна утечка')
    log.push('')

    // Heap snapshot
    log.push('=== Heap Snapshots ===')
    log.push('')
    log.push('// Через v8 модуль')
    log.push('const v8 = require("v8")')
    log.push('')
    log.push('// Записать snapshot в файл')
    log.push('v8.writeHeapSnapshot()')
    log.push('// → "Heap-20240101-123456.heapsnapshot"')
    log.push('')
    log.push('// Открыть в Chrome DevTools:')
    log.push('// 1. chrome://inspect → Memory tab')
    log.push('// 2. Load snapshot')
    log.push('// 3. Искать объекты с большим Retained Size')
    log.push('')
    log.push('// Или программно через signal:')
    log.push('process.on("SIGUSR2", () => {')
    log.push('  v8.writeHeapSnapshot()')
    log.push('  console.log("Heap snapshot saved")')
    log.push('})')
    log.push('// kill -USR2 <pid>')
    log.push('')

    // V8 heap statistics
    log.push('=== v8.getHeapStatistics() ===')
    log.push('')
    log.push('const stats = v8.getHeapStatistics()')
    log.push('{')
    log.push('  total_heap_size: 18_612_224,')
    log.push('  used_heap_size: 16_789_012,')
    log.push('  heap_size_limit: 2_197_815_296,  // макс. размер heap (~2GB)')
    log.push('  number_of_native_contexts: 1,')
    log.push('  number_of_detached_contexts: 0  // утечка! должно быть 0')
    log.push('}')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.2: Memory Profiling</h2>
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
// Задание 13.3: Zlib Compression — Решение
// ============================================

export function Task13_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Zlib — сжатие данных ===')
    log.push('')
    log.push('const zlib = require("zlib")')
    log.push('')

    // Sync API
    log.push('=== Синхронное сжатие ===')
    log.push('')
    log.push('const input = "Hello, World! ".repeat(1000)')
    log.push('')
    log.push('// Gzip (самый популярный)')
    log.push('const gzipped = zlib.gzipSync(input)')
    log.push('console.log(`Original: ${input.length} bytes`)   // 14000 bytes')
    log.push('console.log(`Gzipped: ${gzipped.length} bytes`)  // ~74 bytes')
    log.push('console.log(`Ratio: ${(gzipped.length / input.length * 100).toFixed(1)}%`)')
    log.push('')
    log.push('// Распаковка')
    log.push('const unzipped = zlib.gunzipSync(gzipped)')
    log.push('console.log(unzipped.toString() === input)  // true')
    log.push('')

    // Deflate
    log.push('// Deflate (без gzip обёртки)')
    log.push('const deflated = zlib.deflateSync(input)')
    log.push('const inflated = zlib.inflateSync(deflated)')
    log.push('')
    log.push('// Brotli (лучшее сжатие для web)')
    log.push('const brotli = zlib.brotliCompressSync(input)')
    log.push('const decompressed = zlib.brotliDecompressSync(brotli)')
    log.push('')

    // Comparison
    log.push('=== Сравнение алгоритмов ===')
    log.push('')
    log.push('| Алгоритм | Размер  | Скорость | Использование     |')
    log.push('|----------|---------|----------|-------------------|')
    log.push('| gzip     | Средний | Быстрый  | HTTP, файлы       |')
    log.push('| deflate  | Средний | Быстрый  | Внутри gzip/zip   |')
    log.push('| brotli   | Лучший  | Медленнее| Статика для web   |')
    log.push('')

    // Streaming compression
    log.push('=== Потоковое сжатие (для больших файлов) ===')
    log.push('')
    log.push('const { pipeline } = require("stream/promises")')
    log.push('const fs = require("fs")')
    log.push('')
    log.push('// Сжатие файла')
    log.push('await pipeline(')
    log.push('  fs.createReadStream("input.log"),')
    log.push('  zlib.createGzip(),')
    log.push('  fs.createWriteStream("input.log.gz")')
    log.push(')')
    log.push('')
    log.push('// Распаковка файл��')
    log.push('await pipeline(')
    log.push('  fs.createReadStream("input.log.gz"),')
    log.push('  zlib.createGunzip(),')
    log.push('  fs.createWriteStream("input.log")')
    log.push(')')
    log.push('')

    // HTTP compression
    log.push('=== HTTP сжатие ===')
    log.push('')
    log.push('const http = require("http")')
    log.push('')
    log.push('http.createServer((req, res) => {')
    log.push('  const acceptEncoding = req.headers["accept-encoding"] || ""')
    log.push('')
    log.push('  const body = JSON.stringify(data)')
    log.push('')
    log.push('  if (acceptEncoding.includes("br")) {')
    log.push('    res.setHeader("Content-Encoding", "br")')
    log.push('    const compressed = zlib.brotliCompressSync(body)')
    log.push('    res.end(compressed)')
    log.push('  } else if (acceptEncoding.includes("gzip")) {')
    log.push('    res.setHeader("Content-Encoding", "gzip")')
    log.push('    const compressed = zlib.gzipSync(body)')
    log.push('    res.end(compressed)')
    log.push('  } else {')
    log.push('    res.end(body)')
    log.push('  }')
    log.push('})')
    log.push('')

    // Compression options
    log.push('=== Параметры сжатия ===')
    log.push('')
    log.push('// Уровень сжатия (1-9)')
    log.push('zlib.gzipSync(data, { level: zlib.constants.Z_BEST_COMPRESSION })  // 9')
    log.push('zlib.gzipSync(data, { level: zlib.constants.Z_BEST_SPEED })        // 1')
    log.push('zlib.gzipSync(data, { level: 6 })  // default — баланс')
    log.push('')
    log.push('// Brotli параметры')
    log.push('zlib.brotliCompressSync(data, {')
    log.push('  params: {')
    log.push('    [zlib.constants.BROTLI_PARAM_QUALITY]: 11  // max: 11')
    log.push('  }')
    log.push('})')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.3: Zlib Compression</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Р��зультаты:</h3>
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
// Задание 13.4: Util & Misc — Решение
// ============================================

export function Task13_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== util — утилиты Node.js ===')
    log.push('')
    log.push('const util = require("util")')
    log.push('')

    // util.promisify
    log.push('=== util.promisify — callback → Promise ===')
    log.push('')
    log.push('const fs = require("fs")')
    log.push('const readFile = util.promisify(fs.readFile)')
    log.push('')
    log.push('// Теперь можно использовать async/await')
    log.push('const data = await readFile("file.txt", "utf8")')
    log.push('')
    log.push('// Работает с любыми error-first callback функциями')
    log.push('const exec = util.promisify(require("child_process").exec)')
    log.push('const { stdout } = await exec("ls -la")')
    log.push('')
    log.push('// Custom promisify (для нестандартных callback)')
    log.push('const dns = require("dns")')
    log.push('dns.lookup[util.promisify.custom] = (hostname) => {')
    log.push('  return new Promise((resolve, reject) => {')
    log.push('    dns.lookup(hostname, (err, address, family) => {')
    log.push('      if (err) reject(err)')
    log.push('      else resolve({ address, family })')
    log.push('    })')
    log.push('  })')
    log.push('}')
    log.push('')

    // util.inspect
    log.push('=== util.inspect — форматирование объектов ===')
    log.push('')
    log.push('const obj = {')
    log.push('  name: "John",')
    log.push('  nested: { deep: { value: 42, array: [1,2,3] } },')
    log.push('  date: new Date(),')
    log.push('  fn: function hello() {},')
    log.push('  [Symbol("id")]: 123')
    log.push('}')
    log.push('')
    log.push('// Базовое использование')
    log.push('console.log(util.inspect(obj, {')
    log.push('  depth: Infinity,    // глубина вложенности (default: 2)')
    log.push('  colors: true,       // цветной вывод')
    log.push('  showHidden: false,  // скрытые свойства')
    log.push('  compact: false,     // многострочный формат')
    log.push('  sorted: true,       // сортировка ключей')
    log.push('  showProxy: true,    // показывать Proxy')
    log.push('  maxArrayLength: 100 // макс. элементов массива')
    log.push('}))')
    log.push('')
    log.push('// Custom inspect для своих классов')
    log.push('class User {')
    log.push('  constructor(name, password) {')
    log.push('    this.name = name')
    log.push('    this.password = password')
    log.push('  }')
    log.push('  [util.inspect.custom](depth, options) {')
    log.push('    return `User { name: "${this.name}", password: "***" }`')
    log.push('  }')
    log.push('}')
    log.push('')

    // util.types
    log.push('=== util.types — проверка типов ===')
    log.push('')
    log.push('util.types.isDate(new Date())          // true')
    log.push('util.types.isRegExp(/abc/)              // true')
    log.push('util.types.isPromise(Promise.resolve()) // true')
    log.push('util.types.isAsyncFunction(async () => {}) // true')
    log.push('util.types.isGeneratorFunction(function*(){}) // true')
    log.push('util.types.isProxy(new Proxy({}, {}))   // true')
    log.push('util.types.isArrayBuffer(new ArrayBuffer(8)) // true')
    log.push('util.types.isMap(new Map())              // true')
    log.push('util.types.isSet(new Set())              // true')
    log.push('')

    // Console
    log.push('=== Console — кастомный вывод ===')
    log.push('')
    log.push('const { Console } = require("console")')
    log.push('')
    log.push('// Вывод в файл')
    log.push('const logger = new Console({')
    log.push('  stdout: fs.createWriteStream("app.log"),')
    log.push('  stderr: fs.createWriteStream("error.log"),')
    log.push('  inspectOptions: { depth: 4 }')
    log.push('})')
    log.push('')
    log.push('logger.log("Application started")')
    log.push('logger.error("Something failed")')
    log.push('')
    log.push('// console.table')
    log.push('console.table([')
    log.push('  { name: "John", age: 30 },')
    log.push('  { name: "Jane", age: 25 }')
    log.push('])')
    log.push('// ┌─────────┬────────┬─────┐')
    log.push('// │ (index) │  name  │ age │')
    log.push('// ├─────────┼────────┼─────┤')
    log.push('// │    0    │ "John" │  30 │')
    log.push('// │    1    │ "Jane" │  25 │')
    log.push('// └─────────┴────────┴─────┘')
    log.push('')
    log.push('// console.time / timeEnd')
    log.push('console.time("operation")')
    log.push('doSomething()')
    log.push('console.timeEnd("operation")  // operation: 12.345ms')
    log.push('')

    // readline
    log.push('=== readline — интерактивный ввод ===')
    log.push('')
    log.push('const readline = require("readline")')
    log.push('')
    log.push('const rl = readline.createInterface({')
    log.push('  input: process.stdin,')
    log.push('  output: process.stdout')
    log.push('})')
    log.push('')
    log.push('// Вопрос пользователю')
    log.push('rl.question("What is your name? ", (answer) => {')
    log.push('  console.log(`Hello, ${answer}!`)')
    log.push('  rl.close()')
    log.push('})')
    log.push('')
    log.push('// Promise-версия (Node.js 17+)')
    log.push('const { createInterface } = require("readline/promises")')
    log.push('const rl = createInterface({ input: process.stdin, output: process.stdout })')
    log.push('const name = await rl.question("Name: ")')
    log.push('rl.close()')
    log.push('')
    log.push('// Построчное чтение файла')
    log.push('const rl = readline.createInterface({')
    log.push('  input: fs.createReadStream("data.csv")')
    log.push('})')
    log.push('')
    log.push('for await (const line of rl) {')
    log.push('  const [name, age] = line.split(",")')
    log.push('  console.log(`${name}: ${age}`)')
    log.push('}')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.4: Util & Misc</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Рез��льтаты:</h3>
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
