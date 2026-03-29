import { useState } from 'react'

// ============================================
// Задание 12.1: Error Classes — Решение
// ============================================

export function Task12_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Operational vs Programmer Errors ===')
    log.push('')
    log.push('📌 Operational errors — ожидаемые ошибки в ходе работы:')
    log.push('   - Файл не найден (ENOENT)')
    log.push('   - Сеть недоступна (ECONNREFUSED)')
    log.push('   - Таймаут запроса (ETIMEDOUT)')
    log.push('   - Невалидный пользовательский ввод')
    log.push('')
    log.push('📌 Programmer errors — баги в коде:')
    log.push('   - TypeError: Cannot read property of undefined')
    log.push('   - RangeError: Maximum call stack size exceeded')
    log.push('   - Обращение к несуществующей переменной')
    log.push('   - Передача неверного типа аргумента')
    log.push('')

    // Node.js error codes
    log.push('=== Системные ошибки Node.js (error.code) ===')
    log.push('')
    log.push('try {')
    log.push('  fs.readFileSync("/nonexistent")')
    log.push('} catch (err) {')
    log.push('  err.code      // "ENOENT"')
    log.push('  err.syscall   // "open"')
    log.push('  err.path      // "/nonexistent"')
    log.push('  err.errno     // -2')
    log.push('  err.message   // "ENOENT: no such file or directory"')
    log.push('}')
    log.push('')
    log.push('Частые коды:')
    log.push('  ENOENT    — файл/директория не найдены')
    log.push('  EACCES    — нет прав доступа')
    log.push('  EADDRINUSE — порт уже занят')
    log.push('  ECONNREFUSED — соединение отклонено')
    log.push('  ETIMEDOUT — таймаут операции')
    log.push('  EPERM     — операция не разрешена')
    log.push('')

    // Custom error hierarchy
    log.push('=== Пользовательская иерархия ошибок ===')
    log.push('')
    log.push('class AppError extends Error {')
    log.push('  constructor(message, code, statusCode = 500) {')
    log.push('    super(message)')
    log.push('    this.name = "AppError"')
    log.push('    this.code = code')
    log.push('    this.statusCode = statusCode')
    log.push('    Error.captureStackTrace(this, this.constructor)')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('class ValidationError extends AppError {')
    log.push('  constructor(message, fields) {')
    log.push('    super(message, "VALIDATION_ERROR", 400)')
    log.push('    this.name = "ValidationError"')
    log.push('    this.fields = fields')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('class NotFoundError extends AppError {')
    log.push('  constructor(resource, id) {')
    log.push('    super(`${resource} with id ${id} not found`, "NOT_FOUND", 404)')
    log.push('    this.name = "NotFoundError"')
    log.push('    this.resource = resource')
    log.push('    this.resourceId = id')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('class DatabaseError extends AppError {')
    log.push('  constructor(message, query) {')
    log.push('    super(message, "DB_ERROR", 500)')
    log.push('    this.name = "DatabaseError"')
    log.push('    this.query = query')
    log.push('  }')
    log.push('}')
    log.push('')

    // Error.captureStackTrace
    log.push('=== Error.captureStackTrace ===')
    log.push('')
    log.push('// Убирает конструктор из стека — чище stacktrace')
    log.push('Error.captureStackTrace(this, this.constructor)')
    log.push('')
    log.push('// Без captureStackTrace:')
    log.push('//   at new ValidationError (errors.js:10)')
    log.push('//   at new AppError (errors.js:3)')
    log.push('//   at validateUser (user.js:5)')
    log.push('')
    log.push('// С captureStackTrace:')
    log.push('//   at validateUser (user.js:5)')
    log.push('//   at handleRequest (server.js:20)')
    log.push('')

    // error.cause (ES2022)
    log.push('=== error.cause — цепочка ошибок (ES2022) ===')
    log.push('')
    log.push('try {')
    log.push('  await db.query(sql)')
    log.push('} catch (dbError) {')
    log.push('  throw new AppError("Failed to fetch user", "DB_ERROR", 500, {')
    log.push('    cause: dbError  // оригинальная ошибка сохранена')
    log.push('  })')
    log.push('}')
    log.push('')
    log.push('// В обработчике:')
    log.push('catch (err) {')
    log.push('  console.log(err.message)       // "Failed to fetch user"')
    log.push('  console.log(err.cause.message)  // "connection refused"')
    log.push('}')
    log.push('')

    // instanceof checking
    log.push('=== Проверка типа ошибки ===')
    log.push('')
    log.push('try {')
    log.push('  await getUser(id)')
    log.push('} catch (err) {')
    log.push('  if (err instanceof ValidationError) {')
    log.push('    res.status(400).json({ errors: err.fields })')
    log.push('  } else if (err instanceof NotFoundError) {')
    log.push('    res.status(404).json({ error: err.message })')
    log.push('  } else if (err.code === "ECONNREFUSED") {')
    log.push('    res.status(503).json({ error: "Service unavailable" })')
    log.push('  } else {')
    log.push('    res.status(500).json({ error: "Internal error" })')
    log.push('  }')
    log.push('}')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.1: Error Classes</h2>
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
// Задание 12.2: Process Error Events — Решение
// ============================================

