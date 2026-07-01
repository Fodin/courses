import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 3.1: min, max, positive, negative
// Task 3.1: min, max, positive, negative
// ============================================

// TODO: Создайте ageSchema — yup.number().required().positive().min(18).max(120) с кастомными сообщениями
// TODO: Create ageSchema — yup.number().required().positive().min(18).max(120) with custom messages

// TODO: Создайте temperatureSchema — yup.number().required().min(-50).max(50)
// TODO: Create temperatureSchema — yup.number().required().min(-50).max(50)

// TODO: Создайте balanceSchema — yup.number().required().negative() с кастомным сообщением
// TODO: Create balanceSchema — yup.number().required().negative() with custom message

export function Task3_1() {
  const { t } = useLanguage()
  const [ageInput, setAgeInput] = useState('')
  const [tempInput, setTempInput] = useState('')
  const [balanceInput, setBalanceInput] = useState('')
  const [ageResult, setAgeResult] = useState<string | null>(null)
  const [tempResult, setTempResult] = useState<string | null>(null)
  const [balanceResult, setBalanceResult] = useState<string | null>(null)
  const [ageValid, setAgeValid] = useState<boolean | null>(null)
  const [tempValid, setTempValid] = useState<boolean | null>(null)
  const [balanceValid, setBalanceValid] = useState<boolean | null>(null)

  const validateAge = async () => {
    // TODO: Валидируйте ageInput через ageSchema.validate()
    //   - Преобразуйте пустую строку в undefined, иначе в Number
    //   - При успехе: setAgeResult(`Valid: ${result}`), setAgeValid(true)
    //   - При ошибке: setAgeResult(`Error: ${err.message}`), setAgeValid(false)
    // TODO: Validate ageInput via ageSchema.validate()
    //   - Convert empty string to undefined, otherwise to Number
    //   - On success: setAgeResult(`Valid: ${result}`), setAgeValid(true)
    //   - On error: setAgeResult(`Error: ${err.message}`), setAgeValid(false)
    console.log('Validate age:', ageInput)
    setAgeResult(null)
    setAgeValid(null)
  }

  const validateTemp = async () => {
    // TODO: Валидируйте tempInput через temperatureSchema
    // TODO: Validate tempInput via temperatureSchema
    console.log('Validate temp:', tempInput)
    setTempResult(null)
    setTempValid(null)
  }

  const validateBalance = async () => {
    // TODO: Валидируйте balanceInput через balanceSchema
    // TODO: Validate balanceInput via balanceSchema
    console.log('Validate balance:', balanceInput)
    setBalanceResult(null)
    setBalanceValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.3.1')}</h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <h3>positive() + min/max</h3>
          <div className="form-group">
            <input
              type="number"
              value={ageInput}
              onChange={(e) => setAgeInput(e.target.value)}
              placeholder="Enter age (18-120)"
            />
          </div>
          <button onClick={validateAge}>Validate Age</button>
          {/* TODO: Покажите ageResult в цветном блоке (зелёный/красный) */}
          {/* TODO: Show ageResult in colored block (green/red) */}
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <h3>min() + max()</h3>
          <div className="form-group">
            <input
              type="number"
              value={tempInput}
              onChange={(e) => setTempInput(e.target.value)}
              placeholder="Temperature (-50 to 50)"
            />
          </div>
          <button onClick={validateTemp}>Validate Temp</button>
          {/* TODO: Покажите tempResult в цветном блоке */}
          {/* TODO: Show tempResult in colored block */}
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <h3>negative()</h3>
          <div className="form-group">
            <input
              type="number"
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              placeholder="Enter debt (negative)"
            />
          </div>
          <button onClick={validateBalance}>Validate Balance</button>
          {/* TODO: Покажите balanceResult в цветном блоке */}
          {/* TODO: Show balanceResult in colored block */}
        </div>
      </div>
    </div>
  )
}
