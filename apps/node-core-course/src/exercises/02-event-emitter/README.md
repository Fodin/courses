# 🔥 Уровень 2: EventEmitter

## 🎯 Зачем понимать EventEmitter

EventEmitter -- это основа событийной архитектуры Node.js. Практически все ключевые модули построены на нём:

- `http.Server` — события `request`, `connection`, `close`
- `fs.ReadStream` — события `data`, `end`, `error`
- `net.Socket` — события `connect`, `data`, `close`
- `process` — события `exit`, `uncaughtException`

Понимание EventEmitter необходимо для работы с любым нетривиальным Node.js-приложением.

## 📌 Основы EventEmitter

```js
const EventEmitter = require('events')
const emitter = new EventEmitter()

// Подписка на событие
emitter.on('data', (chunk) => {
  console.log('Received:', chunk)
})

// Генерация события
emitter.emit('data', 'Hello World')
// Received: Hello World
```

### Ключевые методы

```js
// Добавить слушателя
emitter.on(event, listener)
emitter.addListener(event, listener) // alias

// Добавить одноразового слушателя
emitter.once(event, listener)

// Удалить слушателя
emitter.off(event, listener)
emitter.removeListener(event, listener) // alias

// Удалить все слушатели
emitter.removeAllListeners([event])

// Генерировать событие
emitter.emit(event, ...args) // returns boolean

// Информация
emitter.listenerCount(event)
emitter.eventNames()
emitter.listeners(event)
emitter.rawListeners(event)

// Добавить в начало очереди
emitter.prependListener(event, listener)
emitter.prependOnceListener(event, listener)
```

### Порядок вызова слушателей

Слушатели вызываются **синхронно** в порядке регистрации:

```js
emitter.on('event', () => console.log('A'))
emitter.on('event', () => console.log('B'))
emitter.on('event', () => console.log('C'))

emitter.emit('event')
// A, B, C — всегда в этом порядке, синхронно
```

📌 **Важно**: `emit()` вызывает слушателей **синхронно**. Это значит, что `emit()` не вернёт управление, пока все слушатели не завершатся.

### Наследование от EventEmitter

```js
class MyServer extends EventEmitter {
  start(port) {
    // ... запуск сервера
    this.emit('listening', port)
  }
}

const server = new MyServer()
server.on('listening', (port) => {
  console.log(`Server on port ${port}`)
})
server.start(3000)
```

## 🔥 Событие "error"

Событие `error` имеет **особое поведение** в Node.js:

```js
// ❌ Если нет слушателя "error" — процесс падает!
const emitter = new EventEmitter()
emitter.emit('error', new Error('boom'))
// Uncaught Error: boom → process exits!
```

```js
// ✅ С обработчиком ошибок
emitter.on('error', (err) => {
  console.error('Error handled:', err.message)
})
emitter.emit('error', new Error('boom'))
// Error handled: boom — процесс продолжает работу
```

🔥 **Правило**: всегда добавляйте обработчик `error` для каждого EventEmitter.

Можно также использовать `events.captureRejections`:

```js
const EventEmitter = require('events')
EventEmitter.captureRejections = true

class MyEmitter extends EventEmitter {
  async doWork() {
    throw new Error('async error')
  }
}

const emitter = new MyEmitter()
emitter.on('error', (err) => {
  console.log('Caught async error:', err.message)
})
```

## 📌 maxListeners и утечки памяти

По умолчанию EventEmitter предупреждает при более чем **10 слушателях** на одно событие:

```
MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
11 "data" listeners added to [EventEmitter].
```

Это предупреждение помогает обнаружить утечки памяти:

```js
// ❌ Утечка: новый слушатель при каждом запросе
app.get('/api', (req, res) => {
  db.on('error', handleError) // 1000 запросов → 1000 слушателей!
})

// ✅ Слушатель добавляется один раз
db.on('error', handleError)
app.get('/api', (req, res) => { /* ... */ })
```

Изменение лимита:

```js
emitter.setMaxListeners(20)          // для конкретного emitter
EventEmitter.defaultMaxListeners = 20 // глобально
emitter.setMaxListeners(0)           // без ограничений (⚠️)
```

## 🔥 once() — одноразовые события

### emitter.once()

```js
emitter.once('connect', () => {
  console.log('Connected!') // вызовется только один раз
})
emitter.emit('connect') // Connected!
emitter.emit('connect') // ничего
```

### events.once() — Promise-based

```js
const { once } = require('events')

async function main() {
  const server = http.createServer()
  server.listen(3000)

  // Ждём событие как Promise
  await once(server, 'listening')
  console.log('Server ready!')
}
```

`events.once()` автоматически обрабатывает ошибки:

```js
try {
  await once(emitter, 'success')
} catch (err) {
  // Если "error" событие произошло раньше "success"
  console.error('Failed:', err)
}
```

## 📌 Async Iterator с events.on()

```js
const { on } = require('events')

async function processStream() {
  const emitter = new EventEmitter()

  // Async iterator
  for await (const [data] of on(emitter, 'data')) {
    console.log('Chunk:', data)
    if (data === null) break
  }
}
```

С AbortSignal для отмены:

```js
const ac = new AbortController()
setTimeout(() => ac.abort(), 5000) // timeout 5s

try {
  for await (const [event] of on(emitter, 'data', {
    signal: ac.signal
  })) {
    process(event)
  }
} catch (err) {
  if (err.name === 'AbortError') {
    console.log('Iteration timed out')
  }
}
```

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Забыть обработчик error

```js
// ❌ Плохо: процесс падает при ошибке
const stream = fs.createReadStream('missing-file.txt')
stream.on('data', (chunk) => { /* ... */ })
// Error: ENOENT → process crash!
```

```js
// ✅ Хорошо: обработчик error
const stream = fs.createReadStream('missing-file.txt')
stream.on('error', (err) => console.error('File error:', err.message))
stream.on('data', (chunk) => { /* ... */ })
```

### Ошибка 2: Утечка слушателей

```js
// ❌ Плохо: слушатель добавляется многократно
setInterval(() => {
  emitter.on('data', process)
}, 1000)
```

```js
// ✅ Хорошо: добавить один раз
emitter.on('data', process)
```

### Ошибка 3: Подписка после emit

```js
// ❌ Плохо: событие уже произошло
const emitter = new EventEmitter()
emitter.emit('ready')
emitter.on('ready', () => console.log('Ready!')) // никогда не вызовется
```

```js
// ✅ Хорошо: использовать process.nextTick для отложенного emit
class Server extends EventEmitter {
  constructor() {
    super()
    process.nextTick(() => this.emit('ready'))
  }
}
const server = new Server()
server.on('ready', () => console.log('Ready!')) // работает!
```

### Ошибка 4: this в стрелочных функциях

```js
// ❌ this не указывает на emitter в arrow function
emitter.on('event', () => {
  console.log(this) // undefined (или window/global)
})

// ✅ Обычная функция — this === emitter
emitter.on('event', function() {
  console.log(this) // emitter
})
```

## 💡 Best Practices

1. **Всегда добавляйте обработчик `error`** для каждого EventEmitter
2. **Используйте `once()`** для одноразовых событий (connect, listening)
3. **Предпочитайте `events.once()`** (Promise) для async/await кода
4. **Следите за maxListeners warning** — это признак утечки
5. **Используйте `events.on()`** с AbortSignal для потоковой обработки
6. **Не забывайте `off()`** при очистке (например, в React useEffect)
