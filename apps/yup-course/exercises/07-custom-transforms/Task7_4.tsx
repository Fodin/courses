import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// import * as yup from 'yup'

// ============================================
// Задание 7.4: Цепочки трансформаций
// Task 7.4: Transform chains
// ============================================

// TODO: Создайте productSchema — yup.object({
//   sku: yup.string()
//     .transform(v => v?.trim().toUpperCase())         // 1. trim + upper
//     .transform(v => v?.replace(/\s+/g, '-'))          // 2. spaces → dashes
//     .test('sku-format', 'SKU must be like ABC-123',   // 3. test format
//       (v) => !v || /^[A-Z]+-\d+$/.test(v))
//     .required('SKU required'),
//   price: yup.string()
//     .transform(v => v?.replace(',', '.'))              // 1. comma → dot
//     .transform(v => v?.replace(/[^\d.]/g, ''))         // 2. strip non-numeric
//     .test('valid-price', 'Invalid price', function(v) { // 3. test (use function!)
//       if (!v) return true
//       const num = parseFloat(v)
//       if (isNaN(num)) return this.createError({ message: `"${v}" is not a number` })
//       if (num <= 0) return this.createError({ message: 'Price must be positive' })
//       return true
//     })
//     .required('Price required'),
//   tags: yup.string()
//     .transform(v => v?.trim().toLowerCase())           // 1. trim + lower
//     .transform(v => v?.replace(/,\s*/g, ', '))         // 2. normalize commas
//     .test('min-tags', 'At least 2 tags required',      // 3. test count
//       (v) => !v || v.split(', ').filter(Boolean).length >= 2)
//     .required('Tags required'),
// })
// TODO: Create productSchema with chained transforms + tests for sku, price, tags

export function Task7_4() {
  const { t } = useLanguage()
  const [sku, setSku] = useState('  abc 123  ')
  const [price, setPrice] = useState('$19,99')
  const [tags, setTags] = useState('React,  TypeScript,yup')
  const [result, setResult] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const validate = async () => {
    // TODO: Валидируйте { sku, price, tags } через productSchema
    //   - abortEarly: false
    //   - Покажите трансформированный результат
    // TODO: Validate { sku, price, tags } with productSchema
    console.log('Validate:', { sku, price, tags })
    setResult(null)
    setIsValid(null)
  }

  const castOnly = () => {
    // TODO: Используйте productSchema.cast({ sku, price, tags })
    // TODO: Use productSchema.cast() to show transformed data
    console.log('Cast:', { sku, price, tags })
    setResult(null)
    setIsValid(null)
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.7.4')}</h2>

      <div className="form-group">
        <label>SKU (trim → uppercase → spaces to dashes):</label>
        <input value={sku} onChange={(e) => setSku(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Price (comma → dot → strip non-numeric):</label>
        <input value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Tags (trim → lowercase → normalize commas):</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={validate}>Validate</button>
        <button onClick={castOnly} style={{ background: '#1976d2' }}>Cast Only</button>
      </div>

      {/* TODO: Покажите result в цветном блоке с whiteSpace: 'pre-wrap' */}
      {/* TODO: Show result in colored block with whiteSpace: 'pre-wrap' */}
    </div>
  )
}
