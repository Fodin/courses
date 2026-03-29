import { useState } from 'react'

// ============================================
// Задание 7.3: Prisma
// ============================================

// TODO: Настройте Prisma ORM для работы с PostgreSQL
// TODO: Определите модели в schema.prisma (User, Post, Comment)
// TODO: Используйте prisma.user.findMany(), create(), update(), delete()
// TODO: Покажите relations (one-to-many), include и select

export function Task7_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Prisma ORM ===')
    log.push('')

    // TODO: Определите schema.prisma с моделями User, Post
    // TODO: Выполните prisma generate и prisma migrate dev
    // TODO: Реализуйте CRUD через PrismaClient
    // TODO: Покажите include для загрузки связей и select для проекции
    log.push('Prisma')
    log.push('  ... model User { id Int @id @default(autoincrement()), posts Post[] }')
    log.push('  ... prisma.user.findMany({ include: { posts: true } })')
    log.push('  ... prisma.user.create({ data: { name, email } })')
    log.push('  ... prisma.post.findMany({ where: { published: true }, select: { title: true } })')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.3: Prisma</h2>
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
