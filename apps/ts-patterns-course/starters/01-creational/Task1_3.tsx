import { useState } from 'react'

// ============================================
// Задание 1.3: Builder
// ============================================

// TODO: Create interface Query with fields:
//   table: string
//   fields: string[]
//   conditions: string[]
//   order?: { field: string; direction: 'asc' | 'desc' }
//   limitCount?: number

// TODO: Create class QueryBuilder with:
//   private query: Partial<Query>
//
//   select(...fields: string[]): this — set fields, return this
//   from(table: string): this — set table, return this
//   where(condition: string): this — add condition to array, return this
//   orderBy(field: string, direction: 'asc' | 'desc'): this — set order, return this
//   limit(count: number): this — set limitCount, return this
//
//   build(): Query — validate table and fields are set, return final Query
//     Throw Error if table is missing
//     Throw Error if fields are missing or empty
//
//   toSQL(): string — call build() and generate SQL string
//     Format: SELECT fields FROM table [WHERE conditions] [ORDER BY field DIR] [LIMIT n]

export function Task1_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Build a simple query: select name, email from users
    // TODO: Build a complex query with where, orderBy, limit — use toSQL()
    // TODO: Demonstrate validation errors (missing from, missing select)
    // TODO: Show fluent chaining works

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.3: Builder</h2>
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
