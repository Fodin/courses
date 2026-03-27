import { useState } from 'react'
import * as yup from 'yup'

// ============================================
// Task 1.1: string and number — Solution
// ============================================

const stringSchema = yup.string().required('Value is required').min(2, 'Minimum 2 characters')
const numberSchema = yup.number().required('Value is required').min(0, 'Must be >= 0').max(150, 'Must be <= 150')

export function Task1_1_Solution() {
  const [strInput, setStrInput] = useState('')
  const [numInput, setNumInput] = useState('')
  const [strResult, setStrResult] = useState<string | null>(null)
  const [numResult, setNumResult] = useState<string | null>(null)
  const [strValid, setStrValid] = useState<boolean | null>(null)
  const [numValid, setNumValid] = useState<boolean | null>(null)

  const validateString = async () => {
    try {
      const result = await stringSchema.validate(strInput)
      setStrResult(`Valid: "${result}" (type: ${typeof result})`)
      setStrValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setStrResult(`Error: ${err.message}`)
        setStrValid(false)
      }
    }
  }

  const validateNumber = async () => {
    try {
      const value = numInput === '' ? undefined : numInput
      const result = await numberSchema.validate(value)
      setNumResult(`Valid: ${result} (type: ${typeof result})`)
      setNumValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setNumResult(`Error: ${err.message}`)
        setNumValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>string и number</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>string()</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: string().required().min(2)
          </p>
          <div className="form-group">
            <input
              value={strInput}
              onChange={(e) => setStrInput(e.target.value)}
              placeholder="Enter a string"
            />
          </div>
          <button onClick={validateString}>Validate String</button>
          {strResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: strValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {strResult}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>number()</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: number().required().min(0).max(150)
          </p>
          <div className="form-group">
            <input
              value={numInput}
              onChange={(e) => setNumInput(e.target.value)}
              placeholder="Enter a number"
            />
          </div>
          <button onClick={validateNumber}>Validate Number</button>
          {numResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: numValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {numResult}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 1.2: boolean and date — Solution
// ============================================

const boolSchema = yup.boolean().required('Value is required').isTrue('Must be checked')
const dateSchema = yup.date().required('Date is required').min(new Date('2000-01-01'), 'Date must be after 2000')

export function Task1_2_Solution() {
  const [boolInput, setBoolInput] = useState(false)
  const [dateInput, setDateInput] = useState('')
  const [boolResult, setBoolResult] = useState<string | null>(null)
  const [dateResult, setDateResult] = useState<string | null>(null)
  const [boolValid, setBoolValid] = useState<boolean | null>(null)
  const [dateValid, setDateValid] = useState<boolean | null>(null)

  const validateBool = async () => {
    try {
      const result = await boolSchema.validate(boolInput)
      setBoolResult(`Valid: ${result} (type: ${typeof result})`)
      setBoolValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setBoolResult(`Error: ${err.message}`)
        setBoolValid(false)
      }
    }
  }

  const validateDate = async () => {
    try {
      const value = dateInput || undefined
      const result = await dateSchema.validate(value)
      setDateResult(`Valid: ${result?.toISOString()} (type: ${typeof result})`)
      setDateValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setDateResult(`Error: ${err.message}`)
        setDateValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>boolean и date</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>boolean()</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: boolean().required().isTrue()
          </p>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={boolInput}
                onChange={(e) => setBoolInput(e.target.checked)}
              />
              I agree to terms
            </label>
          </div>
          <button onClick={validateBool}>Validate Boolean</button>
          {boolResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: boolValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {boolResult}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>date()</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: date().required().min(&apos;2000-01-01&apos;)
          </p>
          <div className="form-group">
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
          </div>
          <button onClick={validateDate}>Validate Date</button>
          {dateResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: dateValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {dateResult}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 1.3: required and nullable — Solution
// ============================================

const requiredSchema = yup.string().required('This field is required')
const nullableSchema = yup.string().nullable()
const optionalSchema = yup.string().optional()
const nullableRequiredSchema = yup.string().nullable().required('This field is required but can be null... wait, no!')

export function Task1_3_Solution() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Array<{ label: string; result: string; valid: boolean }>>([])

  const validateAll = async () => {
    const value = input === '' ? undefined : input === 'null' ? null : input

    const schemas = [
      { label: 'string().required()', schema: requiredSchema },
      { label: 'string().nullable()', schema: nullableSchema },
      { label: 'string().optional()', schema: optionalSchema },
      { label: 'string().nullable().required()', schema: nullableRequiredSchema },
    ]

    const newResults = await Promise.all(
      schemas.map(async ({ label, schema }) => {
        try {
          const result = await schema.validate(value)
          return { label, result: `Valid: ${JSON.stringify(result)}`, valid: true }
        } catch (err) {
          if (err instanceof yup.ValidationError) {
            return { label, result: `Error: ${err.message}`, valid: false }
          }
          return { label, result: 'Unknown error', valid: false }
        }
      })
    )

    setResults(newResults)
  }

  return (
    <div className="exercise-container">
      <h2>required и nullable</h2>

      <div style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>
            Enter value (leave empty for undefined, type &quot;null&quot; for null):
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Try: empty, "null", or any text'
          />
        </div>
        <button onClick={validateAll}>Validate All Schemas</button>

        {results.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: '0.5rem 0.75rem',
                  marginBottom: '0.5rem',
                  background: r.valid ? '#e8f5e9' : '#ffebee',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${r.valid ? '#4caf50' : '#f44336'}`,
                }}
              >
                <strong>{r.label}</strong>
                <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{r.result}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Task 1.4: default and defined — Solution
// ============================================

const defaultSchema = yup.string().default('Guest')
const defaultNumberSchema = yup.number().default(0)
const definedSchema = yup.string().defined('Value must be defined')

export function Task1_4_Solution() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<Array<{ label: string; result: string; valid: boolean }>>([])

  const validateAll = async () => {
    const value = input === '' ? undefined : input

    const tests: Array<{ label: string; fn: () => Promise<{ result: string; valid: boolean }> }> = [
      {
        label: 'string().default("Guest") — cast',
        fn: async () => {
          const result = defaultSchema.cast(value)
          return { result: `Cast result: ${JSON.stringify(result)}`, valid: true }
        },
      },
      {
        label: 'number().default(0) — cast',
        fn: async () => {
          const numValue = input === '' ? undefined : Number(input)
          const result = defaultNumberSchema.cast(isNaN(numValue as number) ? undefined : numValue)
          return { result: `Cast result: ${JSON.stringify(result)}`, valid: true }
        },
      },
      {
        label: 'string().defined() — validate',
        fn: async () => {
          try {
            const result = await definedSchema.validate(value)
            return { result: `Valid: ${JSON.stringify(result)}`, valid: true }
          } catch (err) {
            if (err instanceof yup.ValidationError) {
              return { result: `Error: ${err.message}`, valid: false }
            }
            return { result: 'Unknown error', valid: false }
          }
        },
      },
    ]

    const newResults = await Promise.all(
      tests.map(async ({ label, fn }) => {
        const { result, valid } = await fn()
        return { label, result, valid }
      })
    )

    setResults(newResults)
  }

  return (
    <div className="exercise-container">
      <h2>default и defined</h2>

      <div style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>Enter value (leave empty to test undefined):</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Try: empty, or any text/number"
          />
        </div>
        <button onClick={validateAll}>Test All</button>

        {results.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: '0.5rem 0.75rem',
                  marginBottom: '0.5rem',
                  background: r.valid ? '#e8f5e9' : '#ffebee',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${r.valid ? '#4caf50' : '#f44336'}`,
                }}
              >
                <strong>{r.label}</strong>
                <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{r.result}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
