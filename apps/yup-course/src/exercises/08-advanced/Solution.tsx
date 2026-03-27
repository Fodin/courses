import { useState } from 'react'
import * as yup from 'yup'
import type { InferType } from 'yup'

// ============================================
// Task 8.1: ref and context — Solution
// ============================================

const passwordFormSchema = yup.object({
  password: yup.string()
    .required('Password is required')
    .min(8, 'At least 8 characters'),
  confirmPassword: yup.string()
    .required('Please confirm password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  minPrice: yup.number()
    .required('Min price required')
    .min(0, 'Cannot be negative'),
  maxPrice: yup.number()
    .required('Max price required')
    .moreThan(yup.ref('minPrice'), 'Max must be greater than min'),
  discount: yup.number()
    .required('Discount required')
    .min(0)
    .max(yup.ref('$maxDiscount'), 'Discount exceeds maximum allowed: ${max}%'),
})

export function Task8_1_Solution() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [minPrice, setMinPrice] = useState('10')
  const [maxPrice, setMaxPrice] = useState('100')
  const [discount, setDiscount] = useState('15')
  const [maxDiscount, setMaxDiscount] = useState('20')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    try {
      const data = await passwordFormSchema.validate(
        {
          password: password || undefined,
          confirmPassword: confirmPassword || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          discount: discount ? Number(discount) : undefined,
        },
        {
          abortEarly: false,
          context: { maxDiscount: Number(maxDiscount) },
        }
      )
      setResult(`Valid:\n${JSON.stringify(data, null, 2)}`)
      setIsValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setResult(`Errors:\n${err.errors.join('\n')}`)
        setIsValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>ref() and context</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Password ref</h3>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="MyPass123" />
          </div>
          <div className="form-group">
            <label>Confirm password:</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="MyPass123" />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Price range ref</h3>
          <div className="form-group">
            <label>Min price:</label>
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Max price (must be &gt; min):</label>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Context ($maxDiscount)</h3>
          <div className="form-group">
            <label>Max allowed discount (context):</label>
            <input type="number" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Your discount:</label>
            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          </div>
        </div>
      </div>

      <button onClick={validate}>Validate All</button>
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
// Task 8.2: lazy — recursive schemas — Solution
// ============================================

interface TreeNode {
  id: number
  label: string
  children: TreeNode[]
}

const treeNodeSchema: yup.ObjectSchema<TreeNode> = yup.object({
  id: yup.number().required('Node ID required').positive(),
  label: yup.string().required('Node label required').min(1),
  children: yup.array().of(
    yup.lazy(() => treeNodeSchema.default(undefined)) as yup.ISchema<TreeNode>
  ).default([]),
})

export function Task8_2_Solution() {
  const [treeJson, setTreeJson] = useState(JSON.stringify({
    id: 1,
    label: 'Root',
    children: [
      {
        id: 2,
        label: 'Child 1',
        children: [
          { id: 4, label: 'Grandchild', children: [] },
        ],
      },
      { id: 3, label: 'Child 2', children: [] },
    ],
  }, null, 2))
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    try {
      const data = JSON.parse(treeJson)
      const validated = await treeNodeSchema.validate(data, { abortEarly: false })
      const countNodes = (node: TreeNode): number =>
        1 + (node.children?.reduce((sum, child) => sum + countNodes(child), 0) ?? 0)
      setResult(`Valid tree with ${countNodes(validated)} nodes:\n${JSON.stringify(validated, null, 2)}`)
      setIsValid(true)
    } catch (err) {
      if (err instanceof SyntaxError) {
        setResult(`JSON parse error: ${err.message}`)
        setIsValid(false)
      } else if (err instanceof yup.ValidationError) {
        setResult(`Validation errors:\n${err.errors.join('\n')}`)
        setIsValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>lazy() — recursive schemas</h2>
      <p style={{ fontSize: '0.85rem', color: '#666' }}>
        Edit the JSON tree below. Each node must have id (positive number), label (non-empty string), and children (array of nodes).
      </p>

      <div className="form-group">
        <label>Tree JSON:</label>
        <textarea
          value={treeJson}
          onChange={(e) => setTreeJson(e.target.value)}
          rows={15}
          style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.85rem', padding: '0.5rem' }}
        />
      </div>

      <button onClick={validate}>Validate Tree</button>
      {result && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem',
            background: isValid ? '#e8f5e9' : '#ffebee',
            borderRadius: '6px',
            fontSize: '0.9rem',
            whiteSpace: 'pre-wrap',
            maxHeight: '300px',
            overflow: 'auto',
          }}
        >
          {result}
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 8.3: TypeScript and InferType — Solution
// ============================================

const profileSchema = yup.object({
  firstName: yup.string().required('First name required').min(2),
  lastName: yup.string().required('Last name required').min(2),
  email: yup.string().email('Invalid email').required('Email required'),
  age: yup.number().required('Age required').positive().integer().min(13).max(120),
  role: yup.string().oneOf(['admin', 'editor', 'viewer'] as const).required('Role required'),
  bio: yup.string().optional().max(500),
  website: yup.string().url('Invalid URL').nullable(),
  joinedAt: yup.date().default(() => new Date()),
})

type Profile = InferType<typeof profileSchema>

async function validateProfile(data: unknown): Promise<{ success: true; data: Profile } | { success: false; errors: string[] }> {
  try {
    const validated = await profileSchema.validate(data, { abortEarly: false })
    return { success: true, data: validated }
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return { success: false, errors: err.errors }
    }
    throw err
  }
}

export function Task8_3_Solution() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [role, setRole] = useState('viewer')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    const res = await validateProfile({
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: email || undefined,
      age: age ? Number(age) : undefined,
      role,
      bio: bio || undefined,
      website: website || null,
    })
    if (res.success) {
      setResult(`Valid (type-safe):\n${JSON.stringify(res.data, null, 2)}\n\nInferred type: Profile\nrole is: "${res.data.role}" (literal type)`)
      setIsValid(true)
    } else {
      setResult(`Errors:\n${res.errors.join('\n')}`)
      setIsValid(false)
    }
  }

  return (
    <div className="exercise-container">
      <h2>TypeScript and InferType</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div className="form-group">
            <label>First name:</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
          </div>
          <div className="form-group">
            <label>Last name:</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label>Age:</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div className="form-group">
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}>
              <option value="admin">admin</option>
              <option value="editor">editor</option>
              <option value="viewer">viewer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Bio (optional, max 500):</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div className="form-group">
            <label>Website (nullable URL):</label>
            <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" />
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
// Task 8.4: Final Project — Solution
// ============================================

const registrationFormSchema = yup.object({
  // Personal info
  firstName: yup.string()
    .transform((v) => v?.trim())
    .required('First name required')
    .min(2, 'At least 2 characters'),
  lastName: yup.string()
    .transform((v) => v?.trim())
    .required('Last name required')
    .min(2, 'At least 2 characters'),
  email: yup.string()
    .transform((v) => v?.trim().toLowerCase())
    .email('Invalid email')
    .required('Email required'),
  password: yup.string()
    .required('Password required')
    .min(8, 'At least 8 characters')
    .test('strong', 'Must contain uppercase, lowercase, and digit', (v) =>
      !v || (/[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v))
    ),
  confirmPassword: yup.string()
    .required('Confirm password')
    .oneOf([yup.ref('password')], 'Passwords must match'),

  // Account type
  accountType: yup.string().oneOf(['personal', 'business'] as const).required(),
  companyName: yup.string().when('accountType', {
    is: 'business',
    then: (schema) => schema.required('Company name required for business'),
    otherwise: (schema) => schema.optional(),
  }),

  // Address
  address: yup.object({
    street: yup.string().required('Street required'),
    city: yup.string().required('City required'),
    country: yup.string().required('Country required'),
    zipCode: yup.string().when('country', {
      is: (c: string) => c === 'US',
      then: (schema) => schema.required('Zip required').matches(/^\d{5}$/, 'US zip: 5 digits'),
      otherwise: (schema) => schema.optional(),
    }),
  }),

  // Preferences
  newsletter: yup.boolean().default(false),
  interests: yup.array()
    .of(yup.string().required())
    .when('newsletter', {
      is: true,
      then: (schema) => schema.min(1, 'Select at least 1 interest for newsletter'),
    })
    .default([]),

  // Terms
  acceptTerms: yup.boolean()
    .oneOf([true], 'You must accept the terms'),
})

type RegistrationForm = InferType<typeof registrationFormSchema>

export function Task8_4_Solution() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'personal',
    companyName: '',
    street: '',
    city: '',
    country: 'US',
    zipCode: '',
    newsletter: false,
    interests: [] as string[],
    acceptTerms: false,
  })
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const update = (field: string, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const validate = async () => {
    try {
      const data: RegistrationForm = await registrationFormSchema.validate(
        {
          firstName: form.firstName || undefined,
          lastName: form.lastName || undefined,
          email: form.email || undefined,
          password: form.password || undefined,
          confirmPassword: form.confirmPassword || undefined,
          accountType: form.accountType,
          companyName: form.companyName || undefined,
          address: {
            street: form.street || undefined,
            city: form.city || undefined,
            country: form.country,
            zipCode: form.zipCode || undefined,
          },
          newsletter: form.newsletter,
          interests: form.interests.length ? form.interests : [],
          acceptTerms: form.acceptTerms,
        },
        { abortEarly: false }
      )
      setResult(`Registration valid!\n${JSON.stringify(data, null, 2)}`)
      setIsValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setResult(`Validation errors (${err.errors.length}):\n${err.errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}`)
        setIsValid(false)
      }
    }
  }

  const allInterests = ['Technology', 'Science', 'Arts', 'Sports', 'Music']

  return (
    <div className="exercise-container">
      <h2>Final Project — Registration Form</h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Column 1: Personal */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>Personal Info</h3>
          <div className="form-group">
            <label>First name:</label>
            <input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="John" />
          </div>
          <div className="form-group">
            <label>Last name:</label>
            <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Doe" />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="john@example.com" />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="MyPass123" />
          </div>
          <div className="form-group">
            <label>Confirm password:</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="MyPass123" />
          </div>
        </div>

        {/* Column 2: Account + Address */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>Account & Address</h3>
          <div className="form-group">
            <label>Account type:</label>
            <select value={form.accountType} onChange={(e) => update('accountType', e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}>
              <option value="personal">Personal</option>
              <option value="business">Business</option>
            </select>
          </div>
          {form.accountType === 'business' && (
            <div className="form-group">
              <label>Company name:</label>
              <input value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="Acme Inc" />
            </div>
          )}
          <div className="form-group">
            <label>Street:</label>
            <input value={form.street} onChange={(e) => update('street', e.target.value)} placeholder="123 Main St" />
          </div>
          <div className="form-group">
            <label>City:</label>
            <input value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="New York" />
          </div>
          <div className="form-group">
            <label>Country:</label>
            <select value={form.country} onChange={(e) => update('country', e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="DE">Germany</option>
            </select>
          </div>
          {form.country === 'US' && (
            <div className="form-group">
              <label>Zip code (5 digits):</label>
              <input value={form.zipCode} onChange={(e) => update('zipCode', e.target.value)} placeholder="10001" />
            </div>
          )}
        </div>

        {/* Column 3: Preferences */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3>Preferences</h3>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={form.newsletter} onChange={(e) => update('newsletter', e.target.checked)} />{' '}
              Subscribe to newsletter
            </label>
          </div>
          {form.newsletter && (
            <div className="form-group">
              <label>Interests (select at least 1):</label>
              {allInterests.map((interest) => (
                <label key={interest} style={{ display: 'block', margin: '0.25rem 0' }}>
                  <input
                    type="checkbox"
                    checked={form.interests.includes(interest)}
                    onChange={() => toggleInterest(interest)}
                  />{' '}
                  {interest}
                </label>
              ))}
            </div>
          )}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>
              <input type="checkbox" checked={form.acceptTerms} onChange={(e) => update('acceptTerms', e.target.checked)} />{' '}
              I accept the terms and conditions
            </label>
          </div>
        </div>
      </div>

      <button onClick={validate} style={{ marginTop: '1rem', fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
        Register
      </button>
      {result && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            background: isValid ? '#e8f5e9' : '#ffebee',
            borderRadius: '6px',
            fontSize: '0.9rem',
            whiteSpace: 'pre-wrap',
            maxHeight: '400px',
            overflow: 'auto',
          }}
        >
          {result}
        </div>
      )}
    </div>
  )
}
