import { useState, useCallback, useRef, memo } from 'react'

// ============================================
// Общие утилиты
// ============================================

function RenderBadge({ count }: { count: number }) {
  return (
    <span style={{
      display: 'inline-block',
      background: count > 5 ? '#ff7043' : count > 2 ? '#ffa726' : '#66bb6a',
      color: '#fff',
      fontSize: '0.7rem',
      fontWeight: 700,
      padding: '1px 6px',
      borderRadius: '10px',
      marginLeft: '6px',
      fontFamily: 'monospace',
    }}>
      renders: {count}
    </span>
  )
}

// ============================================
// Task 8.1 Solution: Чат-приложение — диагностика и исправление
// ============================================

interface Message {
  id: string
  author: string
  text: string
  time: string
}

interface OnlineUser {
  id: string
  name: string
  avatar: string
  status: 'online' | 'away'
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', author: 'Анна', text: 'Привет всем! Как дела?', time: '14:01' },
  { id: '2', author: 'Борис', text: 'Отлично, работаем над проектом!', time: '14:03' },
  { id: '3', author: 'Анна', text: 'Кто смотрел последний доклад по React 19?', time: '14:05' },
  { id: '4', author: 'Виктор', text: 'Да, очень интересно про Actions и use()', time: '14:07' },
  { id: '5', author: 'Борис', text: 'Compiler тоже впечатлил — может убрать необходимость memo', time: '14:09' },
]

const ONLINE_USERS: OnlineUser[] = [
  { id: 'u1', name: 'Анна', avatar: 'А', status: 'online' },
  { id: 'u2', name: 'Борис', avatar: 'Б', status: 'online' },
  { id: 'u3', name: 'Виктор', avatar: 'В', status: 'away' },
  { id: 'u4', name: 'Галина', avatar: 'Г', status: 'online' },
]

// MessageList — с React.memo и render counter
const MessageList = memo(function MessageList({ messages }: { messages: Message[] }) {
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}>
      <div style={{
        position: 'sticky',
        top: 0,
        fontSize: '0.7rem',
        color: '#888',
        background: '#f8f9fa',
        padding: '2px 6px',
        borderRadius: '4px',
        marginBottom: '0.25rem',
        zIndex: 1,
      }}>
        MessageList <RenderBadge count={renderCount.current} />
      </div>
      {messages.map(msg => (
        <div key={msg.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#1976d2', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
          }}>
            {msg.author[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', marginBottom: '2px' }}>
              <strong style={{ fontSize: '0.85rem' }}>{msg.author}</strong>
              <span style={{ fontSize: '0.7rem', color: '#999' }}>{msg.time}</span>
            </div>
            <div style={{
              padding: '0.5rem 0.75rem',
              background: '#fff',
              border: '1px solid #e9ecef',
              borderRadius: '0 8px 8px 8px',
              fontSize: '0.9rem',
              lineHeight: 1.5,
            }}>
              {msg.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})

// MessageInput — хранит свой state (state down) + render counter
const MessageInput = memo(function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState('')
  const renderCount = useRef(0)
  renderCount.current++

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{
      padding: '0.75rem',
      borderTop: '1px solid #e9ecef',
      background: '#fff',
    }}>
      <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.35rem' }}>
        MessageInput <RenderBadge count={renderCount.current} />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение... (Enter — отправить)"
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            border: '1px solid #ddd',
            borderRadius: '20px',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          style={{
            padding: '0.5rem 1rem',
            background: text.trim() ? '#1976d2' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            cursor: text.trim() ? 'pointer' : 'default',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          Отправить
        </button>
      </div>
    </div>
  )
})

// OnlineUsers — с React.memo и render counter
const OnlineUsers = memo(function OnlineUsers({ users }: { users: OnlineUser[] }) {
  const renderCount = useRef(0)
  renderCount.current++

  const onlineCount = users.filter(u => u.status === 'online').length

  return (
    <div style={{
      width: 180,
      borderLeft: '1px solid #e9ecef',
      padding: '0.75rem',
      background: '#fafafa',
      flexShrink: 0,
    }}>
      <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.5rem' }}>
        OnlineUsers <RenderBadge count={renderCount.current} />
      </div>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: '0.5rem' }}>
        Онлайн: {onlineCount}
      </div>
      {users.map(user => (
        <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: '#e8eaf6', color: '#3f51b5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700,
            }}>
              {user.avatar}
            </div>
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 8, height: 8, borderRadius: '50%',
              background: user.status === 'online' ? '#4caf50' : '#ff9800',
              border: '1px solid #fff',
            }} />
          </div>
          <div style={{ fontSize: '0.8rem', color: user.status === 'online' ? '#333' : '#999' }}>
            {user.name}
          </div>
        </div>
      ))}
    </div>
  )
})

