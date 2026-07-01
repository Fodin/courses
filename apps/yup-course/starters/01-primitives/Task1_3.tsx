import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 1.3: required и nullable
// Task 1.3: required and nullable
// ============================================

// TODO: Создайте 4 схемы:
//   1. requiredSchema = yup.string().required()
//   2. nullableSchema = yup.string().nullable()
//   3. optionalSchema = yup.string().optional()
//   4. nullableRequiredSchema = yup.string().nullable().required()
// TODO: Create 4 schemas:
//   1. requiredSchema = yup.string().required()
//   2. nullableSchema = yup.string().nullable()
//   3. optionalSchema = yup.string().optional()
//   4. nullableRequiredSchema = yup.string().nullable().required()

export function Task1_3() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Array<{ label: string; result: string; valid: boolean }>>([])

  const validateAll = async () => {
    // TODO: Определите значение:
    //   - Пустая строка → undefined
    //   - Текст "null" → null
    //   - Остальное → строка как есть
    // TODO: Determine value:
    //   - Empty string → undefined
    //   - Text "null" → null
    //   - Other → string as-is

    // TODO: Валидируйте значение через все 4 схемы
    //   - Для каждой схемы: try/catch с validate()
    //   - Сохраните результат { label, result, valid } для каждой
    //   - Обновите состояние results
    // TODO: Validate value against all 4 schemas
    //   - For each: try/catch with validate()
    //   - Save { label, result, valid } for each
    //   - Update results state
    console.log('Validate all:', input)
    setResults([])
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.1.3')}</h2>

      <div style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>
            Enter value (leave empty for undefined, type &quot;null&quot; for null):
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Try: empty, "null", or any text'
          />
        </div>
        <button onClick={validateAll}>Validate All Schemas</button>

        {/* TODO: Покажите результаты для каждой схемы в цветных блоках */}
        {/* TODO: Show results for each schema in colored blocks */}
      </div>
    </div>
  )
}
