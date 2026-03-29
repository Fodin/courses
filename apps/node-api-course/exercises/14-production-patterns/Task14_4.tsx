import { useState } from 'react'

// ============================================
// Задание 14.4: GraphQL Basics
// ============================================

// TODO: Создайте GraphQL API с Apollo Server или graphql-yoga
// TODO: Определите Type Definitions (SDL): Query, Mutation, types
// TODO: Реализуйте resolvers для каждого поля
// TODO: Покажите relationships, arguments и input types

export function Task14_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== GraphQL Basics ===')
    log.push('')

    // TODO: Определите SDL: type User { id, name, posts: [Post] }
    // TODO: Реализуйте Query resolvers: users, user(id)
    // TODO: Реализуйте Mutation resolvers: createUser(input)
    // TODO: Покажите N+1 проблему и DataLoader для batch loading
    log.push('GraphQL')
    log.push('  ... type Query { users: [User!]!, user(id: ID!): User }')
    log.push('  ... type Mutation { createUser(input: CreateUserInput!): User! }')
    log.push('  ... resolvers: { Query: { users: () => db.users.findAll() } }')
    log.push('  ... DataLoader: batch loading для предотвращения N+1')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 14.4: GraphQL Basics</h2>
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
