import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 5.2: min, max, length для массивов
// Task 5.2: min, max, length for arrays
// ============================================

// TODO: Создайте rolesSchema — yup.array().of(string().required()).required().min(1).max(3)
// TODO: Create rolesSchema — yup.array().of(string().required()).required().min(1).max(3)

// TODO: Создайте teamSchema — yup.array().of(string().required()).required().length(5)
// TODO: Create teamSchema — yup.array().of(string().required()).required().length(5)

export function Task5_2() {
  const { t } = useLanguage()
  const [rolesInput, setRolesInput] = useState('admin, editor')
  const [teamInput, setTeamInput] = useState('')
  const [rolesResult, setRolesResult] = useState<string | null>(null)
  const [teamResult, setTeamResult] = useState<string | null>(null)
  const [rolesValid, setRolesValid] = useState<boolean | null>(null)
  const [teamValid, setTeamValid] = useState<boolean | null>(null)

  const validateRoles = async () => {
    // TODO: Распарсите rolesInput по запятой
    //   - Валидируйте через rolesSchema
    //   - При успехе: покажите количество ролей и JSON
    //   - При ошибке: покажите err.message
    // TODO: Parse rolesInput by comma, validate via rolesSchema
    console.log('Validate roles:', rolesInput)
    setRolesResult(null)
    setRolesValid(null)
  }

  const validateTeam = async () => {
    // TODO: Распарсите teamInput по запятой
    //   - Валидируйте через teamSchema
    //   - При успехе: покажите количество участников и JSON
    // TODO: Parse teamInput by comma, validate via teamSchema
    console.log('Validate team:', teamInput)
    setTeamResult(null)
    setTeamValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.5.2')}</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>min(1) + max(3)</h3>
          <div className="form-group">
            <label>Roles (comma-separated, 1-3):</label>
            <input
              value={rolesInput}
              onChange={(e) => setRolesInput(e.target.value)}
              placeholder="admin, editor, viewer"
            />
          </div>
          <button onClick={validateRoles}>Validate Roles</button>
          {/* TODO: Покажите rolesResult в цветном блоке */}
          {/* TODO: Show rolesResult in colored block */}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>length(5)</h3>
          <div className="form-group">
            <label>Team members (comma-separated, exactly 5):</label>
            <input
              value={teamInput}
              onChange={(e) => setTeamInput(e.target.value)}
              placeholder="Alice, Bob, Charlie, Dave, Eve"
            />
          </div>
          <button onClick={validateTeam}>Validate Team</button>
          {/* TODO: Покажите teamResult в цветном блоке */}
          {/* TODO: Show teamResult in colored block */}
        </div>
      </div>
    </div>
  )
}
