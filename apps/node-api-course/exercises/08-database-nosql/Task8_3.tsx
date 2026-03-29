import { useState } from 'react'

// ============================================
// Задание 8.3: Redis
// ============================================

// TODO: Подключитесь к Redis через ioredis или redis
// TODO: Реализуйте кэширование ответов API в Redis
// TODO: Используйте SET/GET с TTL (EX) для автоматического истечения
// TODO: Покажите паттерн cache-aside: проверка кэша -> БД -> запись в кэш

export function Task8_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Redis Caching ===')
    log.push('')

    // TODO: Создайте Redis client и подключитесь
    // TODO: Реализуйте cacheMiddleware с проверкой redis.get(key)
    // TODO: Покажите redis.set(key, JSON.stringify(data), "EX", 300)
    // TODO: Реализуйте инвалидацию кэша при мутациях (POST/PUT/DELETE)
    log.push('Redis')
    log.push('  ... const redis = new Redis(REDIS_URL)')
    log.push('  ... cache-aside: cached = await redis.get(key)')
    log.push('  ... cache miss: data = await db.query(...) -> redis.set(key, data, "EX", 300)')
    log.push('  ... invalidate: POST /users -> redis.del("users:list")')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.3: Redis</h2>
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
