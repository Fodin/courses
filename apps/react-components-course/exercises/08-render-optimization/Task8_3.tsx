import { useState, useCallback, useRef, memo } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.3: FilterPanel — useCallback + React.memo
// ============================================
//
// FilterPanel с пятью независимыми фильтрами: категория, цена, рейтинг, скидка, сортировка.
// Каждый фильтр — отдельный компонент с render counter.
//
// Задача:
// 1. Добавь render counters (useRef) во все 5 компонентов
// 2. Убедись что при смене одного фильтра ре-рендерятся все 5 (исходная проблема)
// 3. Оберни каждый компонент фильтра в React.memo
// 4. Стабилизируй каждый onChange через useCallback с функциональным setState(prev => ...)
// 5. Убедись что при смене Category ре-рендерится только CategoryFilter

interface Filters {
  category: string
  minPrice: number
  maxPrice: number
  minRating: number
  hasDiscount: boolean
  sort: 'price_asc' | 'price_desc' | 'rating' | 'popular'
}

const INITIAL_FILTERS: Filters = {
  category: 'all',
  minPrice: 0,
  maxPrice: 50000,
  minRating: 0,
  hasDiscount: false,
  sort: 'popular',
}

// TODO: Добавь render counter + оберни в React.memo
// const CategoryFilter = memo(function CategoryFilter(...) { ... })
function CategoryFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  // const renderCount = useRef(0)
  // renderCount.current++

  const categories = [
    { id: 'all', label: 'Все' },
    { id: 'laptops', label: 'Ноутбуки' },
    { id: 'phones', label: 'Смартфоны' },
    { id: 'accessories', label: 'Аксессуары' },
  ]

  return (
    <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
      {/* TODO: Добавь render counter badge */}
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>Категория</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            style={{
              padding: '3px 10px',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: value === cat.id ? '#1976d2' : '#ddd',
              background: value === cat.id ? '#1976d2' : '#fff',
              color: value === cat.id ? '#fff' : '#555',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// TODO: Добавь render counter + оберни в React.memo
function PriceFilter({
  minValue,
  maxValue,
  onChange,
}: {
  minValue: number
  maxValue: number
  onChange: (min: number, max: number) => void
}) {
  // const renderCount = useRef(0)
  // renderCount.current++

  return (
    <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
      {/* TODO: Добавь render counter badge */}
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>
        Цена: {minValue.toLocaleString('ru-RU')} — {maxValue.toLocaleString('ru-RU')} ₽
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.78rem' }}>
          <span style={{ width: 20 }}>от</span>
          <input
            type="range" min={0} max={50000} step={1000}
            value={minValue}
            onChange={e => onChange(Number(e.target.value), maxValue)}
            style={{ flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.78rem' }}>
          <span style={{ width: 20 }}>до</span>
          <input
            type="range" min={0} max={50000} step={1000}
            value={maxValue}
            onChange={e => onChange(minValue, Number(e.target.value))}
            style={{ flex: 1 }}
          />
        </div>
      </div>
    </div>
  )
}

// TODO: Добавь render counter + оберни в React.memo
function RatingFilter({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  // const renderCount = useRef(0)
  // renderCount.current++

  return (
    <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
      {/* TODO: Добавь render counter badge */}
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>Рейтинг от {value}</div>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[0, 1, 2, 3, 4].map(rating => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            style={{
              padding: '3px 8px',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: value === rating ? '#f9a825' : '#ddd',
              background: value === rating ? '#fff8e1' : '#fff',
              color: value === rating ? '#f9a825' : '#888',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {rating === 0 ? 'Любой' : '★'.repeat(rating)}
          </button>
        ))}
      </div>
    </div>
  )
}

// TODO: Добавь render counter + оберни в React.memo
function DiscountFilter({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
  // const renderCount = useRef(0)
  // renderCount.current++

  return (
    <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
      {/* TODO: Добавь render counter badge */}
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>Скидка</div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
        <input
          type="checkbox"
          checked={value}
          onChange={e => onChange(e.target.checked)}
          style={{ width: 16, height: 16, cursor: 'pointer' }}
        />
        Только со скидкой
      </label>
    </div>
  )
}

// TODO: Добавь render counter + оберни в React.memo
function SortFilter({ value, onChange }: { value: Filters['sort']; onChange: (value: Filters['sort']) => void }) {
  // const renderCount = useRef(0)
  // renderCount.current++

  return (
    <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
      {/* TODO: Добавь render counter badge */}
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>Сортировка</div>
      <select
        value={value}
        onChange={e => onChange(e.target.value as Filters['sort'])}
        style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem' }}
      >
        <option value="popular">По популярности</option>
        <option value="price_asc">Цена: по возрастанию</option>
        <option value="price_desc">Цена: по убыванию</option>
        <option value="rating">По рейтингу</option>
      </select>
    </div>
  )
}

export function Task8_3() {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)

  // TODO: Оберни каждый обработчик в useCallback
  // Используй функциональный setState: setFilters(prev => ({ ...prev, field: value }))
  // Это позволит передать пустой массив зависимостей [] — функции создаются один раз
  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value }))
  }

  const handlePriceChange = (min: number, max: number) => {
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))
  }

  const handleRatingChange = (value: number) => {
    setFilters(prev => ({ ...prev, minRating: value }))
  }

  const handleDiscountChange = (value: boolean) => {
    setFilters(prev => ({ ...prev, hasDiscount: value }))
  }

  const handleSortChange = (value: Filters['sort']) => {
    setFilters(prev => ({ ...prev, sort: value }))
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 8.3 — FilterPanel</h2>
      <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Добавь memo + useCallback. При смене одного фильтра должен ре-рендериться только он.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <CategoryFilter value={filters.category} onChange={handleCategoryChange} />
        <PriceFilter minValue={filters.minPrice} maxValue={filters.maxPrice} onChange={handlePriceChange} />
        <RatingFilter value={filters.minRating} onChange={handleRatingChange} />
        <DiscountFilter value={filters.hasDiscount} onChange={handleDiscountChange} />
        <SortFilter value={filters.sort} onChange={handleSortChange} />
      </div>

      {/* Текущие значения для проверки */}
      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #e9ecef' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.4rem', color: '#555' }}>Активные фильтры:</div>
        <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.8rem', color: '#333' }}>
          {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    </div>
  )
}

// Чтобы TypeScript не ругался на неиспользуемые импорты до реализации
void useCallback
void useRef
void memo
