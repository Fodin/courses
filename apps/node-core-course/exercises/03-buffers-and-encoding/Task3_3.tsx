import { useState } from 'react'

// ============================================
// Задание 3.3: Binary Protocol
// ============================================

// TODO: Реализуйте простой бинарный протокол сообщений:
//   Формат пакета (big-endian):
//   [1 байт: version] [1 байт: type] [2 байта: payload length] [N байт: payload]
//   Типы: 0x01 = TEXT, 0x02 = JSON, 0x03 = BINARY
//
// TODO: Implement a simple binary message protocol:
//   Packet format (big-endian):
//   [1 byte: version] [1 byte: type] [2 bytes: payload length] [N bytes: payload]
//   Types: 0x01 = TEXT, 0x02 = JSON, 0x03 = BINARY

export function Task3_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Binary Protocol ===')
    log.push('')

    // TODO: Определите типы для протокола:
    //   type MessageType = 0x01 | 0x02 | 0x03
    //   interface Packet { version: number, type: MessageType, payload: Uint8Array }
    // TODO: Define protocol types

    // TODO: Реализуйте функцию encode(packet: Packet): Uint8Array
    //   1. Вычислите общий размер: 4 (заголовок) + payload.length
    //   2. Создайте буфер нужного размера
    //   3. Запишите version (1 байт), type (1 байт), length (2 байта big-endian)
    //   4. Скопируйте payload
    // TODO: Implement encode(packet: Packet): Uint8Array

    // TODO: Реализуйте функцию decode(data: Uint8Array): Packet
    //   1. Прочитайте version, type, length из заголовка
    //   2. Извлеките payload нужной длины
    //   3. Валидируйте: version === 1, type in [1,2,3], length совпадает
    // TODO: Implement decode(data: Uint8Array): Packet

    log.push('Encoding packets:')
    log.push('  ... закодируйте текстовое, JSON и бинарное сообщение')
    log.push('')

    log.push('Decoding packets:')
    log.push('  ... декодируйте и покажите содержимое')
    log.push('')

    // TODO: Продемонстрируйте round-trip: encode → decode → сравнение
    // TODO: Demonstrate round-trip: encode → decode → comparison
    log.push('Round-trip verification:')
    log.push('  ... проверьте encode/decode цикл')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.3: Binary Protocol</h2>
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
