import { useState } from 'react'

// ============================================
// Задание 11.4: Opaque Types
// ============================================

// TODO: Проблема: string для UserId и string для Email — один и тот же тип
//   Можно случайно передать email вместо userId, и TS не поймает ошибку

// TODO: Создайте Opaque (Branded) type паттерн:
//   type Opaque<T, Brand extends string> = T & { readonly __brand: Brand }
//   Или: type Brand<T, B> = T & { readonly [Symbol]: B }

// TODO: Создайте branded types:
//   type UserId = Opaque<string, 'UserId'>
//   type Email = Opaque<string, 'Email'>
//   type Positive = Opaque<number, 'Positive'>
//   type NonEmpty = Opaque<string, 'NonEmpty'>

// TODO: Создайте конструкторы с валидацией:
//   function createUserId(id: string): UserId
//   function createEmail(email: string): Email — проверка формата
//   function createPositive(n: number): Positive — проверка > 0
//   function createNonEmpty(s: string): NonEmpty — проверка length > 0

// TODO: Покажите, что branded types несовместимы:
//   function getUser(id: UserId): string
//   getUser(createEmail('test@test.com')) // Ошибка компиляции!

export function Task11_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Покажите проблему без branding:
    // log.push('=== Проблема: string === string ===')
    // log.push('UserId и Email оба string — TS не различает')

    // TODO: Создайте branded types и конструкторы:
    // const userId = createUserId('user-123')
    // const email = createEmail('alice@example.com')
    // log.push(`userId = "${userId}"`)
    // log.push(`email = "${email}"`)

    // TODO: Покажите несовместимость:
    // function getUserName(id: UserId): string { return `User ${id}` }
    // log.push(`getUserName(userId) → "${getUserName(userId)}"`)
    // // getUserName(email) // Ошибка! Email !== UserId
    // log.push('getUserName(email) → Ошибка компиляции!')

    // TODO: Протестируйте Positive:
    // const pos = createPositive(42)
    // log.push(`createPositive(42) → ${pos}`)
    // try {
    //   createPositive(-1)
    // } catch (e) {
    //   log.push(`createPositive(-1) → Error: ${(e as Error).message}`)
    // }

    // TODO: Протестируйте NonEmpty:
    // const nonEmpty = createNonEmpty('hello')
    // log.push(`createNonEmpty('hello') → "${nonEmpty}"`)
    // try {
    //   createNonEmpty('')
    // } catch (e) {
    //   log.push(`createNonEmpty('') → Error: ${(e as Error).message}`)
    // }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.4: Opaque Types</h2>
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
