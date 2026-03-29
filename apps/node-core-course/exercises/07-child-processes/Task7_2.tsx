import { useState } from 'react'

// ============================================
// Задание 7.2: spawn
// ============================================

// TODO: Изучите spawn — низкоуровневый способ запуска процессов:
//   - spawn(command, args, options) — не буферизует вывод, стримы
//   - child.stdout — Readable stream
//   - child.stderr — Readable stream
//   - child.stdin — Writable stream
//   - События: 'exit', 'error', 'close', 'disconnect'
//   - options: { cwd, env, stdio, shell, detached, signal }
//   - stdio: 'pipe' | 'inherit' | 'ignore' | Stream
//
// TODO: Study spawn — low-level process creation:
//   - Returns child with stdout/stderr/stdin streams
//   - Events: 'exit', 'error', 'close'
//   - stdio options: 'pipe', 'inherit', 'ignore'

export function Task7_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== spawn ===')
    log.push('')

    // TODO: Смоделируйте spawn с потоковым выводом:
    //   Реализуйте класс MockChildProcess:
    //     - stdout: MockReadable — поток стандартного вывода
    //     - stderr: MockReadable — поток ошибок
    //     - stdin: MockWritable — поток ввода
    //     - kill(signal?) — отправка сигнала
    //     - on('exit', cb) — код завершения
    //   Покажите чтение stdout по частям (chunked)
    // TODO: Simulate spawn with streaming output

    log.push('Streaming stdout:')
    log.push('  ... прочитайте вывод процесса по чанкам')
    log.push('')

    // TODO: Покажите piping между процессами (аналог shell pipe):
    //   spawn('grep', ['error']) с stdin от spawn('cat', ['logfile'])
    //   child1.stdout.pipe(child2.stdin)
    // TODO: Show piping between processes
    log.push('Process piping:')
    log.push('  ... соедините stdout одного процесса с stdin другого')
    log.push('')

    // TODO: Продемонстрируйте разные stdio конфигурации:
    //   'pipe' — доступ к потокам через child.stdout/stderr
    //   'inherit' — вывод прямо в родительский процесс
    //   'ignore' — подавление вывода
    // TODO: Show different stdio configurations
    log.push('stdio options:')
    log.push('  ... покажите разные режимы stdio')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.2: spawn</h2>
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
