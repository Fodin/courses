import { useState } from 'react'

// ============================================
// Задание 6.3: URL & DNS
// ============================================

// TODO: Изучите работу с URL и DNS в Node.js:
//   URL API (WHATWG):
//     - new URL(input, base?) — парсинг URL
//     - url.protocol, hostname, port, pathname, searchParams
//     - URLSearchParams — работа с query-параметрами
//   DNS:
//     - dns.lookup(hostname) — использует ОС resolver (libuv thread pool)
//     - dns.resolve(hostname, rrtype) — прямой DNS запрос
//     - dns.promises — промис-версии
//
// TODO: Study URL and DNS in Node.js:
//   URL API (WHATWG): new URL(), URLSearchParams
//   DNS: dns.lookup, dns.resolve, dns.promises

export function Task6_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== URL & DNS ===')
    log.push('')

    // TODO: Реализуйте парсер URL, который разбирает строку на компоненты:
    //   parseURL(input: string): { protocol, hostname, port, pathname, search, hash, searchParams }
    //   Тестовые URL:
    //   - 'https://api.example.com:8080/users?page=1&limit=10#section'
    //   - 'http://localhost:3000/api/v2/items'
    //   - 'ftp://files.example.com/docs/report.pdf'
    // TODO: Implement URL parser that breaks string into components

    log.push('URL parsing:')
    log.push('  ... разберите URL на компоненты')
    log.push('')

    // TODO: Работа с URLSearchParams:
    //   1. Создание из строки: new URLSearchParams('foo=1&bar=2')
    //   2. Добавление/удаление: append, delete, set
    //   3. Итерация: for...of, entries(), keys(), values()
    //   4. Сериализация: toString()
    // TODO: Work with URLSearchParams

    log.push('URLSearchParams:')
    log.push('  ... покажите операции с query-параметрами')
    log.push('')

    // TODO: Объясните разницу между dns.lookup и dns.resolve:
    //   lookup: использует getaddrinfo ОС, учитывает /etc/hosts, блокирует thread pool
    //   resolve: прямой DNS запрос, не учитывает hosts файл, не блокирует
    // TODO: Explain difference between dns.lookup and dns.resolve
    log.push('dns.lookup vs dns.resolve:')
    log.push('  ... объясните разницу')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.3: URL & DNS</h2>
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
