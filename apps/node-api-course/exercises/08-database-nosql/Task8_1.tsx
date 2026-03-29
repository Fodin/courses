import { useState } from 'react'

// ============================================
// Задание 8.1: MongoDB Native
// ============================================

// TODO: Подключитесь к MongoDB через официальный драйвер (mongodb)
// TODO: Создайте MongoClient и получите доступ к коллекции
// TODO: Реализуйте CRUD: insertOne, find, updateOne, deleteOne
// TODO: Используйте фильтры, проекции и сортировку

export function Task8_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== MongoDB Native Driver ===')
    log.push('')

    // TODO: Создайте MongoClient(MONGO_URI) и подключитесь
    // TODO: const db = client.db("myapp"), const users = db.collection("users")
    // TODO: Выполните users.find({ age: { $gte: 18 } }).sort({ name: 1 })
    // TODO: Покажите индексы: createIndex({ email: 1 }, { unique: true })
    log.push('MongoDB Native')
    log.push('  ... const client = new MongoClient(MONGO_URI)')
    log.push('  ... const users = client.db("myapp").collection("users")')
    log.push('  ... users.insertOne({ name: "John", age: 30 })')
    log.push('  ... users.find({ age: { $gte: 18 } }).toArray()')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.1: MongoDB Native</h2>
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