export function Task8_1_Solution() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)

  // useCallback — стабильная ссылка для React.memo на MessageInput
  const handleSend = useCallback((text: string) => {
    const now = new Date()
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      author: 'Вы',
      text,
      time,
    }])
  }, [])

  return (
    <div className="exercise-container">
      <h2>Решение 8.1: Оптимизированный чат</h2>
      <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
        Печатайте текст — счётчик растёт только у <strong>MessageInput</strong>.
        MessageList и OnlineUsers защищены React.memo. InputText перенесён внутрь MessageInput (state down).
      </p>

      <div style={{
        border: '1px solid #e9ecef',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 480,
      }}>
        {/* Header */}
        <div style={{
          padding: '0.75rem 1rem',
          background: '#1976d2',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontWeight: 600 }}>React Chat</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>{ONLINE_USERS.filter(u => u.status === 'online').length} онлайн</div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: '#f8f9fa' }}>
          <MessageList messages={messages} />
          <OnlineUsers users={ONLINE_USERS} />
        </div>

        <MessageInput onSend={handleSend} />
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px', fontSize: '0.82rem', color: '#2e7d32' }}>
        <strong>Что сделано:</strong> state inputText перенесён в MessageInput (state down) → MessageList и OnlineUsers обёрнуты в React.memo → onSend стабилизирован useCallback
      </div>
    </div>
  )
}

// ============================================
// Task 8.2 Solution: State down / Children up — без memo
// ============================================

// Тяжёлый компонент — симулирует дорогой рендер
function HeavyPreview({ label }: { label: string }) {
  const renderCount = useRef(0)
  renderCount.current++

  // Симулируем "тяжёлый" компонент
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    color: `hsl(${i * 30}, 60%, ${50 + i * 2}%)`,
  }))

  return (
    <div style={{
      padding: '0.75rem',
      background: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
    }}>
      <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>
        {label} <RenderBadge count={renderCount.current} />
      </div>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {items.map(item => (
          <div key={item.id} style={{
            width: 32, height: 32,
            borderRadius: '6px',
            background: item.color,
          }} />
        ))}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
        Тяжёлый компонент: рендеры выше = лишняя работа
      </div>
    </div>
  )
}

