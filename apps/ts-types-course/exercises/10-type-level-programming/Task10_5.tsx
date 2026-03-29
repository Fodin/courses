import { useState } from 'react'

// ============================================
// Задание 10.5: Type-Level SQL Builder
// ============================================

// TODO: Создайте type-safe SQL query builder на уровне типов:

// TODO: Определите схему таблиц:
//   interface Schema {
//     users: { id: number; name: string; email: string; age: number }
//     posts: { id: number; title: string; body: string; authorId: number }
//     comments: { id: number; text: string; postId: number; userId: number }
//   }

// TODO: Создайте тип SelectQuery<Table, Columns>:
//   Гарантирует, что Columns — подмножество ключей Table
//   Результат: Pick<Schema[Table], Columns>

// TODO: Создайте тип WhereClause<Table>:
//   { column: keyof Schema[Table]; op: '=' | '!=' | '>' | '<'; value: unknown }

// TODO: Реализуйте chain-style builder:
//   createQuery<T extends keyof Schema>(table: T)
//     .select<K extends keyof Schema[T]>(...columns: K[])
//     .where(clause: WhereClause<T>)
//     .build(): string
//   Каждый метод возвращает корректно типизированный следующий шаг

// TODO: Результат select должен возвращать Pick<Schema[Table], Columns>

export function Task10_5() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Создайте query builder и протестируйте:
    // const query1 = createQuery('users')
    //   .select('name', 'email')
    //   .where({ column: 'age', op: '>', value: 18 })
    //   .build()
    // log.push(`Query 1: ${query1}`)
    // // → "SELECT name, email FROM users WHERE age > 18"

    // const query2 = createQuery('posts')
    //   .select('title', 'body')
    //   .where({ column: 'authorId', op: '=', value: 1 })
    //   .build()
    // log.push(`Query 2: ${query2}`)

    // TODO: Покажите, что невалидные колонки не компилируются:
    // createQuery('users').select('nonExistent') // Ошибка компиляции!
    // log.push('select("nonExistent") → ошибка компиляции')

    // TODO: Покажите, что where проверяет колонки таблицы:
    // .where({ column: 'invalid', ... }) // Ошибка!
    // log.push('where({ column: "invalid" }) → ошибка компиляции')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.5: Type-Level SQL Builder</h2>
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
