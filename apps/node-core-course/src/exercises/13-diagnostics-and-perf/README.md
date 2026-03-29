# 🔥 Уровень 13: Диагностика и производительность

## 🎯 Введение

Node.js предоставляет мощные встроенные инструменты для диагностики производительности, профилирования памяти, сжатия данных и различных утилит. Эти инструменты критически важны для:

- Измерения и оптимизации производительности
- Обнаружения и устранения утечек памяти
- Сжатия HTTP-ответов и файлов
- Работы с вводом/выводом и форматированием данных

## 🔥 perf_hooks — Performance API

Модуль `perf_hooks` предоставляет Web Performance API для Node.js — высокоточные измерения времени.

### performance.now()

```javascript
const { performance } = require('perf_hooks')

const start = performance.now()
doExpensiveOperation()
const duration = performance.now() - start
console.log(`Duration: ${duration.toFixed(2)}ms`)
```

📌 В отличие от `Date.now()`, `performance.now()` монотонный (не зависит от изменений системного времени) и имеет точность до микросекунд.

### Marks & Measures

```javascript
// Marks — именованные метки во времени
performance.mark('start-db')
await db.query(sql)
performance.mark('end-db')

// Measure — вычислить длительность между метками
performance.measure('db-query', 'start-db', 'end-db')

const entries = performance.getEntriesByName('db-query')
console.log(entries[0].duration) // 45.23
```

### PerformanceObserver

Реактивный мониторинг — получение уведомлений при появлении новых записей:

```javascript
const { PerformanceObserver } = require('perf_hooks')

const obs = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`)
  })
})

obs.observe({ entryTypes: ['measure'] })
```

Доступные entryTypes: `mark`, `measure`, `function`, `gc`, `http`.

### performance.timerify()

Автоматическое измерение времени выполнения функции:

```javascript
function heavyComputation(n) {
  let sum = 0
  for (let i = 0; i < n; i++) sum += i
  return sum
}

const timerified = performance.timerify(heavyComputation)

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration) // 2.45ms
})
obs.observe({ entryTypes: ['function'] })

timerified(1000000)
```

### Мониторинг GC

```javascript
// node --expose-gc app.js
const obs = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`GC ${entry.kind}: ${entry.duration.toFixed(2)}ms`)
    // kind: 1=Scavenge, 2=Mark-Sweep, 4=Incremental, 8=Weak
  })
})
obs.observe({ entryTypes: ['gc'] })
```

## 🔥 Memory Profiling

### process.memoryUsage()

```javascript
const mem = process.memoryUsage()
// {
//   rss: 45_678_592,       — Resident Set Size (полный RAM)
//   heapTotal: 18_612_224, — V8 heap выделено
//   heapUsed: 16_789_012,  — V8 heap используется
//   external: 1_234_567,   — C++ объекты (Buffer)
//   arrayBuffers: 456_789  — ArrayBuffer
// }
```

### Обнаружение утечек памяти

Признаки утечки:
- `heapUsed` постоянно растёт без снижения
- `rss` только увеличивается
- GC не уменьшает потребление

```javascript
// Мониторинг
const formatMB = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB'

setInterval(() => {
  const { heapUsed, rss } = process.memoryUsage()
  console.log(`Heap: ${formatMB(heapUsed)}, RSS: ${formatMB(rss)}`)
}, 10000)
```

### Типичные утечки

1. **Глобальные коллекции** без ограничения размера
2. **EventEmitter listeners** без removeListener
3. **Closures**, удерживающие большие объекты
4. **Незакрытые streams и timers**

### Heap Snapshots

```javascript
const v8 = require('v8')

// Записать snapshot
v8.writeHeapSnapshot() // → "Heap-20240101-123456.heapsnapshot"

// Открыть в Chrome DevTools → Memory → Load

// По сигналу:
process.on('SIGUSR2', () => v8.writeHeapSnapshot())
```

### v8.getHeapStatistics()

```javascript
const stats = v8.getHeapStatistics()
// heap_size_limit: ~2GB по умолчанию
// number_of_detached_contexts: 0 (должно быть 0!)
```

## 🔥 Zlib — сжатие данных

### Синхронное сжатие

```javascript
const zlib = require('zlib')

// Gzip
const gzipped = zlib.gzipSync(data)
const original = zlib.gunzipSync(gzipped)

// Deflate
const deflated = zlib.deflateSync(data)
const inflated = zlib.inflateSync(deflated)

// Brotli
const brotli = zlib.brotliCompressSync(data)
const decompressed = zlib.brotliDecompressSync(brotli)
```

### Сравнение алгоритмов

| Алгоритм | Степень сжатия | Скорость | Использование |
|----------|---------------|----------|---------------|
| gzip | Средняя | Быстрый | HTTP, файлы |
| deflate | Средняя | Быстрый | Внутри gzip/zip |
| brotli | Лучшая | Медленнее | Статика для web |

### Потоковое сжатие

```javascript
const { pipeline } = require('stream/promises')

