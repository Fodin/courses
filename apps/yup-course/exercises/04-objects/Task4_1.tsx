import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 4.1: object и shape
// Task 4.1: object and shape
// ============================================

// TODO: Создайте userSchema — yup.object() с полями:
//   - name: yup.string().required('Name is required').min(2, 'Name too short')
//   - age: yup.number().required('Age is required').positive().integer()
//   - email: yup.string().required('Email is required').email('Invalid email')
// TODO: Create userSchema — yup.object() with fields:
//   - name: yup.string().required('Name is required').min(2, 'Name too short')
//   - age: yup.number().required('Age is required').positive().integer()
//   - email: yup.string().required('Email is required').email('Invalid email')

export function Task4_1() {
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)

  const validate = async () => {
    // TODO: Соберите объект data из полей формы
    //   - name: пустую строку замените на undefined
    //   - age: пустую строку замените на undefined, иначе Number(age)
    //   - email: пустую строку замените на undefined
    // TODO: Build data object from form fields
    //   - name: replace empty string with undefined
    //   - age: replace empty string with undefined, otherwise Number(age)
    //   - email: replace empty string with undefined

    // TODO: Валидируйте через userSchema.validate(data, { abortEarly: false })
    //   - При успехе: setResult(JSON.stringify(validated, null, 2)), setValid(true)
    //   - При ошибке: setResult(err.errors.join('; ')), setValid(false)
    // TODO: Validate via userSchema.validate(data, { abortEarly: false })
    console.log('Validate user:', name, age, email)
    setResult(null)
    setValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.4.1')}</h2>

      <div style={{ maxWidth: '400px' }}>
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

        {/* TODO: Покажите result в <pre> блоке с цветным фоном */}
        {/* TODO: Show result in <pre> block with colored background */}
      </div>
    </div>
  )
}
