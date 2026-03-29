# 🔥 Уровень 7: Дочерние процессы (child_process)

## 🎯 Введение

Node.js — однопоточная среда выполнения. Но это не означает, что вы ограничены одним процессом. Модуль `child_process` позволяет создавать дочерние процессы для выполнения системных команд, запуска внешних программ и параллельной обработки данных.

Умение работать с дочерними процессами критически важно для:
- Запуска CLI-инструментов из Node.js-приложения
- Параллелизации CPU-интенсивных задач
- Изоляции нестабильного кода в отдельных процессах
- Построения микросервисных архитектур

## 🔥 Обзор модуля child_process

Модуль предоставляет 4 основных метода:

| Метод | Shell | Буферизация | IPC | Когда использовать |
|-------|-------|------------|-----|-------------------|
| `exec` | Да | Да (stdout/stderr) | Нет | Короткие команды с малым выводом |
| `execFile` | Нет | Да | Нет | Запуск конкретного бинарника |
| `spawn` | Нет* | Нет (потоки) | Опционально | Долгие процессы, большой вывод |
| `fork` | Нет | Нет (потоки) | Да (авто) | Node.js worker-процессы |

*`spawn` может использовать shell через опцию `{ shell: true }`

## 🔥 exec и execFile

### exec — запуск через shell

```javascript
const { exec } = require('child_process')

exec('ls -la | grep .js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Ошибка: ${error.message}`)
    console.error(`Exit code: ${error.code}`)
    return
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`)
  }
  console.log(`stdout: ${stdout}`)
})
```

`exec` запускает команду **внутри shell** (`/bin/sh` на Unix, `cmd.exe` на Windows). Это означает:
- Можно использовать pipes (`|`), переменные (`$HOME`), globbing (`*.js`)
- Весь stdout и stderr **буферизуются в памяти**
- Результат приходит целиком в callback

### Опции exec

```javascript
exec('npm run build', {
  cwd: '/path/to/project',       // рабочая директория
  env: { ...process.env, CI: '1' }, // окружение
  timeout: 30000,                 // таймаут в мс
  maxBuffer: 10 * 1024 * 1024,   // 10 МБ (по умолчанию 1 МБ)
  encoding: 'utf8',              // кодировка вывода
  shell: '/bin/bash',            // какой shell использовать
  killSignal: 'SIGTERM',         // сигнал при таймауте
}, callback)
```

### execFile — без shell

```javascript
const { execFile } = require('child_process')

execFile('/usr/bin/git', ['log', '--oneline', '-10'], (error, stdout) => {
  if (error) throw error
  console.log(stdout)
})
```

📌 **Ключевое отличие:** `execFile` запускает бинарник напрямую, без создания shell-процесса.

Преимущества:
- **Безопасность**: нет shell injection
- **Производительность**: на один процесс меньше
- **Предсказуемость**: аргументы передаются как массив

### ⚠️ Shell Injection

```javascript
// ❌ ОПАСНО — пользовательский ввод в exec
const filename = req.query.file // ";rm -rf /"
exec(`cat ${filename}`)
// Выполнит: cat ;rm -rf /

// ✅ БЕЗОПАСНО — execFile с массивом аргументов
execFile('cat', [filename])
// Попытается прочитать файл с именем ";rm -rf /"
```

### maxBuffer — частая ловушка

```javascript
// ❌ Падает на больших файлах
exec('cat /var/log/huge.log', (error, stdout) => {
  // Error: stdout maxBuffer length exceeded
})

// ✅ Увеличить буфер
exec('cat /var/log/huge.log', { maxBuffer: 50 * 1024 * 1024 }, callback)

// ✅✅ Лучше — использовать spawn (потоковое чтение)
const child = spawn('cat', ['/var/log/huge.log'])
child.stdout.pipe(process.stdout)
```

## 🔥 spawn — потоковые процессы

`spawn` — самый низкоуровневый и гибкий метод:

