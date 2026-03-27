import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 3.2: integer и truncate
// Task 3.2: integer and truncate
// ============================================

// TODO: Создайте quantitySchema — yup.number().required().positive().integer()
// TODO: Create quantitySchema — yup.number().required().positive().integer()

// TODO: Создайте truncateSchema — yup.number().required().truncate()
// TODO: Create truncateSchema — yup.number().required().truncate()

// TODO: Создайте roundSchema — yup.number().required().round('ceil')
// TODO: Create roundSchema — yup.number().required().round('ceil')

export function Task3_2() {
  const { t } = useLanguage()
  const [quantityInput, setQuantityInput] = useState('')
  const [transformInput, setTransformInput] = useState('')
  const [quantityResult, setQuantityResult] = useState<string | null>(null)
  const [quantityValid, setQuantityValid] = useState<boolean | null>(null)
  const [transformResults, setTransformResults] = useState<Array<{ label: string; result: string }>>([])

  const validateQuantity = async () => {
    // TODO: Валидируйте quantityInput через quantitySchema.validate()
    //   - Преобразуйте пустую строку в undefined, иначе в Number
    //   - При успехе: setQuantityResult(`Valid: ${result}`), setQuantityValid(true)
    //   - При ошибке: setQuantityResult(`Error: ${err.message}`), setQuantityValid(false)
    // TODO: Validate quantityInput via quantitySchema.validate()
    console.log('Validate quantity:', quantityInput)
    setQuantityResult(null)
    setQuantityValid(null)
  }

  const transformAll = () => {
    // TODO: Преобразуйте transformInput в число
    //   - Если NaN, покажите ошибку
    //   - Примените truncateSchema.cast(num) и roundSchema.cast(num)
    //   - Покажите оригинал и оба результата через setTransformResults
    // TODO: Convert transformInput to number
    //   - If NaN, show error
    //   - Apply truncateSchema.cast(num) and roundSchema.cast(num)
    //   - Show original and both results via setTransformResults
    console.log('Transform:', transformInput)
    setTransformResults([])
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.3.2')}</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>integer()</h3>
          <div className="form-group">
            <input
              type="number"
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
              placeholder="Enter quantity (integer)"
              step="0.1"
            />
          </div>
          <button onClick={validateQuantity}>Validate Quantity</button>
          {/* TODO: Покажите quantityResult в цветном блоке */}
          {/* TODO: Show quantityResult in colored block */}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>truncate() and round()</h3>
          <div className="form-group">
            <input
              type="number"
              value={transformInput}
              onChange={(e) => setTransformInput(e.target.value)}
              placeholder="Enter decimal (e.g. 3.7)"
              step="0.1"
            />
          </div>
          <button onClick={transformAll}>Transform</button>
          {/* TODO: Покажите transformResults — массив { label, result } в синих блоках */}
          {/* TODO: Show transformResults — array of { label, result } in blue blocks */}
        </div>
      </div>
    </div>
  )
}
