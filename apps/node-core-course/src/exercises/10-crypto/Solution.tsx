import { useState } from 'react'

// ============================================
// Задание 10.1: Hashing & HMAC — Решение
// ============================================

export function Task10_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Хеширование (createHash) ===')
    log.push('')

    // Симуляция хешей
    log.push('const crypto = require("crypto")')
    log.push('')

    log.push('// MD5 — НЕ для безопасности! Только для контрольных сумм')
    log.push('crypto.createHash("md5")')
    log.push('  .update("Hello, World!")')
    log.push('  .digest("hex")')
    log.push('  → "65a8e27d8879283831b664bd8b7f0ad4"')
    log.push('')

    log.push('// SHA-256 — стандарт для безопасного хеширования')
    log.push('crypto.createHash("sha256")')
    log.push('  .update("Hello, World!")')
    log.push('  .digest("hex")')
    log.push('  → "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f"')
    log.push('')

    log.push('// SHA-512 — более длинный хеш')
    log.push('crypto.createHash("sha512")')
    log.push('  .update("Hello, World!")')
    log.push('  .digest("hex")')
    log.push('  → "374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6c..."')
    log.push('')

    // Потоковое хеширование
    log.push('=== Потоковое хеширование файла ===')
    log.push('')
    log.push('const hash = crypto.createHash("sha256")')
    log.push('const stream = fs.createReadStream("large-file.bin")')
    log.push('stream.pipe(hash).on("finish", () => {')
    log.push('  console.log(hash.digest("hex"))')
    log.push('})')
    log.push('')
    log.push('// Или множественный update:')
    log.push('hash.update("chunk1")')
    log.push('hash.update("chunk2")')
    log.push('hash.digest("hex")  // хеш от "chunk1chunk2"')
    log.push('')

    // HMAC
    log.push('=== HMAC — хеш с секретным ключом ===')
    log.push('')
    log.push('// HMAC = Hash-based Message Authentication Code')
    log.push('// Гарантирует целостность И аутентичность данных')
    log.push('')
    log.push('const secret = "my-secret-key"')
    log.push('const hmac = crypto.createHmac("sha256", secret)')
    log.push('  .update("data to sign")')
    log.push('  .digest("hex")')
    log.push('  → "a1b2c3d4e5f6..."')
    log.push('')
    log.push('// Проверка HMAC:')
    log.push('const expected = computeHmac(data, secret)')
    log.push('const received = req.headers["x-signature"]')
    log.push('')
    log.push('// ⚠️ Используйте timingSafeEqual для сравнения!')
    log.push('const isValid = crypto.timingSafeEqual(')
    log.push('  Buffer.from(expected),')
    log.push('  Buffer.from(received)')
    log.push(')')
    log.push('')

    // Случайные данные
    log.push('=== Генерация случайных данных ===')
    log.push('')
    log.push('// Криптографически стойкие случайные байты')
    log.push('crypto.randomBytes(32)  // Buffer (32 байта)')
    log.push('crypto.randomBytes(32).toString("hex")  // "a1b2c3..."')
    log.push('crypto.randomBytes(16).toString("base64")  // "kWf3Gz..."')
    log.push('')
    log.push('// UUID v4')
    log.push('crypto.randomUUID()')
    log.push('  → "550e8400-e29b-41d4-a716-446655440000"')
    log.push('')
    log.push('// Случайное целое число')
    log.push('crypto.randomInt(1, 100)  // число от 1 до 99')
    log.push('')

    // Доступные алгоритмы
    log.push('=== Доступные алгоритмы ===')
    log.push('crypto.getHashes()')
    log.push('  → ["md5", "sha1", "sha256", "sha384", "sha512", "sha3-256", ...]')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.1: Hashing & HMAC</h2>
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
// Задание 10.2: Symmetric Encryption — Решение
// ============================================

