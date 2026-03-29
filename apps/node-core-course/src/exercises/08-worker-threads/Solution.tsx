import { useState } from 'react'

// ============================================
// Задание 8.1: Basic Worker — Решение
// ============================================

export function Task8_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Worker Threads: Основы ===')
    log.push('')

    // Создание Worker
    log.push('// main.js')
    log.push('const { Worker, isMainThread, workerData, parentPort }')
    log.push('  = require("worker_threads")')
    log.push('')

    log.push('if (isMainThread) {')
    log.push('  // Главный поток')
    log.push('  const worker = new Worker("./worker.js", {')
    log.push('    workerData: { numbers: [1, 2, 3, 4, 5] }')
    log.push('  })')
    log.push('}')
    log.push('')

    // Симуляция Worker lifecycle
    log.push('=== Жизненный цикл Worker ===')
    log.push('')
    log.push('🚀 [Main] Создание Worker...')
    log.push('   new Worker("./heavy-task.js", {')
    log.push('     workerData: { numbers: [1, 2, 3, 4, 5] }')
    log.push('   })')
    log.push('')

    log.push('📥 [Worker] Запущен, получил workerData:')
    log.push('   workerData = { numbers: [1, 2, 3, 4, 5] }')
    log.push('')

    log.push('⚙️ [Worker] Вычисление суммы...')
    const sum = [1, 2, 3, 4, 5].reduce((a, b) => a + b, 0)
    log.push(`   result = ${sum}`)
    log.push('')

    log.push('📤 [Worker] Отправка результата:')
    log.push(`   parentPort.postMessage({ result: ${sum} })`)
    log.push('')

    log.push('📥 [Main] Получено сообщение:')
    log.push(`   worker.on("message", (msg) => { /* msg.result = ${sum} */ })`)
    log.push('')

    log.push('✅ [Main] Worker завершён')
    log.push('   worker.on("exit", (code) => { /* code = 0 */ })')
    log.push('')

    // API
    log.push('=== API Worker ===')
    log.push('')
    log.push('📌 Конструктор:')
    log.push('new Worker(filename, {')
    log.push('  workerData: any,          // данные для worker (клонируются)')
    log.push('  env: SHARE_ENV,           // общие env переменные')
    log.push('  execArgv: [],             // флаги Node.js')
    log.push('  resourceLimits: {         // лимиты ресурсов')
    log.push('    maxOldGenerationSizeMb: 512,')
    log.push('    maxYoungGenerationSizeMb: 64,')
    log.push('    codeRangeSizeMb: 64,')
    log.push('    stackSizeMb: 4')
    log.push('  }')
    log.push('})')
    log.push('')

    log.push('📌 Методы главного потока:')
    log.push('  worker.postMessage(value)    // отправить сообщение')
    log.push('  worker.terminate()           // принудительно завершить')
    log.push('  worker.ref() / worker.unref() // управление event loop')
    log.push('  worker.threadId              // ID потока')
    log.push('')

    log.push('📌 API внутри Worker:')
    log.push('  parentPort.postMessage(value) // отправить в main')
    log.push('  parentPort.on("message", fn)  // получить от main')
    log.push('  workerData                    // данные из конструктора')
    log.push('  isMainThread                  // false внутри worker')
    log.push('  threadId                      // ID текущего потока')
    log.push('')

    // Inline worker
    log.push('=== Inline Worker (без файла) ===')
    log.push('')
    log.push('const worker = new Worker(`')
    log.push('  const { parentPort } = require("worker_threads")')
    log.push('  parentPort.postMessage("hello from inline worker")')
    log.push('`, { eval: true })')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.1: Basic Worker</h2>
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
// Задание 8.2: SharedArrayBuffer & Atomics — Решение
// ============================================

