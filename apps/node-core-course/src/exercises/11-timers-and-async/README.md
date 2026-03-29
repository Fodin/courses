# 🔥 Уровень 11: Таймеры и асинхронные паттерны

## 🎯 Введение

Node.js предоставляет богатый набор инструментов для работы с таймерами и асинхронными операциями. Помимо привычных `setTimeout`/`setInterval`, в арсенале разработчика есть `setImmediate`, `AbortController` для отмены операций и async iterators для поточной обработки данных.

Понимание этих механизмов критически важно для:
- Управления порядком выполнения кода
- Грамотной отмены долгих операций
- Эффективной обработки потоков данных
- Предотвращения утечек памяти и ресурсов

## 🔥 setTimeout / setInterval / setImmediate

### setTimeout — отложенное выполнение

```javascript
const timer = setTimeout(() => {
  console.log('Executed after ~100ms')
}, 100)

// Отмена
clearTimeout(timer)
```

📌 `setTimeout(fn, 0)` не означает мгновенное выполнение. Минимальная задержка — **1 мс** в Node.js. Колбэк выполнится на фазе **Timers** Event Loop.

### setInterval — периодическое выполнение

```javascript
const interval = setInterval(() => {
  console.log('Tick every second')
}, 1000)

// Остановка
clearInterval(interval)
```

⚠️ setInterval не гарантирует точный интервал. Если колбэк выполняется дольше интервала, следующий вызов произойдет сразу после завершения текущего.

### setImmediate — выполнение на фазе Check

```javascript
setImmediate(() => {
  console.log('Check phase')
})
```

`setImmediate` выполняется на фазе **Check** Event Loop, сразу после фазы **Poll**. Внутри I/O колбэков `setImmediate` **всегда** выполнится раньше `setTimeout(fn, 0)`.

## 🔥 ref() / unref() — управление жизнью процесса

Таймеры по умолчанию удерживают процесс Node.js от завершения. `unref()` позволяет процессу завершиться, даже если таймер ещё активен:

```javascript
const heartbeat = setInterval(() => {
  sendPing()
}, 30000)

// Процесс завершится, если heartbeat — единственная активная операция
heartbeat.unref()

// Вернуть удержание
heartbeat.ref()

// Проверить состояние
heartbeat.hasRef() // true или false
```

### Типичные сценарии unref()

```javascript
// ✅ Heartbeat — не блокирует завершение
const hb = setInterval(ping, 10000)
hb.unref()

// ✅ Graceful shutdown timeout
const shutdownTimer = setTimeout(() => {
  process.exit(1) // force exit
}, 30000)
shutdownTimer.unref() // не мешает нормальному завершению
```

## 🔥 refresh() — перезапуск таймера

`refresh()` сбрасывает таймер без пересоздания. Эффективнее, чем `clearTimeout` + `setTimeout`:

```javascript
const inactivityTimer = setTimeout(() => {
  disconnectUser()
}, 60000)

// При каждом действии пользователя
socket.on('data', () => {
  inactivityTimer.refresh() // сброс без пересоздания
})
```

## 🔥 timers/promises — промисифицированные таймеры

Node.js 16+ предоставляет Promise-версии таймеров:

```javascript
const { setTimeout: sleep, setInterval } = require('timers/promises')

// await-able setTimeout
await sleep(1000)
console.log('1 second passed')

// С возвращаемым значением
const result = await sleep(1000, 'done')
console.log(result) // "done"

// Async iterable setInterval
for await (const _ of setInterval(1000)) {
  console.log('tick')
  if (shouldStop) break
}
```

## 🔥 AbortController — отмена операций

`AbortController` — стандартный механизм отмены асинхронных операций. Изначально из Web API, полностью поддерживается в Node.js.

### Базовое использование

```javascript
const controller = new AbortController()
const { signal } = controller

// signal передаётся в API
fetch(url, { signal })
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Cancelled')
    }
  })

// Отмена
controller.abort()
```

### abort() с причиной

```javascript
controller.abort('User cancelled')
controller.abort(new Error('Timeout'))

signal.aborted // true
signal.reason  // значение, переданное в abort()
```

### AbortSignal.timeout() — автоматический таймаут

```javascript
// Автоматически abort через 5 секунд
const signal = AbortSignal.timeout(5000)

await fetch(url, { signal })
```

### AbortSignal.any() — композиция сигналов (Node.js 20+)

```javascript
const userCancel = new AbortController()
const timeout = AbortSignal.timeout(30000)

// Отмена при ЛЮБОМ из сигналов
const combined = AbortSignal.any([
  userCancel.signal,
  timeout
])

await fetch(url, { signal: combined })
```

