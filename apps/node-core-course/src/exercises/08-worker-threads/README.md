# 🔥 Уровень 8: Worker Threads

## 🎯 Введение

Node.js работает в одном потоке, но модуль `worker_threads` позволяет создавать дополнительные потоки для CPU-интенсивных задач. В отличие от `child_process.fork()`, Worker Threads работают **в одном процессе** и могут **разделять память** через `SharedArrayBuffer`.

Когда использовать Worker Threads:
- Хеширование и шифрование больших объёмов данных
- Парсинг и трансформация больших файлов (JSON, CSV, XML)
- Обработка изображений / видео
- Тяжёлые математические вычисления
- Любая CPU-bound работа, блокирующая event loop

Когда **НЕ** использовать:
- I/O-задачи (запросы к БД, HTTP) — Node.js уже обрабатывает их асинхронно
- Простые операции — оверхед создания потока не окупится

## 🔥 Создание Worker

```javascript
// main.js
const { Worker, isMainThread } = require('worker_threads')

if (isMainThread) {
  const worker = new Worker('./worker.js', {
    workerData: { input: 'hello' },
  })

  worker.on('message', (result) => {
    console.log('Результат:', result)
  })

  worker.on('error', (err) => {
    console.error('Ошибка в worker:', err)
  })

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker остановлен с кодом ${code}`)
    }
  })
}
```

```javascript
// worker.js
const { workerData, parentPort } = require('worker_threads')

// workerData содержит данные из конструктора
const result = workerData.input.toUpperCase()

// Отправить результат в главный поток
parentPort.postMessage(result)
```

### Параметры конструктора Worker

```javascript
new Worker(filename, {
  // Данные для worker (клонируются через structured clone)
  workerData: { key: 'value' },

  // Переменные окружения
  env: Worker.SHARE_ENV,  // разделять env с главным потоком
  // env: { MY_VAR: '1' }, // или свой набор

  // Флаги Node.js для worker
  execArgv: ['--max-old-space-size=512'],

  // Лимиты ресурсов
  resourceLimits: {
    maxOldGenerationSizeMb: 512,  // макс. old space heap
    maxYoungGenerationSizeMb: 64, // макс. young space heap
    codeRangeSizeMb: 64,          // макс. код
    stackSizeMb: 4,               // размер стека
  },

  // Transferable objects (передаются без копирования)
  transferList: [arrayBuffer],
})
```

### Inline Worker (без отдельного файла)

```javascript
const worker = new Worker(`
  const { parentPort } = require('worker_threads')
  parentPort.postMessage(2 + 2)
`, { eval: true })

worker.on('message', (msg) => console.log(msg)) // 4
```

## 🔥 Обмен сообщениями

### postMessage — structured clone

```javascript
// Данные КЛОНИРУЮТСЯ (не передаются по ссылке)
worker.postMessage({
  numbers: [1, 2, 3],
  nested: { a: 1 },
  date: new Date(),
  regexp: /test/gi,
  map: new Map([['a', 1]]),
  set: new Set([1, 2, 3]),
  buffer: Buffer.from('hello'),
})

// ❌ Нельзя передать:
worker.postMessage({
  fn: () => {},        // функции
  symbol: Symbol('x'), // символы
  weakRef: new WeakRef(obj), // WeakRef
})
```

### Transfer — передача без копирования

```javascript
const buffer = new ArrayBuffer(1024 * 1024) // 1 МБ

// Клонирование: 1 МБ копируется (медленно для больших буферов)
worker.postMessage({ data: buffer })

// Transfer: буфер ПЕРЕМЕЩАЕТСЯ (мгновенно, O(1))
worker.postMessage({ data: buffer }, [buffer])
// После transfer buffer.byteLength === 0 в отправителе!
```

📌 **Transfer** подходит для `ArrayBuffer`, `MessagePort`, `ReadableStream`, `WritableStream`, `TransformStream`. Данные перемещаются — в отправителе они становятся недоступны.

### MessageChannel — прямая связь между workers

```javascript
const { MessageChannel } = require('worker_threads')
const { port1, port2 } = new MessageChannel()