export function Task8_2_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [sharedDemo, setSharedDemo] = useState<number[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== SharedArrayBuffer: Разделяемая память ===')
    log.push('')

    // Демонстрация SharedArrayBuffer
    const sab = new SharedArrayBuffer(16) // 16 байт = 4 Int32
    const view = new Int32Array(sab)

    log.push('const sab = new SharedArrayBuffer(16)')
    log.push('const view = new Int32Array(sab) // 4 элемента по 4 байта')
    log.push(`view = [${view.join(', ')}]`)
    log.push('')

    // Запись данных
    view[0] = 42
    view[1] = 100
    view[2] = -7
    view[3] = 999

    log.push('view[0] = 42; view[1] = 100; view[2] = -7; view[3] = 999')
    log.push(`view = [${view.join(', ')}]`)
    log.push('')

    log.push('📌 SharedArrayBuffer vs ArrayBuffer:')
    log.push('  • ArrayBuffer — копируется при передаче в Worker (structured clone)')
    log.push('  • SharedArrayBuffer — РАЗДЕЛЯЕТСЯ между потоками')
    log.push('  • Оба потока видят одну и ту же память')
    log.push('')

    // Race condition демонстрация
    log.push('=== ⚠️ Race Condition ===')
    log.push('')
    log.push('// Без Atomics: race condition')
    log.push('// Thread 1: view[0] = view[0] + 1  (read → modify → write)')
    log.push('// Thread 2: view[0] = view[0] + 1  (read → modify → write)')
    log.push('')
    log.push('Если оба потока читают view[0]=0 одновременно:')
    log.push('  Thread 1: read 0, write 1')
    log.push('  Thread 2: read 0, write 1  ← потерянное обновление!')
    log.push('  Результат: 1 (ожидали 2)')
    log.push('')

    // Atomics
    log.push('=== Atomics: Атомарные операции ===')
    log.push('')

    const atomicView = new Int32Array(new SharedArrayBuffer(4))

    Atomics.store(atomicView, 0, 0)
    log.push(`Atomics.store(view, 0, 0)      // view[0] = 0 (атомарно)`)

    const oldVal = Atomics.add(atomicView, 0, 5)
    log.push(`Atomics.add(view, 0, 5)        // возвращает ${oldVal}, view[0] = ${atomicView[0]}`)

    const oldVal2 = Atomics.sub(atomicView, 0, 2)
    log.push(`Atomics.sub(view, 0, 2)        // возвращает ${oldVal2}, view[0] = ${atomicView[0]}`)

    const loaded = Atomics.load(atomicView, 0)
    log.push(`Atomics.load(view, 0)          // ${loaded} (атомарное чтение)`)

    const exchanged = Atomics.exchange(atomicView, 0, 42)
    log.push(`Atomics.exchange(view, 0, 42)  // возвращает ${exchanged}, view[0] = ${atomicView[0]}`)

    const cas = Atomics.compareExchange(atomicView, 0, 42, 100)
    log.push(`Atomics.compareExchange(view, 0, 42, 100) // возвращает ${cas}, view[0] = ${atomicView[0]}`)
    log.push('')

    // Wait/Notify
    log.push('=== Atomics.wait / Atomics.notify ===')
    log.push('')
    log.push('// Worker thread:')
    log.push('Atomics.wait(view, 0, 0)  // блокирует поток пока view[0] === 0')
    log.push('')
    log.push('// Main thread:')
    log.push('Atomics.store(view, 0, 1)')
    log.push('Atomics.notify(view, 0, 1) // пробуждает 1 ожидающий поток')
    log.push('')
    log.push('⚠️ Atomics.wait НЕЛЬЗЯ вызывать в главном потоке!')
    log.push('   Используйте Atomics.waitAsync (Node.js 16+)')

    setSharedDemo(Array.from(view))
    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.2: SharedArrayBuffer & Atomics</h2>
      <button onClick={runExample}>Запустить</button>
      {sharedDemo.length > 0 && (
        <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#e3f2fd', borderRadius: 8 }}>
          <strong>SharedArrayBuffer Int32Array:</strong>{' '}
          <code>[{sharedDemo.join(', ')}]</code>
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
// Задание 8.3: Worker Pool — Решение
// ============================================

interface PoolTask {
  id: number
  status: 'pending' | 'running' | 'done'
  workerId?: number
  result?: number
}

export function Task8_3_Solution() {
  const [tasks, setTasks] = useState<PoolTask[]>([])
  const [poolLog, setPoolLog] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const poolSize = 3
    const taskCount = 8

    log.push(`=== Worker Pool (размер: ${poolSize}) ===`)
    log.push('')

    // Инициализация пула
    log.push('📌 Создание пула:')
    for (let i = 0; i < poolSize; i++) {
      log.push(`  Worker #${i} создан и ожидает задачу`)
    }
    log.push('')

    // Симуляция выполнения задач
    const allTasks: PoolTask[] = Array.from({ length: taskCount }, (_, i) => ({
      id: i + 1,
      status: 'pending' as const,
    }))

    log.push(`📋 Очередь: ${taskCount} задач`)
    log.push('')

    // Распределение задач
    let time = 0
    const workerFreeAt = new Array(poolSize).fill(0)

    for (const task of allTasks) {
      // Найти свободный worker с минимальным временем
      const workerIdx = workerFreeAt.indexOf(Math.min(...workerFreeAt))
      const startTime = workerFreeAt[workerIdx]
      const duration = 100 + Math.floor(Math.random() * 200)
      const endTime = startTime + duration

      task.workerId = workerIdx
      task.status = 'done'
      task.result = task.id * 10

      workerFreeAt[workerIdx] = endTime
      time = Math.max(time, endTime)

      log.push(`⚙️ [${startTime}ms] Worker #${workerIdx} ← Задача #${task.id}`)
      log.push(`✅ [${endTime}ms] Worker #${workerIdx} → Результат: ${task.result} (${duration}ms)`)
    }

    log.push('')
    log.push(`🏁 Все задачи завершены за ~${time}ms`)
    log.push(`   Последовательно заняло бы: ~${allTasks.length * 150}ms`)
    log.push('')

    // Код Worker Pool
    log.push('=== Реализация Worker Pool ===')
    log.push('')
    log.push('class WorkerPool {')
    log.push('  constructor(workerFile, poolSize) {')
    log.push('    this.workers = []')
    log.push('    this.freeWorkers = []')
    log.push('    this.queue = []  // очередь задач')
    log.push('')
    log.push('    for (let i = 0; i < poolSize; i++) {')
    log.push('      const worker = new Worker(workerFile)')
    log.push('      worker.on("message", (result) => {')
    log.push('        // Worker свободен — вернуть в пул')
    log.push('        this.freeWorkers.push(worker)')
    log.push('        worker[kCallback](null, result)')
    log.push('        this.processQueue()')
    log.push('      })')
    log.push('      this.workers.push(worker)')
    log.push('      this.freeWorkers.push(worker)')
    log.push('    }')
    log.push('  }')
    log.push('')
    log.push('  runTask(data) {')
    log.push('    return new Promise((resolve, reject) => {')
    log.push('      const worker = this.freeWorkers.pop()')
    log.push('      if (worker) {')
    log.push('        worker[kCallback] = (err, res) =>')
    log.push('          err ? reject(err) : resolve(res)')
    log.push('        worker.postMessage(data)')
    log.push('      } else {')
    log.push('        this.queue.push({ data, resolve, reject })')
    log.push('      }')
    log.push('    })')
    log.push('  }')
    log.push('')
    log.push('  async destroy() {')
    log.push('    for (const worker of this.workers) {')
    log.push('      await worker.terminate()')
    log.push('    }')
    log.push('  }')
    log.push('}')
    log.push('')

    // Использование
    log.push('=== Использование ===')
    log.push('')
    log.push('const pool = new WorkerPool("./heavy-task.js", os.cpus().length)')
    log.push('')
    log.push('const results = await Promise.all([')
    log.push('  pool.runTask({ type: "hash", data: "file1.bin" }),')
    log.push('  pool.runTask({ type: "hash", data: "file2.bin" }),')
    log.push('  pool.runTask({ type: "hash", data: "file3.bin" }),')
    log.push('])')
    log.push('')
    log.push('await pool.destroy()')

    setTasks(allTasks)
    setPoolLog(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.3: Worker Pool</h2>
      <button onClick={runExample}>Запустить</button>
      {tasks.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Распределение задач:</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {tasks.map(t => (
              <div key={t.id} style={{
                padding: '0.5rem 1rem',
                borderRadius: 8,
                background: t.status === 'done' ? '#e8f5e9' : '#fff3e0',
                border: `1px solid ${t.status === 'done' ? '#4caf50' : '#ff9800'}`,
                fontSize: '0.85rem',
                fontFamily: 'monospace',
              }}>
                Task #{t.id} → W#{t.workerId} = {t.result}
              </div>
            ))}
          </div>
        </div>
      )}
      {poolLog.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Лог выполнения:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {poolLog.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
