import { useState } from 'react'

// ============================================
// Задание 7.1: exec/execFile — Решение
// ============================================

export function Task7_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Симуляция exec — запуск команды через shell
    log.push('=== exec: запуск команды через shell ===')
    log.push('')

    // exec запускает команду в shell (/bin/sh по умолчанию)
    log.push('exec("ls -la /tmp", callback)')
    log.push('  → Команда выполняется внутри shell-процесса')
    log.push('  → stdout и stderr буферизуются ПОЛНОСТЬЮ в памяти')
    log.push('  → callback вызывается когда процесс завершён')
    log.push('')

    // Симуляция успешного выполнения
    const simulatedStdout = 'total 16\ndrwxrwxrwt 5 root root 160 Mar 28 10:00 .\n-rw-r--r-- 1 user user  42 Mar 28 09:55 data.txt'
    log.push('✅ stdout:')
    simulatedStdout.split('\n').forEach(line => log.push(`   ${line}`))
    log.push('')

    // Опции exec
    log.push('=== Опции exec ===')
    log.push('exec("command", {')
    log.push('  cwd: "/home/user",      // рабочая директория')
    log.push('  env: { NODE_ENV: "prod" }, // переменные окружения')
    log.push('  timeout: 5000,           // таймаут в мс (0 = без лимита)')
    log.push('  maxBuffer: 1024 * 1024,  // макс. размер stdout/stderr (по умолчанию 1 МБ)')
    log.push('  encoding: "utf8",        // кодировка stdout/stderr')
    log.push('  shell: "/bin/bash",      // какой shell использовать')
    log.push('})')
    log.push('')

    // maxBuffer ошибка
    log.push('=== ⚠️ maxBuffer ===')
    log.push('exec("cat /var/log/huge.log") → может вызвать:')
    log.push('  ❌ Error: stdout maxBuffer length exceeded')
    log.push('  💡 Решение: увеличить maxBuffer или использовать spawn')
    log.push('')

    // execFile — без shell
    log.push('=== execFile: прямой запуск без shell ===')
    log.push('')
    log.push('execFile("/usr/bin/ls", ["-la", "/tmp"], callback)')
    log.push('  → Запускает бинарник НАПРЯМУЮ (без shell)')
    log.push('  → ✅ Безопаснее: нет shell injection')
    log.push('  → ✅ Чуть быстрее: не создаётся промежуточный shell')
    log.push('  → ❌ Нельзя использовать shell-фичи (pipes, glob, &&)')
    log.push('')

    // Shell injection пример
    log.push('=== 🐛 Shell Injection ===')
    log.push('const userInput = "; rm -rf /"')
    log.push('exec(`ls ${userInput}`)  // ❌ ОПАСНО!')
    log.push('  → Выполнит: ls ; rm -rf /')
    log.push('')
    log.push('execFile("ls", [userInput])  // ✅ БЕЗОПАСНО')
    log.push('  → Попытается найти файл "; rm -rf /"')
    log.push('')

    // Обработка ошибок
    log.push('=== Обработка ошибок ===')
    log.push('exec("nonexistent-command", (error, stdout, stderr) => {')
    log.push('  if (error) {')
    log.push('    // error.code — exit code процесса')
    log.push('    // error.signal — сигнал, если убит')
    log.push('    // error.killed — true, если убит по таймауту')
    log.push('    // stderr — вывод ошибок')
    log.push('  }')
    log.push('})')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.1: exec/execFile</h2>
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
// Задание 7.2: spawn — Решение
// ============================================

interface SpawnEvent {
  time: number
  source: 'stdout' | 'stderr' | 'system'
  data: string
}

