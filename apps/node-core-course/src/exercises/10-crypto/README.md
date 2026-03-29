# 🔥 Уровень 10: Криптография (crypto)

## 🎯 Введение

Модуль `crypto` в Node.js предоставляет криптографические функции: хеширование, шифрование, цифровые подписи и генерацию случайных данных. Он построен на OpenSSL и работает с нативным кодом, обеспечивая высокую производительность.

Типичные задачи:
- Хеширование паролей и проверка целостности данных
- Шифрование конфиденциальных данных (токены, PII)
- Цифровые подписи для API (webhooks, JWT)
- Генерация криптографически стойких случайных значений

## 🔥 Хеширование (createHash)

Хеш-функция превращает данные произвольной длины в строку фиксированной длины. Это **одностороння** операция — восстановить исходные данные из хеша невозможно.

```javascript
const crypto = require('crypto')

// SHA-256 — стандарт для безопасного хеширования
const hash = crypto.createHash('sha256')
  .update('Hello, World!')
  .digest('hex')
// "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f"

// Доступные форматы: 'hex', 'base64', 'base64url', 'binary'
const hashBase64 = crypto.createHash('sha256')
  .update('data')
  .digest('base64')
```

### Потоковое хеширование больших файлов

```javascript
const hash = crypto.createHash('sha256')
const stream = fs.createReadStream('large-file.bin')

stream.on('data', (chunk) => hash.update(chunk))
stream.on('end', () => {
  console.log(hash.digest('hex'))
})

// Или через pipe:
const { pipeline } = require('stream/promises')
await pipeline(
  fs.createReadStream('file.bin'),
  crypto.createHash('sha256').setEncoding('hex'),
  fs.createWriteStream('file.sha256')
)
```

### Алгоритмы хеширования

| Алгоритм | Длина | Безопасность | Использование |
|----------|-------|-------------|---------------|
| MD5 | 128 бит | ❌ Взломан | Только контрольные суммы |
| SHA-1 | 160 бит | ❌ Взломан | Не использовать |
| SHA-256 | 256 бит | ✅ Безопасен | Стандарт |
| SHA-512 | 512 бит | ✅ Безопасен | Повышенная безопасность |
| SHA3-256 | 256 бит | ✅ Безопасен | Новый стандарт |

## 🔥 HMAC — хеш с секретом

HMAC (Hash-based Message Authentication Code) гарантирует **целостность** И **аутентичность** данных:

```javascript
const hmac = crypto.createHmac('sha256', 'secret-key')
  .update('data to authenticate')
  .digest('hex')

// Проверка webhook от GitHub:
function verifyGitHubWebhook(payload, signature, secret) {
  const expected = 'sha256=' + crypto.createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  // ⚠️ Timing-safe сравнение!
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  )
}
```

📌 **timingSafeEqual** предотвращает timing attack — атаку, при которой злоумышленник определяет правильные символы по времени сравнения.

## 🔥 Генерация случайных данных

```javascript
// Криптографически стойкие случайные байты
crypto.randomBytes(32)                    // Buffer (32 байта)
crypto.randomBytes(32).toString('hex')    // строка 64 символа
crypto.randomBytes(16).toString('base64') // строка ~22 символа

// UUID v4
crypto.randomUUID() // "550e8400-e29b-41d4-a716-446655440000"

// Случайное целое число
crypto.randomInt(100)     // 0-99
crypto.randomInt(1, 100)  // 1-99

// Async версия (не блокирует event loop)
crypto.randomBytes(32, (err, buf) => { ... })
const buf = await new Promise((resolve, reject) => {
  crypto.randomBytes(32, (err, buf) => err ? reject(err) : resolve(buf))
})
```

## 🔥 Симметричное шифрование (AES)

Один ключ для шифрования и расшифровки:

### AES-256-GCM (рекомендуемый)

```javascript
function encrypt(text, key) {
  const iv = crypto.randomBytes(12) // 12 байт для GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag() // 16 байт

  return { iv, encrypted, authTag }
}

function decrypt({ iv, encrypted, authTag }, key) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

// Использование
const key = crypto.randomBytes(32) // 32 байта для AES-256
const result = encrypt('Секрет', key)
const original = decrypt(result, key) // "Секрет"
```

### GCM vs CBC

| Характеристика | GCM | CBC |
|----------------|-----|-----|
| Аутентификация | ✅ Да (authTag) | ❌ Нет |
| Padding oracle | ✅ Защищён | ❌ Уязвим |
| IV размер | 12 байт | 16 байт |
| Параллелизм | ✅ Да | ❌ Нет |

### Деривация ключа из пароля

```javascript
// scrypt (рекомендуемый)
const salt = crypto.randomBytes(16)
const key = crypto.scryptSync(password, salt, 32)
// Async:
crypto.scrypt(password, salt, 32, (err, key) => { ... })

// pbkdf2
crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512')
```

📌 Никогда не используйте пароль напрямую как ключ! Всегда деривируйте через scrypt/pbkdf2.

## 🔥 Асимметричное шифрование (RSA/EC)

Два ключа: публичный и приватный.

### Генерация ключей

```javascript
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: {
    type: 'pkcs8', format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'secret'
  }
})
```

### Цифровая подпись

```javascript
// Подписать (приватным ключом)
const signature = crypto.sign('sha256', Buffer.from(data), {
  key: privateKey,
  passphrase: 'secret'
})

// Проверить (публичным ключом)
const isValid = crypto.verify('sha256', Buffer.from(data), publicKey, signature)
```

### Шифрование

```javascript
// Шифровать публичным
const encrypted = crypto.publicEncrypt(publicKey, Buffer.from('Secret'))

// Расшифровать приватным
const decrypted = crypto.privateDecrypt(
  { key: privateKey, passphrase: 'secret' },
  encrypted
)
```

⚠️ RSA шифрует только маленькие данные (~214 байт для RSA-2048 с OAEP). Для больших данных используйте **гибридное шифрование**: RSA шифрует AES-ключ, AES шифрует данные.

## ⚠️ Частые ошибки новичков

### Ошибка 1: MD5/SHA1 для безопасности

```javascript
// ❌ Плохо — MD5 взломан
crypto.createHash('md5').update(password).digest('hex')

// ✅ Хорошо — bcrypt/scrypt для паролей
const salt = crypto.randomBytes(16)
const hash = crypto.scryptSync(password, salt, 64)
```

### Ошибка 2: Повторное использование IV

```javascript
// ❌ Плохо — один IV для всех шифрований
const FIXED_IV = Buffer.alloc(12) // все нули

// ✅ Хорошо — новый IV каждый раз
const iv = crypto.randomBytes(12)
```

### Ошибка 3: Обычное сравнение HMAC

```javascript
// ❌ Плохо — timing attack
if (computedHmac === receivedHmac) { ... }

// ✅ Хорошо — constant-time сравнение
crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(received))
```

### Ошибка 4: Math.random() для токенов

```javascript
// ❌ Плохо — предсказуемый PRNG
const token = Math.random().toString(36).slice(2)

// ✅ Хорошо — CSPRNG
const token = crypto.randomBytes(32).toString('hex')
```

## 💡 Best Practices

1. **SHA-256** минимум для хеширования, **scrypt/bcrypt** для паролей
2. **AES-256-GCM** для симметричного шифрования (не CBC)
3. **Новый IV** для каждого шифрования
4. **timingSafeEqual** для сравнения хешей и HMAC
5. **randomBytes** вместо Math.random() для токенов
6. **Деривация ключей** через scrypt/pbkdf2, не используйте пароли напрямую
7. **Гибридное шифрование** для больших данных (RSA + AES)
