import { useState } from 'react'

// ============================================
// Задание 5.1: Repository (Типобезопасный CRUD)
// ============================================

interface Entity {
  id: string
}

// TODO: Create interface Repository<T extends Entity> with methods:
//   findById(id: string): T | undefined
//   findAll(): T[]
//   create(entity: T): T
//   update(id: string, updates: Partial<T>): T | undefined
//   delete(id: string): boolean

// TODO: Create class InMemoryRepository<T extends Entity> implementing Repository<T>
//   - Use private store = new Map<string, T>()
//   - findById: return entity from store by id
//   - findAll: return Array.from(store.values())
//   - create: save a COPY of entity (use spread), return entity
//   - update: merge updates into existing entity, return updated or undefined
//   - delete: delete from store, return boolean result

interface User extends Entity {
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

export function Task5_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create InMemoryRepository<User>

    // TODO: Create 3 users with repo.create():
    //   { id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin' }
    //   { id: '2', name: 'Bob', email: 'bob@example.com', role: 'user' }
    //   { id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'guest' }
    // Log: "Created 3 users" and findAll().length

    // TODO: Test findById('1') and findById('999')
    // Log the results

    // TODO: Test update('2', { role: 'admin', name: 'Bob Senior' })
    // and update('999', { name: 'Ghost' })
    // Log the results

    // TODO: Test delete('3') and delete('3') again
    // Log the boolean results and findAll().length

    // TODO: Log final state — iterate findAll() and print each user

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Repository</h2>
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
