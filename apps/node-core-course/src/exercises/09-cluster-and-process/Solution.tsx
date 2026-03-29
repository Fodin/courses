import { useState } from 'react'

// ============================================
// Задание 9.1: Process Object — Решение
// ============================================

export function Task9_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== process — глобальный объект Node.js ===')
    log.push('')

    // process.env
    log.push('📌 process.env — переменные окружения')
    log.push('  process.env.NODE_ENV    = "production"')
    log.push('  process.env.PORT        = "3000"')
    log.push('  process.env.DATABASE_URL = "postgres://..."')
    log.push('  process.env.HOME        = "/home/user"')
    log.push('')
    log.push('  ⚠️ Все значения — строки!')
    log.push('  process.env.PORT === "3000"  // string, не number')
    log.push('  const port = Number(process.env.PORT) || 3000')
    log.push('')

    // process.argv
    log.push('📌 process.argv — аргументы командной строки')
    log.push('  $ node app.js --port 3000 --verbose')
    log.push('  process.argv = [')
    log.push('    "/usr/bin/node",     // [0] путь к node')
    log.push('    "/app/app.js",       // [1] путь к скрипту')
    log.push('    "--port",            // [2] первый аргумент')
    log.push('    "3000",              // [3]')
    log.push('    "--verbose"          // [4]')
    log.push('  ]')
    log.push('')
    log.push('  // Парсинг аргументов')
    log.push('  const args = process.argv.slice(2)')
    log.push('  // Node.js 18.3+: util.parseArgs()')
    log.push('')

    // process.cwd()
    log.push('📌 process.cwd() — текущая рабочая директория')
    log.push('  process.cwd()  // "/home/user/project"')
    log.push('  process.chdir("/tmp")  // сменить директорию')
    log.push('')

    // process.memoryUsage()
    log.push('📌 process.memoryUsage()')
    const simMemory = {
      rss: 45 * 1024 * 1024,
      heapTotal: 20 * 1024 * 1024,
      heapUsed: 15 * 1024 * 1024,
      external: 2 * 1024 * 1024,
      arrayBuffers: 1 * 1024 * 1024,
    }
    log.push(`  rss:          ${(simMemory.rss / 1024 / 1024).toFixed(1)} MB  // Resident Set Size (вся память процесса)`)
    log.push(`  heapTotal:    ${(simMemory.heapTotal / 1024 / 1024).toFixed(1)} MB  // выделенный heap`)
    log.push(`  heapUsed:     ${(simMemory.heapUsed / 1024 / 1024).toFixed(1)} MB  // используемый heap`)
    log.push(`  external:     ${(simMemory.external / 1024 / 1024).toFixed(1)} MB   // C++ объекты (Buffers)`)
    log.push(`  arrayBuffers: ${(simMemory.arrayBuffers / 1024 / 1024).toFixed(1)} MB   // ArrayBuffer/SharedArrayBuffer`)
    log.push('')

    // process.exit
    log.push('📌 process.exit(code)')
    log.push('  process.exit(0)   // успешное завершение')
    log.push('  process.exit(1)   // ошибка')
    log.push('')
    log.push('  ⚠️ process.exit() — жёсткое завершение!')
    log.push('  Не дожидается завершения async операций.')
    log.push('  Лучше: process.exitCode = 1')
    log.push('')

    // process.stdin / stdout / stderr
    log.push('📌 process.stdin / stdout / stderr')
    log.push('  process.stdin   — Readable stream (ввод)')
    log.push('  process.stdout  — Writable stream (вывод)')
    log.push('  process.stderr  — Writable stream (ошибки)')
    log.push('')
    log.push('  process.stdout.write("hello\\n")  // без \\n в конце')
    log.push('  console.log("hello")             // автоматический \\n')
    log.push('')

    // Другие полезные свойства
    log.push('📌 Другие свойства')
    log.push('  process.pid         // PID процесса')
    log.push('  process.ppid        // PID родителя')
    log.push('  process.platform    // "linux", "darwin", "win32"')
    log.push('  process.arch        // "x64", "arm64"')
    log.push('  process.version     // "v20.11.0"')
    log.push('  process.versions    // { node, v8, openssl, ... }')
    log.push('  process.uptime()    // секунды с запуска')
    log.push('  process.hrtime.bigint() // наносекунды (для замеров)')
    log.push('  process.cpuUsage()  // { user, system } в микросекундах')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.1: Process Object</h2>
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
// Задание 9.2: Signals & Graceful Shutdown — Решение
// ============================================

