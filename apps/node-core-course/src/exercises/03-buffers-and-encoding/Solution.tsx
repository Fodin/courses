import { useState } from 'react'

// ============================================
// Задание 3.1: Buffer Basics — Решение
// ============================================

export function Task3_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Buffer Basics ===')
    log.push('')
    log.push('Buffer is a fixed-size chunk of binary data in memory.')
    log.push('In Node.js, Buffer is a subclass of Uint8Array.')
    log.push('')
    log.push('=== Creating Buffers ===')
    log.push('')

    // Buffer.from string
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const hello = encoder.encode('Hello, Node.js!')
    log.push(`Buffer.from("Hello, Node.js!")`)
    log.push(`  Bytes: [${Array.from(hello).join(', ')}]`)
    log.push(`  Length: ${hello.length} bytes`)
    log.push(`  String: "${decoder.decode(hello)}"`)
    log.push('')

    // Buffer.alloc
    const zeroed = new Uint8Array(10)
    log.push('Buffer.alloc(10)')
    log.push(`  Bytes: [${Array.from(zeroed).join(', ')}]`)
    log.push('  All zeros — safe, initialized memory')
    log.push('')

    log.push('Buffer.allocUnsafe(10)')
    log.push('  May contain old memory data — faster but unsafe!')
    log.push('  Must fill before reading')
    log.push('')

    // Encoding demos
    log.push('=== Encodings ===')
    log.push('')

    const text = 'Hello'
    const bytes = encoder.encode(text)

    // UTF-8
    log.push(`Text: "${text}"`)
    log.push(`  UTF-8:  [${Array.from(bytes).join(', ')}]`)

    // Hex
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
    log.push(`  Hex:    ${hex}`)

    // Base64
    const base64 = btoa(text)
    log.push(`  Base64: ${base64}`)
    log.push('')

    // Unicode
    const emoji = '🚀'
    const emojiBytes = encoder.encode(emoji)
    log.push(`Text: "${emoji}" (rocket emoji)`)
    log.push(`  UTF-8 bytes: [${Array.from(emojiBytes).join(', ')}]`)
    log.push(`  Length: ${emojiBytes.length} bytes (4 bytes for emoji!)`)
    log.push(`  String length: ${emoji.length} (2 — JS uses UTF-16!)`)
    log.push('')

    // Russian text
    const russian = 'Привет'
    const russianBytes = encoder.encode(russian)
    log.push(`Text: "${russian}"`)
    log.push(`  UTF-8 bytes: [${Array.from(russianBytes).join(', ')}]`)
    log.push(`  Byte length: ${russianBytes.length} (2 bytes per Cyrillic char)`)
    log.push(`  String length: ${russian.length}`)
    log.push('')

    log.push('=== Node.js Buffer API ===')
    log.push('')
    log.push('// Creating')
    log.push('Buffer.from("hello")           // from string')
    log.push('Buffer.from([0x48, 0x65])      // from byte array')
    log.push('Buffer.from("aGVsbG8=", "base64") // from base64')
    log.push('Buffer.alloc(256)              // zeroed buffer')
    log.push('Buffer.allocUnsafe(256)        // uninitialized (fast)')
    log.push('')
    log.push('// Converting')
    log.push('buf.toString("utf8")           // to string')
    log.push('buf.toString("hex")            // to hex')
    log.push('buf.toString("base64")         // to base64')
    log.push('buf.toJSON()                   // { type: "Buffer", data: [...] }')
    log.push('')
    log.push('// Operations')
    log.push('buf.slice(0, 5)                // ⚠️ shares memory!')
    log.push('buf.subarray(0, 5)             // same as slice')
    log.push('Buffer.concat([buf1, buf2])    // concatenate')
    log.push('buf.copy(target, tStart, sStart, sEnd)')
    log.push('buf.compare(otherBuf)          // for sorting')
    log.push('buf.equals(otherBuf)           // byte equality')

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

// ============================================
// Задание 3.2: TypedArray Interop — Решение
// ============================================

