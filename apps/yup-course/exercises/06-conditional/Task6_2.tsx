import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 6.2: when() — is/then/otherwise
// Task 6.2: when() — is/then/otherwise
// ============================================

// TODO: Создайте paymentSchema — yup.object с полями:
//   - paymentMethod: string().oneOf(['card', 'bank', 'cash']).required()
//   - cardNumber: string().when('paymentMethod', {
//       is: 'card',
//       then: (schema) => schema.required().matches(/^\d{16}$/, '16 digits'),
//       otherwise: (schema) => schema.optional()
//     })
//   - bankAccount: string().when('paymentMethod', {
//       is: 'bank',
//       then: (schema) => schema.required().min(10),
//       otherwise: (schema) => schema.optional()
//     })
// TODO: Create paymentSchema — yup.object with fields:
//   - paymentMethod: string().oneOf(['card', 'bank', 'cash']).required()
//   - cardNumber: string().when('paymentMethod', { is: 'card', then: required + 16 digits })
//   - bankAccount: string().when('paymentMethod', { is: 'bank', then: required + min(10) })

export function Task6_2() {
  const { t } = useLanguage()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    // TODO: Валидируйте { paymentMethod, cardNumber, bankAccount }
    //   - Пустые строки → undefined
    //   - abortEarly: false
    //   - Покажите результат или ошибки
    // TODO: Validate { paymentMethod, cardNumber, bankAccount }
    console.log('Validate:', { paymentMethod, cardNumber, bankAccount })
    setResult(null)
    setIsValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.6.2')}</h2>

      <div className="form-group">
        <label>Payment method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
        >
          <option value="card">Credit Card</option>
          <option value="bank">Bank Transfer</option>
          <option value="cash">Cash</option>
        </select>
      </div>

      {paymentMethod === 'card' && (
        <div className="form-group">
          <label>Card number (16 digits):</label>
          <input
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234567890123456"
          />
        </div>
      )}

      {paymentMethod === 'bank' && (
        <div className="form-group">
          <label>Bank account:</label>
          <input
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            placeholder="IBAN or account number"
          />
        </div>
      )}

      {paymentMethod === 'cash' && (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No additional details needed for cash payment.</p>
      )}

      <button onClick={validate}>Validate</button>
      {/* TODO: Покажите result в цветном блоке */}
      {/* TODO: Show result in colored block */}
    </div>
  )
}
