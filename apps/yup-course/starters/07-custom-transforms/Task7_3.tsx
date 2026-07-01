import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 7.3: addMethod()
// Task 7.3: addMethod()
// ============================================

// TODO: Расширьте TypeScript интерфейс:
// declare module 'yup' {
//   interface StringSchema {
//     phone(message?: string): this
//     noSpaces(message?: string): this
//   }
// }
// TODO: Extend Yup's TypeScript interface with declare module

// TODO: Создайте метод phone():
// yup.addMethod(yup.string, 'phone', function (message = 'Invalid phone number') {
//   return this
//     .transform((value) => value?.replace(/\D/g, ''))
//     .test('phone', message, (value) => !value || /^\d{10,11}$/.test(value))
// })
// TODO: Create phone() method with addMethod — transform + test

// TODO: Создайте метод noSpaces():
// yup.addMethod(yup.string, 'noSpaces', function (message = 'Must not contain spaces') {
//   return this.test('no-spaces', message, (value) => !value || !value.includes(' '))
// })
// TODO: Create noSpaces() method with addMethod — test only

// TODO: Создайте userSchema используя кастомные методы:
// const userSchema = yup.object({
//   username: yup.string().required().noSpaces().min(3).max(20),
//   phone: yup.string().required().phone(),
// })
// TODO: Create userSchema using custom .phone() and .noSpaces() methods

export function Task7_3() {
  const { t } = useLanguage()
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    // TODO: Валидируйте { username, phone } через userSchema
    //   - Пустые строки → undefined
    //   - abortEarly: false
    // TODO: Validate { username, phone } with userSchema
    console.log('Validate:', { username, phone })
    setResult(null)
    setIsValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.7.3')}</h2>
      <p style={{ fontSize: '0.85rem', color: '#666' }}>
        Custom methods: <code>.noSpaces()</code> and <code>.phone()</code>
      </p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div className="form-group">
            <label>Username (noSpaces, 3-20 chars):</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
            />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div className="form-group">
            <label>Phone (custom .phone() method):</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
            />
          </div>
        </div>
      </div>

      <button onClick={validate}>Validate</button>
      {/* TODO: Покажите result в цветном блоке */}
      {/* TODO: Show result in colored block */}
    </div>
  )
}
