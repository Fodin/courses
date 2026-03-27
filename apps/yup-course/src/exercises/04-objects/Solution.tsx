import { useState } from 'react'
import * as yup from 'yup'

// ============================================
// Task 4.1: object and shape — Solution
// ============================================

const userSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name too short'),
  age: yup.number().required('Age is required').positive().integer(),
  email: yup.string().required('Email is required').email('Invalid email'),
})

export function Task4_1_Solution() {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)

  const validate = async () => {
    try {
      const data = {
        name: name || undefined,
        age: age === '' ? undefined : Number(age),
        email: email || undefined,
      }
      const validated = await userSchema.validate(data, { abortEarly: false })
      setResult(`Valid user: ${JSON.stringify(validated, null, 2)}`)
      setValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setResult(`Errors: ${err.errors.join('; ')}`)
        setValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>object and shape</h2>

      <div style={{ maxWidth: '400px' }}>
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
          Schema: object({'{'} name, age, email {'}'})
        </p>
        <div className="form-group">
          <label>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
        </div>

        <button onClick={validate}>Validate User</button>

        {result && (
          <pre
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: valid ? '#e8f5e9' : '#ffebee',
              borderRadius: '6px',
              fontSize: '0.85rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {result}
          </pre>
        )}
      </div>
    </div>
  )
}

// ============================================
// Task 4.2: Nested objects — Solution
// ============================================

const profileSchema = yup.object({
  user: yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
  }),
  address: yup.object({
    city: yup.string().required('City is required'),
    zipCode: yup.string().required('Zip is required').matches(/^\d{5,6}$/, 'Invalid zip code'),
    country: yup.string().required('Country is required'),
  }),
})

export function Task4_2_Solution() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)

  const validate = async () => {
    try {
      const data = {
        user: {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
        },
        address: {
          city: city || undefined,
          zipCode: zipCode || undefined,
          country: country || undefined,
        },
      }
      const validated = await profileSchema.validate(data, { abortEarly: false })
      setResult(`Valid profile: ${JSON.stringify(validated, null, 2)}`)
      setValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const fieldErrors = err.inner.map((e) => `${e.path}: ${e.message}`)
        setResult(`Errors:\n${fieldErrors.join('\n')}`)
        setValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>Nested Objects</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>User</h3>
          <div className="form-group">
            <label>First Name:</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>Address</h3>
          <div className="form-group">
            <label>City:</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Moscow" />
          </div>
          <div className="form-group">
            <label>Zip Code:</label>
            <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="123456" />
          </div>
          <div className="form-group">
            <label>Country:</label>
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Russia" />
          </div>
        </div>
      </div>

      <button onClick={validate}>Validate Profile</button>

      {result && (
        <pre
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            background: valid ? '#e8f5e9' : '#ffebee',
            borderRadius: '6px',
            fontSize: '0.85rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {result}
        </pre>
      )}
    </div>
  )
}

// ============================================
// Task 4.3: pick, omit, partial — Solution
// ============================================

const fullPersonSchema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup.number().required('Age is required').positive().integer(),
  email: yup.string().required('Email is required').email(),
  phone: yup.string().required('Phone is required'),
})

const publicSchema = fullPersonSchema.pick(['name', 'email'])
const withoutPhoneSchema = fullPersonSchema.omit(['phone'])
const partialSchema = fullPersonSchema.partial()

export function Task4_3_Solution() {
  const [input, setInput] = useState('{"name": "Alice", "email": "alice@test.com"}')
  const [selectedSchema, setSelectedSchema] = useState<'full' | 'pick' | 'omit' | 'partial'>('full')
  const [result, setResult] = useState<string | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)

  const schemas = {
    full: { schema: fullPersonSchema, label: 'Full (all fields required)' },
    pick: { schema: publicSchema, label: 'pick(["name", "email"])' },
    omit: { schema: withoutPhoneSchema, label: 'omit(["phone"])' },
    partial: { schema: partialSchema, label: 'partial() (all optional)' },
  }

  const validate = async () => {
    try {
      const data = JSON.parse(input)
      const { schema } = schemas[selectedSchema]
      const validated = await schema.validate(data, { abortEarly: false })
      setResult(`Valid (${selectedSchema}): ${JSON.stringify(validated, null, 2)}`)
      setValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setResult(`Errors: ${err.errors.join('; ')}`)
        setValid(false)
      } else if (err instanceof SyntaxError) {
        setResult(`JSON parse error: ${err.message}`)
        setValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>pick, omit, partial</h2>

      <div style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>Schema variant:</label>
          <select
            value={selectedSchema}
            onChange={(e) => setSelectedSchema(e.target.value as typeof selectedSchema)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
          >
            {Object.entries(schemas).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>JSON data:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.85rem', padding: '0.5rem' }}
          />
        </div>

        <button onClick={validate}>Validate</button>

        {result && (
          <pre
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: valid ? '#e8f5e9' : '#ffebee',
              borderRadius: '6px',
              fontSize: '0.85rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {result}
          </pre>
        )}
      </div>
    </div>
  )
}

// ============================================
// Task 4.4: noUnknown and strict — Solution
// ============================================

const strictUserSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required').email(),
}).noUnknown('Unknown field: ${unknown}')

export function Task4_4_Solution() {
  const [input, setInput] = useState('{"name": "Alice", "email": "alice@test.com", "extra": "field"}')
  const [useStrict, setUseStrict] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)

  const validate = async () => {
    try {
      const data = JSON.parse(input)
      const validated = await strictUserSchema.validate(data, {
        abortEarly: false,
        strict: useStrict,
        stripUnknown: !useStrict,
      })
      setResult(`Valid: ${JSON.stringify(validated, null, 2)}`)
      setValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setResult(`Errors: ${err.errors.join('; ')}`)
        setValid(false)
      } else if (err instanceof SyntaxError) {
        setResult(`JSON parse error: ${err.message}`)
        setValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>noUnknown and strict</h2>

      <div style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>JSON data (try adding extra fields):</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.85rem', padding: '0.5rem' }}
          />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={useStrict}
            onChange={(e) => setUseStrict(e.target.checked)}
            id="strict-mode"
          />
          <label htmlFor="strict-mode">
            strict: true (reject unknown fields instead of stripping)
          </label>
        </div>

        <button onClick={validate}>Validate</button>

        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
          {useStrict
            ? 'strict mode: noUnknown() will reject extra fields'
            : 'non-strict: stripUnknown removes extra fields silently'}
        </p>

        {result && (
          <pre
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: valid ? '#e8f5e9' : '#ffebee',
              borderRadius: '6px',
              fontSize: '0.85rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {result}
          </pre>
        )}
      </div>
    </div>
  )
}
