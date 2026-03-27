import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 0.2: Обработка ошибок
// Task 0.2: Error Handling
// ============================================

// TODO: Создайте схему registrationSchema с полями:
//   - username: обязательная строка, минимум 3 символа
//   - email: обязательная строка в формате email
//   - password: обязательная строка, минимум 6 символов
// TODO: Create registrationSchema with fields:
//   - username: required string, min 3 characters
//   - email: required email string
//   - password: required string, min 6 characters

// TODO: Определите интерфейс FieldError с полями path и message
// TODO: Define FieldError interface with path and message fields

export function Task0_2() {
  const { t } = useLanguage()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Array<{ path: string; message: string }>>([])
  const [successData, setSuccessData] = useState<string | null>(null)

  const handleValidate = async () => {
    setErrors([])
    setSuccessData(null)

    // TODO: Валидируйте данные через registrationSchema.validate()
    //   - Используйте { abortEarly: false }
    //   - Проверьте instanceof yup.ValidationError
    //   - Извлеките ошибки из err.inner (path и message)
    //   - Сохраните ошибки в состояние errors
    //   - При успехе сохраните данные в successData
    // TODO: Validate data via registrationSchema.validate()
    //   - Use { abortEarly: false }
    //   - Check instanceof yup.ValidationError
    //   - Extract errors from err.inner (path and message)
    //   - Save errors to errors state
    //   - On success save data to successData
    console.log('Validate:', { username, email, password })
  }

  // TODO: Создайте функцию getFieldError(field) для получения ошибки конкретного поля
  // TODO: Create getFieldError(field) function to get error for a specific field

  return (
    <div className="exercise-container">
      <h2>{t('task.0.2')}</h2>

      <div style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          {/* TODO: Покажите ошибку поля username под инпутом */}
          {/* TODO: Show username field error below input */}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
          {/* TODO: Покажите ошибку поля email под инпутом */}
          {/* TODO: Show email field error below input */}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          {/* TODO: Покажите ошибку поля password под инпутом */}
          {/* TODO: Show password field error below input */}
        </div>

        <button onClick={handleValidate}>Validate</button>
      </div>

      {/* TODO: Покажите общий список всех ошибок в красном блоке */}
      {/* TODO: Show all errors summary in a red block */}

      {/* TODO: Покажите валидированные данные в зелёном блоке при успехе */}
      {/* TODO: Show validated data in a green block on success */}
    </div>
  )
}
