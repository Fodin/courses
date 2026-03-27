import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 0.1: Первая схема
// Task 0.1: First Schema
// ============================================

// TODO: Создайте схему userSchema с помощью yup.object() с полями:
//   - name: обязательная строка
//   - age: обязательное положительное число
//   - email: обязательная строка в формате email
// TODO: Create userSchema using yup.object() with fields:
//   - name: required string
//   - age: required positive number
//   - email: required email string

// TODO: Выведите тип UserData из схемы через yup.InferType
// TODO: Infer UserData type from schema using yup.InferType

export function Task0_1() {
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const handleValidate = async () => {
    // TODO: Вызовите userSchema.validate() с данными из полей
    //   - Используйте { abortEarly: false } для сбора всех ошибок
    //   - При успехе: сохраните результат в result (JSON.stringify)
    //   - При ошибке: проверьте instanceof yup.ValidationError и покажите ошибки
    // TODO: Call userSchema.validate() with field data
    //   - Use { abortEarly: false } to collect all errors
    //   - On success: save result to state (JSON.stringify)
    //   - On error: check instanceof yup.ValidationError and show errors
    console.log('Validate:', { name, age, email })
    setResult(null)
    setIsValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.0.1')}</h2>

      <div style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>

        <button onClick={handleValidate}>Validate</button>
      </div>

      {/* TODO: Покажите результат валидации:
          - Зелёный блок при успехе с данными
          - Красный блок при ошибке со списком ошибок */}
      {/* TODO: Show validation result:
          - Green block on success with data
          - Red block on error with error list */}
    </div>
  )
}
