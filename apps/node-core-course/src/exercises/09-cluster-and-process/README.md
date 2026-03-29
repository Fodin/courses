# 🔥 Уровень 9: Cluster, Process и OS

## 🎯 Введение

Объект `process` — это сердце Node.js-приложения. Через него вы управляете окружением, аргументами, памятью и жизненным циклом процесса. Модуль `os` даёт информацию о системе, а `cluster` позволяет масштабировать HTTP-серверы на все ядра CPU.

## 🔥 Объект process

### process.env — переменные окружения

```javascript
// Чтение
const port = Number(process.env.PORT) || 3000
const isProduction = process.env.NODE_ENV === 'production'

// ⚠️ Все значения — строки!
process.env.PORT = 3000    // автоматически станет "3000"
typeof process.env.PORT    // "string"

// Установка при запуске
// PORT=3000 NODE_ENV=production node app.js
// или dotenv: require('dotenv').config()
```

### process.argv — аргументы командной строки

```javascript
// $ node app.js --port 3000 --verbose
process.argv[0]  // '/usr/bin/node'
process.argv[1]  // '/app/app.js'
process.argv[2]  // '--port'

// Node.js 18.3+
const { values } = require('util').parseArgs({
  options: {
    port: { type: 'string', short: 'p', default: '3000' },
    verbose: { type: 'boolean', short: 'v' },
  }
})
```

### process.memoryUsage()

```javascript
const mem = process.memoryUsage()
// {
//   rss: 47185920,        // Resident Set Size — вся память
//   heapTotal: 20971520,  // выделенный V8 heap
//   heapUsed: 15728640,   // используемый V8 heap
//   external: 2097152,    // C++ объекты (Buffer, etc.)
//   arrayBuffers: 1048576 // ArrayBuffer + SharedArrayBuffer
// }
```

📌 **rss** (Resident Set Size) — общий объём памяти процесса, включая код, стек, heap и C++ объекты. Это то, что показывает `top`/`htop`.

### process.exit и exitCode

```javascript
// ❌ Жёсткое завершение — async операции могут не завершиться
process.exit(1)

// ✅ Мягкое завершение — Node.js завершится после event loop
process.exitCode = 1

// Коды выхода:
// 0 — успех
// 1 — необработанная ошибка
// 2 — неиспользуемый (зарезервирован Bash)
// 12 — невалидный debug аргумент
// 13 — unfinished top-level await
```

### process.stdin / stdout / stderr

```javascript
// stdin — Readable stream
process.stdin.setEncoding('utf8')
process.stdin.on('data', (input) => {
  console.log('Ввод:', input.trim())
})

// stdout — Writable stream
process.stdout.write('без перевода строки')
console.log('с переводом строки') // === stdout.write + \n

// stderr — для ошибок и диагностики
console.error('Ошибка!')  // пишет в stderr
process.stderr.write('diagnostic info\n')

// ⚠️ stdout может быть буферизирован (pipe, файл)
// stderr всегда небуферизирован
```

### Другие полезные свойства

```javascript
process.pid          // PID текущего процесса
process.ppid         // PID родительского процесса
process.platform     // 'linux', 'darwin', 'win32'
process.arch         // 'x64', 'arm64'
process.version      // 'v20.11.0'
process.versions     // { node, v8, uv, zlib, ... }
process.uptime()     // секунды с запуска
process.hrtime.bigint() // наносекунды (замеры производительности)
process.cpuUsage()   // { user, system } в микросекундах
process.title        // имя процесса в ps/top
process.cwd()        // текущая рабочая директория
process.chdir(dir)   // сменить директорию
```

## 🔥 Сигналы и Graceful Shutdown

### Unix-сигналы

| Сигнал | Номер | Описание | Можно перехватить |
|--------|-------|----------|-------------------|
| SIGINT | 2 | Ctrl+C | Да |
| SIGTERM | 15 | Запрос завершения | Да |
| SIGKILL | 9 | Принудительное завершение | Нет |
| SIGHUP | 1 | Терминал закрыт | Да |
| SIGUSR1 | 10 | Пользовательский (Node.js: debugger) | Да |
| SIGUSR2 | 12 | Пользовательский | Да |

### Graceful Shutdown

```javascript
let isShuttingDown = false

async function gracefulShutdown(signal) {
  if (isShuttingDown) return
  isShuttingDown = true

  console.log(`Получен ${signal}, начинаем shutdown...`)

  // Таймаут на случай зависания
  const forceTimeout = setTimeout(() => {
    console.error('Таймаут! Принудительное завершение')
    process.exit(1)
  }, 30000)
  forceTimeout.unref()

  try {
    // 1. Перестать принимать новые соединения
    await new Promise(resolve => server.close(resolve))

    // 2. Закрыть пулы подключений к БД
    await db.end()
    await redis.quit()

    // 3. Завершить фоновые задачи
    await Promise.allSettled(backgroundTasks)

    // 4. Flush логов
    await logger.flush()

    console.log('Shutdown завершён')
    process.exit(0)
  } catch (err) {
    console.error('Ошибка при shutdown:', err)
    process.exit(1)
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
```