export function Task12_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Глобальные события ошибок process ===')
    log.push('')

    // uncaughtException
    log.push('=== uncaughtException ===')
    log.push('')
    log.push('// Срабатывает когда ошибка не поймана ни одним try/catch')
    log.push('process.on("uncaughtException", (err, origin) => {')
    log.push('  console.error("Uncaught Exception:", err.message)')
    log.push('  console.error("Origin:", origin)')
    log.push('')
    log.push('  // ⚠️ ВАЖНО: после uncaughtException процесс в нестабильном состоянии')
    log.push('  // Лучшая практика: залогировать и завершить процесс')
    log.push('  logger.fatal({ err }, "Uncaught exception")')
    log.push('  process.exit(1)')
    log.push('})')
    log.push('')
    log.push('// Пример: ошибка вне try/catch')
    log.push('setTimeout(() => {')
    log.push('  throw new Error("Oops!")  // → uncaughtException')
    log.push('}, 100)')
    log.push('')

    // unhandledRejection
    log.push('=== unhandledRejection ===')
    log.push('')
    log.push('// Срабатывает для rejected Promise без .catch()')
    log.push('process.on("unhandledRejection", (reason, promise) => {')
    log.push('  console.error("Unhandled Rejection:", reason)')
    log.push('')
    log.push('  // В Node.js 15+ по умолчанию крашит процесс')
    log.push('  // --unhandled-rejections=throw (default)')
    log.push('})')
    log.push('')
    log.push('// Пример:')
    log.push('async function fetchData() {')
    log.push('  throw new Error("API Error")')
    log.push('}')
    log.push('fetchData()  // без await и без .catch() → unhandledRejection')
    log.push('')

    // rejectionHandled
    log.push('=== rejectionHandled ===')
    log.push('')
    log.push('// Срабатывает когда rejected Promise получает .catch() "с опозданием"')
    log.push('process.on("rejectionHandled", (promise) => {')
    log.push('  console.log("Late rejection handled")')
    log.push('})')
    log.push('')
    log.push('const p = Promise.reject(new Error("fail"))  // → unhandledRejection')
    log.push('setTimeout(() => {')
    log.push('  p.catch(() => {})  // → rejectionHandled')
    log.push('}, 1000)')
    log.push('')

    // warning
    log.push('=== warning ===')
    log.push('')
    log.push('process.on("warning", (warning) => {')
    log.push('  console.warn("Warning:", warning.name)')
    log.push('  console.warn("Message:", warning.message)')
    log.push('  console.warn("Stack:", warning.stack)')
    log.push('})')
    log.push('')
    log.push('// Частые предупреждения:')
    log.push('// MaxListenersExceededWarning — > 10 listeners на одном EventEmitter')
    log.push('// DeprecationWarning — использование устаревшего API')
    log.push('// ExperimentalWarning — использование экспериментального API')
    log.push('')
    log.push('// Создание собственного предупреждения:')
    log.push('process.emitWarning("Resource limit approaching", {')
    log.push('  code: "RESOURCE_LIMIT",')
    log.push('  type: "AppWarning"')
    log.push('})')
    log.push('')

    // exit and beforeExit
    log.push('=== exit & beforeExit ===')
    log.push('')
    log.push('// beforeExit — Event Loop пуст, но процесс ещё не завершился')
    log.push('// Можно планировать новые операции (но НЕ при process.exit())')
    log.push('process.on("beforeExit", (code) => {')
    log.push('  console.log("Before exit with code:", code)')
    log.push('})')
    log.push('')
    log.push('// exit — процесс завершается, ТОЛЬКО синхронные операции!')
    log.push('process.on("exit", (code) => {')
    log.push('  console.log("Exiting with code:", code)')
    log.push('  // ❌ setTimeout, await, I/O — НЕ будут выполнены!')
    log.push('})')
    log.push('')

    // Graceful shutdown
    log.push('=== Graceful Shutdown Pattern ===')
    log.push('')
    log.push('async function gracefulShutdown(signal) {')
    log.push('  console.log(`Received ${signal}. Shutting down...`)')
    log.push('')
    log.push('  // 1. Перестать принимать новые запросы')
    log.push('  server.close()')
    log.push('')
    log.push('  // 2. Дождаться завершения текущих запросов')
    log.push('  await drainConnections()')
    log.push('')
    log.push('  // 3. Закрыть подключения к БД')
    log.push('  await db.close()')
    log.push('')
    log.push('  // 4. Завершить процесс')
    log.push('  process.exit(0)')
    log.push('}')
    log.push('')
    log.push('process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))')
    log.push('process.on("SIGINT", () => gracefulShutdown("SIGINT"))')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.2: Process Error Events</h2>
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
// Задание 12.3: Async Error Patterns — Решение
// ============================================

