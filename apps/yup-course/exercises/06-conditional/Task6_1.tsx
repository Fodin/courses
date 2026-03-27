import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 6.1: when() — базовое использование
// Task 6.1: when() — basic usage
// ============================================

// TODO: Создайте accountSchema — yup.object с полями:
//   - isBusiness: boolean().required()
//   - companyName: string().when('isBusiness', { is: true, then: required, otherwise: optional })
//   - personalName: string().when('isBusiness', { is: false, then: required, otherwise: optional })
// TODO: Create accountSchema — yup.object with fields:
//   - isBusiness: boolean().required()
//   - companyName: string().when('isBusiness', { is: true, then: required, otherwise: optional })
//   - personalName: string().when('isBusiness', { is: false, then: required, otherwise: optional })

export function Task6_1() {
  const { t } = useLanguage()
  const [isBusiness, setIsBusiness] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [personalName, setPersonalName] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    // TODO: Валидируйте { isBusiness, companyName, personalName } через accountSchema
    //   - Пустые строки передайте как undefined
    //   - Используйте abortEarly: false
    //   - При успехе: setResult(JSON.stringify(data)) + setIsValid(true)
    //   - При ошибке: setResult(err.errors.join('; ')) + setIsValid(false)
    // TODO: Validate { isBusiness, companyName, personalName } with accountSchema
    //   - Pass empty strings as undefined
    //   - Use abortEarly: false
    //   - On success: setResult(JSON.stringify(data)) + setIsValid(true)
    //   - On error: setResult(err.errors.join('; ')) + setIsValid(false)
    console.log('Validate:', { isBusiness, companyName, personalName })
    setResult(null)
    setIsValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.6.1')}</h2>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={isBusiness}
            onChange={(e) => setIsBusiness(e.target.checked)}
          />{' '}
          Business account
        </label>
      </div>

      {isBusiness ? (
        <div className="form-group">
          <label>Company name:</label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Inc"
          />
        </div>
      ) : (
        <div className="form-group">
          <label>Personal name:</label>
          <input
            value={personalName}
            onChange={(e) => setPersonalName(e.target.value)}
            placeholder="John Doe"
          />
        </div>
      )}

      <button onClick={validate}>Validate</button>
      {/* TODO: Покажите result в цветном блоке (зелёный/красный по isValid) */}
      {/* TODO: Show result in colored block (green/red based on isValid) */}
    </div>
  )
}