export function Task9_2_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [phase, setPhase] = useState<string>('')

  const runExample = () => {
    const log: string[] = []

    log.push('=== Сигналы Unix и Graceful Shutdown ===')
    log.push('')

    // Сигналы
    log.push('📌 Основные сигналы:')
    log.push('  SIGINT  (2)  — Ctrl+C в терминале')
    log.push('  SIGTERM (15) — запрос завершения (docker stop, kill)')
    log.push('  SIGKILL (9)  — принудительное завершение (нельзя перехватить!)')
    log.push('  SIGHUP  (1)  — терминал закрыт / перечитать конфиг')
    log.push('  SIGUSR1 (10) — пользовательский (Node.js: запуск debugger)')
    log.push('  SIGUSR2 (12) — пользовательский')
    log.push('')

    // Обработка сигналов
    log.push('📌 Перехват сигналов:')
    log.push('  process.on("SIGINT", () => {')
    log.push('    console.log("Получен SIGINT")')
    log.push('    gracefulShutdown()')
    log.push('  })')
    log.push('')
    log.push('  process.on("SIGTERM", () => {')
    log.push('    console.log("Получен SIGTERM")')
    log.push('    gracefulShutdown()')
    log.push('  })')
    log.push('')

    // Graceful shutdown симуляция
    log.push('=== Симуляция Graceful Shutdown ===')
    log.push('')

    setPhase('signal')
    log.push('📥 Получен SIGTERM')

    setPhase('stop-accepting')
    log.push('⏸️  [1] Перестаём принимать новые соединения')
    log.push('    server.close()')
    log.push('')

    setPhase('drain')
    log.push('⏳ [2] Ожидаем завершения текущих запросов...')
    log.push('    Активных соединений: 5 → 3 → 1 → 0')
    log.push('')

    setPhase('cleanup')
    log.push('🧹 [3] Очистка ресурсов:')
    log.push('    ✅ Закрыто подключение к PostgreSQL')
    log.push('    ✅ Закрыто подключение к Redis')
    log.push('    ✅ Завершены фоновые задачи')
    log.push('    ✅ Файловые дескрипторы закрыты')
    log.push('')

    setPhase('exit')
    log.push('🏁 [4] process.exit(0)')
    log.push('')

    // Таймаут
    log.push('=== ⚠️ Таймаут для force shutdown ===')
    log.push('')
    log.push('async function gracefulShutdown() {')
    log.push('  console.log("Начинаем graceful shutdown...")')
    log.push('')
    log.push('  // Таймаут: если не успели за 30 сек — force exit')
    log.push('  const forceTimeout = setTimeout(() => {')
    log.push('    console.error("Таймаут! Принудительное завершение")')
    log.push('    process.exit(1)')
    log.push('  }, 30000)')
    log.push('  forceTimeout.unref() // не блокировать выход')
    log.push('')
    log.push('  try {')
    log.push('    // 1. Перестать принимать новые подключения')
    log.push('    await new Promise(r => server.close(r))')
    log.push('')
    log.push('    // 2. Закрыть подключения к БД')
    log.push('    await db.end()')
    log.push('    await redis.quit()')
    log.push('')
    log.push('    // 3. Завершить фоновые задачи')
    log.push('    await Promise.allSettled(backgroundTasks)')
    log.push('')
    log.push('    console.log("Graceful shutdown завершён")')
    log.push('    process.exit(0)')
    log.push('  } catch (err) {')
    log.push('    console.error("Ошибка shutdown:", err)')
    log.push('    process.exit(1)')
    log.push('  }')
    log.push('}')
    log.push('')

    // Docker
    log.push('=== Docker и SIGTERM ===')
    log.push('  docker stop → SIGTERM → 10 сек → SIGKILL')
    log.push('  docker stop --time 30 → 30 сек до SIGKILL')
    log.push('')
    log.push('  ⚠️ PID 1 в Docker не получает сигналы автоматически!')
    log.push('  Используйте: CMD ["node", "app.js"]  (exec form)')
    log.push('  Не: CMD node app.js  (shell form — PID 1 = sh)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.2: Signals & Graceful Shutdown</h2>
      <button onClick={runExample}>Запустить</button>
      {phase && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          {['signal', 'stop-accepting', 'drain', 'cleanup', 'exit'].map(p => (
            <div key={p} style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              background: phase === p ? '#4caf50' : p < phase ? '#e8f5e9' : '#f5f5f5',
              color: phase === p ? 'white' : '#333',
              fontSize: '0.8rem',
              fontWeight: phase === p ? 'bold' : 'normal',
            }}>
              {p}
            </div>
          ))}
        </div>
      )}
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
// Задание 9.3: OS Module — Решение
// ============================================

