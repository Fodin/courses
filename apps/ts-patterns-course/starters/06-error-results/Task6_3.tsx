import { useState } from 'react'

// ============================================
// Задание 6.3: Option / Maybe
// ============================================

// TODO: Create class Some<T> with:
// - readonly _tag = 'some'
// - constructor(readonly value: T)
// - map<U>(fn: (value: T) => U): Option<U>
// - flatMap<U>(fn: (value: T) => Option<U>): Option<U>
// - getOrElse(_defaultValue: T): T

// TODO: Create class NoneClass with:
// - readonly _tag = 'none'
// - map<U>(_fn: (value: never) => U): Option<U>
// - flatMap<U>(_fn: (value: never) => Option<U>): Option<U>
// - getOrElse<T>(defaultValue: T): T

// TODO: Define type Option<T> = Some<T> | NoneClass

// TODO: Create helper function some<T>(value: T): Option<T>

// TODO: Create constant none: Option<never> = new NoneClass()

// TODO: Create function fromNullable<T>(value: T | null | undefined): Option<T>
// - Return none if value is null or undefined
// - Return some(value) otherwise

interface Address {
  street?: string
  city?: string
  zip?: string
}

interface UserProfile {
  name: string
  address?: Address
  phone?: string
}

export function Task6_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Demonstrate basic Some/None — log _tag and value

    // TODO: Demonstrate map — some(5).map(x => x * 2) and none.map(...)

    // TODO: Demonstrate getOrElse — some(5).getOrElse(0) and none.getOrElse(0)

    // TODO: Demonstrate fromNullable — with 42, null, undefined, and ""

    // TODO: Create UserProfile objects:
    // - user1 with full address (street, city, zip)
    // - user2 with no address
    // - user3 with address but no street

    // TODO: Create getStreet function using fromNullable + flatMap
    // TODO: Chain: getStreet(user).map(s => s.toUpperCase()).getOrElse('Unknown')
    // TODO: Log results for all three users

    // TODO: Demonstrate flatMap chain:
    // fromNullable(id) → findUser → get address → get city → getOrElse

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.3: Option / Maybe</h2>
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
