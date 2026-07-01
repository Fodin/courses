import { useState } from 'react'

// ============================================
// Задание 6.2: Assertion Functions
// ============================================

// TODO: Реализуйте assertion function assertDefined:
//   function assertDefined<T>(value: T | null | undefined, name?: string): asserts value is T
//   Бросает Error если value === null или undefined

// TODO: Реализуйте assertion function assertIsString:
//   function assertIsString(value: unknown): asserts value is string
//   Бросает TypeError если typeof value !== 'string'

// TODO: Реализуйте assertion function assertInstanceOf:
//   function assertInstanceOf<T>(value: unknown, ctor: new (...args: unknown[]) => T): asserts value is T
//   Бросает Error если !(value instanceof ctor)

// TODO: Реализуйте assertion function assertNever:
//   function assertNever(value: never): never
//   Для exhaustiveness checking

// TODO: Реализуйте assertValidForm для валидации формы:
//   interface FormData { username?: string; email?: string; age?: number }
//   interface ValidForm { username: string; email: string; age: number }
//   function assertValidForm(data: FormData): asserts data is ValidForm

export function Task6_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте assertDefined:
    // const maybeUser: { name: string } | null = { name: 'Alice' }
    // assertDefined(maybeUser, 'user')
    // log.push(`assertDefined passed: ${maybeUser.name}`) // type narrowed to { name: string }
    //
    // try {
    //   assertDefined(null, 'value')
    // } catch (e) {
    //   log.push(`assertDefined(null) → Error: ${(e as Error).message}`)
    // }

    // TODO: Протестируйте assertIsString:
    // const input: unknown = 'hello'
    // assertIsString(input)
    // log.push(`assertIsString passed: "${input.toUpperCase()}"`) // type narrowed

    // TODO: Протестируйте assertInstanceOf:
    // const date: unknown = new Date()
    // assertInstanceOf(date, Date)
    // log.push(`assertInstanceOf(Date) passed: ${date.toISOString()}`)

    // TODO: Протестируйте assertValidForm:
    // const form: FormData = { username: 'alice', email: 'a@t.com', age: 25 }
    // try {
    //   assertValidForm(form)
    //   log.push(`Valid form: ${form.username}, ${form.email}, ${form.age}`)
    // } catch (e) {
    //   log.push(`Invalid: ${(e as Error).message}`)
    // }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.2: Assertion Functions</h2>
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
