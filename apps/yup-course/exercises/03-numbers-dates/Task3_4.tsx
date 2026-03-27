import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 3.4: Диапазоны дат
// Task 3.4: Date Ranges
// ============================================

// TODO: Создайте dateRangeSchema — yup.object() с полями:
//   - startDate: yup.date().required('Start date is required')
//   - endDate: yup.date().required('End date is required').min(yup.ref('startDate'), 'End date must be after start date')
// TODO: Create dateRangeSchema — yup.object() with fields:
//   - startDate: yup.date().required('Start date is required')
//   - endDate: yup.date().required('End date is required').min(yup.ref('startDate'), 'End date must be after start date')

export function Task3_4() {
  const { t } = useLanguage()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)

  const validateRange = async () => {
    // TODO: Валидируйте { startDate, endDate } через dateRangeSchema.validate()
    //   - Передайте пустые строки как undefined
    //   - Используйте { abortEarly: false } для показа всех ошибок
    //   - При успехе: покажите диапазон и количество дней
    //   - При ошибке: покажите все ошибки через err.errors.join('; ')
    // TODO: Validate { startDate, endDate } via dateRangeSchema.validate()
    //   - Pass empty strings as undefined
    //   - Use { abortEarly: false } to show all errors
    //   - On success: show range and day count
    //   - On error: show all errors via err.errors.join('; ')
    console.log('Validate range:', startDate, endDate)
    setResult(null)
    setValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.3.4')}</h2>

      <div style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button onClick={validateRange}>Validate Range</button>

        {/* TODO: Покажите result в цветном блоке */}
        {/* TODO: Show result in colored block */}
      </div>
    </div>
  )
}