export function Task12_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Ошибки в разных асинхронных паттернах ===')
    log.push('')

    // Callbacks (error-first)
    log.push('=== 1. Error-first callbacks ===')
    log.push('')
    log.push('fs.readFile("file.txt", (err, data) => {')
    log.push('  if (err) {')
    log.push('    // ✅ Обрабатываем ошибку первым аргументом')
    log.push('    console.error("Read error:", err.code)')
    log.push('    return')
    log.push('  }')
    log.push('  console.log(data)')
    log.push('})')
    log.push('')
    log.push('// ❌ Частая ошибка: throw внутри callback')
    log.push('fs.readFile("file.txt", (err, data) => {')
    log.push('  if (err) throw err  // → uncaughtException! НЕ поймается try/catch')
    log.push('})')
    log.push('')

    // Promises
    log.push('=== 2. Promises ===')
    log.push('')
    log.push('// ✅ Цепочка catch')
    log.push('fetchUser(id)')
    log.push('  .then(user => fetchOrders(user.id))')
    log.push('  .then(orders => processOrders(orders))')
    log.push('  .catch(err => {')
    log.push('    // Ловит ошибку из ЛЮБОГО шага цепочки')
    log.push('    console.error("Pipeline failed:", err.message)')
    log.push('  })')
    log.push('')
    log.push('// ✅ async/await + try/catch')
    log.push('try {')
    log.push('  const user = await fetchUser(id)')
    log.push('  const orders = await fetchOrders(user.id)')
    log.push('} catch (err) {')
    log.push('  console.error(err)')
    log.push('}')
    log.push('')

    // EventEmitter errors
    log.push('=== 3. EventEmitter errors ===')
    log.push('')
    log.push('// EventEmitter бросает при emit("error") если нет обработчика!')
    log.push('const emitter = new EventEmitter()')
    log.push('emitter.emit("error", new Error("boom"))  // → uncaughtException!')
    log.push('')
    log.push('// ✅ Всегда добавляйте обработчик error')
    log.push('emitter.on("error", (err) => {')
    log.push('  console.error("Emitter error:", err.message)')
    log.push('})')
    log.push('')
    log.push('// events.captureRejections = true (Node.js 12+)')
    log.push('// Автоматически перенаправляет rejected Promise в "error" событие')
    log.push('const { EventEmitter } = require("events")')
    log.push('EventEmitter.captureRejections = true')
    log.push('')
    log.push('class MyEmitter extends EventEmitter {')
    log.push('  async [Symbol.for("nodejs.rejection")](err, event, ...args) {')
    log.push('    // Custom rejection handler')
    log.push('    this.emit("error", err)')
    log.push('  }')
    log.push('}')
    log.push('')

    // Stream errors
    log.push('=== 4. Stream errors ===')
    log.push('')
    log.push('// ❌ pipe() НЕ передаёт ошибки!')
    log.push('readStream.pipe(transformStream).pipe(writeStream)')
    log.push('// Ошибка в readStream не попадёт в writeStream')
    log.push('')
    log.push('// ✅ Используйте pipeline() — передаёт ошибки и очищает ресурсы')
    log.push('const { pipeline } = require("stream/promises")')
    log.push('')
    log.push('try {')
    log.push('  await pipeline(readStream, transformStream, writeStream)')
    log.push('} catch (err) {')
    log.push('  console.error("Pipeline failed:", err.message)')
    log.push('  // Все потоки автоматически закрыты/уничтожены')
    log.push('}')
    log.push('')
    log.push('// Или callback-версия:')
    log.push('const { pipeline } = require("stream")')
    log.push('pipeline(readStream, transformStream, writeStream, (err) => {')
    log.push('  if (err) console.error("Pipeline error:", err)')
    log.push('})')
    log.push('')

    // Error propagation
    log.push('=== 5. Паттерн пропагации ошибок ===')
    log.push('')
    log.push('// Каждый слой добавляет контекст')
    log.push('async function getUser(id) {')
    log.push('  try {')
    log.push('    return await db.query("SELECT * FROM users WHERE id = $1", [id])')
    log.push('  } catch (err) {')
    log.push('    throw new DatabaseError(`Failed to get user ${id}`, {')
    log.push('      cause: err  // сохраняем оригинальную ошибку')
    log.push('    })')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('async function handleRequest(req, res) {')
    log.push('  try {')
    log.push('    const user = await getUser(req.params.id)')
    log.push('    res.json(user)')
    log.push('  } catch (err) {')
    log.push('    if (err instanceof DatabaseError) {')
    log.push('      logger.error({ err, cause: err.cause }, "DB failure")')
    log.push('      res.status(503).json({ error: "Service unavailable" })')
    log.push('    }')
    log.push('  }')
    log.push('}')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.3: Async Error Patterns</h2>
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