const worker1 = new Worker('./w1.js')
const worker2 = new Worker('./w2.js')

// Передать порты в workers
worker1.postMessage({ port: port1 }, [port1])
worker2.postMessage({ port: port2 }, [port2])

// Теперь worker1 и worker2 общаются напрямую
```

## 🔥 SharedArrayBuffer и Atomics

### SharedArrayBuffer — разделяемая память

```javascript
// Создать буфер, общий для всех потоков
const sharedBuffer = new SharedArrayBuffer(1024)

// Передать в worker (НЕ копируется, а разделяется)
worker.postMessage({ buffer: sharedBuffer })

// Оба потока работают с ОДНОЙ памятью
const view = new Int32Array(sharedBuffer)
view[0] = 42 // виден в обоих потоках
```

### Race Condition — проблема

```javascript
// Thread 1 и Thread 2 одновременно делают view[0]++
//
// Thread 1: read view[0] → 0
// Thread 2: read view[0] → 0  (ещё не записано!)
// Thread 1: write view[0] = 1
// Thread 2: write view[0] = 1  (перезаписал!)
//
// Результат: 1 вместо 2
```

### Atomics — решение

```javascript
const view = new Int32Array(sharedBuffer)

// Атомарные операции (неделимые, thread-safe)
Atomics.store(view, 0, 42)        // view[0] = 42
Atomics.load(view, 0)             // прочитать view[0]
Atomics.add(view, 0, 1)           // view[0] += 1 (возвращает старое)
Atomics.sub(view, 0, 1)           // view[0] -= 1
Atomics.and(view, 0, 0xFF)        // view[0] &= 0xFF
Atomics.or(view, 0, 0x0F)         // view[0] |= 0x0F
Atomics.xor(view, 0, 0xFF)        // view[0] ^= 0xFF
Atomics.exchange(view, 0, 99)     // view[0] = 99 (возвращает старое)
Atomics.compareExchange(view, 0, expected, desired)
// if view[0] === expected: view[0] = desired
```

### Wait / Notify — синхронизация потоков

```javascript
// Worker (ожидающий поток):
const result = Atomics.wait(view, 0, 0)
// Блокирует поток, пока view[0] === 0
// Возвращает: "ok", "not-equal", "timed-out"

Atomics.wait(view, 0, 0, 5000) // с таймаутом 5 сек

// Main thread (нельзя wait, но можно waitAsync):
const promise = Atomics.waitAsync(view, 0, 0)
// { async: true, value: Promise<"ok"|"not-equal"|"timed-out"> }

// Пробуждение:
Atomics.notify(view, 0, 1) // пробудить 1 поток
Atomics.notify(view, 0)    // пробудить все потоки
```

⚠️ `Atomics.wait()` **нельзя** вызывать в главном потоке — он заблокирует event loop!

### Паттерн: Mutex на Atomics

```javascript
const UNLOCKED = 0
const LOCKED = 1

class Mutex {
  constructor(sharedBuffer, offset = 0) {
    this.view = new Int32Array(sharedBuffer, offset, 1)
  }

  lock() {
    while (true) {
      // Попытка захватить блокировку
      if (Atomics.compareExchange(this.view, 0, UNLOCKED, LOCKED) === UNLOCKED) {
        return // захвачена
      }
      // Ждать освобождения
      Atomics.wait(this.view, 0, LOCKED)
    }
  }

  unlock() {
    Atomics.store(this.view, 0, UNLOCKED)
    Atomics.notify(this.view, 0, 1)
  }
}
```

## 🔥 Worker Pool

### Зачем нужен пул

Создание Worker — дорогая операция (~5-30ms). Если у вас сотни задач, создавать отдельный Worker на каждую — расточительно. Worker Pool переиспользует фиксированное количество Workers:

```javascript
const { Worker } = require('worker_threads')
const os = require('os')

class WorkerPool {
  constructor(workerFile, size = os.cpus().length) {
    this.workerFile = workerFile
    this.workers = []
    this.freeWorkers = []
    this.taskQueue = []

    for (let i = 0; i < size; i++) {
      this.addWorker()
    }
  }

