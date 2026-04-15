# Web Workers и Worker Threads

## Зачем нужны Web Workers

Представьте ресторан. Шеф-повар (главный поток) принимает заказы, готовит блюда и одновременно общается с гостями. Если блюдо сложное — гости ждут и не получают никаких ответов. Решение: нанять помощника на кухню (Web Worker), который занимается сложным блюдом, пока шеф продолжает общаться с гостями.

Именно это делает Web Worker: берёт тяжёлую CPU-bound задачу и выполняет её **в отдельном потоке**, не блокируя главный.

```js
// Без Worker: UI замирает на несколько секунд
function fib(n) {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)
}
fib(45) // главный поток занят — кнопки не работают, анимации стоят

// С Worker: UI свободен
const worker = new Worker('worker.js')
worker.postMessage({ n: 45 })
worker.onmessage = (e) => console.log('Результат:', e.data)
// Пока Worker считает — страница полностью отзывчива
```

## Создание Worker

Web Worker создаётся через конструктор `new Worker(url)`. URL может указывать на отдельный файл или на Blob (встроенный воркер):

```js
// Вариант 1: отдельный файл worker.js
const worker = new Worker('/workers/heavy-calc.js')

// Вариант 2: Inline Worker через Blob URL (удобно в сборщиках)
const code = `
  self.onmessage = function(e) {
    const result = heavyCalc(e.data)
    self.postMessage(result)
  }
`
const blob = new Blob([code], { type: 'application/javascript' })
const url = URL.createObjectURL(blob)
const worker = new Worker(url)
URL.revokeObjectURL(url) // освободить после создания
```

## Коммуникация: postMessage / onmessage

Главный поток и Worker общаются через систему сообщений. Это **асинхронная** коммуникация — нет общей памяти, нет блокировок.

```js
// --- Главный поток ---
const worker = new Worker('worker.js')

// Отправить сообщение в Worker
worker.postMessage({ type: 'calculate', n: 42 })

// Получить ответ от Worker
worker.onmessage = (event) => {
  console.log('Ответ:', event.data)
}

// Обработать ошибку из Worker
worker.onerror = (error) => {
  console.error('Worker упал:', error.message)
}

// Завершить Worker
worker.terminate()
```

```js
// --- worker.js (код внутри Worker) ---
self.onmessage = function(event) {
  const { type, n } = event.data
  if (type === 'calculate') {
    const result = fib(n)     // тяжёлое вычисление — не блокирует главный поток
    self.postMessage(result)  // отправить результат обратно
  }
}
```

## Structured Clone Algorithm

Данные между потоками **не передаются по ссылке** — они клонируются. Алгоритм Structured Clone глубоко копирует объект.

Что можно передать:

| Тип данных | Клонируется? |
|---|---|
| `Object`, `Array` | ✅ Да |
| `Date`, `RegExp` | ✅ Да |
| `Map`, `Set` | ✅ Да |
| `ArrayBuffer`, `TypedArray` | ✅ Да |
| `Error` | ✅ Да |
| `Function` | ❌ Нет — DataCloneError |
| `DOM Node` | ❌ Нет — DataCloneError |
| `Symbol` | ❌ Нет |

```js
// Мутация объекта в Worker не влияет на оригинал
const obj = { value: 42 }
worker.postMessage(obj)
// obj.value по-прежнему 42 — Worker работает с копией
```

## Transferable Objects: передача без копирования

Для больших данных (ArrayBuffer, ImageBitmap) клонирование дорого. **Transferable objects** передаются без копирования — владение объектом переходит к Worker, а у отправителя объект становится пустым.

```js
const buffer = new ArrayBuffer(100 * 1024 * 1024) // 100 MB
console.log(buffer.byteLength) // 104857600

// Передать (Transfer) — мгновенно, без копирования
worker.postMessage(buffer, [buffer]) // второй аргумент — список transferables

console.log(buffer.byteLength) // 0 — буфер теперь принадлежит Worker
```

Transferable types:
- `ArrayBuffer`
- `MessagePort`
- `OffscreenCanvas`
- `ImageBitmap`
- `ReadableStream`, `WritableStream`

## Inline Worker через Blob URL