// Вариант 1: State DOWN
// ColorPicker сам владеет своим state — HeavyPreview рядом, не потомок
function ColorPickerStateDown() {
  const [color, setColor] = useState('#1976d2')
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.75rem', background: '#fff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
      <div style={{
        width: 36, height: 36,
        borderRadius: '50%',
        background: color,
        border: '2px solid #ddd',
        flexShrink: 0,
      }} />
      <div>
        <div style={{ fontSize: '0.7rem', color: '#888' }}>
          ColorPicker (state здесь) <RenderBadge count={renderCount.current} />
        </div>
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          style={{ width: 80, height: 24, cursor: 'pointer', border: 'none', padding: 0 }}
        />
        <span style={{ marginLeft: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>{color}</span>
      </div>
    </div>
  )
}

// Вариант 2: Children UP
// ColorWrapper хранит state, HeavyPreview передаётся как children — не является потомком по коду
function ColorWrapper({ children }: { children: React.ReactNode }) {
  const [color, setColor] = useState('#388e3c')
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <div style={{
      padding: '0.75rem',
      background: color + '18',
      borderRadius: '8px',
      border: `2px solid ${color}`,
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{
          width: 36, height: 36,
          borderRadius: '50%',
          background: color,
          border: '2px solid #ddd',
          flexShrink: 0,
        }} />
        <div>
          <div style={{ fontSize: '0.7rem', color: '#555' }}>
            ColorWrapper (state здесь) <RenderBadge count={renderCount.current} />
          </div>
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            style={{ width: 80, height: 24, cursor: 'pointer', border: 'none', padding: 0 }}
          />
        </div>
      </div>
      {children}
    </div>
  )
}

export function Task8_2_Solution() {
  return (
    <div className="exercise-container">
      <h2>Решение 8.2: State down / Children up — без memo</h2>
      <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Меняйте цвета в обоих вариантах. Счётчик у HeavyPreview не должен расти.
        React.memo не используется — только структурные изменения.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Вариант 1: State down */}
        <div>
          <div style={{
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            padding: '0.25rem 0.75rem',
            background: '#e3f2fd',
            borderRadius: '4px',
            display: 'inline-block',
          }}>
            Вариант 1: State down
          </div>
          <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0.5rem' }}>
            State перенесён в ColorPicker. HeavyPreview — сосед, не потомок.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <ColorPickerStateDown />
            <HeavyPreview label="HeavyPreview (сосед ColorPicker)" />
          </div>
        </div>

        {/* Вариант 2: Children up */}
        <div>
          <div style={{
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            padding: '0.25rem 0.75rem',
            background: '#e8f5e9',
            borderRadius: '4px',
            display: 'inline-block',
          }}>
            Вариант 2: Children up
          </div>
          <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0.5rem' }}>
            HeavyPreview передаётся как children — создаётся снаружи ColorWrapper, не зависит от его state.
          </p>
          <ColorWrapper>
            <HeavyPreview label="HeavyPreview (передан как children)" />
          </ColorWrapper>
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fff3e0', borderRadius: '8px', fontSize: '0.82rem', color: '#e65100' }}>
        <strong>Ключевое:</strong> React не пересоздаёт JSX-элемент, переданный как children — он уже существует в области видимости родителя и не зависит от state потомка.
      </div>
    </div>
  )
}

// ============================================
// Task 8.3 Solution: FilterPanel — useCallback + React.memo
// ============================================

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

// CategoryFilter с React.memo + render counter
const CategoryFilter = memo(function CategoryFilter({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const renderCount = useRef(0)
  renderCount.current++

  const categories = [
    { id: 'all', label: 'Все' },
    { id: 'laptops', label: 'Ноутбуки' },
    { id: 'phones', label: 'Смартфоны' },
    { id: 'tablets', label: 'Планшеты' },
    { id: 'accessories', label: 'Аксессуары' },
  ]

  return (
    <div style={filterBoxStyle}>
      <div style={filterLabelStyle}>
        Категория <RenderBadge count={renderCount.current} />
      </div>
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
})

// PriceFilter с React.memo + render counter
const PriceFilter = memo(function PriceFilter({
  minValue,
  maxValue,
  onChange,
}: {
  minValue: number
  maxValue: number
  onChange: (min: number, max: number) => void
}) {
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <div style={filterBoxStyle}>
      <div style={filterLabelStyle}>
        Цена: {minValue.toLocaleString('ru-RU')} — {maxValue.toLocaleString('ru-RU')} ₽ <RenderBadge count={renderCount.current} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.78rem', color: '#666' }}>
          <span>от</span>
          <input
            type="range" min={0} max={50000} step={1000}
            value={minValue}
            onChange={e => onChange(Number(e.target.value), maxValue)}
            style={{ flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.78rem', color: '#666' }}>
          <span>до</span>
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
})

// RatingFilter с React.memo + render counter
const RatingFilter = memo(function RatingFilter({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <div style={filterBoxStyle}>
      <div style={filterLabelStyle}>
        Рейтинг от {value} <RenderBadge count={renderCount.current} />
      </div>
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
            {'★'.repeat(rating) || 'Любой'}
          </button>
        ))}
      </div>
    </div>
  )
})

// DiscountFilter с React.memo + render counter
const DiscountFilter = memo(function DiscountFilter({
  value,
  onChange,
}: {
  value: boolean
  onChange: (value: boolean) => void
}) {
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <div style={filterBoxStyle}>
      <div style={filterLabelStyle}>
        Скидка <RenderBadge count={renderCount.current} />
      </div>
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
})

// SortFilter с React.memo + render counter
const SortFilter = memo(function SortFilter({
  value,
  onChange,
}: {
  value: Filters['sort']
  onChange: (value: Filters['sort']) => void
}) {
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <div style={filterBoxStyle}>
      <div style={filterLabelStyle}>
        Сортировка <RenderBadge count={renderCount.current} />
      </div>
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
})

const filterBoxStyle: React.CSSProperties = {
  padding: '0.75rem',
  background: '#fff',
  borderRadius: '8px',
  border: '1px solid #e9ecef',
}

const filterLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#555',
  marginBottom: '0.5rem',
  display: 'flex',
  alignItems: 'center',
}

