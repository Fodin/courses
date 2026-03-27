import { useState } from 'react'

// ============================================
// Задание 5.2: Unit of Work (Транзакции)
// ============================================

interface Entity {
  id: string
}

interface Repository<T extends Entity> {
  findById(id: string): T | undefined
  findAll(): T[]
  create(entity: T): T
  update(id: string, updates: Partial<T>): T | undefined
  delete(id: string): boolean
}

class InMemoryRepository<T extends Entity> implements Repository<T> {
  private store = new Map<string, T>()

  findById(id: string): T | undefined {
    return this.store.get(id)
  }

  findAll(): T[] {
    return Array.from(this.store.values())
  }

  create(entity: T): T {
    this.store.set(entity.id, { ...entity })
    return entity
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const existing = this.store.get(id)
    if (!existing) return undefined
    const updated = { ...existing, ...updates }
    this.store.set(id, updated)
    return updated
  }

  delete(id: string): boolean {
    return this.store.delete(id)
  }
}

// TODO: Create interface UnitOfWork with methods:
//   registerNew<T extends Entity>(entity: T, repoName: string): void
//   registerDirty<T extends Entity>(entity: T, repoName: string): void
//   registerDeleted(id: string, repoName: string): void
//   commit(): string[]  — apply all pending ops, return log of operations
//   rollback(): void    — discard all pending ops

// TODO: Define types for pending operations:
//   PendingNew   { kind: 'new',    entity: Entity, repoName: string }
//   PendingDirty { kind: 'dirty',  entity: Entity, repoName: string }
//   PendingDelete{ kind: 'delete', id: string,     repoName: string }
//   PendingOp = PendingNew | PendingDirty | PendingDelete

// TODO: Create class InMemoryUnitOfWork implementing UnitOfWork
//   constructor(repos: Map<string, Repository<Entity>>)
//   - private pending: PendingOp[] = []
//   - registerNew/registerDirty/registerDeleted push to pending
//   - commit(): apply in order: creates -> updates -> deletes
//     For each op: get repo from this.repos by repoName, call repo method
//     Return log array like: "[CREATE] users: id=u1"
//     Clear pending after commit
//   - rollback(): clear pending array

interface User extends Entity {
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

interface Product extends Entity {
  name: string
  price: number
}

export function Task5_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    const userRepo = new InMemoryRepository<User>()
    const productRepo = new InMemoryRepository<Product>()

    const repos = new Map<string, Repository<Entity>>()
    repos.set('users', userRepo as Repository<Entity>)
    repos.set('products', productRepo as Repository<Entity>)

    // TODO: Scenario 1 — Commit
    // Create InMemoryUnitOfWork with repos
    // Register 2 new users and 1 new product
    // Log repo counts before and after commit
    // Log the operations returned by commit()

    // TODO: Scenario 2 — Update + Delete in one transaction
    // Register a dirty user (update) and a deleted user
    // Commit and log results

    // TODO: Scenario 3 — Rollback
    // Register some operations, then call rollback()
    // Log that repos are unchanged

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.2: Unit of Work</h2>
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
