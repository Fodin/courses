import { useState } from 'react'

// ============================================
// Задание 4.3: Response DTOs
// ============================================

// TODO: Реализуйте Data Transfer Objects для ответов API
// TODO: Создайте DTO-классы/функции для преобразования моделей в ответы
// TODO: Скройте внутренние поля (password, internalId) из ответа
// TODO: Реализуйте сериализацию с учетом роли пользователя (admin видит больше)

export function Task4_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Response DTOs ===')
    log.push('')

    // TODO: Создайте toUserDto(user) -> { id, name, email } (без password)
    // TODO: Реализуйте toAdminDto(user) -> { ...toUserDto, createdAt, role, lastLogin }
    // TODO: Покажите class-transformer или ручной маппинг
    // TODO: Реализуйте serialize middleware для автоматического преобразования
    log.push('Response DTOs')
    log.push('  ... toUserDto(dbUser) -> { id, name, email }')
    log.push('  ... toAdminDto(dbUser) -> { id, name, email, role, createdAt }')
    log.push('  ... password, passwordHash, internalNotes -> исключены')
    log.push('  ... serialize(UserDto) middleware для автоматического маппинга')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.3: Response DTOs</h2>
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
