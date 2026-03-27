import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'
// import type { InferType } from 'yup'

// ============================================
// Задание 8.3: TypeScript и InferType
// Task 8.3: TypeScript and InferType
// ============================================

// TODO: Создайте profileSchema — yup.object({
//   firstName: yup.string().required().min(2),
//   lastName: yup.string().required().min(2),
//   email: yup.string().email().required(),
//   age: yup.number().required().positive().integer().min(13).max(120),
//   role: yup.string().oneOf(['admin', 'editor', 'viewer'] as const).required(),
//   bio: yup.string().optional().max(500),
//   website: yup.string().url().nullable(),
//   joinedAt: yup.date().default(() => new Date()),
// })
// Подсказка: используйте 'as const' в oneOf для литеральных типов!
// TODO: Create profileSchema, use 'as const' with oneOf for literal types

// TODO: Выведите тип: type Profile = InferType<typeof profileSchema>
// TODO: Derive type: type Profile = InferType<typeof profileSchema>

// TODO: Создайте типобезопасную функцию валидации:
// async function validateProfile(data: unknown):
//   Promise<{ success: true; data: Profile } | { success: false; errors: string[] }>
// TODO: Create type-safe validateProfile function

export function Task8_3() {
  const { t } = useLanguage()
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
    // TODO: Вызовите validateProfile с данными формы:
    //   { firstName, lastName, email, age: Number(age), role, bio, website: website || null }
    // При success: покажите data + роль (литеральный тип)
    // При failure: покажите errors
    // TODO: Call validateProfile, show typed result
    console.log('Validate profile:', { firstName, lastName, email, age, role })
    setResult(null)
    setIsValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.8.3')}</h2>

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
      {/* TODO: Покажите result в цветном блоке */}
      {/* TODO: Show result in colored block */}
    </div>
  )
}
