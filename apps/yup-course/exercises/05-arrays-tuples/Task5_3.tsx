import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 5.3: tuple
// Task 5.3: tuple
// ============================================

// TODO: Создайте coordinatesSchema — yup.tuple([
//   yup.number().required('Latitude is required').min(-90).max(90),
//   yup.number().required('Longitude is required').min(-180).max(180),
// ])
// TODO: Create coordinatesSchema — yup.tuple([...])

// TODO: Создайте personTupleSchema — yup.tuple([
//   yup.string().required('Name is required').label('name'),
//   yup.number().required('Age is required').positive().integer().label('age'),
//   yup.string().required('Role is required').oneOf(['admin', 'user', 'guest']).label('role'),
// ])
// TODO: Create personTupleSchema — yup.tuple([...])

export function Task5_3() {
  const { t } = useLanguage()
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
    // TODO: Соберите массив [lat, lng] из полей
    //   - Пустые строки замените на undefined, иначе Number()
    //   - Валидируйте через coordinatesSchema.validate()
    //   - При успехе: покажите координаты
    //   - При ошибке: покажите err.message
    // TODO: Build array [lat, lng] from fields
    console.log('Validate coords:', lat, lng)
    setCoordResult(null)
    setCoordValid(null)
  }

  const validatePerson = async () => {
    // TODO: Соберите массив [name, age, role] из полей
    //   - Пустые строки замените на undefined
    //   - Валидируйте через personTupleSchema.validate()
    // TODO: Build array [name, age, role] from fields
    console.log('Validate person:', tupleName, tupleAge, tupleRole)
    setPersonResult(null)
    setPersonValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.5.3')}</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Coordinates [lat, lng]</h3>
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
          {/* TODO: Покажите coordResult в цветном блоке */}
          {/* TODO: Show coordResult in colored block */}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Person [name, age, role]</h3>
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
          {/* TODO: Покажите personResult в цветном блоке */}
          {/* TODO: Show personResult in colored block */}
        </div>
      </div>
    </div>
  )
}