📌 В Docker: `docker stop` посылает SIGTERM, ждёт 10 секунд, затем SIGKILL. Убедитесь, что ваш shutdown укладывается в это время.

## 🔥 Модуль os

```javascript
const os = require('os')

// CPU
os.cpus()              // массив ядер с моделью и скоростью
os.cpus().length       // количество ядер
os.availableParallelism() // Node.js 19.4+ (учитывает cgroups в Docker)

// Память
os.totalmem()          // общая RAM в байтах
os.freemem()           // свободная RAM

// Система
os.platform()          // 'linux', 'darwin', 'win32'
os.type()              // 'Linux', 'Darwin', 'Windows_NT'
os.arch()              // 'x64', 'arm64'
os.release()           // версия ядра ОС
os.hostname()          // имя хоста
os.homedir()           // домашняя директория
os.tmpdir()            // временная директория
os.uptime()            // uptime ОС в секундах
os.loadavg()           // нагрузка [1мин, 5мин, 15мин]

// Сеть
os.networkInterfaces() // сетевые интерфейсы с IP-адресами

// Пользователь
os.userInfo()          // { username, uid, gid, homedir, shell }

// Константы
os.EOL                 // '\n' (Unix) или '\r\n' (Windows)
os.constants.signals   // { SIGTERM: 15, SIGKILL: 9, ... }
os.constants.errno     // { ENOENT: -2, EACCES: -13, ... }
```

## 🔥 Cluster Module

### Зачем нужен Cluster

Node.js использует одно ядро CPU. Cluster позволяет запустить несколько процессов (workers), разделяющих один порт:

```javascript
const cluster = require('cluster')
const http = require('http')
const os = require('os')

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`)
    cluster.fork() // перезапуск
  })
} else {
  http.createServer((req, res) => {
    res.end(`Worker ${process.pid}`)
  }).listen(3000)
}
```

### Load Balancing

```javascript
// Round-Robin (по умолчанию на Linux/macOS)
cluster.schedulingPolicy = cluster.SCHED_RR

// OS-based (Windows default)
cluster.schedulingPolicy = cluster.SCHED_NONE

// Primary принимает соединение и передаёт worker-у
// При SCHED_RR — по очереди
// При SCHED_NONE — ОС решает кому отдать
```

### Zero-Downtime Restart

```javascript
async function rollingRestart() {
  const workerIds = Object.keys(cluster.workers)

  for (const id of workerIds) {
    const oldWorker = cluster.workers[id]

    // Создать нового
    const newWorker = cluster.fork()
    await new Promise(r => newWorker.on('listening', r))

    // Отключить старого
    oldWorker.disconnect()
    await new Promise(r => oldWorker.on('exit', r))

    console.log(`Worker ${id} перезапущен`)
  }
}

process.on('SIGUSR2', rollingRestart)
// kill -USR2 <primary_pid>
```

### IPC между Primary и Workers

```javascript
if (cluster.isPrimary) {
  const worker = cluster.fork()

  worker.send({ type: 'config', data: { maxConnections: 100 } })

  worker.on('message', (msg) => {
    console.log('От worker:', msg)
  })
} else {
  process.on('message', (msg) => {
    if (msg.type === 'config') {
      // Применить конфигурацию
    }
  })

  process.send({ type: 'ready' })
}
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: process.exit() вместо exitCode

```javascript
// ❌ Плохо — async операции не завершатся
async function main() {
  await saveData()
  process.exit(0) // может прервать запись в БД
}

// ✅ Хорошо
async function main() {
  await saveData()
  process.exitCode = 0
  // Node.js завершится когда event loop опустеет
}
```

### Ошибка 2: Нет таймаута в graceful shutdown

```javascript
// ❌ Плохо — может зависнуть навсегда
process.on('SIGTERM', async () => {
  await db.end() // что если БД не отвечает?
})

// ✅ Хорошо — с таймаутом
process.on('SIGTERM', async () => {
  const timeout = setTimeout(() => process.exit(1), 30000)
  timeout.unref()
  await db.end()
  process.exit(0)
})
```

### Ошибка 3: cluster.isMaster вместо isPrimary

```javascript
// ❌ Устаревшее (deprecated в Node.js 16)
if (cluster.isMaster) { ... }

// ✅ Актуальное
if (cluster.isPrimary) { ... }
```

### Ошибка 4: Хранение состояния в workers

```javascript
// ❌ Плохо — каждый worker имеет своё состояние
let sessions = {} // НЕ разделяется между workers!

// ✅ Хорошо — внешнее хранилище
const redis = require('redis').createClient()
```

## 💡 Best Practices

1. **Graceful shutdown** — всегда обрабатывайте SIGTERM и SIGINT
2. **Таймаут shutdown** — не позволяйте процессу зависнуть
3. **process.exitCode вместо process.exit()** — для мягкого завершения
4. **os.availableParallelism()** вместо os.cpus().length в контейнерах
5. **Внешнее состояние** (Redis, DB) при использовании cluster — workers не разделяют память
6. **Мониторинг process.memoryUsage()** — для обнаружения утечек памяти
7. **Rolling restart** — обновление без простоя через последовательный перезапуск workers
