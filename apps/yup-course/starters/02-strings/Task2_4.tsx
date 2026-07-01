import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 2.4: trim, lowercase, uppercase
// Task 2.4: trim, lowercase, uppercase
// ============================================

// TODO: Создайте 4 схемы:
//   1. trimSchema = yup.string().required().trim()
//   2. lowerSchema = yup.string().required().lowercase()
//   3. upperSchema = yup.string().required().uppercase()
//   4. combinedSchema = yup.string().required().trim().lowercase()
// TODO: Create 4 schemas:
//   1. trimSchema = yup.string().required().trim()
//   2. lowerSchema = yup.string().required().lowercase()
//   3. upperSchema = yup.string().required().uppercase()
//   4. combinedSchema = yup.string().required().trim().lowercase()

export function Task2_4() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Array<{ label: string; original: string; transformed: string }>>([])

  const transformAll = () => {
    // TODO: Используйте cast() для каждой схемы
    //   - Покажите исходное значение (JSON.stringify)
    //   - Покажите преобразованное значение
    //   - Сохраните результаты в state
    // TODO: Use cast() for each schema
    //   - Show original value (JSON.stringify)
    //   - Show transformed value
    //   - Save results to state
    console.log('Transform:', input)
    setResults([])
  }

  const validateStrictMode = async () => {
    // TODO: Валидируйте input через lowerSchema с { strict: true }
    //   - Покажите, что strict mode НЕ трансформирует, а проверяет
    //   - "HELLO" с strict → ошибка
    //   - "hello" с strict → успех
    // TODO: Validate input via lowerSchema with { strict: true }
    //   - Show that strict mode does NOT transform, but validates
    //   - "HELLO" with strict → error
    //   - "hello" with strict → success
    console.log('Strict validate:', input)
    setResults([])
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.2.4')}</h2>

      <div style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>Enter a string (try spaces, mixed case):</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='  Hello World  '
          />
          <span style={{ fontSize: '0.8rem', color: '#999' }}>
            Raw: {JSON.stringify(input)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={transformAll}>Cast All</button>
          <button onClick={validateStrictMode}>Test strict mode</button>
        </div>

        {/* TODO: Покажите результаты трансформаций в синих блоках */}
        {/* TODO: Show transformation results in blue blocks */}
      </div>
    </div>
  )
}
