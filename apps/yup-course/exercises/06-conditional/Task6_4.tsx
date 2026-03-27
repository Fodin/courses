import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 6.4: when() — вложенные условия
// Task 6.4: when() — nested conditions
// ============================================

// TODO: Создайте registrationSchema — yup.object с полями:
//   - accountType: string().oneOf(['personal', 'business']).required()
//   - country: string().required()
//   - age: number().when('accountType', { is: 'personal', then: required + min(13) })
//   - companyName: string().when('accountType', { is: 'business', then: required })
//   - taxId: string()
//       .when('accountType', { is: 'business', then: required })
//       .when(['accountType', 'country'], ... format check by country)
//   - parentConsent: boolean()
//       .when(['accountType', 'age'], ... must be true if personal + age < 18)
// TODO: Create registrationSchema — yup.object with:
//   - taxId: TWO .when() calls — first for required, second for format by country
//   - parentConsent: .when(['accountType', 'age'], ...) — required true for minors

export function Task6_4() {
  const { t } = useLanguage()
  const [accountType, setAccountType] = useState('personal')
  const [country, setCountry] = useState('US')
  const [age, setAge] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [taxId, setTaxId] = useState('')
  const [parentConsent, setParentConsent] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    // TODO: Валидируйте все поля через registrationSchema
    //   - age: Number(age) или undefined
    //   - Пустые строки → undefined
    //   - abortEarly: false
    // TODO: Validate all fields with registrationSchema
    console.log('Validate:', { accountType, country, age, companyName, taxId, parentConsent })
    setResult(null)
    setIsValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.6.4')}</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label>Account type:</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
          >
            <option value="personal">Personal</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label>Country:</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
          >
            <option value="US">United States</option>
            <option value="DE">Germany</option>
            <option value="RU">Russia</option>
          </select>
        </div>
      </div>

      {accountType === 'personal' && (
        <>
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
            />
          </div>
          {age && Number(age) < 18 && (
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={parentConsent}
                  onChange={(e) => setParentConsent(e.target.checked)}
                />{' '}
                Parent/guardian consent
              </label>
            </div>
          )}
        </>
      )}

      {accountType === 'business' && (
        <>
          <div className="form-group">
            <label>Company name:</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Inc"
            />
          </div>
          <div className="form-group">
            <label>Tax ID ({country === 'US' ? 'EIN: XX-XXXXXXX' : country === 'DE' ? 'VAT: DEXXXXXXXXX' : 'any format'}):</label>
            <input
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              placeholder={country === 'US' ? '12-3456789' : country === 'DE' ? 'DE123456789' : 'Tax ID'}
            />
          </div>
        </>
      )}

      <button onClick={validate}>Validate</button>
      {/* TODO: Покажите result в цветном блоке */}
      {/* TODO: Show result in colored block */}
    </div>
  )
}
