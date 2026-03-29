# 🔥 Уровень 12: Обработка ошибок в Node.js

## 🎯 Введение

Обработка ошибок — одна из самых важных тем в Node.js. В отличие от синхронных языков, где ошибки всегда можно поймать через try/catch, в Node.js ошибки возникают в разных контекстах: callbacks, promises, streams, EventEmitters, process events. Каждый контекст требует своего подхода.

Неправильная обработка ошибок приводит к:
- Падению процесса в production
- Утечкам памяти и ресурсов
- Потере данных
- Уязвимостям безопасности

## 🔥 Operational vs Programmer Errors

Ключевое различие, которое влияет на стратегию обработки:

### Operational errors (операционные)

Ожидаемые ошибки, которые происходят при нормальной работе:

```javascript
// Файл не найден
fs.readFile('/nonexistent', (err) => {
  err.code // "ENOENT"
})

// Сеть недоступна
fetch('http://down-service')
  .catch(err => err.code) // "ECONNREFUSED"

// Невалидный ввод
if (!email.includes('@')) {
  throw new ValidationError('Invalid email')
}
```

**Стратегия:** обработать, залогировать, продолжить работу.

### Programmer errors (ошибки программиста)

Баги в коде:

```javascript
// TypeError
const user = null
user.name // Cannot read property 'name' of null

// RangeError
function recursive() { recursive() }
// Maximum call stack size exceeded

// Забыли await
const data = fetchData() // Promise, не данные!
data.forEach(...)        // TypeError: data.forEach is not a function
```

**Стратегия:** исправить код. В production — перезапустить процесс.

## 🔥 Системные коды ошибок Node.js

Node.js оборачивает системные ошибки в объекты с дополнительными свойствами:

```javascript
try {
  fs.readFileSync('/nonexistent')
} catch (err) {
  err.code    // "ENOENT" — код ошибки
  err.syscall // "open" — системный вызов
  err.path    // "/nonexistent" — путь
  err.errno   // -2 — числовой код
}
```

| Код | Описание | Контекст |
|-----|----------|----------|
| ENOENT | Файл/директория не найдены | fs |
| EACCES | Нет прав доступа | fs, net |
| EADDRINUSE | Порт уже занят | net |
| ECONNREFUSED | Соединение отклонено | net |
| ECONNRESET | Соединение сброшено | net |
| ETIMEDOUT | Таймаут операции | net |
| EPERM | Операция не разрешена | fs |
| EMFILE | Слишком много открытых файлов | fs |

## 🔥 Пользовательская иерархия ошибок

Создание собственных классов ошибок помогает структурировать обработку:

```javascript
class AppError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

class ValidationError extends AppError {
  constructor(message, fields = []) {
    super(message, 'VALIDATION_ERROR', 400)
    this.fields = fields
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404)
    this.resource = resource
    this.resourceId = id
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401)
  }
}
```

### Error.captureStackTrace

Убирает конструктор ошибки из stack trace для чистоты:

```javascript
Error.captureStackTrace(this, this.constructor)
// Stack trace начинается с вызывающего кода, а не с конструктора ошибки
```

### error.cause (ES2022)

Сохраняет цепочку ошибок:

```javascript
try {
  await db.query(sql)
} catch (dbError) {
  throw new AppError('Failed to fetch user', 'DB_ERROR', 500, {
    cause: dbError
  })
}

// В обработчике:
catch (err) {
  err.message        // "Failed to fetch user"
  err.cause.message  // "connection refused" — оригинальная причина
}
```

## 🔥 Глобальные события процесса

### uncaughtException

Ошибка не поймана ни одним try/catch:

```javascript
process.on('uncaughtException', (err, origin) => {
  logger.fatal({ err, origin }, 'Uncaught exception')

  // ⚠️ Процесс в неопределённом состоянии!
  // Залогировать и ЗАВЕРШИТЬ процесс
  process.exit(1)
})
```

⚠️ **Нельзя просто продолжить работу** после uncaughtException — состояние приложения может быть повреждено.

### unhandledRejection

Rejected Promise без `.catch()`:

```javascript
process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason }, 'Unhandled rejection')
  // В Node.js 15+ по умолчанию крашит процесс
})
```

### warning

Предупреждения от Node.js и пользовательского кода:

