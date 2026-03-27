import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'
// import type { InferType } from 'yup'

// ============================================
// Задание 8.4: Финальный проект — форма регистрации
// Task 8.4: Final Project — Registration Form
// ============================================

// TODO: Создайте registrationFormSchema — комплексную схему:
//
// Персональные данные:
//   firstName: transform(trim) → required → min(2)
//   lastName: transform(trim) → required → min(2)
//   email: transform(trim + toLowerCase) → email → required
//   password: required → min(8) → test('strong', ...) — uppercase, lowercase, digit
//   confirmPassword: required → oneOf([yup.ref('password')])
//
// Тип аккаунта:
//   accountType: oneOf(['personal', 'business'] as const) → required
//   companyName: when('accountType', { is: 'business', then: required })
//
// Адрес (вложенный объект):
//   address: yup.object({
//     street: required, city: required, country: required,
//     zipCode: when('country', { is: 'US', then: required + matches(/^\d{5}$/) })
//   })
//
// Предпочтения:
//   newsletter: boolean → default(false)
//   interests: array → when('newsletter', { is: true, then: min(1) })
//   acceptTerms: boolean → oneOf([true], 'You must accept the terms')
//
// TODO: Create registrationFormSchema combining all Yup techniques

// TODO: type RegistrationForm = InferType<typeof registrationFormSchema>

export function Task8_4() {
  const { t } = useLanguage()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'personal',
    companyName: '',
    street: '',
    city: '',
    country: 'US',
    zipCode: '',
    newsletter: false,
    interests: [] as string[],
    acceptTerms: false,
  })
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const update = (field: string, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const validate = async () => {
    // TODO: Соберите данные из form в формат схемы:
    //   - address: { street, city, country, zipCode }
    //   - Пустые строки → undefined
    //   - Валидируйте через registrationFormSchema.validate(data, { abortEarly: false })
    // TODO: Build data object from form state and validate with registrationFormSchema
    console.log('Validate registration:', form)
    setResult(null)
    setIsValid(null)
  }

  const allInterests = ['Technology', 'Science', 'Arts', 'Sports', 'Music']

  return (
    <div className="exercise-container">
      <h2>{t('task.8.4')}</h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Column 1: Personal */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>Personal Info</h3>
          <div className="form-group">
            <label>First name:</label>
            <input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="John" />
          </div>
          <div className="form-group">
            <label>Last name:</label>
            <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Doe" />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="MyPass123" />
          </div>
          <div className="form-group">
            <label>Confirm password:</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="MyPass123" />
          </div>
        </div>

        {/* Column 2: Account + Address */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>Account & Address</h3>
          <div className="form-group">
            <label>Account type:</label>
            <select value={form.accountType} onChange={(e) => update('accountType', e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}>
              <option value="personal">Personal</option>
              <option value="business">Business</option>
            </select>
          </div>
          {form.accountType === 'business' && (
            <div className="form-group">
              <label>Company name:</label>
              <input value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="Acme Inc" />
            </div>
          )}
          <div className="form-group">
            <label>Street:</label>
            <input value={form.street} onChange={(e) => update('street', e.target.value)} placeholder="123 Main St" />
          </div>
          <div className="form-group">
            <label>City:</label>
            <input value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="New York" />
          </div>
          <div className="form-group">
            <label>Country:</label>
            <select value={form.country} onChange={(e) => update('country', e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="DE">Germany</option>
            </select>
          </div>
          {form.country === 'US' && (
            <div className="form-group">
              <label>Zip code (5 digits):</label>
              <input value={form.zipCode} onChange={(e) => update('zipCode', e.target.value)} placeholder="10001" />
            </div>
          )}
        </div>

        {/* Column 3: Preferences */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>Preferences</h3>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={form.newsletter} onChange={(e) => update('newsletter', e.target.checked)} />{' '}
              Subscribe to newsletter
            </label>
          </div>
          {form.newsletter && (
            <div className="form-group">
              <label>Interests (select at least 1):</label>
              {allInterests.map((interest) => (
                <label key={interest} style={{ display: 'block', margin: '0.25rem 0' }}>
                  <input
                    type="checkbox"
                    checked={form.interests.includes(interest)}
                    onChange={() => toggleInterest(interest)}
                  />{' '}
                  {interest}
                </label>
              ))}
            </div>
          )}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>
              <input type="checkbox" checked={form.acceptTerms} onChange={(e) => update('acceptTerms', e.target.checked)} />{' '}
              I accept the terms and conditions
            </label>
          </div>
        </div>
      </div>

      <button onClick={validate} style={{ marginTop: '1rem', fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
        Register
      </button>
      {/* TODO: Покажите result в цветном блоке с maxHeight и overflow */}
      {/* TODO: Show result in colored block with maxHeight and overflow */}
    </div>
  )
}
