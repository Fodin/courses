import { useState } from 'react'

// ============================================
// Задание 3.1: Buffer Basics
// ============================================

// TODO: Изучите основы работы с Buffer в Node.js:
//   - Buffer.alloc(size) — создаёт заполненный нулями буфер
//   - Buffer.from(string, encoding) — из строки (utf8, hex, base64)
//   - Buffer.from(array) — из массива байтов
//   - buf.toString(encoding) — конвертация обратно в строку
//   - buf[index], buf.slice(), buf.copy() — работа с байтами
//
// TODO: Study Buffer basics in Node.js:
//   - Buffer.alloc(size) — creates zero-filled buffer
//   - Buffer.from(string, encoding) — from string (utf8, hex, base64)
//   - Buffer.from(array) — from byte array
//   - buf.toString(encoding) — convert back to string
//   - buf[index], buf.slice(), buf.copy() — byte manipulation

export function Task3_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Buffer Basics ===')
    log.push('')

    // TODO: Создайте буферы разными способами и покажите их содержимое:
    //   1. Buffer.from('Hello, Node.js!', 'utf8') — покажите hex и base64 представление
    //   2. Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]) — покажите строку
    //   3. Buffer.alloc(10) — покажите, что заполнен нулями
    //   4. Buffer.from('SGVsbG8=', 'base64') — декодируйте base64
    // TODO: Create buffers in different ways and show their contents

    log.push('Buffer creation:')
    log.push('  ... создайте буферы разными способами')
    log.push('')

    // TODO: Продемонстрируйте операции с буфером:
    //   1. Запись по индексу: buf[0] = 0x4A
    //   2. Сравнение: buf.equals(), buf.compare()
    //   3. Конкатенация: Buffer.concat([buf1, buf2])
    //   4. Поиск: buf.indexOf('Node')
    // TODO: Demonstrate buffer operations

    log.push('Buffer operations:')
    log.push('  ... покажите операции с буфером')
    log.push('')

    // TODO: Покажите разницу между Buffer.alloc и Buffer.allocUnsafe
    //   allocUnsafe не заполняет нулями — может содержать старые данные из памяти
    // TODO: Show the difference between Buffer.alloc and Buffer.allocUnsafe

    log.push('alloc vs allocUnsafe:')
    log.push('  ... объясните разницу')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.1: Buffer Basics</h2>
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