### throwIfAborted() — проверка в цикле

```javascript
for (const item of items) {
  signal.throwIfAborted() // throws if aborted
  await processItem(item)
}
```

### Отменяемые таймеры

```javascript
const { setTimeout: sleep } = require('timers/promises')

const ac = new AbortController()

try {
  await sleep(10000, null, { signal: ac.signal })
} catch (err) {
  // AbortError
}

// Отмена извне
ac.abort()
```

## 🔥 Async Iterators

Async iterators позволяют обрабатывать асинхронные последовательности данных с помощью `for-await-of`.

### Symbol.asyncIterator

```javascript
const asyncRange = {
  [Symbol.asyncIterator]() {
    let i = 0
    return {
      async next() {
        if (i < 5) {
          await sleep(100)
          return { value: i++, done: false }
        }
        return { done: true }
      }
    }
  }
}

for await (const num of asyncRange) {
  console.log(num) // 0, 1, 2, 3, 4
}
```

### Async Generators

Более удобный синтаксис через `async function*`:

```javascript
async function* fetchAllPages(url) {
  let page = 1
  while (true) {
    const res = await fetch(`${url}?page=${page}`)
    const data = await res.json()
    if (data.items.length === 0) return
    yield data.items
    page++
  }
}

for await (const items of fetchAllPages('/api/users')) {
  console.log(`Page with ${items.length} users`)
}
```

### Streams как async iterators

Readable streams в Node.js реализуют `Symbol.asyncIterator`:

```javascript
const stream = fs.createReadStream('file.txt', { encoding: 'utf8' })

for await (const chunk of stream) {
  process.stdout.write(chunk)
}
// Stream автоматически закрывается
```

### events.on() — EventEmitter как async iterator

```javascript
const { on } = require('events')

const server = http.createServer()

for await (const [req, res] of on(server, 'request')) {
  res.end('Hello')
}
```

С AbortSignal для остановки:

```javascript
const ac = new AbortController()

for await (const [data] of on(emitter, 'data', { signal: ac.signal })) {
  if (data === 'stop') ac.abort()
  console.log(data)
}
```

### Pipeline с async generators

```javascript
async function* toUpperCase(source) {
  for await (const chunk of source) {
    yield chunk.toString().toUpperCase()
  }
}

const { pipeline } = require('stream/promises')
await pipeline(
  fs.createReadStream('input.txt'),
  toUpperCase,
  fs.createWriteStream('output.txt')
)
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: Утечка таймеров

```javascript
// ❌ Плохо — таймер никогда не очищается
function startPolling() {
  setInterval(async () => {
    await checkStatus()
  }, 5000)
}

// ✅ Хорошо — сохраняем ссылку и очищаем
function startPolling() {
  const interval = setInterval(async () => {
    await checkStatus()
  }, 5000)
  return () => clearInterval(interval)
}
const stopPolling = startPolling()
// Позже:
stopPolling()
```

### Ошибка 2: Забытый AbortController cleanup

```javascript
// ❌ Плохо — listener остаётся после отмены
signal.addEventListener('abort', handler)

// ✅ Хорошо — once: true
signal.addEventListener('abort', handler, { once: true })
```

### Ошибка 3: break без cleanup в for-await-of

```javascript
// ❌ Плохо — stream может остаться незакрытым при ошибке
for await (const chunk of stream) {
  if (foundTarget) break
}

// ✅ Хорошо — stream.destroy() при раннем выходе
// (Node.js автоматически вызывает return() на итераторе при break,
//  но для streams лучше явный destroy)
try {
  for await (const chunk of stream) {
    if (foundTarget) break
  }
} finally {
  stream.destroy()
}
```

### Ошибка 4: setInterval с async колбэком

```javascript
// ❌ Плохо — overlap если операция дольше интервала
setInterval(async () => {
  await longOperation() // 3 секунды
}, 1000) // запускается каждую секунду

// ✅ Хорошо — ждём завершения перед следующим запуском
async function poll() {
  while (true) {
    await longOperation()
    await sleep(1000)
  }
}
```

## 💡 Best Practices

1. **unref()** для вспомогательных таймеров (heartbeat, cleanup), чтобы не блокировать завершение процесса
2. **refresh()** вместо clearTimeout + setTimeout для сброса таймеров
3. **AbortController** для всех отменяемых операций — единый стандарт
4. **AbortSignal.timeout()** вместо ручного setTimeout + abort
5. **for-await-of** для потоковой обработки вместо event listeners
6. **events.on()** для превращения EventEmitter в async iterator
7. **timers/promises** для await-able таймеров
8. Всегда **очищайте таймеры** при завершении работы
