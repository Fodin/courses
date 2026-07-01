import { useState, useCallback, useEffect } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 12.2: Композиция хуков
//
// Цель: реализовать три компонуемых хука через FP-принципы:
//       useValidation, useDebouncedValue, useFilteredList.
// ============================================================

// --- Types ---

type ValidationRule = (value: string) => string[]

interface Product {
  id: number
  name: string
  category: string
  price: number
}

type FilterFn<T> = (item: T) => boolean

const PRODUCTS: Product[] = [
  { id: 1, name: 'Apple', category: 'Fruits', price: 1.2 },
  { id: 2, name: 'Banana', category: 'Fruits', price: 0.5 },
  { id: 3, name: 'Carrot', category: 'Vegetables', price: 0.8 },
  { id: 4, name: 'Broccoli', category: 'Vegetables', price: 1.5 },
  { id: 5, name: 'Cherry', category: 'Fruits', price: 3.0 },
  { id: 6, name: 'Potato', category: 'Vegetables', price: 0.4 },
  { id: 7, name: 'Orange', category: 'Fruits', price: 0.9 },
  { id: 8, name: 'Spinach', category: 'Vegetables', price: 2.1 },
]

const CATEGORIES = ['All', 'Fruits', 'Vegetables']

// ============================================================
// TODO 1: Реализуй функцию pipeRules
//
// Принимает произвольное количество ValidationRule.
// Возвращает новый ValidationRule, который запускает
// ВСЕ правила по порядку и собирает их ошибки в один массив.
//
// Используй flatMap или reduce.
// ============================================================
function pipeRules(..._rules: ValidationRule[]): ValidationRule {
  // TODO: return (value) => _rules.flatMap(rule => rule(value))
  return (_value: string) => [] // заглушка
}

// ============================================================
// TODO 2: Реализуй фабрики правил валидации
//
// checkRequired(msg) — ошибка если строка пустая (после trim)
// checkMinLength(min, msg) — ошибка если длина < min (непустых строк)
// checkPattern(pattern, msg) — ошибка если не совпадает regex (непустых строк)
//
// Каждая функция возвращает ValidationRule: (value) => string[]
// ============================================================
const checkRequired = (_msg: string): ValidationRule =>
  (_value: string) => [] // TODO: реализовать

const checkMinLength = (_min: number, _msg: string): ValidationRule =>
  (_value: string) => [] // TODO: реализовать

const checkPattern = (_pattern: RegExp, _msg: string): ValidationRule =>
  (_value: string) => [] // TODO: реализовать

// ============================================================
// TODO 3: Реализуй хук useValidation
//
// Принимает массив правил ValidationRule[].
// Возвращает { errors: string[], touch: (value: string) => void }
//
// touch(value) запускает все правила и сохраняет результат в errors.
// ============================================================
function useValidation(_rules: ValidationRule[]): {
  errors: string[]
  touch: (value: string) => void
} {
  const [errors, setErrors] = useState<string[]>([])

  const touch = useCallback((_value: string) => {
    // TODO: вызвать pipeRules(..._rules)(value), записать результат в errors
    setErrors([]) // заглушка
  }, [])

  return { errors, touch }
}

// ============================================================
// TODO 4: Реализуй хук useDebouncedValue
//
// Возвращает значение, которое обновляется с задержкой delay мс.
// При изменении value — запускает setTimeout.
// При отмонтировании или изменении value — очищает таймер.
//
// Используй useState + useEffect + clearTimeout.
// ============================================================
function useDebouncedValue<T>(value: T, _delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    // TODO: setTimeout → setDebounced(value), return cleanup
    // const id = setTimeout(() => setDebounced(value), _delay)
    // return () => clearTimeout(id)
    setDebounced(value) // заглушка без дебаунса
  }, [value, _delay])

  return debounced
}

// ============================================================
// TODO 5: Реализуй хук useFilteredList
//
// Принимает items: T[] и filters: FilterFn<T>[]
// Возвращает items, прошедшие ВСЕ фильтры (логическое AND).
//
// Используй Array.filter + Array.every.
// ============================================================
function useFilteredList<T>(items: T[], _filters: FilterFn<T>[]): T[] {
  // TODO: return items.filter(item => _filters.every(f => f(item)))
  return items // заглушка — возвращает все
}

// ============================================================
// TODO 6: Реализуй фабрики фильтров для продуктов
//
// byCategory(cat) — если cat === 'All', пропускать всё; иначе сравнивать
// byPriceRange(min, max) — price >= min && price <= max
// bySearchTerm(term) — name включает term (нечувствительно к регистру)
// ============================================================
const byCategory = (_cat: string): FilterFn<Product> =>
  (_item: Product) => true // TODO

