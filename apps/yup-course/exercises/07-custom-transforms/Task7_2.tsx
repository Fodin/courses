import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 7.2: transform()
// Task 7.2: transform()
// ============================================

// TODO: Создайте contactSchema — yup.object({
//   email: yup.string()
//     .transform((value) => value?.trim().toLowerCase())
//     .email('Invalid email')
//     .required('Email required'),
//   phone: yup.string()
//     .transform((value) => value?.replace(/\D/g, ''))
//     .matches(/^\d{10,11}$/, 'Phone must be 10-11 digits')
//     .required('Phone required'),
//   name: yup.string()
//     .transform((value) => value?.trim().replace(/\s+/g, ' '))
//     .required('Name required')
//     .min(2, 'At least 2 characters'),
// })
// TODO: Create contactSchema with transforms for email, phone, name

export function Task7_2() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('  USER@EXAMPLE.COM  ')
  const [phone, setPhone] = useState('+7 (999) 123-45-67')
  const [name, setName] = useState('  John    Doe  ')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    // TODO: Валидируйте { email, phone, name } через contactSchema
    //   - abortEarly: false
    //   - Покажите трансформированные данные при успехе
    // TODO: Validate with contactSchema
    console.log('Validate:', { email, phone, name })
    setResult(null)
    setIsValid(null)
  }

  const castOnly = () => {
    // TODO: Используйте contactSchema.cast({ email, phone, name })
    //   - Покажите результат cast (только трансформация, без валидации)
    // TODO: Use contactSchema.cast() to show transformed data
    console.log('Cast:', { email, phone, name })
    setResult(null)
    setIsValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.7.2')}</h2>

      <div className="form-group">
        <label>Email (will trim + lowercase):</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Phone (will strip non-digits):</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Name (will trim + normalize spaces):</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={validate}>Validate</button>
        <button onClick={castOnly} style={{ background: '#1976d2' }}>Cast Only</button>
      </div>

      {/* TODO: Покажите result в цветном блоке с whiteSpace: 'pre-wrap' */}
      {/* TODO: Show result in colored block with whiteSpace: 'pre-wrap' */}
    </div>
  )
}