export function Task9_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Модуль os ===')
    log.push('')

    // os.cpus()
    log.push('📌 os.cpus() — информация о CPU')
    log.push('  [')
    const cpuModels = ['Intel Core i7-12700K', 'Intel Core i7-12700K', 'Intel Core i7-12700K', 'Intel Core i7-12700K']
    cpuModels.forEach((model, i) => {
      const speed = 3600 + Math.floor(Math.random() * 400)
      log.push(`    { model: "${model}", speed: ${speed} MHz },`)
    })
    log.push(`    // ... всего ${8} ядер`)
    log.push('  ]')
    log.push('')
    log.push('  os.cpus().length  // количество ядер (для Worker Pool)')
    log.push('  os.availableParallelism()  // Node.js 19.4+ (учитывает cgroups)')
    log.push('')

    // Память
    log.push('📌 Память')
    const totalMem = 16 * 1024 * 1024 * 1024
    const freeMem = 4.2 * 1024 * 1024 * 1024
    log.push(`  os.totalmem() = ${(totalMem / 1024 / 1024 / 1024).toFixed(1)} GB`)
    log.push(`  os.freemem()  = ${(freeMem / 1024 / 1024 / 1024).toFixed(1)} GB`)
    log.push(`  Использовано: ${((totalMem - freeMem) / 1024 / 1024 / 1024).toFixed(1)} GB (${(((totalMem - freeMem) / totalMem) * 100).toFixed(0)}%)`)
    log.push('')

    // Платформа
    log.push('📌 Платформа и система')
    log.push('  os.platform()   = "linux"      // "darwin", "win32"')
    log.push('  os.type()       = "Linux"       // "Darwin", "Windows_NT"')
    log.push('  os.arch()       = "x64"         // "arm64"')
    log.push('  os.release()    = "5.15.0-91"   // версия ядра')
    log.push('  os.hostname()   = "web-server-1"')
    log.push('  os.homedir()    = "/home/user"')
    log.push('  os.tmpdir()     = "/tmp"')
    log.push('  os.uptime()     = 1234567       // секунды работы ОС')
    log.push('  os.loadavg()    = [1.2, 0.8, 0.5] // нагрузка 1/5/15 мин')
    log.push('')

    // Сетевые интерфейсы
    log.push('📌 os.networkInterfaces()')
    log.push('  {')
    log.push('    eth0: [')
    log.push('      { address: "192.168.1.100", netmask: "255.255.255.0",')
    log.push('        family: "IPv4", internal: false },')
    log.push('      { address: "fe80::1", family: "IPv6", internal: false }')
    log.push('    ],')
    log.push('    lo: [')
    log.push('      { address: "127.0.0.1", family: "IPv4", internal: true }')
    log.push('    ]')
    log.push('  }')
    log.push('')

    // Пользователь
    log.push('📌 os.userInfo()')
    log.push('  { username: "node", uid: 1000, gid: 1000,')
    log.push('    homedir: "/home/node", shell: "/bin/bash" }')
    log.push('')

    // Константы
    log.push('📌 os.constants')
    log.push('  os.constants.signals.SIGTERM  = 15')
    log.push('  os.constants.signals.SIGKILL  = 9')
    log.push('  os.constants.errno.ENOENT     = -2')
    log.push('  os.constants.errno.EACCES     = -13')
    log.push('  os.EOL                        = "\\n" (Unix) / "\\r\\n" (Windows)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.3: OS Module</h2>
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
// Задание 9.4: Cluster Module — Решение
// ============================================

interface WorkerInfo {
  id: number
  pid: number
  status: 'online' | 'listening' | 'dead' | 'restarting'
  requests: number
}

export function Task9_4_Solution() {
  const [workers, setWorkers] = useState<WorkerInfo[]>([])
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const numCPUs = 4

    log.push('=== Cluster Module ===')
    log.push('')

    // Базовый пример
    log.push('const cluster = require("cluster")')
    log.push('const http = require("http")')
    log.push(`const numCPUs = os.cpus().length  // ${numCPUs}`)
    log.push('')

    log.push('if (cluster.isPrimary) {  // Node.js 16+ (ранее isMaster)')
    log.push(`  console.log("Primary ${process.pid} запущен")`)
    log.push('')

    // Создание workers
    const workerInfos: WorkerInfo[] = []
    for (let i = 0; i < numCPUs; i++) {
      const pid = 10001 + i
      workerInfos.push({
        id: i + 1,
        pid,
        status: 'listening',
        requests: Math.floor(Math.random() * 100),
      })
      log.push(`  cluster.fork()  // Worker #${i + 1} (PID: ${pid})`)
    }
    log.push('')

    // События
    log.push('  // События cluster')
    log.push('  cluster.on("online", (worker) => {')
    log.push('    console.log(`Worker ${worker.process.pid} online`)')
    log.push('  })')
    log.push('')
    log.push('  cluster.on("listening", (worker, address) => {')
    log.push('    console.log(`Worker ${worker.process.pid} listening on ${address.port}`)')
    log.push('  })')
    log.push('')

    // Auto-restart
    log.push('  // Автоматический перезапуск упавших workers')
    log.push('  cluster.on("exit", (worker, code, signal) => {')
    log.push('    console.log(`Worker ${worker.process.pid} died (${signal || code})`)')
    log.push('    if (!worker.exitedAfterDisconnect) {')
    log.push('      cluster.fork()  // перезапуск')
    log.push('    }')
    log.push('  })')
    log.push('')

    log.push('} else {')
    log.push('  // Worker код — каждый worker запускает свой HTTP сервер')
    log.push('  http.createServer((req, res) => {')
    log.push('    res.end(`Hello from worker ${process.pid}`)')
    log.push('  }).listen(3000)')
    log.push('}')
    log.push('')

    // Load balancing
    log.push('=== Load Balancing ===')
    log.push('')
    log.push('📌 Round-Robin (по умолчанию на Linux/macOS)')
    log.push('  Primary принимает соединения и распределяет по workers')
    log.push('  Запрос 1 → Worker #1')
    log.push('  Запрос 2 → Worker #2')
    log.push('  Запрос 3 → Worker #3')
    log.push('  Запрос 4 → Worker #4')
    log.push('  Запрос 5 → Worker #1 (по кругу)')
    log.push('')
    log.push('  cluster.schedulingPolicy = cluster.SCHED_RR    // round-robin')
    log.push('  cluster.schedulingPolicy = cluster.SCHED_NONE  // ОС решает')
    log.push('')

    // Zero-downtime restart
    log.push('=== Zero-Downtime Restart ===')
    log.push('')
    log.push('async function zeroDowntimeRestart() {')
    log.push('  const workers = Object.values(cluster.workers)')
    log.push('')
    log.push('  for (const worker of workers) {')
    log.push('    // 1. Создать нового worker')
    log.push('    const newWorker = cluster.fork()')
    log.push('')
    log.push('    // 2. Дождаться пока новый будет ready')
    log.push('    await new Promise(r => newWorker.on("listening", r))')
    log.push('')
    log.push('    // 3. Отключить старого (drain connections)')
    log.push('    worker.disconnect()')
    log.push('')
    log.push('    // 4. Дождаться завершения старого')
    log.push('    await new Promise(r => worker.on("exit", r))')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('process.on("SIGUSR2", zeroDowntimeRestart)')

    setWorkers(workerInfos)
    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.4: Cluster Module</h2>
      <button onClick={runExample}>Запустить</button>
      {workers.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Workers:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
            {workers.map(w => (
              <div key={w.id} style={{
                padding: '0.75rem',
                borderRadius: 8,
                background: w.status === 'listening' ? '#e8f5e9' : w.status === 'dead' ? '#ffebee' : '#fff3e0',
                border: `1px solid ${w.status === 'listening' ? '#4caf50' : w.status === 'dead' ? '#f44336' : '#ff9800'}`,
                fontFamily: 'monospace',
                fontSize: '0.85rem',
              }}>
                <div><strong>Worker #{w.id}</strong></div>
                <div>PID: {w.pid}</div>
                <div>Status: {w.status}</div>
                <div>Requests: {w.requests}</div>
              </div>
            ))}
          </div>
        </div>
      )}
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
