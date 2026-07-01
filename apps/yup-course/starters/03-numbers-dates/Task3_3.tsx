import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 3.3: Валидация дат
// Task 3.3: Date Validation
// ============================================

// TODO: Создайте birthdaySchema — yup.date().required().max(new Date()).min(new Date('1900-01-01'))
// TODO: Create birthdaySchema — yup.date().required().max(new Date()).min(new Date('1900-01-01'))

// TODO: Создайте eventSchema — yup.date().required().min(new Date())
// TODO: Create eventSchema — yup.date().required().min(new Date())

export function Task3_3() {
  const { t } = useLanguage()
  const [birthdayInput, setBirthdayInput] = useState('')
  const [eventInput, setEventInput] = useState('')
  const [birthdayResult, setBirthdayResult] = useState<string | null>(null)
  const [eventResult, setEventResult] = useState<string | null>(null)
  const [birthdayValid, setBirthdayValid] = useState<boolean | null>(null)
  const [eventValid, setEventValid] = useState<boolean | null>(null)

  const validateBirthday = async () => {
    // TODO: Валидируйте birthdayInput через birthdaySchema.validate()
    //   - Передайте пустую строку как undefined
    //   - При успехе: покажите дату через toLocaleDateString()
    //   - При ошибке: покажите err.message
    // TODO: Validate birthdayInput via birthdaySchema.validate()
    console.log('Validate birthday:', birthdayInput)
    setBirthdayResult(null)
    setBirthdayValid(null)
  }

  const validateEvent = async () => {
    // TODO: Валидируйте eventInput через eventSchema.validate()
    // TODO: Validate eventInput via eventSchema.validate()
    console.log('Validate event:', eventInput)
    setEventResult(null)
    setEventValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.3.3')}</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Birthday (past date)</h3>
          <div className="form-group">
            <input
              type="date"
              value={birthdayInput}
              onChange={(e) => setBirthdayInput(e.target.value)}
            />
          </div>
          <button onClick={validateBirthday}>Validate Birthday</button>
          {/* TODO: Покажите birthdayResult в цветном блоке */}
          {/* TODO: Show birthdayResult in colored block */}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Event (future date)</h3>
          <div className="form-group">
            <input
              type="date"
              value={eventInput}
              onChange={(e) => setEventInput(e.target.value)}
            />
          </div>
          <button onClick={validateEvent}>Validate Event Date</button>
          {/* TODO: Покажите eventResult в цветном блоке */}
          {/* TODO: Show eventResult in colored block */}
        </div>
      </div>
    </div>
  )
}
