import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 2.3: matches (regex)
// Task 2.3: matches (regex)
// ============================================

// TODO: Создайте phoneSchema — валидация российского номера:
//   yup.string().required().matches(/^\+7\d{10}$/, 'Phone must be +7XXXXXXXXXX')
// TODO: Create phoneSchema — Russian phone validation:
//   yup.string().required().matches(/^\+7\d{10}$/, 'Phone must be +7XXXXXXXXXX')

// TODO: Создайте hexColorSchema — валидация hex-цвета:
//   yup.string().required().matches(/^#[0-9A-Fa-f]{6}$/, 'Must be valid hex color')
// TODO: Create hexColorSchema — hex color validation:
//   yup.string().required().matches(/^#[0-9A-Fa-f]{6}$/, 'Must be valid hex color')

export function Task2_3() {
  const { t } = useLanguage()
  const [phoneInput, setPhoneInput] = useState('')
  const [colorInput, setColorInput] = useState('')
  const [phoneResult, setPhoneResult] = useState<string | null>(null)
  const [colorResult, setColorResult] = useState<string | null>(null)
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null)
  const [colorValid, setColorValid] = useState<boolean | null>(null)

  const validatePhone = async () => {
    // TODO: Валидируйте phoneInput через phoneSchema.validate()
    // TODO: Validate phoneInput via phoneSchema.validate()
    console.log('Validate phone:', phoneInput)
    setPhoneResult(null)
    setPhoneValid(null)
  }

  const validateColor = async () => {
    // TODO: Валидируйте colorInput через hexColorSchema.validate()
    // TODO: Validate colorInput via hexColorSchema.validate()
    console.log('Validate color:', colorInput)
    setColorResult(null)
    setColorValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.2.3')}</h2>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Phone number</h3>
          <div className="form-group">
            <input
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="+79001234567"
            />
          </div>
          <button onClick={validatePhone}>Validate Phone</button>
          {/* TODO: Покажите phoneResult в цветном блоке */}
          {/* TODO: Show phoneResult in colored block */}
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3>Hex color</h3>
          <div className="form-group">
            <input
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="#FF0000"
            />
          </div>
          <button onClick={validateColor}>Validate Color</button>
          {/* TODO: Покажите colorResult в цветном блоке */}
          {/* TODO: Show colorResult in colored block */}

          {/* TODO: При успешной валидации цвета покажите квадрат-превью с этим цветом */}
          {/* TODO: On successful color validation show a preview square with the color */}
        </div>
      </div>
    </div>
  )
}
