import { useState } from 'react'
import * as yup from 'yup'

// ============================================
// Task 6.1: when — basic usage — Solution
// ============================================

const accountSchema = yup.object({
  isBusiness: yup.boolean().required(),
  companyName: yup.string().when('isBusiness', {
    is: true,
    then: (schema) => schema.required('Company name is required for business accounts'),
    otherwise: (schema) => schema.optional(),
  }),
  personalName: yup.string().when('isBusiness', {
    is: false,
    then: (schema) => schema.required('Personal name is required'),
    otherwise: (schema) => schema.optional(),
  }),
})

export function Task6_1_Solution() {
  const [isBusiness, setIsBusiness] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [personalName, setPersonalName] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    try {
      const data = await accountSchema.validate(
        { isBusiness, companyName: companyName || undefined, personalName: personalName || undefined },
        { abortEarly: false }
      )
      setResult(`Valid: ${JSON.stringify(data, null, 2)}`)
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
      <h2>when() — basic</h2>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={isBusiness}
            onChange={(e) => setIsBusiness(e.target.checked)}
          />{' '}
          Business account
        </label>
      </div>

      {isBusiness ? (
        <div className="form-group">
          <label>Company name:</label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Inc"
          />
        </div>
      ) : (
        <div className="form-group">
          <label>Personal name:</label>
          <input
            value={personalName}
            onChange={(e) => setPersonalName(e.target.value)}
            placeholder="John Doe"
          />
        </div>
      )}

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
// Task 6.2: when — is/then/otherwise — Solution
// ============================================

const paymentSchema = yup.object({
  paymentMethod: yup.string().oneOf(['card', 'bank', 'cash']).required('Payment method required'),
  cardNumber: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema.required('Card number required').matches(/^\d{16}$/, 'Card number must be 16 digits'),
    otherwise: (schema) => schema.optional(),
  }),
  bankAccount: yup.string().when('paymentMethod', {
    is: 'bank',
    then: (schema) => schema.required('Bank account required').min(10, 'At least 10 characters'),
    otherwise: (schema) => schema.optional(),
  }),
})

