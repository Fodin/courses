import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 5.1: array().of()
// Task 5.1: array().of()
// ============================================

// TODO: Создайте tagsSchema — yup.array().of(yup.string().required('Tag cannot be empty')).required('Tags are required')
// TODO: Create tagsSchema — yup.array().of(yup.string().required('Tag cannot be empty')).required('Tags are required')

// TODO: Создайте numbersSchema — yup.array().of(yup.number().required().positive('Each number must be positive')).required()
// TODO: Create numbersSchema — yup.array().of(yup.number().required().positive('Each number must be positive')).required()

export function Task5_1() {
  const { t } = useLanguage()
  const [tagsInput, setTagsInput] = useState('react, typescript, yup')
  const [numbersInput, setNumbersInput] = useState('1, 2, 3')
  const [tagsResult, setTagsResult] = useState<string | null>(null)
  const [numbersResult, setNumbersResult] = useState<string | null>(null)
  const [tagsValid, setTagsValid] = useState<boolean | null>(null)
  const [numbersValid, setNumbersValid] = useState<boolean | null>(null)

  const validateTags = async () => {
    // TODO: Распарсите tagsInput: split(','), trim(), filter(Boolean)
    //   - Если массив пустой, передайте undefined
    //   - Валидируйте через tagsSchema.validate()
    //   - При успехе: покажите JSON массива
    //   - При ошибке: покажите err.message
    // TODO: Parse tagsInput: split(','), trim(), filter(Boolean)
    console.log('Validate tags:', tagsInput)
    setTagsResult(null)
    setTagsValid(null)
  }

  const validateNumbers = async () => {
    // TODO: Распарсите numbersInput: split(','), trim(), Number()
    //   - Если массив пустой, передайте undefined
    //   - Валидируйте через numbersSchema.validate(nums, { abortEarly: false })
    //   - При ошибке: покажите err.errors.join('; ')
    // TODO: Parse numbersInput: split(','), trim(), Number()
    console.log('Validate numbers:', numbersInput)
    setNumbersResult(null)
    setNumbersValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.5.1')}</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Array of strings</h3>
          <div className="form-group">
            <label>Tags (comma-separated):</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="react, typescript, yup"
            />
          </div>
          <button onClick={validateTags}>Validate Tags</button>
          {/* TODO: Покажите tagsResult в цветном блоке */}
          {/* TODO: Show tagsResult in colored block */}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Array of numbers</h3>
          <div className="form-group">
            <label>Numbers (comma-separated):</label>
            <input
              value={numbersInput}
              onChange={(e) => setNumbersInput(e.target.value)}
              placeholder="1, 2, 3"
            />
          </div>
          <button onClick={validateNumbers}>Validate Numbers</button>
          {/* TODO: Покажите numbersResult в цветном блоке */}
          {/* TODO: Show numbersResult in colored block */}
        </div>
      </div>
    </div>
  )
}
