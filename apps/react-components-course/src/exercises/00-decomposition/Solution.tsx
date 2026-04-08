import { useState, useEffect } from 'react'

// ============================================
// Task 0.1 Solution: Декомпозиция ProductPage
// ============================================

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
  category: string
}

interface Review {
  id: string
  author: string
  rating: number
  text: string
  date: string
}

const MOCK_PRODUCT: Product = {
  id: '1',
  name: 'Механическая клавиатура Keychron K2',
  description: 'Компактная механическая клавиатура с подключением Bluetooth и проводным режимом. Переключатели Gateron Red обеспечивают плавное нажатие без тактильного отклика.',
  price: 8990,
  image: 'https://placehold.co/400x300/e8f5e9/2e7d32?text=Keyboard',
  stock: 15,
  category: 'Периферия',
}

const MOCK_REVIEWS: Review[] = [
  { id: '1', author: 'Алексей К.', rating: 5, text: 'Отличная клавиатура, очень доволен покупкой! Печатать одно удовольствие.', date: '15.03.2024' },
  { id: '2', author: 'Марина П.', rating: 4, text: 'Хорошее качество сборки, но немного шумновата для офиса.', date: '02.03.2024' },
  { id: '3', author: 'Дмитрий В.', rating: 5, text: 'Брал уже третью такую. Лучшая клавиатура в своём ценовом сегменте.', date: '20.02.2024' },
]

const MOCK_RELATED: Product[] = [
  { id: '2', name: 'Мышь Logitech MX Master 3', description: '', price: 6490, image: 'https://placehold.co/150x120/e3f2fd/1565c0?text=Mouse', stock: 8, category: 'Периферия' },
  { id: '3', name: 'Коврик для мыши XL', description: '', price: 1290, image: 'https://placehold.co/150x120/fce4ec/880e4f?text=Pad', stock: 20, category: 'Аксессуары' },
  { id: '4', name: 'USB-хаб 7 портов', description: '', price: 2190, image: 'https://placehold.co/150x120/fff8e1/f57f17?text=Hub', stock: 12, category: 'Аксессуары' },
]

// Dumb компонент: только отображение товара
function ProductCard({ product }: { product: Product }) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', padding: '1rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #eee' }}>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: 200, height: 150, objectFit: 'cover', borderRadius: '6px' }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.25rem' }}>{product.category}</div>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem' }}>{product.name}</h3>
        <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '1rem' }}>{product.description}</p>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#d32f2f' }}>
          {product.price.toLocaleString('ru-RU')} ₽
        </div>
        <div style={{ fontSize: '0.85rem', color: '#4caf50', marginTop: '0.25rem' }}>
          В наличии: {product.stock} шт.
        </div>
      </div>
    </div>
  )
}

