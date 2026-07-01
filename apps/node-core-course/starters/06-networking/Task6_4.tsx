import { useState } from 'react'

// ============================================
// Задание 6.4: HTTPS / TLS
// ============================================

// TODO: Изучите работу с TLS/HTTPS в Node.js:
//   - tls.createServer(options) — TLS сервер (нужен сертификат и ключ)
//   - tls.connect(options) — TLS клиент
//   - https.createServer(options, handler) — HTTPS сервер
//   - Самоподписанные сертификаты для разработки
//   - SNI (Server Name Indication) — несколько сертификатов на одном IP
//   - tls.createSecureContext() — переиспользование контекста
//
// TODO: Study TLS/HTTPS in Node.js:
//   - tls.createServer, tls.connect, https.createServer
//   - Self-signed certificates, SNI, secure context

export function Task6_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== HTTPS / TLS ===')
    log.push('')

    // TODO: Опишите процесс TLS handshake:
    //   1. Client Hello (поддерживаемые cipher suites, random)
    //   2. Server Hello (выбранный cipher suite, сертификат)
    //   3. Client верифицирует сертификат
    //   4. Key exchange (Diffie-Hellman или RSA)
    //   5. Обе стороны вычисляют session key
    //   6. Encrypted communication begins
    // TODO: Describe the TLS handshake process

    const handshakeSteps: Array<{ step: number, name: string, description: string }> = [
      // TODO: Заполните массив шагов TLS handshake
      // TODO: Fill in the TLS handshake steps array
    ]

    log.push('TLS Handshake:')
    handshakeSteps.forEach(s => {
      log.push(`  ${s.step}. ${s.name}: ${s.description}`)
    })
    log.push('')

    // TODO: Покажите конфигурацию HTTPS сервера:
    //   - Какие опции нужны: key, cert, ca
    //   - Как сгенерировать самоподписанный сертификат (команда openssl)
    //   - Настройки безопасности: minVersion, ciphers
    // TODO: Show HTTPS server configuration
    log.push('HTTPS server config:')
    log.push('  ... покажите необходимые опции')
    log.push('')

    // TODO: Объясните разницу между HTTP/1.1, HTTP/2 и поддержку в Node.js
    //   http — HTTP/1.1, http2 — HTTP/2 с мультиплексированием
    // TODO: Explain HTTP/1.1 vs HTTP/2 and Node.js support
    log.push('HTTP/1.1 vs HTTP/2:')
    log.push('  ... сравните протоколы')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.4: HTTPS / TLS</h2>
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
