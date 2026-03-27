import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 1.2: boolean и date
// Task 1.2: boolean and date
// ============================================

// TODO: Создайте boolSchema — yup.boolean().required().isTrue() с кастомным сообщением
// TODO: Create boolSchema — yup.boolean().required().isTrue() with custom message

// TODO: Создайте dateSchema — yup.date().required().min(new Date('2000-01-01')) с кастомным сообщением
// TODO: Create dateSchema — yup.date().required().min(new Date('2000-01-01')) with custom message

export function Task1_2() {
  const { t } = useLanguage()
  const [boolInput, setBoolInput] = useState(false)
  const [dateInput, setDateInput] = useState('')
  const [boolResult, setBoolResult] = useState<string | null>(null)
  const [dateResult, setDateResult] = useState<string | null>(null)
  const [boolValid, setBoolValid] = useState<boolean | null>(null)
  const [dateValid, setDateValid] = useState<boolean | null>(null)

  const validateBool = async () => {
    // TODO: Валидируйте boolInput через boolSchema.validate()
    //   - При успехе: покажите результат и typeof
    //   - При ошибке: покажите сообщение
    // TODO: Validate boolInput via boolSchema.validate()
    //   - On success: show result and typeof
    //   - On error: show message
    console.log('Validate bool:', boolInput)
    setBoolResult(null)
    setBoolValid(null)
  }

  const validateDate = async () => {
    // TODO: Валидируйте dateInput через dateSchema.validate()
    //   - Передайте undefined если поле пустое
    //   - При успехе: покажите toISOString() результат и typeof
    //   - При ошибке: покажите сообщение
    // TODO: Validate dateInput via dateSchema.validate()
    //   - Pass undefined if empty
    //   - On success: show toISOString() result and typeof
    //   - On error: show message
    console.log('Validate date:', dateInput)
    setDateResult(null)
    setDateValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.1.2')}</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>boolean()</h3>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={boolInput}
                onChange={(e) => setBoolInput(e.target.checked)}
              />
              I agree to terms
            </label>
          </div>
          <button onClick={validateBool}>Validate Boolean</button>
          {/* TODO: Покажите boolResult в цветном блоке */}
          {/* TODO: Show boolResult in colored block */}
        </div>

        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>date()</h3>
          <div className="form-group">
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
          </div>
          <button onClick={validateDate}>Validate Date</button>
          {/* TODO: Покажите dateResult в цветном блоке */}
          {/* TODO: Show dateResult in colored block */}
        </div>
      </div>
    </div>
  )
}
