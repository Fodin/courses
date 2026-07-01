import { useState } from 'react'

// ============================================
// Задание 5.1: Value Objects
// ============================================

// TODO: Определите Brand<T, B> — тип T с уникальным символом __brand: B
//   declare const __brand: unique symbol
//   type Brand<T, B extends string> = T & { readonly [__brand]: B }
// TODO: Define Brand<T, B> — type T with unique symbol __brand: B

// TODO: Создайте брендированные типы:
//   type Email = Brand<string, 'Email'>
//   type Money = Brand<number, 'Money'>
//   type Currency = 'USD' | 'EUR' | 'RUB'
//   type PositiveInt = Brand<number, 'PositiveInt'>
//   type UserId = Brand<string, 'UserId'>
// TODO: Create branded types: Email, Money, Currency, PositiveInt, UserId

// TODO: Реализуйте фабричные функции с валидацией:
//   createEmail(raw) — проверка regex, toLowerCase, бросает ошибку для невалидных
//   createMoney(amount) — проверка isFinite, округление до 2 знаков
//   createPositiveInt(n) — проверка isInteger и n > 0
//   createUserId(raw) — проверка непустой ��троки
// TODO: Implement factory functions with validation

// TODO: Создайте интерфейс Price { amount: Money, currency: Currency }
//   и функции createPrice, addPrices (проверка совпадения валют!), formatPrice
// TODO: Create Price interface and createPrice, addPrices, formatPrice functions

export function Task5_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Value Objects ===')
    log.push('')

    // TODO: Покажите создание Email с валидацией (валидный и невалидный)
    log.push('Branded Types: Email')
    log.push('  ... createEmail("User@Example.COM") и createEmail("invalid")')
    log.push('')

    // TODO: Покажите Price: создание, сложение, форматирование
    log.push('Branded Types: Money & Price')
    log.push('  ... создайте два Price и сложите через addPrices')
    log.push('')

    // TODO: Покажите PositiveInt с валидацией отрицательных и дробных
    log.push('Branded Types: PositiveInt')
    log.push('  ... createPositiveInt(5), createPositiveInt(-3), createPositiveInt(2.5)')
    log.push('')

    // TODO: Покажите что addPrices с разными валютами бросает ошибку
    log.push('Mixed currencies error:')
    log.push('  ... addPrices(usd, eur) -> Error')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Value Objects</h2>
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
