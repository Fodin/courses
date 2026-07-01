import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 7.1: test() — кастомная валидация
// Task 7.1: test() — custom validation
// ============================================

// TODO: Создайте passwordSchema — yup.string()
//   .required('Password is required')
//   .min(8, 'At least 8 characters')
//   .test('has-uppercase', 'Must contain uppercase letter', ...)
//   .test('has-lowercase', 'Must contain lowercase letter', ...)
//   .test('has-digit', 'Must contain digit', ...)
//   Подсказка: в валидаторе проверяйте !value || /regex/.test(value)
// TODO: Create passwordSchema with three .test() calls for uppercase, lowercase, digit

// TODO: Создайте usernameSchema — yup.string()
//   .required().min(3)
//   .test('unique-username', 'Username is already taken', async (value) => {
//     if (!value) return true
//     await new Promise(resolve => setTimeout(resolve, 500))
//     const taken = ['admin', 'root', 'test', 'user']
//     return !taken.includes(value.toLowerCase())
//   })
// TODO: Create usernameSchema with async .test() for uniqueness check

export function Task7_1() {
  const { t } = useLanguage()
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [passwordResult, setPasswordResult] = useState<string | null>(null)
  const [usernameResult, setUsernameResult] = useState<string | null>(null)
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null)
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const validatePassword = async () => {
    // TODO: Валидируйте password через passwordSchema
    //   - Используйте abortEarly: false для показа всех ошибок
    //   - При успехе: setPasswordResult + setPasswordValid(true)
    //   - При ошибке: setPasswordResult(err.errors.join('; '))
    // TODO: Validate password with passwordSchema, abortEarly: false
    console.log('Validate password:', password)
    setPasswordResult(null)
    setPasswordValid(null)
  }

  const validateUsername = async () => {
    // TODO: setLoading(true), валидируйте username через usernameSchema
    //   - Это async — дождитесь результата
    //   - В finally: setLoading(false)
    // TODO: Validate username with usernameSchema (async test)
    console.log('Check username:', username)
    setUsernameResult(null)
    setUsernameValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.7.1')}</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Password (sync tests)</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Must have: 8+ chars, uppercase, lowercase, digit
          </p>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="MyPass123"
            />
          </div>
          <button onClick={validatePassword}>Validate Password</button>
          {/* TODO: Покажите passwordResult в цветном блоке */}
          {/* TODO: Show passwordResult in colored block */}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Username (async test)</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Taken: admin, root, test, user
          </p>
          <div className="form-group">
            <label>Username:</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
            />
          </div>
          <button onClick={validateUsername} disabled={loading}>
            {loading ? 'Checking...' : 'Check Username'}
          </button>
          {/* TODO: Покажите usernameResult в цветном блоке */}
          {/* TODO: Show usernameResult in colored block */}
        </div>
      </div>
    </div>
  )
}
