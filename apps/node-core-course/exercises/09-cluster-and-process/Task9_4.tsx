import { useState } from 'react'

// ============================================
// Задание 9.4: Cluster
// ============================================

// TODO: Изучите модуль cluster для масштабирования на все ядра CPU:
//   - cluster.isPrimary / cluster.isWorker — определение роли
//   - cluster.fork() — создание рабочего процесса
//   - cluster.on('exit', (worker, code, signal) => ...) — перезапуск
//   - Workers разделяют серверный порт (round-robin балансировка)
//   - Каждый worker — отдельный Node.js процесс с своим V8 и Event Loop
//   - IPC между primary и workers через cluster.workers
//
// TODO: Study the cluster module for multi-core scaling:
//   - isPrimary/isWorker, fork(), exit handling
//   - Workers share server port (round-robin)

export function Task9_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Cluster ===')
    log.push('')

    // TODO: Смоделируйте работу cluster:
    //   class MockCluster {
    //     isPrimary: boolean
    //     workers: Map<number, MockWorker>
    //     fork(): MockWorker
    //     on('exit', cb) — перезапуск упавшего воркера
    //   }
    //   Primary создаёт os.cpus().length воркеров
    //   Каждый воркер "обрабатывает" HTTP запросы
    // TODO: Simulate cluster behavior

    log.push('Cluster setup:')
    log.push('  ... создайте primary + N workers')
    log.push('')

    // TODO: Реализуйте round-robin балансировку:
    //   Primary получает запросы и распределяет их по workers по очереди
    //   Покажите, какой worker обработал какой запрос
    // TODO: Implement round-robin load balancing

    log.push('Round-robin balancing:')
    log.push('  ... покажите распределение запросов по воркерам')
    log.push('')

    // TODO: Реализуйте zero-downtime restart:
    //   1. Primary получает сигнал SIGUSR2
    //   2. Создаёт новых воркеров по одному
    //   3. После запуска нового — останавливает старый
    //   4. Все запросы продолжают обрабатываться
    // TODO: Implement zero-downtime restart
    log.push('Zero-downtime restart:')
    log.push('  ... реализуйте перезапуск без простоя')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.4: Cluster</h2>
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
