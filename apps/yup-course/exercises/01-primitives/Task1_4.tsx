import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 1.4: default и defined
// Task 1.4: default and defined
// ============================================

// TODO: Создайте 3 схемы:
//   1. defaultSchema = yup.string().default('Guest')
//   2. defaultNumberSchema = yup.number().default(0)
//   3. definedSchema = yup.string().defined('Value must be defined')
// TODO: Create 3 schemas:
//   1. defaultSchema = yup.string().default('Guest')
//   2. defaultNumberSchema = yup.number().default(0)
//   3. definedSchema = yup.string().defined('Value must be defined')

export function Task1_4() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Array<{ label: string; result: string; valid: boolean }>>([])

  const validateAll = async () => {
    // TODO: Для default-схем используйте cast() чтобы показать подстановку значений
    //   - Пустое поле → undefined
    //   - defaultSchema.cast(value) → покажите результат
    //   - defaultNumberSchema.cast(value) → покажите результат
    // TODO: For default schemas use cast() to show value substitution
    //   - Empty field → undefined
    //   - defaultSchema.cast(value) → show result
    //   - defaultNumberSchema.cast(value) → show result

    // TODO: Для definedSchema используйте validate()
    //   - Покажите ошибку при undefined
    //   - Покажите успех при заданном значении
    // TODO: For definedSchema use validate()
    //   - Show error on undefined
    //   - Show success on defined value
    console.log('Test all:', input)
    setResults([])
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.1.4')}</h2>

      <div style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>Enter value (leave empty to test undefined):</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Try: empty, or any text/number"
          />
        </div>
        <button onClick={validateAll}>Test All</button>

        {/* TODO: Покажите результаты для каждой схемы в цветных блоках */}
        {/* TODO: Show results for each schema in colored blocks */}
      </div>
    </div>
  )
}