// Сжатие файла
await pipeline(
  fs.createReadStream('input.log'),
  zlib.createGzip(),
  fs.createWriteStream('input.log.gz')
)

// Распаковка
await pipeline(
  fs.createReadStream('input.log.gz'),
  zlib.createGunzip(),
  fs.createWriteStream('input.log')
)
```

### HTTP сжатие

```javascript
http.createServer((req, res) => {
  const encoding = req.headers['accept-encoding'] || ''
  const body = JSON.stringify(data)

  if (encoding.includes('br')) {
    res.setHeader('Content-Encoding', 'br')
    res.end(zlib.brotliCompressSync(body))
  } else if (encoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip')
    res.end(zlib.gzipSync(body))
  } else {
    res.end(body)
  }
})
```

## 🔥 util — утилиты

### util.promisify

Преобразует callback-функции в Promise-based:

```javascript
const util = require('util')
const fs = require('fs')

const readFile = util.promisify(fs.readFile)
const data = await readFile('file.txt', 'utf8')

const exec = util.promisify(require('child_process').exec)
const { stdout } = await exec('ls -la')
```

### util.inspect

Форматирование объектов для отладки:

```javascript
console.log(util.inspect(obj, {
  depth: Infinity,
  colors: true,
  compact: false,
  sorted: true,
  maxArrayLength: 100
}))

// Custom inspect для классов
class User {
  [util.inspect.custom](depth, options) {
    return `User { name: "${this.name}", password: "***" }`
  }
}
```

### util.types

Точная проверка типов:

```javascript
util.types.isDate(new Date())              // true
util.types.isRegExp(/abc/)                 // true
util.types.isPromise(Promise.resolve())    // true
util.types.isAsyncFunction(async () => {}) // true
util.types.isProxy(new Proxy({}, {}))      // true
```

## 🔥 Console — кастомный вывод

```javascript
const { Console } = require('console')

// Вывод в файл
const logger = new Console({
  stdout: fs.createWriteStream('app.log'),
  stderr: fs.createWriteStream('error.log')
})

// Полезные методы
console.table([{ name: 'John', age: 30 }])
console.time('op')
doSomething()
console.timeEnd('op') // op: 12.345ms
console.count('label') // label: 1, label: 2, ...
```

## 🔥 readline — интерактивный ввод

```javascript
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Name: ', (answer) => {
  console.log(`Hello, ${answer}!`)
  rl.close()
})

// Promise-версия (Node.js 17+)
const { createInterface } = require('readline/promises')
const rl = createInterface({ input: process.stdin, output: process.stdout })
const name = await rl.question('Name: ')
rl.close()
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: Date.now() для замеров

```javascript
// ❌ Плохо — низкая точность, зависит от системного времени
const start = Date.now()
doWork()
console.log(Date.now() - start)

// ✅ Хорошо — performance.now()
const start = performance.now()
doWork()
console.log(performance.now() - start)
```

### Ошибка 2: Синхронное сжатие в hot path

```javascript
// ❌ Плохо — блокирует Event Loop
app.get('/data', (req, res) => {
  const compressed = zlib.gzipSync(hugeData) // блокирующий вызов!
  res.end(compressed)
})

// ✅ Хорошо — потоковое сжатие
app.get('/data', (req, res) => {
  res.setHeader('Content-Encoding', 'gzip')
  const gzip = zlib.createGzip()
  readStream.pipe(gzip).pipe(res)
})
```

### Ошибка 3: Игнорирование утечек памяти

```javascript
// ❌ Плохо — кеш растёт бесконечно
const cache = new Map()
function getData(key) {
  if (!cache.has(key)) cache.set(key, fetchData(key))
  return cache.get(key)
}

// ✅ Хорошо — LRU-кеш с ограничением
const LRU = require('lru-cache')
const cache = new LRU({ max: 1000 })
```

### Ошибка 4: promisify с методами, зависящими от this

```javascript
// ❌ Плохо — потеря контекста this
const getUser = util.promisify(db.getUser)

// ✅ Хорошо — bind
const getUser = util.promisify(db.getUser.bind(db))
```

## 💡 Best Practices

1. **performance.now()** вместо Date.now() для замеров
2. **PerformanceObserver** для реактивного мониторинга
3. **Потоковое сжатие** через pipeline, не синхронное
4. **Brotli** для статики, **gzip** для динамики
5. **Heap snapshots** для диагностики утечек
6. **util.inspect.custom** для безопасного логирования (скрытие паролей)
7. **readline/promises** вместо callback-версии
8. **Периодический мониторинг** memoryUsage для обнаружения утечек