export function Task3_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== TypedArray & ArrayBuffer Interop ===')
    log.push('')
    log.push('Buffer (Node.js) extends Uint8Array (Web standard)')
    log.push('')
    log.push('Hierarchy:')
    log.push('  ArrayBuffer — raw binary data container')
    log.push('    └── TypedArray — typed view over ArrayBuffer')
    log.push('        ├── Uint8Array    (Buffer extends this)')
    log.push('        ├── Uint16Array')
    log.push('        ├── Uint32Array')
    log.push('        ├── Int8Array')
    log.push('        ├── Int16Array')
    log.push('        ├── Int32Array')
    log.push('        ├── Float32Array')
    log.push('        ├── Float64Array')
    log.push('        └── BigInt64Array / BigUint64Array')
    log.push('    └── DataView — flexible read/write with endianness')
    log.push('')

    // ArrayBuffer demo
    const ab = new ArrayBuffer(8)
    log.push('=== ArrayBuffer Demo ===')
    log.push(`new ArrayBuffer(8) — ${ab.byteLength} bytes of raw memory`)
    log.push('')

    // Different views on same data
    const uint8 = new Uint8Array(ab)
    const uint16 = new Uint16Array(ab)
    const uint32 = new Uint32Array(ab)
    const float64 = new Float64Array(ab)

    uint8[0] = 0x48 // 'H'
    uint8[1] = 0x65 // 'e'
    uint8[2] = 0x6C // 'l'
    uint8[3] = 0x6C // 'l'

    log.push('Writing "Hell" as bytes: [0x48, 0x65, 0x6C, 0x6C]')
    log.push(`  Uint8Array:   [${Array.from(uint8).join(', ')}]`)
    log.push(`  Uint16Array:  [${Array.from(uint16).join(', ')}]`)
    log.push(`  Uint32Array:  [${Array.from(uint32).join(', ')}]`)
    log.push(`  Float64Array: [${Array.from(float64).join(', ')}]`)
    log.push('')
    log.push('Same memory, different interpretations!')
    log.push('')

    // DataView for explicit endianness
    log.push('=== DataView ===')
    const dv = new DataView(ab)
    log.push(`  getUint8(0):  ${dv.getUint8(0)} (0x${dv.getUint8(0).toString(16)})`)
    log.push(`  getUint16(0, false): ${dv.getUint16(0, false)} (big-endian)`)
    log.push(`  getUint16(0, true):  ${dv.getUint16(0, true)} (little-endian)`)
    log.push(`  getUint32(0, false): ${dv.getUint32(0, false)} (big-endian)`)
    log.push('')

    // Endianness
    log.push('=== Endianness ===')
    log.push('')
    log.push('Number 0x01020304 in memory:')
    const endianBuf = new ArrayBuffer(4)
    const endianView = new DataView(endianBuf)
    endianView.setUint32(0, 0x01020304, false) // big-endian
    const be = new Uint8Array(endianBuf)
    log.push(`  Big-endian:    [${Array.from(be).map(b => '0x' + b.toString(16).padStart(2, '0')).join(', ')}]`)

    endianView.setUint32(0, 0x01020304, true) // little-endian
    const le = new Uint8Array(endianBuf)
    log.push(`  Little-endian: [${Array.from(le).map(b => '0x' + b.toString(16).padStart(2, '0')).join(', ')}]`)
    log.push('')
    log.push('Network protocols use big-endian (Network Byte Order)')
    log.push('x86/ARM CPUs typically use little-endian')
    log.push('')

    // Buffer ↔ TypedArray
    log.push('=== Node.js Buffer ↔ TypedArray ===')
    log.push('')
    log.push('// Buffer → ArrayBuffer')
    log.push('const buf = Buffer.from("hello")')
    log.push('const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)')
    log.push('')
    log.push('// ArrayBuffer → Buffer')
    log.push('const buf2 = Buffer.from(arrayBuffer)')
    log.push('')
    log.push('// ⚠️ Buffer.buffer may point to a larger ArrayBuffer pool!')
    log.push('// Always use byteOffset and byteLength for correct slicing')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.2: TypedArray Interop</h2>
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
// Задание 3.3: Binary Protocol Parsing — Решение
// ============================================

