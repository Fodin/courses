import { useState } from 'react'

// ============================================
// Задание 10.2: Symmetric Encryption
// ============================================

// TODO: Изучите симметричное шифрование в Node.js:
//   - crypto.createCipheriv(algorithm, key, iv) — шифрование
//   - crypto.createDecipheriv(algorithm, key, iv) — дешифрование
//   - Алгоритмы: 'aes-256-cbc', 'aes-256-gcm' (с аутентификацией)
//   - IV (Initialization Vector) — уникальный для каждого шифрования
//   - GCM mode: authTag для проверки целостности
//   - crypto.randomBytes(size) — генерация ключа и IV
//   - crypto.scrypt(password, salt, keylen) — вывод ключа из пароля
//
// TODO: Study symmetric encryption in Node.js:
//   - createCipheriv/createDecipheriv, AES-256-CBC/GCM
//   - IV uniqueness, GCM authTag, randomBytes, scrypt

export function Task10_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Symmetric Encryption ===')
    log.push('')

    // TODO: Реализуйте упрощённый XOR-шифр для демонстрации принципа:
    //   xorEncrypt(plaintext: string, key: string): string
    //   xorDecrypt(ciphertext: string, key: string): string
    //   Покажите, что encrypt(encrypt(text, key), key) === text
    // TODO: Implement simplified XOR cipher for demonstration

    log.push('XOR cipher demo:')
    log.push('  ... покажите принцип симметричного шифрования')
    log.push('')

    // TODO: Опишите правильный процесс AES-256-GCM шифрования:
    //   encrypt(plaintext, password):
    //     1. salt = randomBytes(16)
    //     2. key = scrypt(password, salt, 32)
    //     3. iv = randomBytes(12) // 12 байт для GCM
    //     4. cipher = createCipheriv('aes-256-gcm', key, iv)
    //     5. encrypted = cipher.update(plaintext) + cipher.final()
    //     6. authTag = cipher.getAuthTag()
    //     7. return { salt, iv, authTag, encrypted }
    // TODO: Describe proper AES-256-GCM encryption process

    log.push('AES-256-GCM process:')
    log.push('  ... опишите шаги шифрования')
    log.push('')

    // TODO: Покажите распространённые ошибки:
    //   1. Повторное использование IV
    //   2. Использование ECB mode (паттерны видны!)
    //   3. Хранение ключа рядом с данными
    //   4. Использование MD5 для вывода ключа
    // TODO: Show common encryption mistakes
    log.push('Common mistakes:')
    log.push('  ... покажите типичные ошибки шифрования')

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