export function Task8_3_Solution() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)

  // Каждый onChange стабилизирован через useCallback
  // Функциональный setState (prev =>) — не читаем filters напрямую
  const handleCategoryChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, category: value }))
  }, [])

  const handlePriceChange = useCallback((min: number, max: number) => {
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))
  }, [])

  const handleRatingChange = useCallback((value: number) => {
    setFilters(prev => ({ ...prev, minRating: value }))
  }, [])

  const handleDiscountChange = useCallback((value: boolean) => {
    setFilters(prev => ({ ...prev, hasDiscount: value }))
  }, [])

  const handleSortChange = useCallback((value: Filters['sort']) => {
    setFilters(prev => ({ ...prev, sort: value }))
  }, [])

  const handleReset = () => setFilters(INITIAL_FILTERS)

  const SORT_LABELS: Record<Filters['sort'], string> = {
    popular: 'По популярности',
    price_asc: 'Цена ↑',
    price_desc: 'Цена ↓',
    rating: 'По рейтингу',
  }

  return (
    <div className="exercise-container">
      <h2>Решение 8.3: FilterPanel — useCallback + React.memo</h2>
      <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Меняйте любой фильтр — только его счётчик растёт. Остальные 4 не ре-рендерятся.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <CategoryFilter
          value={filters.category}
          onChange={handleCategoryChange}
        />
        <PriceFilter
          minValue={filters.minPrice}
          maxValue={filters.maxPrice}
          onChange={handlePriceChange}
        />
        <RatingFilter
          value={filters.minRating}
          onChange={handleRatingChange}
        />
        <DiscountFilter
          value={filters.hasDiscount}
          onChange={handleDiscountChange}
        />
        <SortFilter
          value={filters.sort}
          onChange={handleSortChange}
        />
      </div>

      {/* Текущие значения фильтров */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '0.82rem',
        border: '1px solid #e9ecef',
      }}>
        <div style={{ fontWeight: 600, marginBottom: '0.4rem', color: '#555' }}>Активные фильтры:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { label: 'Категория', value: filters.category },
            { label: 'Цена', value: `${filters.minPrice.toLocaleString('ru-RU')} — ${filters.maxPrice.toLocaleString('ru-RU')} ₽` },
            { label: 'Рейтинг', value: filters.minRating > 0 ? `от ${'★'.repeat(filters.minRating)}` : 'любой' },
            { label: 'Скидка', value: filters.hasDiscount ? 'да' : 'нет' },
            { label: 'Сортировка', value: SORT_LABELS[filters.sort] },
          ].map(item => (
            <span key={item.label} style={{
              padding: '2px 8px',
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'monospace',
            }}>
              {item.label}: <strong>{item.value}</strong>
            </span>
          ))}
        </div>
        <button
          onClick={handleReset}
          style={{
            marginTop: '0.5rem',
            padding: '4px 12px',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            color: '#666',
          }}
        >
          Сбросить фильтры
        </button>
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px', fontSize: '0.82rem', color: '#2e7d32' }}>
        <strong>Что сделано:</strong> каждый фильтр-компонент — React.memo. Каждый onChange — useCallback с функциональным setState(prev =&gt; ...). Зависимости useCallback пустые — функции создаются один раз.
      </div>
    </div>
  )
}
