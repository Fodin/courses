import { useState } from 'react'
import * as yup from 'yup'

// ============================================
// Task 3.1: min, max, positive, negative — Solution
// ============================================

const ageSchema = yup
  .number()
  .required('Age is required')
  .positive('Age must be positive')
  .min(18, 'Must be at least 18')
  .max(120, 'Must be at most 120')

const temperatureSchema = yup
  .number()
  .required('Temperature is required')
  .min(-50, 'Too cold! Min is -50')
  .max(50, 'Too hot! Max is 50')

const balanceSchema = yup
  .number()
  .required('Balance is required')
  .negative('Balance must be negative (debt)')

export function Task3_1_Solution() {
  const [ageInput, setAgeInput] = useState('')
  const [tempInput, setTempInput] = useState('')
  const [balanceInput, setBalanceInput] = useState('')
  const [ageResult, setAgeResult] = useState<string | null>(null)
  const [tempResult, setTempResult] = useState<string | null>(null)
  const [balanceResult, setBalanceResult] = useState<string | null>(null)
  const [ageValid, setAgeValid] = useState<boolean | null>(null)
  const [tempValid, setTempValid] = useState<boolean | null>(null)
  const [balanceValid, setBalanceValid] = useState<boolean | null>(null)

  const validate = async (
    schema: yup.NumberSchema,
    value: string,
    setResult: (v: string | null) => void,
    setValid: (v: boolean | null) => void,
  ) => {
    try {
      const parsed = value === '' ? undefined : Number(value)
      const result = await schema.validate(parsed)
      setResult(`Valid: ${result}`)
      setValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setResult(`Error: ${err.message}`)
        setValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>min, max, positive, negative</h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <h3>positive() + min/max</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: number().positive().min(18).max(120)
          </p>
          <div className="form-group">
            <input
              type="number"
              value={ageInput}
              onChange={(e) => setAgeInput(e.target.value)}
              placeholder="Enter age (18-120)"
            />
          </div>
          <button onClick={() => validate(ageSchema, ageInput, setAgeResult, setAgeValid)}>
            Validate Age
          </button>
          {ageResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: ageValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {ageResult}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <h3>min() + max() (negative allowed)</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: number().min(-50).max(50)
          </p>
          <div className="form-group">
            <input
              type="number"
              value={tempInput}
              onChange={(e) => setTempInput(e.target.value)}
              placeholder="Temperature (-50 to 50)"
            />
          </div>
          <button onClick={() => validate(temperatureSchema, tempInput, setTempResult, setTempValid)}>
            Validate Temp
          </button>
          {tempResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: tempValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {tempResult}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <h3>negative()</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: number().negative()
          </p>
          <div className="form-group">
            <input
              type="number"
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              placeholder="Enter debt (negative)"
            />
          </div>
          <button onClick={() => validate(balanceSchema, balanceInput, setBalanceResult, setBalanceValid)}>
            Validate Balance
          </button>
          {balanceResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: balanceValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {balanceResult}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 3.2: integer and truncate — Solution
// ============================================

const quantitySchema = yup
  .number()
  .required('Quantity is required')
  .positive('Must be positive')
  .integer('Must be a whole number')

const truncateSchema = yup
  .number()
  .required()
  .truncate()

const roundSchema = yup
  .number()
  .required()
  .round('ceil')

export function Task3_2_Solution() {
  const [quantityInput, setQuantityInput] = useState('')
  const [transformInput, setTransformInput] = useState('')
  const [quantityResult, setQuantityResult] = useState<string | null>(null)
  const [quantityValid, setQuantityValid] = useState<boolean | null>(null)
  const [transformResults, setTransformResults] = useState<Array<{ label: string; result: string }>>([])

  const validateQuantity = async () => {
    try {
      const parsed = quantityInput === '' ? undefined : Number(quantityInput)
      const result = await quantitySchema.validate(parsed)
      setQuantityResult(`Valid: ${result}`)
      setQuantityValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setQuantityResult(`Error: ${err.message}`)
        setQuantityValid(false)
      }
    }
  }

  const transformAll = () => {
    const num = Number(transformInput)
    if (isNaN(num)) {
      setTransformResults([{ label: 'Error', result: 'Not a number' }])
      return
    }

    const truncated = truncateSchema.cast(num)
    const rounded = roundSchema.cast(num)

    setTransformResults([
      { label: 'Original', result: String(num) },
      { label: 'truncate()', result: String(truncated) },
      { label: 'round("ceil")', result: String(rounded) },
      { label: 'Math comparison', result: `Math.trunc(${num}) = ${Math.trunc(num)}, Math.ceil(${num}) = ${Math.ceil(num)}` },
    ])
  }

  return (
    <div className="exercise-container">
      <h2>integer and truncate</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>integer()</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: number().positive().integer()
          </p>
          <div className="form-group">
            <input
              type="number"
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
              placeholder="Enter quantity (integer)"
              step="0.1"
            />
          </div>
          <button onClick={validateQuantity}>Validate Quantity</button>
          {quantityResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: quantityValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {quantityResult}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>truncate() and round()</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Transformations: truncate(), round(&quot;ceil&quot;)
          </p>
          <div className="form-group">
            <input
              type="number"
              value={transformInput}
              onChange={(e) => setTransformInput(e.target.value)}
              placeholder="Enter decimal (e.g. 3.7)"
              step="0.1"
            />
          </div>
          <button onClick={transformAll}>Transform</button>
          {transformResults.length > 0 && (
            <div style={{ marginTop: '0.75rem' }}>
              {transformResults.map((r, i) => (
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
                  <strong>{r.label}:</strong> {r.result}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 3.3: Date validation — Solution
// ============================================

const birthdaySchema = yup
  .date()
  .required('Date is required')
  .max(new Date(), 'Birthday cannot be in the future')
  .min(new Date('1900-01-01'), 'Date too far in the past')

const eventSchema = yup
  .date()
  .required('Event date is required')
  .min(new Date(), 'Event must be in the future')

export function Task3_3_Solution() {
  const [birthdayInput, setBirthdayInput] = useState('')
  const [eventInput, setEventInput] = useState('')
  const [birthdayResult, setBirthdayResult] = useState<string | null>(null)
  const [eventResult, setEventResult] = useState<string | null>(null)
  const [birthdayValid, setBirthdayValid] = useState<boolean | null>(null)
  const [eventValid, setEventValid] = useState<boolean | null>(null)

  const validateDate = async (
    schema: yup.DateSchema,
    value: string,
    setResult: (v: string | null) => void,
    setValid: (v: boolean | null) => void,
  ) => {
    try {
      const parsed = value === '' ? undefined : value
      const result = await schema.validate(parsed)
      setResult(`Valid: ${result?.toLocaleDateString()}`)
      setValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setResult(`Error: ${err.message}`)
        setValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>Date Validation</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Birthday (past date)</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: date().max(new Date()).min(&quot;1900-01-01&quot;)
          </p>
          <div className="form-group">
            <input
              type="date"
              value={birthdayInput}
              onChange={(e) => setBirthdayInput(e.target.value)}
            />
          </div>
          <button onClick={() => validateDate(birthdaySchema, birthdayInput, setBirthdayResult, setBirthdayValid)}>
            Validate Birthday
          </button>
          {birthdayResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: birthdayValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {birthdayResult}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Event (future date)</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: date().min(new Date())
          </p>
          <div className="form-group">
            <input
              type="date"
              value={eventInput}
              onChange={(e) => setEventInput(e.target.value)}
            />
          </div>
          <button onClick={() => validateDate(eventSchema, eventInput, setEventResult, setEventValid)}>
            Validate Event Date
          </button>
          {eventResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: eventValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {eventResult}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 3.4: Date ranges — Solution
// ============================================

const dateRangeSchema = yup.object({
  startDate: yup
    .date()
    .required('Start date is required'),
  endDate: yup
    .date()
    .required('End date is required')
    .min(yup.ref('startDate'), 'End date must be after start date'),
})

export function Task3_4_Solution() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)

  const validateRange = async () => {
    try {
      const data = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }
      const validated = await dateRangeSchema.validate(data, { abortEarly: false })
      const start = validated.startDate.toLocaleDateString()
      const end = validated.endDate.toLocaleDateString()
      const diffMs = validated.endDate.getTime() - validated.startDate.getTime()
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
      setResult(`Valid range: ${start} — ${end} (${diffDays} days)`)
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
      <h2>Date Ranges</h2>

      <div style={{ maxWidth: '500px' }}>
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
          Schema: object with startDate and endDate, endDate.min(ref(&quot;startDate&quot;))
        </p>

        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button onClick={validateRange}>Validate Range</button>

        {result && (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem',
              background: valid ? '#e8f5e9' : '#ffebee',
              borderRadius: '6px',
              fontSize: '0.9rem',
            }}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  )
}
