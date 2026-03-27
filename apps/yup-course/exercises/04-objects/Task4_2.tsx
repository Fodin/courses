import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 4.2: Вложенные объекты
// Task 4.2: Nested Objects
// ============================================

// TODO: Создайте profileSchema — yup.object() с вложенными объектами:
//   - user: yup.object({ firstName: string().required(), lastName: string().required() })
//   - address: yup.object({ city: string().required(), zipCode: string().required().matches(/^\d{5,6}$/), country: string().required() })
// TODO: Create profileSchema — yup.object() with nested objects:
//   - user: yup.object({ firstName, lastName })
//   - address: yup.object({ city, zipCode, country })

export function Task4_2() {
  const { t } = useLanguage()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)

  const validate = async () => {
    // TODO: Соберите вложенный объект:
    //   { user: { firstName, lastName }, address: { city, zipCode, country } }
    //   Пустые строки замените на undefined
    // TODO: Build nested object, replace empty strings with undefined

    // TODO: Валидируйте через profileSchema.validate(data, { abortEarly: false })
    //   - При успехе: покажите JSON
    //   - При ошибке: используйте err.inner для показа path: message
    // TODO: Validate via profileSchema.validate(data, { abortEarly: false })
    //   - On success: show JSON
    //   - On error: use err.inner to show path: message
    console.log('Validate profile')
    setResult(null)
    setValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.4.2')}</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>User</h3>
          <div className="form-group">
            <label>First Name:</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>Address</h3>
          <div className="form-group">
            <label>City:</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Moscow" />
          </div>
          <div className="form-group">
            <label>Zip Code:</label>
            <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="123456" />
          </div>
          <div className="form-group">
            <label>Country:</label>
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Russia" />
          </div>
        </div>
      </div>

      <button onClick={validate}>Validate Profile</button>

      {/* TODO: Покажите result в <pre> блоке с цветным фоном */}
      {/* TODO: Show result in <pre> block with colored background */}
    </div>
  )
}
