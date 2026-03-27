import { useState } from 'react'
import * as yup from 'yup'

// ============================================
// Task 5.1: array().of() — Solution
// ============================================

const tagsSchema = yup
  .array()
  .of(yup.string().required('Tag cannot be empty'))
  .required('Tags are required')

const numbersSchema = yup
  .array()
  .of(yup.number().required().positive('Each number must be positive'))
  .required('Numbers are required')

export function Task5_1_Solution() {
  const [tagsInput, setTagsInput] = useState('react, typescript, yup')
  const [numbersInput, setNumbersInput] = useState('1, 2, 3')
  const [tagsResult, setTagsResult] = useState<string | null>(null)
  const [numbersResult, setNumbersResult] = useState<string | null>(null)
  const [tagsValid, setTagsValid] = useState<boolean | null>(null)
  const [numbersValid, setNumbersValid] = useState<boolean | null>(null)

  const validateTags = async () => {
    try {
      const tags = tagsInput.split(',').map((s) => s.trim()).filter(Boolean)
      const result = await tagsSchema.validate(tags.length ? tags : undefined)
      setTagsResult(`Valid tags: ${JSON.stringify(result)}`)
      setTagsValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setTagsResult(`Error: ${err.message}`)
        setTagsValid(false)
      }
    }
  }

  const validateNumbers = async () => {
    try {
      const nums = numbersInput.split(',').map((s) => {
        const trimmed = s.trim()
        return trimmed === '' ? undefined : Number(trimmed)
      })
      const result = await numbersSchema.validate(nums.length ? nums : undefined, { abortEarly: false })
      setNumbersResult(`Valid numbers: ${JSON.stringify(result)}`)
      setNumbersValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setNumbersResult(`Errors: ${err.errors.join('; ')}`)
        setNumbersValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>array().of()</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Array of strings</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: array().of(string().required())
          </p>
          <div className="form-group">
            <label>Tags (comma-separated):</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="react, typescript, yup"
            />
          </div>
          <button onClick={validateTags}>Validate Tags</button>
          {tagsResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: tagsValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {tagsResult}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Array of numbers</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: array().of(number().positive())
          </p>
          <div className="form-group">
            <label>Numbers (comma-separated):</label>
            <input
              value={numbersInput}
              onChange={(e) => setNumbersInput(e.target.value)}
              placeholder="1, 2, 3"
            />
          </div>
          <button onClick={validateNumbers}>Validate Numbers</button>
          {numbersResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: numbersValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {numbersResult}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 5.2: min, max, length for arrays — Solution
// ============================================

const rolesSchema = yup
  .array()
  .of(yup.string().required())
  .required('Roles are required')
  .min(1, 'At least 1 role required')
  .max(3, 'Maximum 3 roles allowed')

const teamSchema = yup
  .array()
  .of(yup.string().required())
  .required('Team is required')
  .length(5, 'Team must have exactly 5 members')

export function Task5_2_Solution() {
  const [rolesInput, setRolesInput] = useState('admin, editor')
  const [teamInput, setTeamInput] = useState('')
  const [rolesResult, setRolesResult] = useState<string | null>(null)
  const [teamResult, setTeamResult] = useState<string | null>(null)
  const [rolesValid, setRolesValid] = useState<boolean | null>(null)
  const [teamValid, setTeamValid] = useState<boolean | null>(null)

  const validateRoles = async () => {
    try {
      const roles = rolesInput.split(',').map((s) => s.trim()).filter(Boolean)
      const result = await rolesSchema.validate(roles.length ? roles : undefined)
      setRolesResult(`Valid (${result?.length} roles): ${JSON.stringify(result)}`)
      setRolesValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setRolesResult(`Error: ${err.message}`)
        setRolesValid(false)
      }
    }
  }

  const validateTeam = async () => {
    try {
      const team = teamInput.split(',').map((s) => s.trim()).filter(Boolean)
      const result = await teamSchema.validate(team.length ? team : undefined)
      setTeamResult(`Valid (${result?.length} members): ${JSON.stringify(result)}`)
      setTeamValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setTeamResult(`Error: ${err.message}`)
        setTeamValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>min, max, length for arrays</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>min(1) + max(3)</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: array().of(string()).min(1).max(3)
          </p>
          <div className="form-group">
            <label>Roles (comma-separated, 1-3):</label>
            <input
              value={rolesInput}
              onChange={(e) => setRolesInput(e.target.value)}
              placeholder="admin, editor, viewer"
            />
          </div>
          <button onClick={validateRoles}>Validate Roles</button>
          {rolesResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: rolesValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {rolesResult}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>length(5)</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: array().of(string()).length(5)
          </p>
          <div className="form-group">
            <label>Team members (comma-separated, exactly 5):</label>
            <input
              value={teamInput}
              onChange={(e) => setTeamInput(e.target.value)}
              placeholder="Alice, Bob, Charlie, Dave, Eve"
            />
          </div>
          <button onClick={validateTeam}>Validate Team</button>
          {teamResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: teamValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {teamResult}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 5.3: tuple — Solution
// ============================================

const coordinatesSchema = yup.tuple([
  yup.number().required('Latitude is required').min(-90).max(90),
  yup.number().required('Longitude is required').min(-180).max(180),
])

const personTupleSchema = yup.tuple([
  yup.string().required('Name is required').label('name'),
  yup.number().required('Age is required').positive().integer().label('age'),
  yup.string().required('Role is required').oneOf(['admin', 'user', 'guest']).label('role'),
])

export function Task5_3_Solution() {
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [tupleName, setTupleName] = useState('')
  const [tupleAge, setTupleAge] = useState('')
  const [tupleRole, setTupleRole] = useState('')
  const [coordResult, setCoordResult] = useState<string | null>(null)
  const [personResult, setPersonResult] = useState<string | null>(null)
  const [coordValid, setCoordValid] = useState<boolean | null>(null)
  const [personValid, setPersonValid] = useState<boolean | null>(null)

  const validateCoords = async () => {
    try {
      const data = [
        lat === '' ? undefined : Number(lat),
        lng === '' ? undefined : Number(lng),
      ] as [number | undefined, number | undefined]
      const result = await coordinatesSchema.validate(data)
      setCoordResult(`Valid coordinates: [${result?.[0]}, ${result?.[1]}]`)
      setCoordValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setCoordResult(`Error: ${err.message}`)
        setCoordValid(false)
      }
    }
  }

  const validatePerson = async () => {
    try {
      const data = [
        tupleName || undefined,
        tupleAge === '' ? undefined : Number(tupleAge),
        tupleRole || undefined,
      ] as [string | undefined, number | undefined, string | undefined]
      const result = await personTupleSchema.validate(data)
      setPersonResult(`Valid person: [${result?.[0]}, ${result?.[1]}, ${result?.[2]}]`)
      setPersonValid(true)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setPersonResult(`Error: ${err.message}`)
        setPersonValid(false)
      }
    }
  }

  return (
    <div className="exercise-container">
      <h2>tuple</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Coordinates [lat, lng]</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: tuple([number().min(-90).max(90), number().min(-180).max(180)])
          </p>
          <div className="form-group">
            <label>Latitude (-90 to 90):</label>
            <input
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="55.7558"
            />
          </div>
          <div className="form-group">
            <label>Longitude (-180 to 180):</label>
            <input
              type="number"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="37.6173"
            />
          </div>
          <button onClick={validateCoords}>Validate Coordinates</button>
          {coordResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: coordValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {coordResult}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Person [name, age, role]</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Schema: tuple([string(), number().positive(), string().oneOf([...])])
          </p>
          <div className="form-group">
            <label>Name:</label>
            <input
              value={tupleName}
              onChange={(e) => setTupleName(e.target.value)}
              placeholder="Alice"
            />
          </div>
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              value={tupleAge}
              onChange={(e) => setTupleAge(e.target.value)}
              placeholder="25"
            />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <select
              value={tupleRole}
              onChange={(e) => setTupleRole(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            >
              <option value="">-- select --</option>
              <option value="admin">admin</option>
              <option value="user">user</option>
              <option value="guest">guest</option>
            </select>
          </div>
          <button onClick={validatePerson}>Validate Person</button>
          {personResult && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: personValid ? '#e8f5e9' : '#ffebee',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              {personResult}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
