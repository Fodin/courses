import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 4.4: noUnknown и strict
// Task 4.4: noUnknown and strict
// ============================================

// TODO: Создайте strictUserSchema — yup.object() с полями name и email,
//   добавьте .noUnknown('Unknown field: ${unknown}')
// TODO: Create strictUserSchema — yup.object() with name and email,
//   add .noUnknown('Unknown field: ${unknown}')

export function Task4_4() {
  const { t } = useLanguage()
  const [input, setInput] = useState('{"name": "Alice", "email": "alice@test.com", "extra": "field"}')
  const [useStrict, setUseStrict] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)

  const validate = async () => {
    // TODO: Распарсите JSON из input
    // TODO: Валидируйте через strictUserSchema.validate(data, {
    //   abortEarly: false,
    //   strict: useStrict,
    //   stripUnknown: !useStrict,
    // })
    // TODO: Parse JSON from input
    // TODO: Validate via strictUserSchema.validate(data, { ... })
    console.log('Validate strict:', useStrict)
    setResult(null)
    setValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.4.4')}</h2>

      <div style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>JSON data (try adding extra fields):</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.85rem', padding: '0.5rem' }}
          />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={useStrict}
            onChange={(e) => setUseStrict(e.target.checked)}
            id="strict-mode"
          />
          <label htmlFor="strict-mode">
            strict: true
          </label>
        </div>

        <button onClick={validate}>Validate</button>

        {/* TODO: Покажите подпись о текущем режиме */}
        {/* TODO: Show hint about current mode */}

        {/* TODO: Покажите result в <pre> блоке с цветным фоном */}
        {/* TODO: Show result in <pre> block with colored background */}
      </div>
    </div>
  )
}
