import { useState } from 'react'

// ============================================
// Задание 10.3: Asymmetric Crypto
// ============================================

// TODO: Изучите асимметричное шифрование в Node.js:
//   - crypto.generateKeyPairSync('rsa', options) — генерация пары ключей
//   - crypto.publicEncrypt(publicKey, data) — шифрование открытым ключом
//   - crypto.privateDecrypt(privateKey, data) — дешифрование закрытым
//   - crypto.sign(algorithm, data, privateKey) — цифровая подпись
//   - crypto.verify(algorithm, data, publicKey, signature) — проверка подписи
//   - Применение: TLS, JWT, SSH, цифровые подписи
//
// TODO: Study asymmetric cryptography in Node.js:
//   - generateKeyPairSync, publicEncrypt, privateDecrypt
//   - sign, verify — digital signatures

export function Task10_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Asymmetric Crypto ===')
    log.push('')

    // TODO: Объясните принцип асимметричного шифрования:
    //   1. Генерация пары: publicKey (открытый) + privateKey (закрытый)
    //   2. Шифрование: publicKey шифрует → только privateKey расшифрует
    //   3. Подпись: privateKey подписывает → publicKey проверяет
    //   Смоделируйте с помощью упрощённой арифметики (например, RSA-like)
    // TODO: Explain asymmetric encryption principle

    log.push('Key pair concept:')
    log.push('  ... объясните принцип пары ключей')
    log.push('')

    // TODO: Реализуйте упрощённую цифровую подпись:
    //   class SimpleSignature {
    //     generateKeyPair(): { publicKey, privateKey }
    //     sign(data: string, privateKey): string
    //     verify(data: string, signature: string, publicKey): boolean
    //   }
    //   Для упрощения: подпись = hash(data + privateKey)
    //   Верификация: hash(data + derivedKey) === signature
    // TODO: Implement simplified digital signature

    log.push('Digital signature:')
    log.push('  ... подпишите данные и проверьте подпись')
    log.push('')

    // TODO: Покажите реальный пример — JWT-like токен:
    //   1. Создайте header + payload (JSON)
    //   2. Подпишите private key
    //   3. Верифицируйте public key
    //   4. Покажите, что изменение payload ломает верификацию
    // TODO: Show real-world example — JWT-like token
    log.push('JWT-like token:')
    log.push('  ... создайте, подпишите и верифицируйте токен')

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
