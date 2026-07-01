import { useState } from 'react'

// ============================================
// Задание 3.2: TypedArray
// ============================================

// TODO: Разберитесь в связи Buffer и TypedArray:
//   - Buffer наследует от Uint8Array
//   - ArrayBuffer — блок сырой памяти
//   - TypedArray (Uint8Array, Int32Array, Float64Array) — "вид" на ArrayBuffer
//   - DataView — гибкий доступ с контролем endianness
//   - Buffer.from(arrayBuffer, byteOffset, length) — создание из ArrayBuffer
//
// TODO: Understand the relationship between Buffer and TypedArray:
//   - Buffer extends Uint8Array
//   - ArrayBuffer — raw memory block
//   - TypedArray (Uint8Array, Int32Array, Float64Array) — view over ArrayBuffer
//   - DataView — flexible access with endianness control
//   - Buffer.from(arrayBuffer, byteOffset, length) — create from ArrayBuffer

export function Task3_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== TypedArray & Buffer ===')
    log.push('')

    // TODO: Создайте ArrayBuffer и несколько TypedArray-видов на него:
    //   1. const ab = new ArrayBuffer(16)
    //   2. const uint8 = new Uint8Array(ab) — побайтовый вид
    //   3. const int32 = new Int32Array(ab) — 4 числа по 4 байта
    //   4. const float64 = new Float64Array(ab) — 2 числа по 8 байт
    //   5. Запишите значение через один вид и прочитайте через другой
    // TODO: Create ArrayBuffer and multiple TypedArray views

    log.push('Shared ArrayBuffer views:')
    log.push('  ... создайте разные виды на один ArrayBuffer')
    log.push('')

    // TODO: Покажите работу DataView для чтения/записи с контролем endianness:
    //   const dv = new DataView(ab)
    //   dv.setUint16(0, 0x0102, false) — big-endian
    //   dv.setUint16(0, 0x0102, true)  — little-endian
    //   Покажите, как одни и те же байты читаются по-разному
    // TODO: Show DataView with endianness control

    log.push('DataView endianness:')
    log.push('  ... покажите big-endian vs little-endian')
    log.push('')

    // TODO: Конвертируйте между Buffer и TypedArray:
    //   Buffer → Uint8Array (buf.buffer, buf.byteOffset, buf.byteLength)
    //   Uint8Array → Buffer (Buffer.from(uint8.buffer))
    // TODO: Convert between Buffer and TypedArray

    log.push('Buffer ↔ TypedArray conversion:')
    log.push('  ... покажите конвертацию')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.2: TypedArray</h2>
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