export function Task10_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Симметричное шифрование ===')
    log.push('')
    log.push('📌 Один ключ для шифрования И расшифровки')
    log.push('')

    // AES-256-GCM
    log.push('=== AES-256-GCM (рекомендуемый) ===')
    log.push('')
    log.push('const crypto = require("crypto")')
    log.push('')
    log.push('function encrypt(text, key) {')
    log.push('  // IV (Initialization Vector) — уникальный для каждого шифрования')
    log.push('  const iv = crypto.randomBytes(12)  // 12 байт для GCM')
    log.push('')
    log.push('  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)')
    log.push('  let encrypted = cipher.update(text, "utf8", "hex")')
    log.push('  encrypted += cipher.final("hex")')
    log.push('')
    log.push('  // Auth tag — гарантирует целостность данных')
    log.push('  const authTag = cipher.getAuthTag()')
    log.push('')
    log.push('  return { iv, encrypted, authTag }')
    log.push('}')
    log.push('')

    // Расшифровка
    log.push('function decrypt({ iv, encrypted, authTag }, key) {')
    log.push('  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)')
    log.push('  decipher.setAuthTag(authTag)')
    log.push('')
    log.push('  let decrypted = decipher.update(encrypted, "hex", "utf8")')
    log.push('  decrypted += decipher.final("utf8")')
    log.push('')
    log.push('  return decrypted')
    log.push('}')
    log.push('')

    // Пример
    log.push('=== Пример использования ===')
    log.push('')
    log.push('// Генерация ключа (32 байта для AES-256)')
    log.push('const key = crypto.randomBytes(32)')
    log.push('')
    log.push('const data = encrypt("Секретное сообщение", key)')
    log.push('// data.iv        = <Buffer a1 b2 c3 ...>  (12 байт)')
    log.push('// data.encrypted = "4f8a2b1c9d..."')
    log.push('// data.authTag   = <Buffer d4 e5 f6 ...>  (16 байт)')
    log.push('')
    log.push('const original = decrypt(data, key)')
    log.push('// → "Секретное сообщение"')
    log.push('')

    // IV management
    log.push('=== ⚠️ Управление IV ===')
    log.push('')
    log.push('❌ НИКОГДА не используйте один IV дважды с тем же ключом!')
    log.push('   Повторный IV полностью компрометирует шифрование.')
    log.push('')
    log.push('✅ Генерируйте новый IV для каждого шифрования:')
    log.push('   const iv = crypto.randomBytes(12)')
    log.push('')
    log.push('✅ Храните IV вместе с зашифрованными данными:')
    log.push('   // iv + authTag + encrypted → одна строка')
    log.push('   const packed = Buffer.concat([iv, authTag, encrypted])')
    log.push('')

    // AES-256-CBC
    log.push('=== AES-256-CBC (менее безопасный) ===')
    log.push('')
    log.push('// CBC не обеспечивает аутентификацию (нет authTag)')
    log.push('// Уязвим к padding oracle attack')
    log.push('const iv = crypto.randomBytes(16)  // 16 байт для CBC')
    log.push('const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)')
    log.push('')
    log.push('📌 Предпочитайте GCM: шифрование + аутентификация в одном')
    log.push('')

    // Деривация ключа
    log.push('=== Деривация ключа из пароля ===')
    log.push('')
    log.push('// Пароль → ключ через scrypt (рекомендуемый)')
    log.push('const salt = crypto.randomBytes(16)')
    log.push('const key = crypto.scryptSync(password, salt, 32)')
    log.push('')
    log.push('// Или pbkdf2')
    log.push('crypto.pbkdf2(password, salt, 100000, 32, "sha512", (err, key) => {')
    log.push('  // key — Buffer 32 байта')
    log.push('})')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.2: Symmetric Encryption</h2>
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
// Задание 10.3: Asymmetric Crypto — Решение
// ============================================