  addWorker() {
    const worker = new Worker(this.workerFile)

    worker.on('message', (result) => {
      const { resolve } = worker.currentTask
      worker.currentTask = null
      this.freeWorkers.push(worker)
      resolve(result)
      this.processQueue()
    })

    worker.on('error', (err) => {
      if (worker.currentTask) {
        worker.currentTask.reject(err)
        worker.currentTask = null
      }
      // Заменить упавший worker
      this.workers = this.workers.filter(w => w !== worker)
      this.addWorker()
    })

    this.workers.push(worker)
    this.freeWorkers.push(worker)
  }

  runTask(data) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject }
      const worker = this.freeWorkers.pop()
      if (worker) {
        worker.currentTask = task
        worker.postMessage(data)
      } else {
        this.taskQueue.push(task)
      }
    })
  }

  processQueue() {
    if (this.taskQueue.length > 0 && this.freeWorkers.length > 0) {
      const task = this.taskQueue.shift()
      const worker = this.freeWorkers.pop()
      worker.currentTask = task
      worker.postMessage(task.data)
    }
  }

  async destroy() {
    await Promise.all(this.workers.map(w => w.terminate()))
  }
}
```

### Использование

```javascript
const pool = new WorkerPool('./hash-worker.js', 4)

// Параллельная обработка
const results = await Promise.all(
  files.map(file => pool.runTask({ file }))
)

await pool.destroy()
```

## 🔥 Worker Threads vs child_process.fork

| Характеристика | Worker Threads | child_process.fork |
|----------------|---------------|-------------------|
| Изоляция | Один процесс | Разные процессы |
| Память | ~5-10 МБ на worker | ~30 МБ на процесс |
| Общая память | SharedArrayBuffer | Нет |
| Коммуникация | postMessage (structured clone) | IPC (JSON) |
| Startup time | ~5-30ms | ~50-100ms |
| Crash impact | Может повредить весь процесс | Изолированный |

## ⚠️ Частые ошибки новичков

### Ошибка 1: Worker для I/O задач

```javascript
// ❌ Плохо — HTTP запросы и так асинхронные
const worker = new Worker(`
  const fetch = require('node-fetch')
  const data = await fetch('https://api.example.com/data')
  parentPort.postMessage(data)
`, { eval: true })

// ✅ Хорошо — просто используйте async/await
const data = await fetch('https://api.example.com/data')
```

### Ошибка 2: Создание Worker на каждый запрос

```javascript
// ❌ Плохо — оверхед создания потока
app.get('/hash', (req, res) => {
  const worker = new Worker('./hasher.js', { workerData: req.body })
  worker.on('message', (hash) => res.json({ hash }))
})

// ✅ Хорошо — пул workers
const pool = new WorkerPool('./hasher.js', 4)
app.get('/hash', async (req, res) => {
  const hash = await pool.runTask(req.body)
  res.json({ hash })
})
```

### Ошибка 3: Мутация SharedArrayBuffer без Atomics

```javascript
// ❌ Плохо — race condition
const view = new Int32Array(sharedBuffer)
view[0]++ // НЕ атомарная операция!

// ✅ Хорошо
Atomics.add(view, 0, 1)
```

### Ошибка 4: Попытка передать функцию в Worker

```javascript
// ❌ Плохо — функции не сериализуются
worker.postMessage({ transform: (x) => x * 2 })
// DataCloneError!

// ✅ Хорошо — передайте имя операции
worker.postMessage({ operation: 'double', value: 5 })
```

## 💡 Best Practices

1. **Размер пула = количество CPU ядер** (`os.cpus().length`) — больше не даёт прироста
2. **Используйте Transfer для больших буферов** — избегайте копирования мегабайтов
3. **SharedArrayBuffer только когда критична производительность** — Atomics усложняют код
4. **Обрабатывайте ошибки и перезапускайте workers** — упавший worker нужно заменить
5. **Измеряйте перед оптимизацией** — Worker Threads имеют оверхед, не всегда быстрее
6. **Не блокируйте главный поток Atomics.wait** — используйте waitAsync
