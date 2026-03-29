import { useState } from 'react'

// ============================================
// Задание 9.3: OS Module
// ============================================

// TODO: Изучите модуль os для получения информации о системе:
//   - os.cpus() — информация о CPU (модель, скорость, times)
//   - os.totalmem() / os.freemem() — память
//   - os.platform() — 'linux', 'darwin', 'win32'
//   - os.arch() — 'x64', 'arm64'
//   - os.hostname() — имя хоста
//   - os.networkInterfaces() — сетевые интерфейсы
//   - os.loadavg() — средняя загрузка (Linux/macOS)
//   - os.tmpdir() — временная директория
//   - os.homedir() — домашняя директория
//   - os.EOL — символ конца строки для текущей ОС
//
// TODO: Study the os module for system information

export function Task9_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== OS Module ===')
    log.push('')

    // TODO: Реализуйте системный монитор — функцию getSystemInfo():
    //   Возвращает объект с:
    //   - platform, arch, hostname
    //   - cpuCount, cpuModel
    //   - totalMemory (в GB), freeMemory (в GB), usedPercent
    //   - uptime (форматированное: "2d 5h 30m")
    //   - loadAvg (1min, 5min, 15min)
    //   Для симуляции используйте заранее определённые значения
    // TODO: Implement system monitor — getSystemInfo() function

    log.push('System info:')
    log.push('  ... выведите информацию о системе')
    log.push('')

    // TODO: Реализуйте health check функцию:
    //   checkHealth(): { status: 'healthy' | 'warning' | 'critical', checks: [...] }
    //   Проверки:
    //     - Память: warning > 80%, critical > 95%
    //     - CPU load: warning > 0.7 * cores, critical > 0.9 * cores
    //     - Disk (симуляция): warning > 80%, critical > 95%
    // TODO: Implement health check function

    log.push('Health check:')
    log.push('  ... реализуйте проверку здоровья системы')
    log.push('')

    // TODO: Реализуйте форматирование uptime в человекочитаемый формат:
    //   formatUptime(seconds: number): string
    //   12345 → "3h 25m 45s", 90061 → "1d 1h 1m 1s"
    // TODO: Implement human-readable uptime formatting
    log.push('Uptime formatting:')
    log.push('  ... отформатируйте uptime')

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
