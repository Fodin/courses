import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 2.1: email и url
// Task 2.1: email and url
// ============================================

// TODO: Создайте emailSchema — yup.string().required().email() с кастомными сообщениями
// TODO: Create emailSchema — yup.string().required().email() with custom messages

// TODO: Создайте urlSchema — yup.string().required().url() с кастомными сообщениями
// TODO: Create urlSchema — yup.string().required().url() with custom messages

export function Task2_1() {
  const { t } = useLanguage()
  const [emailInput, setEmailInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [emailResult, setEmailResult] = useState<string | null>(null)
  const [urlResult, setUrlResult] = useState<string | null>(null)
  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const [urlValid, setUrlValid] = useState<boolean | null>(null)

  const validateEmail = async () => {
    // TODO: Валидируйте emailInput через emailSchema.validate()
    //   - Передайте undefined если поле пустое
    //   - При успехе: покажите результат
    //   - При ошибке: покажите сообщение
    // TODO: Validate emailInput via emailSchema.validate()
    //   - Pass undefined if empty
    //   - On success: show result
    //   - On error: show message
    console.log('Validate email:', emailInput)
    setEmailResult(null)
    setEmailValid(null)
  }

  const validateUrl = async () => {
    // TODO: Валидируйте urlInput через urlSchema.validate()
    // TODO: Validate urlInput via urlSchema.validate()
    console.log('Validate url:', urlInput)
    setUrlResult(null)
    setUrlValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.2.1')}</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>string().email()</h3>
          <div className="form-group">
            <input
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <button onClick={validateEmail}>Validate Email</button>
          {/* TODO: Покажите emailResult в цветном блоке */}
          {/* TODO: Show emailResult in colored block */}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>string().url()</h3>
          <div className="form-group">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <button onClick={validateUrl}>Validate URL</button>
          {/* TODO: Покажите urlResult в цветном блоке */}
          {/* TODO: Show urlResult in colored block */}
        </div>
      </div>
    </div>
  )
}
