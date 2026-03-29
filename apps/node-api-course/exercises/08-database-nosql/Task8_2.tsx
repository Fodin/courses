import { useState } from 'react'

// ============================================
// Задание 8.2: Mongoose
// ============================================

// TODO: Определите Mongoose-схемы и модели
// TODO: Создайте Schema с валидацией: required, minlength, enum
// TODO: Реализуйте виртуальные поля, методы и стatics
// TODO: Покажите populate для связей между документами

export function Task8_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Mongoose ODM ===')
    log.push('')

    // TODO: Определите userSchema = new Schema({ name: { type: String, required: true } })
    // TODO: Добавьте virtual "fullName" и method "comparePassword"
    // TODO: Создайте Post model с ref: "User" для populate
    // TODO: Покажите middleware: pre("save") для хэширования пароля
    log.push('Mongoose')
    log.push('  ... const userSchema = new Schema({ name: String, email: String })')
    log.push('  ... userSchema.virtual("fullName").get(function() { ... })')
    log.push('  ... userSchema.pre("save", async function() { hash password })')
    log.push('  ... Post.find().populate("author", "name email")')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.2: Mongoose</h2>
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
