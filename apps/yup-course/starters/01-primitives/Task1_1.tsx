import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 1.1: string и number
// Task 1.1: string and number
// ============================================

// TODO: Создайте stringSchema — yup.string().required().min(2) с кастомными сообщениями
// TODO: Create stringSchema — yup.string().required().min(2) with custom messages

// TODO: Создайте numberSchema — yup.number().required().min(0).max(150) с кастомными сообщениями
// TODO: Create numberSchema — yup.number().required().min(0).max(150) with custom messages

export function Task1_1() {
  const { t } = useLanguage()
  const [strInput, setStrInput] = useState('')
  const [numInput, setNumInput] = useState('')
  const [strResult, setStrResult] = useState<string | null>(null)
  const [numResult, setNumResult] = useState<string | null>(null)
  const [strValid, setStrValid] = useState<boolean | null>(null)
  const [numValid, setNumValid] = useState<boolean | null>(null)

  const validateString = async () => {
    // TODO: Валидируйте strInput через stringSchema.validate()
    //   - При успехе: покажите результат и его typeof
    //   - При ошибке: покажите сообщение ошибки
    // TODO: Validate strInput via stringSchema.validate()
    //   - On success: show result and its typeof
    //   - On error: show error message
    console.log('Validate string:', strInput)
    setStrResult(null)
    setStrValid(null)
  }

  const validateNumber = async () => {
    // TODO: Валидируйте numInput через numberSchema.validate()
    //   - Передайте undefined если поле пустое, иначе само значение строки
    //   - При успехе: покажите результат и его typeof (заметьте cast!)
    //   - При ошибке: покажите сообщение ошибки
    // TODO: Validate numInput via numberSchema.validate()
    //   - Pass undefined if empty, otherwise the string value
    //   - On success: show result and its typeof (notice the cast!)
    //   - On error: show error message
    console.log('Validate number:', numInput)
    setNumResult(null)
    setNumValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.1.1')}</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>string()</h3>
          <div className="form-group">
            <input
              value={strInput}
              onChange={(e) => setStrInput(e.target.value)}
              placeholder="Enter a string"
            />
          </div>
          <button onClick={validateString}>Validate String</button>
          {/* TODO: Покажите strResult в цветном блоке (зелёный/красный) */}
          {/* TODO: Show strResult in colored block (green/red) */}
        </div>

        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>number()</h3>
          <div className="form-group">
            <input
              value={numInput}
              onChange={(e) => setNumInput(e.target.value)}
              placeholder="Enter a number"
            />
          </div>
          <button onClick={validateNumber}>Validate Number</button>
          {/* TODO: Покажите numResult в цветном блоке (зелёный/красный) */}
          {/* TODO: Show numResult in colored block (green/red) */}
        </div>
      </div>
    </div>
  )
}