export function Task7_2_Solution() {
  const [events, setEvents] = useState<SpawnEvent[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runExample = () => {
    setIsRunning(true)
    const log: SpawnEvent[] = []
    let time = 0

    // Симуляция spawn — потоковый вывод
    log.push({ time: 0, source: 'system', data: '🚀 spawn("find", ["/var/log", "-name", "*.log"], { stdio: "pipe" })' })
    log.push({ time: 0, source: 'system', data: 'Процесс запущен (PID: 12345)' })

    // Потоковый stdout
    const chunks = [
      '/var/log/syslog',
      '/var/log/auth.log',
      '/var/log/kern.log',
      '/var/log/nginx/access.log',
      '/var/log/nginx/error.log',
    ]

    chunks.forEach((chunk, i) => {
      time = (i + 1) * 50
      log.push({ time, source: 'stdout', data: chunk })
    })

    // stderr может приходить параллельно
    log.push({ time: 120, source: 'stderr', data: 'find: /var/log/private: Permission denied' })

    // Завершение
    log.push({ time: 300, source: 'system', data: 'Событие "close": code=1, signal=null' })
    log.push({ time: 300, source: 'system', data: '(code=1 потому что были ошибки в stderr)' })

    // API spawn
    log.push({ time: 400, source: 'system', data: '' })
    log.push({ time: 400, source: 'system', data: '=== API spawn ===' })
    log.push({ time: 400, source: 'system', data: 'const child = spawn("cmd", args, options)' })
    log.push({ time: 400, source: 'system', data: '' })
    log.push({ time: 400, source: 'system', data: '📌 Ключевые отличия от exec:' })
    log.push({ time: 400, source: 'system', data: '  • stdout/stderr — это потоки (Readable streams)' })
    log.push({ time: 400, source: 'system', data: '  • Данные приходят чанками, не буферизуются' })
    log.push({ time: 400, source: 'system', data: '  • Нет ограничения maxBuffer' })
    log.push({ time: 400, source: 'system', data: '  • Подходит для длительных процессов и больших выводов' })
    log.push({ time: 400, source: 'system', data: '' })

    // Сигналы
    log.push({ time: 400, source: 'system', data: '=== Сигналы ===' })
    log.push({ time: 400, source: 'system', data: 'child.kill("SIGTERM")  // мягкое завершение' })
    log.push({ time: 400, source: 'system', data: 'child.kill("SIGKILL")  // принудительное завершение' })
    log.push({ time: 400, source: 'system', data: 'child.kill("SIGINT")   // как Ctrl+C' })
    log.push({ time: 400, source: 'system', data: '' })

    // Detached
    log.push({ time: 400, source: 'system', data: '=== Detached процессы ===' })
    log.push({ time: 400, source: 'system', data: 'const child = spawn("server", [], {' })
    log.push({ time: 400, source: 'system', data: '  detached: true,       // независимый от родителя' })
    log.push({ time: 400, source: 'system', data: '  stdio: "ignore"       // отключить потоки' })
    log.push({ time: 400, source: 'system', data: '})' })
    log.push({ time: 400, source: 'system', data: 'child.unref()  // позволить родителю завершиться' })

    setEvents(log)
    setIsRunning(false)
  }

  const getColor = (source: string) => {
    switch (source) {
      case 'stdout': return '#4caf50'
      case 'stderr': return '#f44336'
      case 'system': return '#2196f3'
      default: return '#333'
    }
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.2: spawn</h2>
      <button onClick={runExample} disabled={isRunning}>
        {isRunning ? 'Выполняется...' : 'Запустить'}
      </button>
      {events.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Потоковый вывод:</h3>
          <div style={{ background: '#1e1e1e', borderRadius: 8, padding: '1rem', maxHeight: 500, overflow: 'auto' }}>
            {events.map((e, i) => (
              <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: getColor(e.source), padding: '2px 0', whiteSpace: 'pre' }}>
                {e.source !== 'system' ? `[${e.source}] ${e.data}` : e.data}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 7.3: fork — Решение
// ============================================

interface IPCMessage {
  direction: 'parent→child' | 'child→parent' | 'system'
  data: string
}

export function Task7_3_Solution() {
  const [messages, setMessages] = useState<IPCMessage[]>([])

  const runExample = () => {
    const log: IPCMessage[] = []

    // Симуляция fork и IPC
    log.push({ direction: 'system', data: '🚀 fork("./worker.js", [], { execArgv: ["--max-old-space-size=512"] })' })
    log.push({ direction: 'system', data: 'Дочерний процесс создан (PID: 54321)' })
    log.push({ direction: 'system', data: 'IPC канал автоматически установлен' })
    log.push({ direction: 'system', data: '' })

    // Parent отправляет задачу
    log.push({ direction: 'parent→child', data: 'child.send({ type: "task", payload: { data: [1,2,3,4,5], operation: "sum" } })' })

    // Child получает и обрабатывает
    log.push({ direction: 'child→parent', data: 'process.on("message", (msg) => { /* получена задача */ })' })
    log.push({ direction: 'child→parent', data: 'Вычисление: sum([1,2,3,4,5]) = 15' })
    log.push({ direction: 'child→parent', data: 'process.send({ type: "result", payload: 15 })' })

    // Parent получает результат
    log.push({ direction: 'parent→child', data: 'child.on("message", (msg) => { /* результат: 15 */ })' })
    log.push({ direction: 'system', data: '' })

    // Worker pattern
    log.push({ direction: 'system', data: '=== Worker Pattern ===' })
    log.push({ direction: 'system', data: '' })
    log.push({ direction: 'system', data: '// parent.js' })
    log.push({ direction: 'system', data: 'const child = fork("./worker.js")' })
    log.push({ direction: 'system', data: '' })
    log.push({ direction: 'system', data: 'child.on("message", (msg) => {' })
    log.push({ direction: 'system', data: '  if (msg.type === "ready") sendTask(child)' })
    log.push({ direction: 'system', data: '  if (msg.type === "result") handleResult(msg.payload)' })
    log.push({ direction: 'system', data: '  if (msg.type === "error") handleError(msg.error)' })
    log.push({ direction: 'system', data: '})' })
    log.push({ direction: 'system', data: '' })
    log.push({ direction: 'system', data: '// worker.js' })
    log.push({ direction: 'system', data: 'process.on("message", async (msg) => {' })
    log.push({ direction: 'system', data: '  try {' })
    log.push({ direction: 'system', data: '    const result = await heavyComputation(msg.payload)' })
    log.push({ direction: 'system', data: '    process.send({ type: "result", payload: result })' })
    log.push({ direction: 'system', data: '  } catch (err) {' })
    log.push({ direction: 'system', data: '    process.send({ type: "error", error: err.message })' })
    log.push({ direction: 'system', data: '  }' })
    log.push({ direction: 'system', data: '})' })
    log.push({ direction: 'system', data: 'process.send({ type: "ready" })' })
    log.push({ direction: 'system', data: '' })

    // fork vs spawn
    log.push({ direction: 'system', data: '=== fork vs spawn ===' })
    log.push({ direction: 'system', data: '📌 fork():' })
    log.push({ direction: 'system', data: '  • Запускает НОВЫЙ Node.js-процесс' })
    log.push({ direction: 'system', data: '  • Автоматически создаёт IPC канал' })
    log.push({ direction: 'system', data: '  • child.send() / process.send() для обмена' })
    log.push({ direction: 'system', data: '  • Каждый fork = отдельный V8 instance (~30 МБ)' })
    log.push({ direction: 'system', data: '' })
    log.push({ direction: 'system', data: '📌 spawn():' })
    log.push({ direction: 'system', data: '  • Запускает ЛЮБОЙ процесс' })
    log.push({ direction: 'system', data: '  • IPC нужно настраивать вручную (stdio: "ipc")' })
    log.push({ direction: 'system', data: '  • Общение через stdin/stdout потоки' })

    // Завершение дочернего процесса
    log.push({ direction: 'system', data: '' })
    log.push({ direction: 'system', data: '=== Завершение ===' })
    log.push({ direction: 'parent→child', data: 'child.send({ type: "shutdown" })' })
    log.push({ direction: 'child→parent', data: 'process.exit(0)' })
    log.push({ direction: 'system', data: 'child.on("exit", (code) => { /* code: 0 */ })' })
    log.push({ direction: 'parent→child', data: 'child.disconnect()  // закрыть IPC канал' })

    setMessages(log)
  }

  const getStyle = (direction: string) => {
    switch (direction) {
      case 'parent→child': return { color: '#ff9800', prefix: '📤 [Parent→Child]' }
      case 'child→parent': return { color: '#4caf50', prefix: '📥 [Child→Parent]' }
      default: return { color: '#90caf9', prefix: '' }
    }
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.3: fork и IPC</h2>
      <button onClick={runExample}>Запустить</button>
      {messages.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>IPC-коммуникация:</h3>
          <div style={{ background: '#1e1e1e', borderRadius: 8, padding: '1rem', maxHeight: 500, overflow: 'auto' }}>
            {messages.map((m, i) => {
              const style = getStyle(m.direction)
              return (
                <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: style.color, padding: '2px 0', whiteSpace: 'pre' }}>
                  {style.prefix ? `${style.prefix} ${m.data}` : m.data}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
