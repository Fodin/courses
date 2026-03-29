# 🔥 Уровень 3: Buffer и кодировки

## 🎯 Зачем понимать Buffer

JavaScript исторически работал только с текстом. Node.js добавил `Buffer` для работы с **бинарными данными**: файлами, сетевыми пакетами, криптографией, изображениями. Без понимания Buffer невозможно:

- Читать/писать файлы в бинарном формате
- Работать с сетевыми протоколами (TCP, WebSocket)
- Реализовывать криптографию и хэширование
- Парсить бинарные форматы (Protocol Buffers, MessagePack)

## 📌 Что такое Buffer

`Buffer` -- это класс Node.js, представляющий фиксированный блок памяти для хранения бинарных данных. Технически `Buffer` -- подкласс `Uint8Array`.

```js
// Buffer = массив байтов
const buf = Buffer.from('Hello')
// <Buffer 48 65 6c 6c 6f>
// Каждый элемент — число от 0 до 255 (1 байт)
```

## 🔥 Создание Buffer

### Buffer.from()

```js
// Из строки
Buffer.from('Hello')              // UTF-8 по умолчанию
Buffer.from('Hello', 'utf8')      // явное указание кодировки
Buffer.from('48656c6c6f', 'hex')  // из hex-строки
Buffer.from('SGVsbG8=', 'base64') // из base64

// Из массива байтов
Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]) // "Hello"

// Из ArrayBuffer
const ab = new ArrayBuffer(4)
Buffer.from(ab)

// Из другого Buffer (копия)
const copy = Buffer.from(originalBuffer)
```

### Buffer.alloc() и Buffer.allocUnsafe()

```js
// Безопасный: заполнен нулями
const safe = Buffer.alloc(1024)

// Небезопасный: может содержать старые данные из памяти!
const unsafe = Buffer.allocUnsafe(1024)
// ⚠️ Быстрее, но нужно заполнить перед чтением

// Заполнить конкретным значением
const filled = Buffer.alloc(10, 0xFF)
```

⚠️ `Buffer.allocUnsafe()` не очищает память — может содержать данные от предыдущих операций (паролей, ключей!). Используйте только когда **точно знаете**, что заполните весь буфер перед чтением.

## 📌 Кодировки

Node.js Buffer поддерживает следующие кодировки:

| Кодировка | Описание | Пример |
|---|---|---|
| `utf8` | Unicode (по умолчанию) | `Buffer.from('Привет')` |
| `ascii` | 7-bit ASCII | `Buffer.from('Hello', 'ascii')` |
| `latin1` | ISO 8859-1 | `Buffer.from('café', 'latin1')` |
| `hex` | Шестнадцатеричное | `Buffer.from('48656c6c6f', 'hex')` |
| `base64` | Base64 | `Buffer.from('SGVsbG8=', 'base64')` |
| `base64url` | URL-safe Base64 | без `+` и `/` |
| `binary` | Alias для latin1 | устаревшее |
| `utf16le` | UTF-16 Little Endian | 2 байта на символ |

### UTF-8 и длина строки

⚠️ **Длина строки !== длина буфера в байтах**:

```js
const ascii = Buffer.from('Hello')
console.log(ascii.length) // 5 байт (1 байт на символ)

const cyrillic = Buffer.from('Привет')
console.log(cyrillic.length) // 12 байт (2 байта на кириллический символ)

const emoji = Buffer.from('🚀')
console.log(emoji.length) // 4 байта (4 байта на emoji)

// String.length vs Buffer.byteLength
'Hello'.length           // 5
Buffer.byteLength('Hello') // 5

'Привет'.length           // 6
Buffer.byteLength('Привет') // 12
```

## 🔥 TypedArray и ArrayBuffer

### Иерархия типов

```
ArrayBuffer — контейнер сырых байтов (нельзя читать напрямую)
  ├── TypedArray — типизированное представление
  │     ├── Uint8Array      (Buffer наследует от этого!)
  │     ├── Uint16Array
  │     ├── Uint32Array
  │     ├── Int8Array / Int16Array / Int32Array
  │     ├── Float32Array / Float64Array
  │     └── BigInt64Array / BigUint64Array
  └── DataView — гибкое чтение/запись с контролем endianness
```

### Один ArrayBuffer — разные представления

