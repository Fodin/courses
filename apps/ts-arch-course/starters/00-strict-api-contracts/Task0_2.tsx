import { useState } from 'react'

// ============================================
// Задание 0.2: Response Mapping
// ============================================

// TODO: Определите интерфейс ApiUserDTO (snake_case поля от API):
//   user_id (number), full_name (string), email_address (string),
//   created_at (string), is_active (boolean)
// TODO: Define ApiUserDTO interface (snake_case fields from API):
//   user_id (number), full_name (string), email_address (string),
//   created_at (string), is_active (boolean)

// TODO: Определите интерфейс DomainUser (camelCase поля для домена):
//   id (number), name (string), email (string),
//   createdAt (Date), isActive (boolean)
// TODO: Define DomainUser interface (camelCase fields for domain):
//   id (number), name (string), email (string),
//   createdAt (Date), isActive (boolean)

// TODO: Определите ApiOrderDTO и DomainOrder по аналогии.
//   DTO: order_id, user_id, total_cents, status, items (product_id, qty, price_cents)
//   Domain: id, userId, totalPrice (доллары!), status, items (productId, quantity, price)
// TODO: Define ApiOrderDTO and DomainOrder similarly.
//   DTO: order_id, user_id, total_cents, status, items (product_id, qty, price_cents)
//   Domain: id, userId, totalPrice (dollars!), status, items (productId, quantity, price)

// TODO: Создайте обобщённый тип Mapper<TFrom, TTo> = (dto: TFrom) => TTo
// TODO: Create a generic type Mapper<TFrom, TTo> = (dto: TFrom) => TTo

// TODO: Реализуйте функцию createMapper<TFrom, TTo> для создания маппера
// TODO: Implement createMapper<TFrom, TTo> function to create a mapper

// TODO: Реализуйте функцию mapArray<TFrom, TTo> — оборачивает маппер для массивов
// TODO: Implement mapArray<TFrom, TTo> — wraps a mapper for arrays

// TODO: Создайте mapUser и mapOrder используя createMapper
//   - mapUser: user_id -> id, full_name -> name, created_at -> new Date(), ...
//   - mapOrder: total_cents / 100 -> totalPrice, items маппинг вложенных объектов
// TODO: Create mapUser and mapOrder using createMapper
//   - mapUser: user_id -> id, full_name -> name, created_at -> new Date(), ...
//   - mapOrder: total_cents / 100 -> totalPrice, nested items mapping

export function Task0_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Response Mapping ===')
    log.push('')

    // TODO: Создайте тестовые DTO данные и продемонстрируйте маппинг
    // TODO: Create test DTO data and demonstrate mapping
    log.push('API Response (snake_case DTO):')
    log.push('  ... создайте ApiUserDTO и выведите поля')
    log.push('')

    log.push('Domain Object (camelCase):')
    log.push('  ... примените mapUser и выведите результат')
    log.push('')

    log.push('Order mapping (cents -> dollars):')
    log.push('  ... примените mapOrder и выведите результат')
    log.push('')

    log.push('Batch mapping (mapArray):')
    log.push('  ... используйте mapArray(mapUser) для массива пользователей')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.2: Response Mapping</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
