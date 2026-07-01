import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 2.2: min, max, length
// Task 2.2: min, max, length
// ============================================

// TODO: Создайте usernameSchema — yup.string().required().min(3).max(20) с кастомными сообщениями
// TODO: Create usernameSchema — yup.string().required().min(3).max(20) with custom messages

// TODO: Создайте pinSchema — yup.string().required().length(4) с кастомным сообщением
// TODO: Create pinSchema — yup.string().required().length(4) with custom message

export function Task2_2() {
  const { t } = useLanguage()
  const [usernameInput, setUsernameInput] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [usernameResult, setUsernameResult] = useState<string | null>(null)
  const [pinResult, setPinResult] = useState<string | null>(null)
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null)
  const [pinValid, setPinValid] = useState<boolean | null>(null)

  const validateUsername = async () => {
    // TODO: Валидируйте usernameInput через usernameSchema.validate()
    //   - При успехе: покажите значение и его length
    //   - При ошибке: покажите сообщение
    // TODO: Validate usernameInput via usernameSchema.validate()
    //   - On success: show value and its length
    //   - On error: show message
    console.log('Validate username:', usernameInput)
    setUsernameResult(null)
    setUsernameValid(null)
  }

  const validatePin = async () => {
    // TODO: Валидируйте pinInput через pinSchema.validate()
    // TODO: Validate pinInput via pinSchema.validate()
    console.log('Validate pin:', pinInput)
    setPinResult(null)
    setPinValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.2.2')}</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>min() + max()</h3>
          <div className="form-group">
            <input
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter username (3-20 chars)"
            />
            <span style={{ fontSize: '0.8rem', color: '#999' }}>
              Length: {usernameInput.length}
            </span>
          </div>
          <button onClick={validateUsername}>Validate Username</button>
          {/* TODO: Покажите usernameResult в цветном блоке */}
          {/* TODO: Show usernameResult in colored block */}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>length()</h3>
          <div className="form-group">
            <input
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter 4-digit PIN"
              maxLength={6}
            />
            <span style={{ fontSize: '0.8rem', color: '#999' }}>
              Length: {pinInput.length}
            </span>
          </div>
          <button onClick={validatePin}>Validate PIN</button>
          {/* TODO: Покажите pinResult в цветном блоке */}
          {/* TODO: Show pinResult in colored block */}
        </div>
      </div>
    </div>
  )
}