export function Task10_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Асимметричное шифрование ===')
    log.push('')
    log.push('📌 Два ключа: публичный (для шифрования) и приватный (для расшифровки)')
    log.push('')

    // Генерация ключей
    log.push('=== Генерация ключевой пары ===')
    log.push('')
    log.push('const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {')
    log.push('  modulusLength: 2048,  // или 4096 для повышенной безопасности')
    log.push('  publicKeyEncoding: {')
    log.push('    type: "spki",')
    log.push('    format: "pem"')
    log.push('  },')
    log.push('  privateKeyEncoding: {')
    log.push('    type: "pkcs8",')
    log.push('    format: "pem",')
    log.push('    cipher: "aes-256-cbc",     // защита приватного ключа')
    log.push('    passphrase: "my-passphrase" // паролем')
    log.push('  }')
    log.push('})')
    log.push('')
    log.push('// publicKey:  "-----BEGIN PUBLIC KEY-----\\nMIIBI..."')
    log.push('// privateKey: "-----BEGIN ENCRYPTED PRIVATE KEY-----\\nMIIE..."')
    log.push('')

    // EC ключи
    log.push('// Или EC (Elliptic Curve) — быстрее и короче')
    log.push('const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", {')
    log.push('  namedCurve: "P-256",  // secp256r1')
    log.push('  publicKeyEncoding: { type: "spki", format: "pem" },')
    log.push('  privateKeyEncoding: { type: "pkcs8", format: "pem" }')
    log.push('})')
    log.push('')

    // Sign / Verify
    log.push('=== Цифровая подпись (Sign / Verify) ===')
    log.push('')
    log.push('// Подпись — доказывает авторство и целостность')
    log.push('const data = "Important document content"')
    log.push('')
    log.push('// Создание подписи (приватным ключом)')
    log.push('const signature = crypto.sign("sha256", Buffer.from(data), {')
    log.push('  key: privateKey,')
    log.push('  passphrase: "my-passphrase"')
    log.push('})')
    log.push('// signature: <Buffer 2a 4f ...> (256 байт для RSA-2048)')
    log.push('')

    log.push('// Проверка подписи (публичным ключом)')
    log.push('const isValid = crypto.verify(')
    log.push('  "sha256",')
    log.push('  Buffer.from(data),')
    log.push('  publicKey,')
    log.push('  signature')
    log.push(')')
    log.push('// isValid: true')
    log.push('')

    log.push('// Изменённые данные не пройдут проверку')
    log.push('const isValid2 = crypto.verify("sha256", Buffer.from("Tampered"), publicKey, signature)')
    log.push('// isValid2: false')
    log.push('')

    // Encrypt / Decrypt
    log.push('=== Шифрование (publicEncrypt / privateDecrypt) ===')
    log.push('')
    log.push('// Шифруем публичным ключом')
    log.push('const encrypted = crypto.publicEncrypt(publicKey, Buffer.from("Secret"))')
    log.push('')
    log.push('// Расшифровываем приватным')
    log.push('const decrypted = crypto.privateDecrypt(')
    log.push('  { key: privateKey, passphrase: "my-passphrase" },')
    log.push('  encrypted')
    log.push(')')
    log.push('// decrypted.toString() → "Secret"')
    log.push('')

    log.push('⚠️ RSA может шифровать только маленькие данные!')
    log.push('   RSA-2048: макс. ~214 байт (OAEP padding)')
    log.push('   Для больших данных: шифруйте AES-ключ через RSA,')
    log.push('   а данные — через AES (гибридное шифрование)')
    log.push('')

    // Гибридное шифрование
    log.push('=== Гибридное шифрование ===')
    log.push('')
    log.push('function hybridEncrypt(data, publicKey) {')
    log.push('  // 1. Генерируем случайный AES-ключ')
    log.push('  const aesKey = crypto.randomBytes(32)')
    log.push('')
    log.push('  // 2. Шифруем данные AES-ключом (быстро)')
    log.push('  const { iv, encrypted, authTag } = aesEncrypt(data, aesKey)')
    log.push('')
    log.push('  // 3. Шифруем AES-ключ RSA-публичным ключом')
    log.push('  const encryptedKey = crypto.publicEncrypt(publicKey, aesKey)')
    log.push('')
    log.push('  return { encryptedKey, iv, authTag, encrypted }')
    log.push('}')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.3: Asymmetric Crypto</h2>
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