```js
const ab = new ArrayBuffer(4) // 4 байта

const u8 = new Uint8Array(ab)
const u16 = new Uint16Array(ab)
const u32 = new Uint32Array(ab)

u8[0] = 1
u8[1] = 0
u8[2] = 0
u8[3] = 0

console.log(u32[0]) // 1 (little-endian на x86)
```

### DataView — контроль endianness

```js
const buf = new ArrayBuffer(4)
const view = new DataView(buf)

// Big-endian (сетевой порядок)
view.setUint32(0, 0x01020304, false)
// Байты: [0x01, 0x02, 0x03, 0x04]

// Little-endian (x86/ARM)
view.setUint32(0, 0x01020304, true)
// Байты: [0x04, 0x03, 0x02, 0x01]
```

### Endianness (порядок байтов)

**Big-endian** (BE): старший байт первый. Используется в сетевых протоколах.

**Little-endian** (LE): младший байт первый. Используется в x86/ARM процессорах.

```js
// Число 0x01020304 = 16909060
// Big-endian:    01 02 03 04 (readable, network byte order)
// Little-endian: 04 03 02 01 (how CPU stores it)
```

## 📌 Парсинг бинарных протоколов

### Формат TLV (Type-Length-Value)

Многие протоколы используют TLV:

```
[1 byte: type][2 bytes: length][N bytes: value]
```

```js
function parseTLV(buf) {
  const entries = []
  let offset = 0

  while (offset < buf.length) {
    const type = buf.readUInt8(offset++)
    const length = buf.readUInt16BE(offset)
    offset += 2
    const value = buf.slice(offset, offset + length)
    offset += length
    entries.push({ type, length, value })
  }

  return entries
}
```

### Методы чтения/записи Buffer

```js
// Чтение
buf.readUInt8(offset)
buf.readUInt16BE(offset)    // Big-endian
buf.readUInt16LE(offset)    // Little-endian
buf.readUInt32BE(offset)
buf.readInt32BE(offset)     // Со знаком
buf.readFloatBE(offset)
buf.readDoubleBE(offset)
buf.readBigUInt64BE(offset) // BigInt

// Запись
buf.writeUInt8(value, offset)
buf.writeUInt16BE(value, offset)
buf.writeUInt32BE(value, offset)
buf.writeFloatBE(value, offset)
```

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Путать длину строки и размер буфера

```js
// ❌ Плохо: предполагать 1 символ = 1 байт
const str = 'Привет'
const buf = Buffer.alloc(str.length) // 6 байт — мало для UTF-8!
buf.write(str) // обрежет данные
```

```js
// ✅ Хорошо: использовать Buffer.byteLength
const buf = Buffer.alloc(Buffer.byteLength(str, 'utf8')) // 12 байт
buf.write(str)
```

### Ошибка 2: Использовать Buffer.allocUnsafe без очистки

```js
// ❌ Плохо: чтение неинициализированной памяти
const buf = Buffer.allocUnsafe(100)
console.log(buf.toString()) // мусор! Возможно, чужие пароли!
```

```js
// ✅ Хорошо: заполнить или использовать alloc
const buf = Buffer.alloc(100)
```

### Ошибка 3: slice() разделяет память

```js
// ❌ Плохо: slice создаёт VIEW, не копию!
const original = Buffer.from('Hello')
const slice = original.slice(0, 3)
slice[0] = 0x58 // 'X'
console.log(original.toString()) // "Xello" — оригинал изменён!
```

```js
// ✅ Хорошо: явная копия
const copy = Buffer.from(original.slice(0, 3))
```

### Ошибка 4: Игнорировать endianness

```js
// ❌ Плохо: не учитывать порядок байтов
const port = buf.readUInt16BE(0) // может быть неправильно!
```

```js
// ✅ Хорошо: знать протокол
// Сетевые протоколы — обычно big-endian
const port = buf.readUInt16BE(0)
// Бинарные файлы — зависит от формата
```

## 💡 Best Practices

1. **Используйте `Buffer.alloc()`** вместо `allocUnsafe()` по умолчанию
2. **Используйте `Buffer.byteLength()`** для определения размера строки в байтах
3. **Помните про endianness** при работе с сетевыми протоколами
4. **Buffer.slice() разделяет память** — создавайте копии при необходимости
5. **Для кроссплатформенности** используйте DataView с явным endianness
6. **Используйте Buffer.concat()** вместо ручной конкатенации
