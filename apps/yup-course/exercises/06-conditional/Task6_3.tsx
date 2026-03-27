import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 6.3: when() — несколько полей
// Task 6.3: when() — multiple fields
// ============================================

// TODO: Создайте shippingSchema — yup.object с полями:
//   - country: string().required()
//   - deliveryType: string().oneOf(['pickup', 'courier', 'post']).required()
//   - address: string().when(['country', 'deliveryType'], ([country, delivery], schema) => {
//       courier → required; post + US → required; else → optional
//     })
//   - zipCode: string().when(['country', 'deliveryType'], ([country, delivery], schema) => {
//       pickup → optional; US → required + /^\d{5}$/; UK → required + UK format; else → optional
//     })
// TODO: Create shippingSchema — yup.object with fields:
//   - country, deliveryType, address (conditional), zipCode (conditional)
//   - Use functional when() with array destructuring: ([country, delivery], schema) => ...

export function Task6_3() {
  const { t } = useLanguage()
  const [country, setCountry] = useState('US')
  const [deliveryType, setDeliveryType] = useState('courier')
  const [address, setAddress] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    // TODO: Валидируйте { country, deliveryType, address, zipCode }
    //   - Пустые строки → undefined
    //   - abortEarly: false
    // TODO: Validate { country, deliveryType, address, zipCode }
    console.log('Validate:', { country, deliveryType, address, zipCode })
    setResult(null)
    setIsValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.6.3')}</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label>Country:</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
          >
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="DE">Germany</option>
          </select>
        </div>

        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label>Delivery type:</label>
          <select
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
          >
            <option value="pickup">Pickup</option>
            <option value="courier">Courier</option>
            <option value="post">Post</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Address:</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main St"
        />
      </div>

      <div className="form-group">
        <label>Zip / Post code:</label>
        <input
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder={country === 'US' ? '12345' : country === 'UK' ? 'SW1A 1AA' : 'Optional'}
        />
      </div>

      <button onClick={validate}>Validate</button>
      {/* TODO: Покажите result в цветном блоке */}
      {/* TODO: Show result in colored block */}
    </div>
  )
}
