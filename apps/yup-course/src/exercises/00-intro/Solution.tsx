import { useState } from 'react'
import * as yup from 'yup'

// ============================================
// Task 0.1: First Schema — Solution
// ============================================

const userSchema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup.number().required('Age is required').positive('Age must be positive'),
  email: yup.string().email('Invalid email').required('Email is required'),
})

type UserData = yup.InferType<typeof userSchema>

export function Task0_1_Solution() {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const handleValidate = async () => {
    try {
      const data: unknown = {
        name: name || undefined,
        age: age ? Number(age) : undefined,
        email: email || undefined,
      }

      const validated: UserData = await userSchema.validate(data, { abortEarly: false })
      setResult(JSON.stringify(validated, null, 2))
      setIsValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setResult(err.errors.join('\n'))
        setIsValid(false)
      }
    }
  }

  const handleClear = () => {
    setName('')
    setAge('')
    setEmail('')
    setResult(null)
    setIsValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>Первая схема</h2>

      <div style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
          />
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
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleValidate}>Validate</button>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>

      {result && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: isValid ? '#e8f5e9' : '#ffebee',
            borderRadius: '8px',
            border: `1px solid ${isValid ? '#4caf50' : '#f44336'}`,
          }}
        >
          <h3>{isValid ? 'Validated data:' : 'Validation errors:'}</h3>
          <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{result}</pre>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 0.2: Error Handling — Solution
// ============================================

const registrationSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

interface FieldError {
  path: string
  message: string
}

export function Task0_2_Solution() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldError[]>([])
  const [successData, setSuccessData] = useState<string | null>(null)

  const handleValidate = async () => {
    setErrors([])
    setSuccessData(null)

    try {
      const data = {
        username: username || undefined,
        email: email || undefined,
        password: password || undefined,
      }

      const validated = await registrationSchema.validate(data, { abortEarly: false })
      setSuccessData(JSON.stringify(validated, null, 2))
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const fieldErrors: FieldError[] = err.inner.map((e) => ({
          path: e.path || 'unknown',
          message: e.message,
        }))
        setErrors(fieldErrors)
      }
    }
  }

  const getFieldError = (field: string) => {
    return errors.find((e) => e.path === field)?.message
  }

  const handleClear = () => {
    setUsername('')
    setEmail('')
    setPassword('')
    setErrors([])
    setSuccessData(null)
  }

  return (
    <div className="exercise-container">
      <h2>Обработка ошибок</h2>

      <div style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            style={getFieldError('username') ? { borderColor: '#f44336' } : undefined}
          />
          {getFieldError('username') && (
            <span style={{ color: '#f44336', fontSize: '0.85rem' }}>
              {getFieldError('username')}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            style={getFieldError('email') ? { borderColor: '#f44336' } : undefined}
          />
          {getFieldError('email') && (
            <span style={{ color: '#f44336', fontSize: '0.85rem' }}>
              {getFieldError('email')}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={getFieldError('password') ? { borderColor: '#f44336' } : undefined}
          />
          {getFieldError('password') && (
            <span style={{ color: '#f44336', fontSize: '0.85rem' }}>
              {getFieldError('password')}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleValidate}>Validate</button>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#ffebee',
            borderRadius: '8px',
            border: '1px solid #f44336',
          }}
        >
          <h3>All errors ({errors.length}):</h3>
          <ul style={{ marginTop: '0.5rem' }}>
            {errors.map((err, i) => (
              <li key={i}>
                <strong>{err.path}</strong>: {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {successData && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#e8f5e9',
            borderRadius: '8px',
            border: '1px solid #4caf50',
          }}
        >
          <h3>Validation passed!</h3>
          <pre style={{ marginTop: '0.5rem' }}>{successData}</pre>
        </div>
      )}
    </div>
  )
}
