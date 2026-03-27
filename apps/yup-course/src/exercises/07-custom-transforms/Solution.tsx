import { useState } from 'react'
import * as yup from 'yup'

// ============================================
// Task 7.1: test() — custom validation — Solution
// ============================================

const passwordSchema = yup.string()
  .required('Password is required')
  .min(8, 'At least 8 characters')
  .test(
    'has-uppercase',
    'Must contain at least one uppercase letter',
    (value) => !value || /[A-Z]/.test(value)
  )
  .test(
    'has-lowercase',
    'Must contain at least one lowercase letter',
    (value) => !value || /[a-z]/.test(value)
  )
  .test(
    'has-digit',
    'Must contain at least one digit',
    (value) => !value || /\d/.test(value)
  )

const usernameSchema = yup.string()
  .required('Username is required')
  .min(3, 'At least 3 characters')
  .test(
    'unique-username',
    'Username is already taken',
    async (value) => {
      if (!value) return true
      // Simulate API check
      await new Promise((resolve) => setTimeout(resolve, 500))
      const taken = ['admin', 'root', 'test', 'user']
      return !taken.includes(value.toLowerCase())
    }
  )

export function Task7_1_Solution() {
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [passwordResult, setPasswordResult] = useState<string | null>(null)
  const [usernameResult, setUsernameResult] = useState<string | null>(null)
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null)
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const validatePassword = async () => {
    try {
      const result = await passwordSchema.validate(password || undefined, { abortEarly: false })
      setPasswordResult(`Valid password: ${result}`)
      setPasswordValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setPasswordResult(`Errors: ${err.errors.join('; ')}`)
        setPasswordValid(false)
      }
    }
  }

  const validateUsername = async () => {
    setLoading(true)
    try {
      const result = await usernameSchema.validate(username || undefined)
      setUsernameResult(`Username "${result}" is available!`)
      setUsernameValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setUsernameResult(`Error: ${err.message}`)
        setUsernameValid(false)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="exercise-container">
      <h2>test() — custom validation</h2>

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
          {passwordResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: passwordValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {passwordResult}
            </div>
          )}
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
          {usernameResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: usernameValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {usernameResult}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 7.2: transform() — Solution
// ============================================

const contactSchema = yup.object({
  email: yup.string()
    .transform((value) => value?.trim().toLowerCase())
    .email('Invalid email')
    .required('Email required'),
  phone: yup.string()
    .transform((value) => value?.replace(/\D/g, ''))
    .matches(/^\d{10,11}$/, 'Phone must be 10-11 digits')
    .required('Phone required'),
  name: yup.string()
    .transform((value) => value?.trim().replace(/\s+/g, ' '))
    .required('Name required')
    .min(2, 'At least 2 characters'),
})

export function Task7_2_Solution() {
  const [email, setEmail] = useState('  USER@EXAMPLE.COM  ')
  const [phone, setPhone] = useState('+7 (999) 123-45-67')
  const [name, setName] = useState('  John    Doe  ')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    try {
      const data = await contactSchema.validate({ email, phone, name }, { abortEarly: false })
      setResult(`Transformed & valid:\n${JSON.stringify(data, null, 2)}`)
      setIsValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setResult(`Errors: ${err.errors.join('; ')}`)
        setIsValid(false)
      }
    }
  }

  const castOnly = () => {
    try {
      const data = contactSchema.cast({ email, phone, name })
      setResult(`Cast (no validation):\n${JSON.stringify(data, null, 2)}`)
      setIsValid(true)
    } catch (err) {
      setResult(`Cast error: ${err}`)
      setIsValid(false)
    }
  }

  return (
    <div className="exercise-container">
      <h2>transform()</h2>

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

      {result && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem',
            background: isValid ? '#e8f5e9' : '#ffebee',
            borderRadius: '6px',
            fontSize: '0.9rem',
            whiteSpace: 'pre-wrap',
          }}
        >
          {result}
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 7.3: addMethod() — Solution
// ============================================

// Extend Yup's StringSchema
declare module 'yup' {
  interface StringSchema {
    phone(message?: string): this
    noSpaces(message?: string): this
  }
}

yup.addMethod(yup.string, 'phone', function (message = 'Invalid phone number') {
  return this
    .transform((value) => value?.replace(/\D/g, ''))
    .test('phone', message, (value) => !value || /^\d{10,11}$/.test(value))
})

yup.addMethod(yup.string, 'noSpaces', function (message = 'Must not contain spaces') {
  return this.test('no-spaces', message, (value) => !value || !value.includes(' '))
})

const userSchema = yup.object({
  username: yup.string().required().noSpaces().min(3).max(20),
  phone: yup.string().required().phone(),
})

export function Task7_3_Solution() {
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    try {
      const data = await userSchema.validate(
        { username: username || undefined, phone: phone || undefined },
        { abortEarly: false }
      )
      setResult(`Valid:\n${JSON.stringify(data, null, 2)}`)
      setIsValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setResult(`Errors: ${err.errors.join('; ')}`)
        setIsValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>addMethod()</h2>
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
      {result && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem',
            background: isValid ? '#e8f5e9' : '#ffebee',
            borderRadius: '6px',
            fontSize: '0.9rem',
            whiteSpace: 'pre-wrap',
          }}
        >
          {result}
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 7.4: Transform chains — Solution
// ============================================

const productSchema = yup.object({
  sku: yup.string()
    .transform((v) => v?.trim().toUpperCase())
    .transform((v) => v?.replace(/\s+/g, '-'))
    .test('sku-format', 'SKU must be like ABC-123', (v) => !v || /^[A-Z]+-\d+$/.test(v))
    .required('SKU required'),
  price: yup.string()
    .transform((v) => v?.replace(',', '.'))
    .transform((v) => v?.replace(/[^\d.]/g, ''))
    .test('valid-price', 'Price must be a positive number', function (v) {
      if (!v) return true
      const num = parseFloat(v)
      if (isNaN(num)) return this.createError({ message: `"${v}" is not a number` })
      if (num <= 0) return this.createError({ message: 'Price must be positive' })
      return true
    })
    .required('Price required'),
  tags: yup.string()
    .transform((v) => v?.trim().toLowerCase())
    .transform((v) => v?.replace(/,\s*/g, ', '))
    .test('min-tags', 'At least 2 tags required', (v) => {
      if (!v) return true
      return v.split(', ').filter(Boolean).length >= 2
    })
    .required('Tags required'),
})

export function Task7_4_Solution() {
  const [sku, setSku] = useState('  abc 123  ')
  const [price, setPrice] = useState('$19,99')
  const [tags, setTags] = useState('React,  TypeScript,yup')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    try {
      const data = await productSchema.validate(
        { sku, price, tags },
        { abortEarly: false }
      )
      setResult(`Transformed & valid:\n${JSON.stringify(data, null, 2)}`)
      setIsValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setResult(`Errors: ${err.errors.join('; ')}`)
        setIsValid(false)
      }
    }
  }

  const castOnly = () => {
    try {
      const data = productSchema.cast({ sku, price, tags })
      setResult(`Cast result:\n${JSON.stringify(data, null, 2)}`)
      setIsValid(true)
    } catch (err) {
      setResult(`Cast error: ${err}`)
      setIsValid(false)
    }
  }

  return (
    <div className="exercise-container">
      <h2>Transform chains</h2>

      <div className="form-group">
        <label>SKU (trim → uppercase → spaces to dashes):</label>
        <input value={sku} onChange={(e) => setSku(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Price (comma → dot → strip non-numeric):</label>
        <input value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Tags (trim → lowercase → normalize commas):</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={validate}>Validate</button>
        <button onClick={castOnly} style={{ background: '#1976d2' }}>Cast Only</button>
      </div>

      {result && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem',
            background: isValid ? '#e8f5e9' : '#ffebee',
            borderRadius: '6px',
            fontSize: '0.9rem',
            whiteSpace: 'pre-wrap',
          }}
        >
          {result}
        </div>
      )}
    </div>
  )
}
