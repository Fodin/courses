import { useState } from 'react'

// ============================================
// Задание 9.1: Process Object
// ============================================

// TODO: Изучите глобальный объект process:
//   - process.env — переменные окружения
//   - process.argv — аргументы командной строки
//   - process.cwd() — текущая директория
//   - process.pid, process.ppid — ID процесса
//   - process.memoryUsage() — { rss, heapTotal, heapUsed, external, arrayBuffers }
//   - process.cpuUsage() — { user, system } в микросекундах
//   - process.uptime() — время работы в секундах
//   - process.exit(code) — завершение с кодом
//   - process.exitCode — код завершения без вызова exit()
//
// TODO: Study the global process object:
//   - env, argv, cwd, pid, memoryUsage, cpuUsage, uptime, exit

export function Task9_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Process Object ===')
    log.push('')

    // TODO: Реализуйте парсер аргументов командной строки:
    //   parseArgs(argv: string[]): { flags: Record<string, boolean>, options: Record<string, string>, positional: string[] }
    //   Поддержка:
    //     --verbose → flags.verbose = true
    //     --port 3000 или --port=3000 → options.port = '3000'
    //     -v → flags.v = true
    //     файл.txt → positional = ['файл.txt']
    // TODO: Implement CLI argument parser

    const testArgv = ['node', 'app.js', '--verbose', '--port', '3000', '-d', 'input.txt', 'output.txt']

    log.push('Argument parsing:')
    log.push(`  Input: ${testArgv.join(' ')}`)
    log.push('  ... распарсите аргументы')
    log.push('')

    // TODO: Реализуйте форматирование memoryUsage:
    //   Конвертируйте байты в MB, покажите красивый вывод
    //   { rss: '45.2 MB', heapTotal: '20.1 MB', heapUsed: '15.3 MB' }
    // TODO: Format memoryUsage output converting bytes to MB

    log.push('Memory usage:')
    log.push('  ... отформатируйте и покажите использование памяти')
    log.push('')

    // TODO: Реализуйте безопасную работу с process.env:
    //   getEnv(key, defaultValue?) — возвращает значение или default
    //   requireEnv(key) — бросает ошибку если не задано
    //   parseEnvInt(key, defaultValue) — парсит как число
    // TODO: Implement safe process.env helpers
    log.push('Environment helpers:')
    log.push('  ... реализуйте безопасные хелперы для env')

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
