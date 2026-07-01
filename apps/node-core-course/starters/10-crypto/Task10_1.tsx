import { useState } from 'react'

// ============================================
// Задание 10.1: Hashing & HMAC
// ============================================

// TODO: Изучите хеширование и HMAC в модуле crypto:
//   Хеширование:
//     - crypto.createHash(algorithm) — 'sha256', 'sha512', 'md5'
//     - hash.update(data) — добавление данных
//     - hash.digest(encoding) — получение хеша ('hex', 'base64')
//   HMAC (Hash-based Message Authentication Code):
//     - crypto.createHmac(algorithm, key)
//     - Используется для проверки целостности + аутентификации
//     - Webhook signatures, API authentication
//
// TODO: Study hashing and HMAC in the crypto module:
//   - createHash, hash.update, hash.digest
//   - createHmac for message authentication

export function Task10_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Hashing & HMAC ===')
    log.push('')

    // TODO: Реализуйте упрощённое хеширование (для демонстрации):
    //   simpleHash(input: string): string — используйте любой простой алгоритм
    //   (сумма char codes с модулем, XOR и т.д.)
    //   Покажите свойства хеш-функции:
    //     1. Детерминизм: одинаковый вход → одинаковый выход
    //     2. Лавинный эффект: малое изменение → большое изменение хеша
    //     3. Необратимость: по хешу нельзя восстановить исходные данные
    // TODO: Implement simplified hashing for demonstration

    log.push('Hash properties:')
    log.push('  ... покажите детерминизм, лавинный эффект, необратимость')
    log.push('')

    // TODO: Реализуйте проверку webhook signature:
    //   verifyWebhookSignature(payload: string, signature: string, secret: string): boolean
    //   1. Вычислите HMAC-SHA256 от payload с secret
    //   2. Сравните с signature (используйте timingSafeEqual!)
    //   3. Покажите, почему обычное === сравнение уязвимо к timing attack
    // TODO: Implement webhook signature verification

    log.push('Webhook signature verification:')
    log.push('  ... реализуйте и протестируйте верификацию подписи')
    log.push('')

    // TODO: Покажите применение хешей:
    //   - Хеширование паролей (с солью!)
    //   - Контрольные суммы файлов
    //   - Content-addressable storage (как Git)
    // TODO: Show hash use cases
    log.push('Hash use cases:')
    log.push('  ... покажите практическое применение')

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
