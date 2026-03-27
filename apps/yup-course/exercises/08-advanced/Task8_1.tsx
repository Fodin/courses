import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 8.1: ref() и context — кросс-валидация полей
// Task 8.1: ref() and context — cross-field validation
// ============================================

// TODO: Создайте passwordFormSchema — yup.object({
//   password: yup.string().required().min(8),
//   confirmPassword: yup.string().required()
//     .oneOf([yup.ref('password')], 'Passwords must match'),
//   minPrice: yup.number().required().min(0),
//   maxPrice: yup.number().required()
//     .moreThan(yup.ref('minPrice'), 'Max must be greater than min'),
//   discount: yup.number().required().min(0)
//     .max(yup.ref('$maxDiscount'), 'Discount exceeds maximum allowed: ${max}%'),
// })
// TODO: Create passwordFormSchema with ref() and context ($maxDiscount)

export function Task8_1() {
  const { t } = useLanguage()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [minPrice, setMinPrice] = useState('10')
  const [maxPrice, setMaxPrice] = useState('100')
  const [discount, setDiscount] = useState('15')
  const [maxDiscount, setMaxDiscount] = useState('20')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    // TODO: Валидируйте данные через passwordFormSchema.validate(
    //   { password, confirmPassword, minPrice: Number(minPrice), ... },
    //   { abortEarly: false, context: { maxDiscount: Number(maxDiscount) } }
    // )
    // При успехе: setResult(JSON.stringify(data)) + setIsValid(true)
    // При ошибке: setResult(err.errors.join('\n')) + setIsValid(false)
    // TODO: Validate with passwordFormSchema, pass context: { maxDiscount }
    console.log('Validate:', { password, confirmPassword, minPrice, maxPrice, discount, maxDiscount })
    setResult(null)
    setIsValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.8.1')}</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Password ref</h3>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="MyPass123" />
          </div>
          <div className="form-group">
            <label>Confirm password:</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="MyPass123" />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Price range ref</h3>
          <div className="form-group">
            <label>Min price:</label>
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Max price (must be &gt; min):</label>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Context ($maxDiscount)</h3>
          <div className="form-group">
            <label>Max allowed discount (context):</label>
            <input type="number" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Your discount:</label>
            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          </div>
        </div>
      </div>

      <button onClick={validate}>Validate All</button>
      {/* TODO: Покажите result в цветном блоке (зелёный/красный) */}
      {/* TODO: Show result in colored block (green/red) */}
    </div>
  )
}
