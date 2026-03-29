import { useState } from 'react'

// ============================================
// Задание 1.1: Routes & Router
// ============================================

// TODO: Создайте Express-приложение с модульной маршрутизацией
// TODO: Используйте express.Router() для группировки маршрутов
// TODO: Реализуйте CRUD-маршруты: GET, POST, PUT, DELETE
// TODO: Покажите вложенные роутеры и параметры маршрутов (:id)

export function Task1_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Express Routes & Router ===')
    log.push('')

    // TODO: Создайте app = express() и userRouter = express.Router()
    // TODO: Определите маршруты GET /users, GET /users/:id, POST /users
    // TODO: Подключите роутер через app.use('/api', userRouter)
    // TODO: Покажите req.params, req.query, req.body
    log.push('Express Router')
    log.push('  ... const router = express.Router()')
    log.push('  ... router.get("/users", listUsers)')
    log.push('  ... router.get("/users/:id", getUser)')
    log.push('  ... app.use("/api/v1", router)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.1: Routes & Router</h2>
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
