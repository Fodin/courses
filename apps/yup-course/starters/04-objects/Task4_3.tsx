import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 4.3: pick, omit, partial
// Task 4.3: pick, omit, partial
// ============================================

// TODO: Создайте fullPersonSchema — yup.object() с полями:
//   name (string, required), age (number, required, positive, integer),
//   email (string, required, email), phone (string, required)
// TODO: Create fullPersonSchema — yup.object() with fields:
//   name, age, email, phone (all required)

// TODO: Создайте publicSchema через fullPersonSchema.pick(['name', 'email'])
// TODO: Create publicSchema via fullPersonSchema.pick(['name', 'email'])

// TODO: Создайте withoutPhoneSchema через fullPersonSchema.omit(['phone'])
// TODO: Create withoutPhoneSchema via fullPersonSchema.omit(['phone'])

// TODO: Создайте partialSchema через fullPersonSchema.partial()
// TODO: Create partialSchema via fullPersonSchema.partial()

export function Task4_3() {
  const { t } = useLanguage()
  const [input, setInput] = useState('{"name": "Alice", "email": "alice@test.com"}')
  const [selectedSchema, setSelectedSchema] = useState<'full' | 'pick' | 'omit' | 'partial'>('full')
  const [result, setResult] = useState<string | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)

  // TODO: Создайте объект schemas с вариантами:
  //   full: { schema: fullPersonSchema, label: '...' }
  //   pick: { schema: publicSchema, label: '...' }
  //   omit: { schema: withoutPhoneSchema, label: '...' }
  //   partial: { schema: partialSchema, label: '...' }
  // TODO: Create schemas object with variants

  const validate = async () => {
    // TODO: Распарсите JSON из input
    //   - Выберите схему по selectedSchema
    //   - Валидируйте с abortEarly: false
    //   - При SyntaxError покажите ошибку парсинга
    // TODO: Parse JSON from input
    //   - Select schema by selectedSchema
    //   - Validate with abortEarly: false
    //   - On SyntaxError show parse error
    console.log('Validate with schema:', selectedSchema)
    setResult(null)
    setValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.4.3')}</h2>

      <div style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>Schema variant:</label>
          <select
            value={selectedSchema}
            onChange={(e) => setSelectedSchema(e.target.value as typeof selectedSchema)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
          >
            {/* TODO: Рендерите options из объекта schemas */}
            {/* TODO: Render options from schemas object */}
            <option value="full">Full (all required)</option>
            <option value="pick">pick</option>
            <option value="omit">omit</option>
            <option value="partial">partial</option>
          </select>
        </div>

        <div className="form-group">
          <label>JSON data:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.85rem', padding: '0.5rem' }}
          />
        </div>

        <button onClick={validate}>Validate</button>

        {/* TODO: Покажите result в <pre> блоке с цветным фоном */}
        {/* TODO: Show result in <pre> block with colored background */}
      </div>
    </div>
  )
}