```javascript
process.on('warning', (warning) => {
  logger.warn({
    name: warning.name,
    message: warning.message,
    code: warning.code
  })
})

// MaxListenersExceededWarning
// DeprecationWarning
// ExperimentalWarning

// Создание собственного предупреждения:
process.emitWarning('Cache size limit approaching', {
  code: 'CACHE_LIMIT',
  type: 'AppWarning'
})
```

### Graceful Shutdown

```javascript
async function gracefulShutdown(signal) {
  console.log(`Received ${signal}`)

  // 1. Перестать принимать новые запросы
  server.close()

  // 2. Дождаться завершения текущих
  await drainConnections()

  // 3. Закрыть ресурсы
  await db.close()
  await cache.quit()

  process.exit(0)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Safety net — принудительное завершение через 30 секунд
const forceExit = setTimeout(() => process.exit(1), 30000)
forceExit.unref()
```

## 🔥 Ошибки в разных асинхронных контекстах

### Callbacks (error-first pattern)

```javascript
fs.readFile('file.txt', (err, data) => {
  if (err) {
    console.error('Error:', err.code)
    return
  }
  processData(data)
})
```

### Promises и async/await

```javascript
// Promise chain
fetchUser(id)
  .then(user => fetchOrders(user.id))
  .catch(err => handleError(err))

// async/await
try {
  const user = await fetchUser(id)
} catch (err) {
  handleError(err)
}
```

### EventEmitter

```javascript
// ⚠️ emit('error') без обработчика крашит процесс!
emitter.on('error', (err) => {
  console.error('Emitter error:', err)
})

// captureRejections для async обработчиков
const { EventEmitter } = require('events')
EventEmitter.captureRejections = true

emitter.on('data', async (data) => {
  await riskyOperation(data) // rejected → emit('error')
})
```

### Streams — pipeline вместо pipe

```javascript
// ❌ pipe() НЕ передаёт ошибки
readStream.pipe(writeStream)
// Ошибка в readStream не закроет writeStream → утечка!

// ✅ pipeline() передаёт ошибки и очищает ресурсы
const { pipeline } = require('stream/promises')

try {
  await pipeline(readStream, transformStream, writeStream)
} catch (err) {
  // Все потоки автоматически destroyed
}
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: throw внутри callback

```javascript
// ❌ Плохо — throw не поймается внешним try/catch
try {
  fs.readFile('file.txt', (err, data) => {
    if (err) throw err  // → uncaughtException!
  })
} catch (err) {
  // Сюда НЕ попадёт!
}

// ✅ Хорошо — обрабатывайте внутри callback
fs.readFile('file.txt', (err, data) => {
  if (err) {
    handleError(err)
    return
  }
})
```

### Ошибка 2: Забытый .catch() на Promise

```javascript
// ❌ Плохо — unhandledRejection
async function riskyOperation() {
  throw new Error('fail')
}
riskyOperation() // без await и без .catch()!

// ✅ Хорошо
riskyOperation().catch(handleError)
// или
try {
  await riskyOperation()
} catch (err) {
  handleError(err)
}
```

### Ошибка 3: Продолжение работы после uncaughtException

```javascript
// ❌ Плохо — состояние приложения может быть повреждено
process.on('uncaughtException', (err) => {
  console.error(err)
  // Продолжаем работу... опасно!
})

// ✅ Хорошо — залогировать и завершить
process.on('uncaughtException', (err) => {
  logger.fatal(err)
  process.exit(1) // Process Manager перезапустит
})
```

### Ошибка 4: Глотание ошибок

```javascript
// ❌ Плохо — ошибка потеряна
try {
  await doSomething()
} catch (err) {
  // пустой catch — ошибка проглочена
}

// ✅ Хорошо — хотя бы залогировать
try {
  await doSomething()
} catch (err) {
  logger.error(err, 'doSomething failed')
  // решить: rethrow, return default, или другое
}
```

## 💡 Best Practices

1. **Разделяйте** operational и programmer errors
2. **Создавайте иерархию** пользовательских ошибок с кодами и statusCode
3. **error.cause** для сохранения цепочки ошибок
4. **pipeline()** вместо pipe() для потоков
5. **Graceful shutdown** с SIGTERM/SIGINT
6. **Не продолжайте** после uncaughtException
7. **Всегда** ставьте обработчик `error` на EventEmitter
8. **Логируйте** ошибки с контекстом (request id, user id, operation)