```javascript
const { spawn } = require('child_process')

const child = spawn('find', ['/var/log', '-name', '*.log', '-size', '+1M'])

child.stdout.on('data', (chunk) => {
  // chunk — это Buffer, приходит частями
  console.log(`stdout: ${chunk}`)
})

child.stderr.on('data', (chunk) => {
  console.error(`stderr: ${chunk}`)
})

child.on('close', (code, signal) => {
  console.log(`Процесс завершён: code=${code}, signal=${signal}`)
})

child.on('error', (err) => {
  // Ошибка запуска (бинарник не найден и т.д.)
  console.error('Не удалось запустить процесс:', err)
})
```

### stdio — управление потоками

```javascript
// pipe (по умолчанию) — потоки доступны как child.stdin/stdout/stderr
spawn('cmd', [], { stdio: 'pipe' })
// эквивалентно:
spawn('cmd', [], { stdio: ['pipe', 'pipe', 'pipe'] })

// inherit — ребёнок наследует потоки родителя
spawn('npm', ['test'], { stdio: 'inherit' })
// Вывод идёт прямо в терминал родителя

// ignore — потоки отключены
spawn('daemon', [], { stdio: 'ignore' })

// Комбинация: stdin от родителя, stdout в pipe, stderr в файл
const logFile = fs.openSync('error.log', 'a')
spawn('cmd', [], { stdio: ['inherit', 'pipe', logFile] })
```

### Сигналы

```javascript
const child = spawn('long-running-task', [])

// Мягкое завершение
child.kill('SIGTERM')

// Принудительное завершение (процесс не может перехватить)
child.kill('SIGKILL')

// Проверка, жив ли процесс
console.log(child.killed)    // true, если мы отправили сигнал
console.log(child.exitCode)  // null, если ещё работает

// Таймаут вручную
setTimeout(() => {
  if (child.exitCode === null) {
    child.kill('SIGKILL')
  }
}, 10000)
```

### Detached процессы

```javascript
// Создать процесс, который переживёт родителя
const child = spawn('node', ['server.js'], {
  detached: true,   // новая группа процессов
  stdio: 'ignore',  // отключить потоки
})

// Позволить родителю завершиться, не дожидаясь ребёнка
child.unref()
```

📌 `detached: true` создаёт новую группу процессов. Без `unref()` Node.js будет ждать завершения дочернего процесса.

## 🔥 fork — Node.js worker-процессы

`fork` — специализированная версия `spawn` для запуска Node.js-скриптов:

```javascript
const { fork } = require('child_process')

// Создаёт новый Node.js-процесс с IPC-каналом
const child = fork('./worker.js', ['arg1'], {
  execArgv: ['--max-old-space-size=512'],  // флаги Node.js
  env: { ...process.env, WORKER_ID: '1' },
})
```

### IPC — межпроцессное взаимодействие

```javascript
// parent.js
const child = fork('./worker.js')

// Отправить сообщение ребёнку
child.send({ type: 'task', data: [1, 2, 3] })

// Получить сообщение от ребёнка
child.on('message', (msg) => {
  console.log('Результат:', msg.result)
})

// worker.js
process.on('message', (msg) => {
  if (msg.type === 'task') {
    const result = msg.data.reduce((a, b) => a + b, 0)
    process.send({ type: 'result', result })
  }
})
```

### Паттерн Worker

```javascript
// parent.js
class TaskRunner {
  constructor(workerPath, count = 4) {
    this.workers = []
    this.queue = []
    this.callbacks = new Map()

    for (let i = 0; i < count; i++) {
      const worker = fork(workerPath)
      worker.on('message', (msg) => this.handleMessage(worker, msg))
      worker.on('exit', (code) => this.handleExit(worker, code))
      this.workers.push({ process: worker, busy: false })
    }
  }

  run(task) {
    return new Promise((resolve, reject) => {
      const freeWorker = this.workers.find(w => !w.busy)
      if (freeWorker) {
        this.dispatch(freeWorker, task, resolve, reject)
      } else {
        this.queue.push({ task, resolve, reject })
      }
    })
  }
}
```

### Передача сложных объектов