Удобный паттерн для современных приложений — создавать Worker прямо в JS-коде:

```js
function createWorker(fn: (data: unknown) => unknown) {
  const code = `
    self.onmessage = function(e) {
      const result = (${fn.toString()})(e.data)
      self.postMessage(result)
    }
  `
  const blob = new Blob([code], { type: 'application/javascript' })
  return new Worker(URL.createObjectURL(blob))
}

const worker = createWorker((n: number) => {
  // Этот код будет выполняться в Worker
  function fib(x: number): number {
    return x <= 1 ? x : fib(x - 1) + fib(x - 2)
  }
  return fib(n as number)
})
```

## SharedWorker — один на несколько вкладок

Обычный `Worker` создаётся заново для каждой страницы. `SharedWorker` живёт один на все вкладки с одним origin.

```js
// Подключиться к SharedWorker (или создать, если не существует)
const shared = new SharedWorker('/shared-worker.js')
shared.port.start()
shared.port.postMessage('hello')
shared.port.onmessage = (e) => console.log(e.data)
```

## Web Worker vs Worker Threads (Node.js)

| Характеристика | Web Worker (Browser) | Worker Threads (Node.js) |
|---|---|---|
| API | `new Worker(url)` | `new Worker(filename)` |
| Данные запуска | `postMessage` | `workerData` |
| Общая память | `SharedArrayBuffer` | `SharedArrayBuffer` |
| Доступ к DOM | Нет | Нет (нет DOM) |
| `require`/`import` | ES modules только | Полный Node.js API |
| Ошибки | `worker.onerror` | `worker.on('error')` |

## Worker Pool паттерн

Создавать Worker для каждой задачи дорого — инициализация занимает время. Паттерн Worker Pool решает это:

```
Задачи: [T1, T2, T3, T4, T5, T6, T7, T8]
                   |
           [Worker Pool: 4 workers]
           W1  W2  W3  W4
           T1  T2  T3  T4  <- выполняются параллельно
           T5  T6  T7  T8  <- следующая партия, когда воркер освободился
```

```js
class WorkerPool {
  private workers: Worker[] = []
  private queue: Array<{ data: unknown, resolve: Function }> = []
  private idle: Worker[] = []

  constructor(size: number, workerCode: string) {
    for (let i = 0; i < size; i++) {
      const w = createInlineWorker(workerCode)
      w.onmessage = (e) => this.onResult(w, e.data)
      this.workers.push(w)
      this.idle.push(w)
    }
  }

  run(data: unknown): Promise<unknown> {
    return new Promise((resolve) => {
      const worker = this.idle.pop()
      if (worker) {
        worker.postMessage(data)
        // ... связать resolve с worker
      } else {
        this.queue.push({ data, resolve })
      }
    })
  }
}
```

## Ограничения Web Workers

- Нет доступа к `document`, `window`, `DOM`
- Нет доступа к `localStorage` / `sessionStorage`
- Есть доступ к `fetch`, `WebSocket`, `IndexedDB`, `console`
- Нет `alert`, `confirm`, `prompt`
- Для canvas нужен `OffscreenCanvas`

## Частые ошибки новичков

❌ **Передавать функции через postMessage**

```js
// Ломается — DataCloneError
worker.postMessage(() => console.log('hello'))
```

✅ Передавайте только данные, логику держите в коде Worker.

❌ **Создавать Worker внутри цикла без пула**

```js
// Создаёт 1000 воркеров — дорого
for (const task of tasks) {
  new Worker('calc.js').postMessage(task)
}
```

✅ Используйте Worker Pool — заранее созданные воркеры берут задачи из очереди.

❌ **Забывать terminate() после завершения**

```js
// Worker продолжает занимать память
const worker = new Worker('calc.js')
worker.postMessage(data)
worker.onmessage = (e) => console.log(e.data) // не вызвали terminate!
```

✅

```js
worker.onmessage = (e) => {
  console.log(e.data)
  worker.terminate() // освободить ресурсы
}
```

❌ **Ждать ответа синхронно**

```js
// Так нельзя — Worker асинхронен
worker.postMessage(data)
const result = worker.response // undefined — ответа ещё нет
```

✅ Всегда используйте `onmessage` или оберните в Promise.