// Dumb компонент с UI-state: управляет количеством и статусом кнопки
function AddToCartForm({ productId, stock }: { productId: string; stock: number }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    console.log(`Добавлено в корзину: ${productId}, количество: ${quantity}`)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
      <label style={{ fontWeight: 500 }}>Количество:</label>
      <input
        type="number"
        value={quantity}
        onChange={e => setQuantity(Math.max(1, Math.min(stock, Number(e.target.value))))}
        min={1}
        max={stock}
        style={{ width: 60, padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', textAlign: 'center' }}
      />
      <button
        onClick={handleAdd}
        disabled={added}
        style={{
          padding: '0.6rem 1.5rem',
          background: added ? '#4caf50' : '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: added ? 'default' : 'pointer',
          fontWeight: 500,
          transition: 'background 0.2s',
        }}
      >
        {added ? 'Добавлено ✓' : 'В корзину'}
      </button>
    </div>
  )
}

// Dumb компонент: список отзывов
function ReviewsList({ reviews }: { reviews: Review[] }) {
  return (
    <div>
      <h3 style={{ marginBottom: '0.75rem' }}>Отзывы ({reviews.length})</h3>
      {reviews.map(review => (
        <div
          key={review.id}
          style={{ padding: '0.75rem', borderBottom: '1px solid #eee', marginBottom: '0.5rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <strong>{review.author}</strong>
            <span style={{ color: '#888', fontSize: '0.85rem' }}>{review.date}</span>
          </div>
          <div style={{ color: '#f9a825', marginBottom: '0.25rem', letterSpacing: 2 }}>
            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
          </div>
          <p style={{ margin: 0, color: '#555', lineHeight: 1.5 }}>{review.text}</p>
        </div>
      ))}
    </div>
  )
}

// Dumb компонент: плитка похожих товаров
function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <div>
      <h3 style={{ marginBottom: '0.75rem' }}>Похожие товары</h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {products.map(product => (
          <div
            key={product.id}
            style={{
              width: 160,
              padding: '0.75rem',
              border: '1px solid #eee',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '4px', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem', lineHeight: 1.3 }}>{product.name}</div>
            <div style={{ color: '#d32f2f', fontWeight: 'bold' }}>{product.price.toLocaleString('ru-RU')} ₽</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Оркестратор — только координация дочерних компонентов
export function Task0_1_Solution() {
  return (
    <div className="exercise-container">
      <h2>Решение 0.1: Декомпозиция ProductPage</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Монолит разбит на 4 независимых компонента: ProductCard, AddToCartForm, ReviewsList, RelatedProducts
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <ProductCard product={MOCK_PRODUCT} />
        <AddToCartForm productId={MOCK_PRODUCT.id} stock={MOCK_PRODUCT.stock} />
        <ReviewsList reviews={MOCK_REVIEWS} />
        <RelatedProducts products={MOCK_RELATED} />
      </div>
    </div>
  )
}

// ============================================
// Task 0.2 Solution: Container/Presentational
// ============================================

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  isOnline: boolean
  joinedAt: string
  postsCount: number
  followersCount: number
}

const MOCK_USER: User = {
  id: 'u1',
  name: 'Екатерина Смирнова',
  email: 'e.smirnova@example.com',
  role: 'Senior Frontend Developer',
  avatar: 'https://placehold.co/80x80/e8eaf6/3f51b5?text=ES',
  isOnline: true,
  joinedAt: 'Март 2021',
  postsCount: 47,
  followersCount: 312,
}

// Dumb компонент: только отображение профиля
function UserProfileView({ user }: { user: User }) {
  return (
    <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '12px', border: '1px solid #eee', maxWidth: 400 }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid #e8eaf6' }}
          />
          {user.isOnline && (
            <span style={{
              position: 'absolute', bottom: 4, right: 4,
              width: 14, height: 14, background: '#4caf50',
              borderRadius: '50%', border: '2px solid #fff',
              display: 'block',
            }} />
          )}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{user.name}</h3>
          <div style={{ color: '#666', fontSize: '0.85rem' }}>{user.role}</div>
          <div style={{ color: '#888', fontSize: '0.8rem' }}>{user.email}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', padding: '0.75rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{user.postsCount}</div>
          <div style={{ color: '#888', fontSize: '0.8rem' }}>публикаций</div>
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{user.followersCount}</div>
          <div style={{ color: '#888', fontSize: '0.8rem' }}>подписчиков</div>
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user.joinedAt}</div>
          <div style={{ color: '#888', fontSize: '0.8rem' }}>с нами</div>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: user.isOnline ? '#4caf50' : '#bbb', display: 'inline-block' }} />
        <span style={{ fontSize: '0.85rem', color: '#666' }}>{user.isOnline ? 'Онлайн' : 'Не в сети'}</span>
      </div>
    </div>
  )
}

// Smart компонент: управляет загрузкой данных
function UserProfileContainer({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadCount, setLoadCount] = useState(0)

  useEffect(() => {
    setLoading(true)
    setUser(null)
    // Симулируем загрузку с сервера
    const timer = setTimeout(() => {
      setUser({ ...MOCK_USER, id: userId })
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [userId, loadCount])

  const handleReload = () => setLoadCount(c => c + 1)

  return (
    <div>
      {loading && (
        <div style={{
          padding: '2rem', textAlign: 'center', color: '#666',
          background: '#fafafa', borderRadius: '12px', border: '1px dashed #ddd', maxWidth: 400,
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
          Загрузка профиля...
        </div>
      )}
      {!loading && user && <UserProfileView user={user} />}
      <button
        onClick={handleReload}
        disabled={loading}
        style={{
          marginTop: '1rem', padding: '0.5rem 1rem',
          background: loading ? '#eee' : '#1976d2', color: loading ? '#999' : '#fff',
          border: 'none', borderRadius: '6px', cursor: loading ? 'default' : 'pointer',
        }}
      >
        {loading ? 'Загрузка...' : 'Перезагрузить'}
      </button>
    </div>
  )
}

export function Task0_2_Solution() {
  return (
    <div className="exercise-container">
      <h2>Решение 0.2: Container / Presentational</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        <strong>UserProfileContainer</strong> управляет загрузкой данных. <strong>UserProfileView</strong> — только отображение.
      </p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1 }}>
            Через контейнер (с загрузкой)
          </div>
          <UserProfileContainer userId="u1" />
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 1 }}>
            Напрямую (без загрузки)
          </div>
          <UserProfileView user={{ ...MOCK_USER, isOnline: false, name: 'Тестовый пользователь' }} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 0.3 Solution: Dashboard по ответственностям
// ============================================

interface DashboardFiltersType {
  period: 'day' | 'week' | 'month'
  category: string
}

interface StatItem {
  label: string
  value: string
  change: number
  icon: string
}

interface ChartPoint {
  label: string
  value: number
}

interface TableRow {
  id: string
  product: string
  category: string
  sales: number
  revenue: number
  growth: number
}

const CATEGORIES = ['Все', 'Периферия', 'Ноутбуки', 'Смартфоны', 'Аксессуары']

function generateStats(filters: DashboardFiltersType): StatItem[] {
  const multiplier = filters.period === 'day' ? 1 : filters.period === 'week' ? 7 : 30
  return [
    { label: 'Продажи', value: `${(124 * multiplier).toLocaleString('ru-RU')} шт.`, change: 12.5, icon: '📦' },
    { label: 'Выручка', value: `${(489000 * multiplier).toLocaleString('ru-RU')} ₽`, change: -3.2, icon: '💰' },
    { label: 'Заказы', value: `${(87 * multiplier).toLocaleString('ru-RU')}`, change: 8.1, icon: '🛒' },
    { label: 'Средний чек', value: `${(5620).toLocaleString('ru-RU')} ₽`, change: -1.4, icon: '📊' },
  ]
}

function generateChart(filters: DashboardFiltersType): ChartPoint[] {
  const labels = filters.period === 'day'
    ? ['9:00', '12:00', '15:00', '18:00', '21:00']
    : filters.period === 'week'
    ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    : ['1 нед', '2 нед', '3 нед', '4 нед']

  return labels.map((label, i) => ({
    label,
    value: Math.floor(20 + Math.sin(i * 0.8) * 15 + (i * 3)),
  }))
}

function generateTable(filters: DashboardFiltersType): TableRow[] {
  const allRows: TableRow[] = [
    { id: '1', product: 'Keychron K2', category: 'Периферия', sales: 48, revenue: 431520, growth: 15.2 },
    { id: '2', product: 'MacBook Air M3', category: 'Ноутбуки', sales: 12, revenue: 1788000, growth: 8.7 },
    { id: '3', product: 'iPhone 15 Pro', category: 'Смартфоны', sales: 23, revenue: 2277000, growth: -2.1 },
    { id: '4', product: 'Logitech MX Master 3', category: 'Периферия', sales: 67, revenue: 434830, growth: 22.4 },
    { id: '5', product: 'USB-C кабель 2м', category: 'Аксессуары', sales: 134, revenue: 66866, growth: 5.3 },
    { id: '6', product: 'Samsung Galaxy S24', category: 'Смартфоны', sales: 18, revenue: 1440000, growth: 11.9 },
  ]
  if (filters.category === 'Все') return allRows
  return allRows.filter(r => r.category === filters.category)
}

// Dumb компонент фильтров
function FilterPanel({ filters, onChange }: { filters: DashboardFiltersType; onChange: (f: DashboardFiltersType) => void }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Период:</label>
        <select
          value={filters.period}
          onChange={e => onChange({ ...filters, period: e.target.value as DashboardFiltersType['period'] })}
          style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #ddd', background: '#fff' }}
        >
          <option value="day">День</option>
          <option value="week">Неделя</option>
          <option value="month">Месяц</option>
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Категория:</label>
        <select
          value={filters.category}
          onChange={e => onChange({ ...filters, category: e.target.value })}
          style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #ddd', background: '#fff' }}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
  )
}

// Dumb компонент: карточки статистики
function StatsCards({ stats }: { stats: StatItem[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
      {stats.map((stat, i) => (
        <div key={i} style={{ padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{stat.icon}</div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.25rem' }}>{stat.label}</div>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{stat.value}</div>
          <div style={{ fontSize: '0.8rem', color: stat.change >= 0 ? '#4caf50' : '#f44336', fontWeight: 500 }}>
            {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
          </div>
        </div>
      ))}
    </div>
  )
}

// Dumb компонент: bar chart через CSS
function SalesChart({ data }: { data: ChartPoint[] }) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div style={{ padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
      <h4 style={{ margin: '0 0 1rem', color: '#555' }}>Продажи по периодам</h4>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: 120 }}>
        {data.map((point, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#888' }}>{point.value}</div>
            <div
              style={{
                width: '100%',
                height: `${(point.value / maxValue) * 100}px`,
                background: 'linear-gradient(to top, #1976d2, #64b5f6)',
                borderRadius: '3px 3px 0 0',
              }}
            />
            <div style={{ fontSize: '0.7rem', color: '#888', textAlign: 'center' }}>{point.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Компонент с UI-state сортировки (допустимо в Presentational!)
function DataTable({ rows }: { rows: TableRow[] }) {
  const [sortField, setSortField] = useState<keyof TableRow>('revenue')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: keyof TableRow) => {
    if (field === sortField) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const valA = a[sortField]
    const valB = b[sortField]
    const cmp = valA < valB ? -1 : valA > valB ? 1 : 0
    return sortDir === 'asc' ? cmp : -cmp
  })

  const thStyle: React.CSSProperties = {
    padding: '0.6rem 0.75rem',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#555',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    background: '#f8f8f8',
  }

  return (
    <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #eee', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        <thead>
          <tr>
            {(['product', 'category', 'sales', 'revenue', 'growth'] as Array<keyof TableRow>).map(field => {
              const labels: Record<keyof TableRow, string> = {
                id: 'ID', product: 'Товар', category: 'Категория', sales: 'Продажи', revenue: 'Выручка', growth: 'Рост',
              }
              return (
                <th key={field} style={thStyle} onClick={() => handleSort(field)}>
                  {labels[field]}
                  {sortField === field ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map(row => (
            <tr key={row.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '0.6rem 0.75rem', fontWeight: 500 }}>{row.product}</td>
              <td style={{ padding: '0.6rem 0.75rem', color: '#666', fontSize: '0.85rem' }}>{row.category}</td>
              <td style={{ padding: '0.6rem 0.75rem' }}>{row.sales}</td>
              <td style={{ padding: '0.6rem 0.75rem' }}>{row.revenue.toLocaleString('ru-RU')} ₽</td>
              <td style={{ padding: '0.6rem 0.75rem', color: row.growth >= 0 ? '#4caf50' : '#f44336', fontWeight: 500 }}>
                {row.growth >= 0 ? '+' : ''}{row.growth}%
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                Нет данных для выбранного фильтра
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// Оркестратор Dashboard
export function Task0_3_Solution() {
  const [filters, setFilters] = useState<DashboardFiltersType>({ period: 'week', category: 'Все' })

  const stats = generateStats(filters)
  const chartData = generateChart(filters)
  const tableRows = generateTable(filters)

  return (
    <div className="exercise-container">
      <h2>Решение 0.3: Dashboard — декомпозиция по ответственностям</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        4 компонента: FilterPanel, StatsCards, SalesChart, DataTable — каждый делает одно
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <FilterPanel filters={filters} onChange={setFilters} />
        <StatsCards stats={stats} />
        <SalesChart data={chartData} />
        <DataTable rows={tableRows} />
      </div>
    </div>
  )
}
