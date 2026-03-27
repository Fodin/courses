import { useState } from 'react'

// ============================================
// Задание 7.2: Ports & Adapters
// ============================================

interface User {
  id: string
  name: string
  email: string
}

// TODO: Define interface UserRepository (this is the PORT):
//   findById(id: string): User | null
//   save(user: User): void
//   findAll(): User[]

// TODO: Create class InMemoryUserRepository implementing UserRepository (this is the ADAPTER):
//   private users: Map<string, User>
//
//   findById(id: string): User | null
//     — return user from map or null
//
//   save(user: User): void
//     — store user in map by user.id
//
//   findAll(): User[]
//     — return Array.from(this.users.values())

let userIdCounter = 0

// TODO: Create class UserService with:
//   constructor(private readonly userRepo: UserRepository)
//     — IMPORTANT: depend on the interface, NOT on InMemoryUserRepository
//
//   createUser(name: string, email: string): User
//     — create user with id = `usr-${++userIdCounter}`, save via repo, return user
//
//   getUser(id: string): User
//     — find via repo, throw Error(`User not found: ${id}`) if null
//
//   listUsers(): User[]
//     — return all users via repo

export function Task7_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    userIdCounter = 0

    // TODO: Create InMemoryUserRepository instance
    // TODO: Create UserService with the repository injected

    // TODO: Create two users (Alice, Bob) and log their names and ids

    // TODO: Find Alice by id using getUser, log found user name and email

    // TODO: List all users, log each name and email

    // TODO: Try to find non-existent user 'usr-999', catch error and log message

    // TODO: Log architecture summary:
    //   'UserService depends on UserRepository (port/interface)'
    //   'InMemoryUserRepository is the adapter (implementation)'
    //   'Swapping to PostgresUserRepository requires zero changes in UserService'

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.2: Ports & Adapters</h2>
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