export function Task3_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Binary Protocol Parsing ===')
    log.push('')
    log.push('Many protocols use binary formats: TCP, HTTP/2, WebSocket,')
    log.push('Protocol Buffers, MessagePack, database wire protocols.')
    log.push('')
    log.push('=== Example: Simple Message Protocol ===')
    log.push('')
    log.push('Format:')
    log.push('  [1 byte: type] [2 bytes: length] [N bytes: payload]')
    log.push('')

    // Build a binary message
    const type = 0x01 // text message
    const payload = new TextEncoder().encode('Hello, binary world!')
    const length = payload.length

    // Construct packet
    const packet = new Uint8Array(3 + length)
    packet[0] = type
    const view = new DataView(packet.buffer)
    view.setUint16(1, length, false) // big-endian length
    packet.set(payload, 3)

    log.push('=== Encoding a Message ===')
    log.push(`  Type: 0x${type.toString(16).padStart(2, '0')} (text)`)
    log.push(`  Length: ${length} bytes`)
    log.push(`  Payload: "${new TextDecoder().decode(payload)}"`)
    log.push(`  Raw packet: [${Array.from(packet.slice(0, 10)).map(b => '0x' + b.toString(16).padStart(2, '0')).join(', ')}...]`)
    log.push(`  Total size: ${packet.length} bytes`)
    log.push('')

    // Parse the packet
    log.push('=== Decoding the Message ===')
    const parsedType = packet[0]
    const parsedLength = new DataView(packet.buffer).getUint16(1, false)
    const parsedPayload = packet.slice(3, 3 + parsedLength)
    const parsedText = new TextDecoder().decode(parsedPayload)

    log.push(`  Type: 0x${parsedType.toString(16).padStart(2, '0')}`)
    log.push(`  Length: ${parsedLength}`)
    log.push(`  Payload: "${parsedText}"`)
    log.push('')

    // More complex: parsing a TLV structure
    log.push('=== TLV (Type-Length-Value) Format ===')
    log.push('')

    interface TLVEntry {
      type: number
      typeName: string
      value: string
    }

    const tlvTypes: Record<number, string> = {
      0x01: 'STRING',
      0x02: 'UINT32',
      0x03: 'BOOLEAN'
    }

    // Build multiple TLV entries
    const entries: TLVEntry[] = []
    const tlvBuffer = new Uint8Array(50)
    let offset = 0

    // Entry 1: string "user"
    const strValue = new TextEncoder().encode('admin')
    tlvBuffer[offset++] = 0x01
    new DataView(tlvBuffer.buffer).setUint16(offset, strValue.length, false)
    offset += 2
    tlvBuffer.set(strValue, offset)
    offset += strValue.length

    // Entry 2: uint32 42
    tlvBuffer[offset++] = 0x02
    new DataView(tlvBuffer.buffer).setUint16(offset, 4, false)
    offset += 2
    new DataView(tlvBuffer.buffer).setUint32(offset, 42, false)
    offset += 4

    // Entry 3: boolean true
    tlvBuffer[offset++] = 0x03
    new DataView(tlvBuffer.buffer).setUint16(offset, 1, false)
    offset += 2
    tlvBuffer[offset++] = 1

    // Parse TLV entries
    let readOffset = 0
    while (readOffset < offset) {
      const t = tlvBuffer[readOffset++]
      const l = new DataView(tlvBuffer.buffer).getUint16(readOffset, false)
      readOffset += 2
      const v = tlvBuffer.slice(readOffset, readOffset + l)
      readOffset += l

      let value = ''
      switch (t) {
        case 0x01: value = new TextDecoder().decode(v); break
        case 0x02: value = new DataView(v.buffer, v.byteOffset).getUint32(0, false).toString(); break
        case 0x03: value = v[0] === 1 ? 'true' : 'false'; break
      }

      entries.push({ type: t, typeName: tlvTypes[t] || 'UNKNOWN', value })
    }

    entries.forEach((e, i) => {
      log.push(`  Entry ${i + 1}: type=${e.typeName} (0x${e.type.toString(16).padStart(2, '0')}), value="${e.value}"`)
    })

    log.push('')
    log.push('=== Node.js Buffer Methods for Binary Parsing ===')
    log.push('')
    log.push('buf.readUInt8(offset)')
    log.push('buf.readUInt16BE(offset)  // big-endian')
    log.push('buf.readUInt16LE(offset)  // little-endian')
    log.push('buf.readUInt32BE(offset)')
    log.push('buf.readInt32BE(offset)   // signed')
    log.push('buf.readFloatBE(offset)')
    log.push('buf.readDoubleBE(offset)')
    log.push('buf.readBigUInt64BE(offset)')
    log.push('')
    log.push('buf.writeUInt8(value, offset)')
    log.push('buf.writeUInt16BE(value, offset)')
    log.push('buf.writeUInt32BE(value, offset)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.3: Binary Protocol Parsing</h2>
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