export function Task6_2_Solution() {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    try {
      const data = await paymentSchema.validate(
        {
          paymentMethod,
          cardNumber: cardNumber || undefined,
          bankAccount: bankAccount || undefined,
        },
        { abortEarly: false }
      )
      setResult(`Valid: ${JSON.stringify(data, null, 2)}`)
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
      <h2>when() — is/then/otherwise</h2>

      <div className="form-group">
        <label>Payment method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
        >
          <option value="card">Credit Card</option>
          <option value="bank">Bank Transfer</option>
          <option value="cash">Cash</option>
        </select>
      </div>

      {paymentMethod === 'card' && (
        <div className="form-group">
          <label>Card number (16 digits):</label>
          <input
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234567890123456"
          />
        </div>
      )}

      {paymentMethod === 'bank' && (
        <div className="form-group">
          <label>Bank account:</label>
          <input
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            placeholder="IBAN or account number"
          />
        </div>
      )}

      {paymentMethod === 'cash' && (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No additional details needed for cash payment.</p>
      )}

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
// Task 6.3: when — multiple fields — Solution
// ============================================

const shippingSchema = yup.object({
  country: yup.string().required('Country is required'),
  deliveryType: yup.string().oneOf(['pickup', 'courier', 'post']).required('Delivery type required'),
  address: yup.string().when(
    ['country', 'deliveryType'],
    ([country, delivery], schema) => {
      if (delivery === 'courier') {
        return schema.required('Address required for courier delivery')
      }
      if (delivery === 'post' && country === 'US') {
        return schema.required('Address required for US postal delivery')
      }
      return schema.optional()
    }
  ),
  zipCode: yup.string().when(
    ['country', 'deliveryType'],
    ([country, delivery], schema) => {
      if (delivery === 'pickup') return schema.optional()
      if (country === 'US') {
        return schema.required('Zip code required').matches(/^\d{5}$/, 'US zip must be 5 digits')
      }
      if (country === 'UK') {
        return schema.required('Post code required').matches(/^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/i, 'Invalid UK post code')
      }
      return schema.optional()
    }
  ),
})

export function Task6_3_Solution() {
  const [country, setCountry] = useState('US')
  const [deliveryType, setDeliveryType] = useState('courier')
  const [address, setAddress] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    try {
      const data = await shippingSchema.validate(
        {
          country,
          deliveryType,
          address: address || undefined,
          zipCode: zipCode || undefined,
        },
        { abortEarly: false }
      )
      setResult(`Valid: ${JSON.stringify(data, null, 2)}`)
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
      <h2>when() — multiple fields</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label>Country:</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
          >
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="DE">Germany</option>
          </select>
        </div>

        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label>Delivery type:</label>
          <select
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
          >
            <option value="pickup">Pickup</option>
            <option value="courier">Courier</option>
            <option value="post">Post</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Address:</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main St"
        />
      </div>

      <div className="form-group">
        <label>Zip / Post code:</label>
        <input
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder={country === 'US' ? '12345' : country === 'UK' ? 'SW1A 1AA' : 'Optional'}
        />
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
// Task 6.4: when — nested conditions — Solution
// ============================================

const registrationSchema = yup.object({
  accountType: yup.string().oneOf(['personal', 'business']).required('Account type required'),
  country: yup.string().required('Country required'),
  age: yup.number()
    .when('accountType', {
      is: 'personal',
      then: (schema) => schema.required('Age required for personal accounts').min(13, 'Must be at least 13'),
    }),
  companyName: yup.string()
    .when('accountType', {
      is: 'business',
      then: (schema) => schema.required('Company name required'),
    }),
  taxId: yup.string()
    .when('accountType', {
      is: 'business',
      then: (schema) => schema.required('Tax ID required for business'),
    })
    .when(['accountType', 'country'], ([type, country], schema) => {
      if (type === 'business' && country === 'US') {
        return schema.matches(/^\d{2}-\d{7}$/, 'US EIN format: XX-XXXXXXX')
      }
      if (type === 'business' && country === 'DE') {
        return schema.matches(/^DE\d{9}$/, 'German VAT format: DEXXXXXXXXX')
      }
      return schema
    }),
  parentConsent: yup.boolean()
    .when(['accountType', 'age'], ([type, age], schema) => {
      if (type === 'personal' && typeof age === 'number' && age < 18) {
        return schema.oneOf([true], 'Parent consent required for minors')
      }
      return schema
    }),
})

export function Task6_4_Solution() {
  const [accountType, setAccountType] = useState('personal')
  const [country, setCountry] = useState('US')
  const [age, setAge] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [taxId, setTaxId] = useState('')
  const [parentConsent, setParentConsent] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    try {
      const data = await registrationSchema.validate(
        {
          accountType,
          country,
          age: age ? Number(age) : undefined,
          companyName: companyName || undefined,
          taxId: taxId || undefined,
          parentConsent,
        },
        { abortEarly: false }
      )
      setResult(`Valid: ${JSON.stringify(data, null, 2)}`)
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
      <h2>when() — nested conditions</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label>Account type:</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
          >
            <option value="personal">Personal</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label>Country:</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
          >
            <option value="US">United States</option>
            <option value="DE">Germany</option>
            <option value="RU">Russia</option>
          </select>
        </div>
      </div>

      {accountType === 'personal' && (
        <>
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
            />
          </div>
          {age && Number(age) < 18 && (
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={parentConsent}
                  onChange={(e) => setParentConsent(e.target.checked)}
                />{' '}
                Parent/guardian consent
              </label>
            </div>
          )}
        </>
      )}

      {accountType === 'business' && (
        <>
          <div className="form-group">
            <label>Company name:</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Inc"
            />
          </div>
          <div className="form-group">
            <label>Tax ID ({country === 'US' ? 'EIN: XX-XXXXXXX' : country === 'DE' ? 'VAT: DEXXXXXXXXX' : 'any format'}):</label>
            <input
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              placeholder={country === 'US' ? '12-3456789' : country === 'DE' ? 'DE123456789' : 'Tax ID'}
            />
          </div>
        </>
      )}

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
