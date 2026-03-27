import { useState } from 'react'
import * as yup from 'yup'

// ============================================
// Task 2.1: email and url — Solution
// ============================================

const emailSchema = yup.string().required('Email is required').email('Invalid email format')
const urlSchema = yup.string().required('URL is required').url('Invalid URL format')

export function Task2_1_Solution() {
  const [emailInput, setEmailInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [emailResult, setEmailResult] = useState<string | null>(null)
  const [urlResult, setUrlResult] = useState<string | null>(null)
  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const [urlValid, setUrlValid] = useState<boolean | null>(null)

  const validateEmail = async () => {
    try {
      const result = await emailSchema.validate(emailInput || undefined)
      setEmailResult(`Valid: "${result}"`)
      setEmailValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setEmailResult(`Error: ${err.message}`)
        setEmailValid(false)
      }
    }
  }

  const validateUrl = async () => {
    try {
      const result = await urlSchema.validate(urlInput || undefined)
      setUrlResult(`Valid: "${result}"`)
      setUrlValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setUrlResult(`Error: ${err.message}`)
        setUrlValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>email и url</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>string().email()</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: string().required().email()
          </p>
          <div className="form-group">
            <input
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <button onClick={validateEmail}>Validate Email</button>
          {emailResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: emailValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {emailResult}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>string().url()</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: string().required().url()
          </p>
          <div className="form-group">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <button onClick={validateUrl}>Validate URL</button>
          {urlResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: urlValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {urlResult}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 2.2: min, max, length — Solution
// ============================================

const usernameSchema = yup
  .string()
  .required('Username is required')
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')

const pinSchema = yup
  .string()
  .required('PIN is required')
  .length(4, 'PIN must be exactly 4 characters')

export function Task2_2_Solution() {
  const [usernameInput, setUsernameInput] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [usernameResult, setUsernameResult] = useState<string | null>(null)
  const [pinResult, setPinResult] = useState<string | null>(null)
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null)
  const [pinValid, setPinValid] = useState<boolean | null>(null)

  const validateUsername = async () => {
    try {
      const result = await usernameSchema.validate(usernameInput || undefined)
      setUsernameResult(`Valid: "${result}" (length: ${result?.length})`)
      setUsernameValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setUsernameResult(`Error: ${err.message}`)
        setUsernameValid(false)
      }
    }
  }

  const validatePin = async () => {
    try {
      const result = await pinSchema.validate(pinInput || undefined)
      setPinResult(`Valid: "${result}" (length: ${result?.length})`)
      setPinValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setPinResult(`Error: ${err.message}`)
        setPinValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>min, max, length</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>min() + max()</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: string().required().min(3).max(20)
          </p>
          <div className="form-group">
            <input
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter username (3-20 chars)"
            />
            <span style={{ fontSize: '0.8rem', color: '#999' }}>
              Length: {usernameInput.length}
            </span>
          </div>
          <button onClick={validateUsername}>Validate Username</button>
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

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>length()</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: string().required().length(4)
          </p>
          <div className="form-group">
            <input
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter 4-digit PIN"
              maxLength={6}
            />
            <span style={{ fontSize: '0.8rem', color: '#999' }}>
              Length: {pinInput.length}
            </span>
          </div>
          <button onClick={validatePin}>Validate PIN</button>
          {pinResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: pinValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {pinResult}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 2.3: matches (regex) — Solution
// ============================================

const phoneSchema = yup
  .string()
  .required('Phone is required')
  .matches(/^\+7\d{10}$/, 'Phone must be in format +7XXXXXXXXXX')

const hexColorSchema = yup
  .string()
  .required('Color is required')
  .matches(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g. #FF0000)')

export function Task2_3_Solution() {
  const [phoneInput, setPhoneInput] = useState('')
  const [colorInput, setColorInput] = useState('')
  const [phoneResult, setPhoneResult] = useState<string | null>(null)
  const [colorResult, setColorResult] = useState<string | null>(null)
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null)
  const [colorValid, setColorValid] = useState<boolean | null>(null)

  const validatePhone = async () => {
    try {
      const result = await phoneSchema.validate(phoneInput || undefined)
      setPhoneResult(`Valid: "${result}"`)
      setPhoneValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setPhoneResult(`Error: ${err.message}`)
        setPhoneValid(false)
      }
    }
  }

  const validateColor = async () => {
    try {
      const result = await hexColorSchema.validate(colorInput || undefined)
      setColorResult(`Valid: "${result}"`)
      setColorValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setColorResult(`Error: ${err.message}`)
        setColorValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>matches (regex)</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Phone number</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Pattern: /^\+7\d{'{'}10{'}'}$/
          </p>
          <div className="form-group">
            <input
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="+79001234567"
            />
          </div>
          <button onClick={validatePhone}>Validate Phone</button>
          {phoneResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: phoneValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {phoneResult}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Hex color</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Pattern: /^#[0-9A-Fa-f]{'{'}6{'}'}$/
          </p>
          <div className="form-group">
            <input
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="#FF0000"
            />
          </div>
          <button onClick={validateColor}>Validate Color</button>
          {colorResult && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
              <div
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: colorValid ? '#e8f5e9' : '#ffebee',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                }}
              >
                {colorResult}
              </div>
              {colorValid && (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    backgroundColor: colorInput,
                    border: '1px solid #ccc',
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 2.4: trim, lowercase, uppercase — Solution
// ============================================

const trimSchema = yup.string().required().trim()
const lowerSchema = yup.string().required().lowercase()
const upperSchema = yup.string().required().uppercase()
const combinedSchema = yup.string().required().trim().lowercase()

export function Task2_4_Solution() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Array<{ label: string; original: string; transformed: string }>>([])

  const transformAll = () => {
    const schemas = [
      { label: 'trim()', schema: trimSchema },
      { label: 'lowercase()', schema: lowerSchema },
      { label: 'uppercase()', schema: upperSchema },
      { label: 'trim().lowercase()', schema: combinedSchema },
    ]

    const newResults = schemas.map(({ label, schema }) => {
      const transformed = schema.cast(input)
      return {
        label,
        original: JSON.stringify(input),
        transformed: JSON.stringify(transformed),
      }
    })

    setResults(newResults)
  }

  const validateStrictMode = async () => {
    try {
      // In strict mode, transforms are NOT applied — value must already match
      await lowerSchema.validate(input, { strict: true })
      setResults([{
        label: 'lowercase() with strict: true',
        original: JSON.stringify(input),
        transformed: 'Valid! (value is already lowercase)',
      }])
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setResults([{
          label: 'lowercase() with strict: true',
          original: JSON.stringify(input),
          transformed: `Error: ${err.message}`,
        }])
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>trim, lowercase, uppercase</h2>

      <div style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>Enter a string (try spaces, mixed case):</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='  Hello World  '
          />
          <span style={{ fontSize: '0.8rem', color: '#999' }}>
            Raw: {JSON.stringify(input)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={transformAll}>Cast All</button>
          <button onClick={validateStrictMode}>Test strict mode</button>
        </div>

        {results.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: '0.5rem 0.75rem',
                  marginBottom: '0.5rem',
                  background: '#e3f2fd',
                  borderRadius: '6px',
                  borderLeft: '4px solid #2196f3',
                }}
              >
                <strong>{r.label}</strong>
                <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  {r.original} → {r.transformed}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