```javascript
// ❌ Нельзя передать через IPC
child.send({ fn: () => {} })          // функции
child.send({ socket: net.Socket() })  // нативные объекты*

// ✅ Можно передать
child.send({ data: [1, 2, 3] })          // примитивы и массивы
child.send({ nested: { a: { b: 1 } } })  // вложенные объекты
child.send({ buffer: Buffer.from('hi') }) // Buffer (сериализуется)

// * Исключение: TCP-сокеты можно передать через специальный механизм
child.send({ type: 'socket' }, socket)
```

📌 IPC использует JSON-сериализацию. Всё, что не сериализуется в JSON, будет потеряно.

## 🔥 Promise-обёртки

Начиная с Node.js 16+, доступны Promise-версии:

```javascript
const { execFile } = require('child_process')
const { promisify } = require('util')

const execFileAsync = promisify(execFile)

async function getGitBranch() {
  const { stdout } = await execFileAsync('git', ['branch', '--show-current'])
  return stdout.trim()
}
```

Для `spawn` Promise не подходит (потоковый API), но можно обернуть событие `close`:

```javascript
function spawnAsync(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, options)
    let stdout = ''
    let stderr = ''

    child.stdout?.on('data', (d) => { stdout += d })
    child.stderr?.on('data', (d) => { stderr += d })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr })
      else reject(new Error(`Process exited with code ${code}: ${stderr}`))
    })
  })
}
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: exec для больших выводов

```javascript
// ❌ Плохо — буферизация всего вывода
exec('mysqldump mydb', (error, stdout) => {
  fs.writeFileSync('backup.sql', stdout)
})
// Упадёт с maxBuffer exceeded на большой БД

// ✅ Хорошо — потоковая запись
const child = spawn('mysqldump', ['mydb'])
child.stdout.pipe(fs.createWriteStream('backup.sql'))
```

### Ошибка 2: Игнорирование stderr

```javascript
// ❌ Плохо — stderr не обрабатывается
const child = spawn('npm', ['install'])
child.stdout.on('data', (d) => console.log(d.toString()))
// Ошибки npm молча теряются!

// ✅ Хорошо
child.stderr.on('data', (d) => console.error(d.toString()))
child.on('close', (code) => {
  if (code !== 0) console.error(`npm install failed with code ${code}`)
})
```

### Ошибка 3: Утечка процессов

```javascript
// ❌ Плохо — процесс-зомби при ошибке
const child = spawn('server', [])
// Если родитель падает, ребёнок остаётся

// ✅ Хорошо — очистка при завершении
process.on('exit', () => {
  child.kill()
})
process.on('SIGTERM', () => {
  child.kill()
  process.exit(0)
})
```

### Ошибка 4: Не обрабатывать событие error

```javascript
// ❌ Плохо — необработанное исключение
const child = spawn('nonexistent-command', [])
// Throws: Error: spawn nonexistent-command ENOENT

// ✅ Хорошо
const child = spawn('nonexistent-command', [])
child.on('error', (err) => {
  console.error('Не удалось запустить:', err.message)
})
```

### Ошибка 5: fork для не-Node.js скриптов

```javascript
// ❌ Плохо — fork только для Node.js
fork('./script.py')
// Попытается запустить Python-файл через Node.js

// ✅ Хорошо
spawn('python3', ['./script.py'])
```

## 💡 Best Practices

1. **Используйте `execFile` вместо `exec`** когда не нужны shell-фичи — безопаснее и быстрее
2. **Всегда обрабатывайте `error`** событие на spawn/fork — иначе ENOENT бросит необработанное исключение
3. **Используйте `spawn` для больших выводов** — потоки не съедают память
4. **Убивайте дочерние процессы при завершении** — предотвращайте зомби-процессы
5. **Ограничивайте количество параллельных процессов** — каждый fork = ~30 МБ RAM
6. **Валидируйте пользовательский ввод** перед передачей в exec/spawn
7. **Используйте AbortController** (Node.js 16+) для отмены exec/spawn:

```javascript
const controller = new AbortController()
const child = spawn('cmd', [], { signal: controller.signal })
setTimeout(() => controller.abort(), 5000)
```