const byPriceRange = (_min: number, _max: number): FilterFn<Product> =>
  (_item: Product) => true // TODO

const bySearchTerm = (_term: string): FilterFn<Product> =>
  (_item: Product) => true // TODO

// ============================================================
// Компонент задания — завершите TODO выше, UI готов
// ============================================================

export function Task12_2() {
  const { t } = useLanguage()

  // Hook 1: validation
  const { errors, touch } = useValidation([
    checkRequired('Обязательное поле'),
    checkMinLength(3, 'Минимум 3 символа'),
    checkPattern(/^[a-zA-Z]+$/, 'Только латинские буквы'),
  ])
  const [nameValue, setNameValue] = useState('')

  // Hook 2: debounce
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebouncedValue(searchTerm, 300)

  // Hook 3: filters
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(5)

  const filtered = useFilteredList(PRODUCTS, [
    byCategory(selectedCategory),
    byPriceRange(minPrice, maxPrice),
    bySearchTerm(debouncedSearch),
  ])

  const inputStyle: React.CSSProperties = {
    padding: '0.35rem 0.6rem',
    background: '#0f172a',
    border: '1px solid #374151',
    color: '#e5e7eb',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '0.82rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  }

  const panelStyle: React.CSSProperties = {
    background: '#1f2937',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.12.2')}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Hook 1: Validation */}
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0, color: '#f9fafb', fontSize: '0.9rem' }}>useValidation — поле "Имя"</h3>
          <input
            style={inputStyle}
            value={nameValue}
            onChange={e => {
              setNameValue(e.target.value)
              touch(e.target.value)
            }}
            placeholder="Введите имя (только латиница, от 3 символов)..."
          />
          <div style={{ marginTop: '0.5rem' }}>
            {errors.length > 0 ? (
              errors.map((err, i) => (
                <div key={i} style={{ color: '#fca5a5', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                  {err}
                </div>
              ))
            ) : nameValue.length > 0 ? (
              <div style={{ color: '#86efac', fontSize: '0.75rem' }}>Валидно</div>
            ) : null}
          </div>
        </div>

        {/* Hook 2: Debounce */}
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0, color: '#f9fafb', fontSize: '0.9rem' }}>useDebouncedValue (300ms)</h3>
          <input
            style={inputStyle}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Поиск продукта..."
          />
          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
            <span style={{ color: '#9ca3af' }}>
              Сейчас: <span style={{ color: '#e5e7eb' }}>{searchTerm || '(пусто)'}</span>
            </span>
            <span style={{ color: '#9ca3af' }}>
              Дебаунс: <span style={{ color: '#93c5fd' }}>{debouncedSearch || '(пусто)'}</span>
            </span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: 0 }}>
            Значения должны различаться во время печати
          </p>
        </div>
      </div>

      {/* Hook 3: FilteredList */}
      <div style={panelStyle}>
        <h3 style={{ marginTop: 0, color: '#f9fafb', fontSize: '0.9rem' }}>
          useFilteredList — продукты ({filtered.length} / {PRODUCTS.length})
        </h3>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? '#1e3a5f' : '#374151',
                color: selectedCategory === cat ? '#93c5fd' : '#e5e7eb',
                border: `1px solid ${selectedCategory === cat ? '#3b82f6' : '#4b5563'}`,
                borderRadius: '6px',
                padding: '0.25rem 0.75rem',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
          Цена: ${minPrice.toFixed(1)} – ${maxPrice.toFixed(1)}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="range" min={0} max={5} step={0.1}
            value={minPrice}
            onChange={e => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
            style={{ flex: 1, accentColor: '#3b82f6' }}
          />
          <input
            type="range" min={0} max={5} step={0.1}
            value={maxPrice}
            onChange={e => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
            style={{ flex: 1, accentColor: '#3b82f6' }}
          />
        </div>

        <div>
          {filtered.map(p => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.3rem 0.5rem',
                borderRadius: '4px',
                background: '#111827',
                marginBottom: '0.25rem',
                fontSize: '0.8rem',
              }}
            >
              <span style={{ color: '#e5e7eb' }}>{p.name}</span>
              <span style={{ color: '#9ca3af' }}>{p.category}</span>
              <span style={{ color: '#86efac' }}>${p.price.toFixed(2)}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>Нет результатов</p>
          )}
        </div>
      </div>
    </div>
  )
}
