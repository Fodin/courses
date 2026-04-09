import { useState } from 'react'

// ============================================
// Задание 4.3: Response DTOs
// Task 4.3: Response DTOs
// ============================================

// TODO: Реализуйте Data Transfer Objects для ответов API
// TODO: Implement Data Transfer Objects for API responses
// TODO: Создайте DTO-классы/функции для преобразования моделей в ответы
// TODO: Create DTO classes/functions for transforming models into responses
// TODO: Скройте внутренние поля (password, internalId) из ответа
// TODO: Hide internal fields (password, internalId) from the response
// TODO: Реализуйте сериализацию с учетом роли пользователя (admin видит больше)
// TODO: Implement serialization based on user role (admin sees more)

export function Task4_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Response DTOs ===')
    log.push('')

    // TODO: Создайте toUserDto(user) -> { id, name, email } (без password)
    // TODO: Create toUserDto(user) -> { id, name, email } (without password)
    // TODO: Реализуйте toAdminDto(user) -> { ...toUserDto, createdAt, role, lastLogin }
    // TODO: Implement toAdminDto(user) -> { ...toUserDto, createdAt, role, lastLogin }
    // TODO: Покажите class-transformer или ручной маппинг
    // TODO: Show class-transformer or manual mapping
    // TODO: Реализуйте serialize middleware для автоматического преобразования
    // TODO: Implement serialize middleware for automatic transformation
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
