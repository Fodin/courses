import { useState } from 'react'

// ============================================
// Задание 5.1: Визуализатор пагинации
// ============================================

type PaginationMode = 'offset' | 'cursor'

interface Item {
  id: number
  name: string
  createdAt: string
}

const ALL_ITEMS: Item[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Товар #${String(i + 1).padStart(2, '0')}`,
  createdAt: `2024-04-${String(i + 1).padStart(2, '0')}`,
}))

const PAGE_SIZE = 5

function getOffsetPage(page: number, items: Item[]) {
  const offset = (page - 1) * PAGE_SIZE
  return items.slice(offset, offset + PAGE_SIZE)
}

function getCursorPage(afterId: number | null, items: Item[]) {
  if (afterId === null) return items.slice(0, PAGE_SIZE)
  const idx = items.findIndex(item => item.id === afterId)
  if (idx === -1) return []
  return items.slice(idx + 1, idx + 1 + PAGE_SIZE)
}

export function Task5_1_Solution() {
  const [mode, setMode] = useState<PaginationMode>('offset')
  const [offsetPage, setOffsetPage] = useState(1)
  const [cursorHistory, setCursorHistory] = useState<(number | null)[]>([null])
  const [cursorStep, setCursorStep] = useState(0)
  const [showInsertDemo, setShowInsertDemo] = useState(false)

  const mutatedItems: Item[] = showInsertDemo
    ? [
        { id: 999, name: 'Новый товар (вставлен)', createdAt: '2024-04-00' },
        ...ALL_ITEMS,
      ]
    : ALL_ITEMS

  const totalPages = Math.ceil(ALL_ITEMS.length / PAGE_SIZE)
  const currentOffsetItems = getOffsetPage(offsetPage, mutatedItems)
  const currentCursor = cursorHistory[cursorStep]
  const currentCursorItems = getCursorPage(currentCursor, ALL_ITEMS)
  const lastCursorItem = currentCursorItems[currentCursorItems.length - 1]
  const hasNextCursor = ALL_ITEMS.findIndex(i => i.id === (lastCursorItem?.id ?? -1)) < ALL_ITEMS.length - 1

  const offsetQuery =
    mode === 'offset'
      ? `GET /api/products?page=${offsetPage}&limit=${PAGE_SIZE}`
      : `GET /api/products?after=${currentCursor ?? 'null'}&first=${PAGE_SIZE}`

  function handleOffsetPrev() {
    setOffsetPage(p => Math.max(1, p - 1))
  }
  function handleOffsetNext() {
    setOffsetPage(p => Math.min(totalPages, p + 1))
  }
  function handleCursorNext() {
    if (!hasNextCursor || !lastCursorItem) return
    const next = [...cursorHistory.slice(0, cursorStep + 1), lastCursorItem.id]
    setCursorHistory(next)
    setCursorStep(s => s + 1)
  }
  function handleCursorPrev() {
    if (cursorStep === 0) return
    setCursorStep(s => s - 1)
  }

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
  }
  const highlightCard: React.CSSProperties = {
    ...cardStyle,
    background: showInsertDemo && mode === 'offset' && offsetPage === 1 ? '#fff3cd' : '#f0fdf4',
    borderColor: showInsertDemo && mode === 'offset' && offsetPage === 1 ? '#f59e0b' : '#22c55e',
  }
  const duplicatedCard: React.CSSProperties = {
    ...cardStyle,
    background: '#fee2e2',
    borderColor: '#ef4444',
  }

  const isDuplicated = (item: Item) =>
    showInsertDemo &&
    mode === 'offset' &&
    offsetPage === 2 &&
    item.id === ALL_ITEMS[(offsetPage - 2) * PAGE_SIZE + PAGE_SIZE - 1]?.id

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Визуализатор пагинации</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Сравните offset и cursor-пагинацию в действии. Посмотрите, что происходит при вставке
        нового элемента.
      </p>

      {/* Mode switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        {(['offset', 'cursor'] as PaginationMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              background: mode === m ? '#3b82f6' : '#e2e8f0',
              color: mode === m ? '#fff' : '#374151',
            }}
          >
            {m === 'offset' ? 'Offset (page/limit)' : 'Cursor (after/first)'}
          </button>
        ))}
      </div>

      {/* URL display */}
      <div
        style={{
          background: '#1e293b',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '1.5rem',
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#7dd3fc',
        }}
      >
        {offsetQuery}
      </div>

      {/* Insert demo toggle */}
      <div
        style={{
          background: '#fef9c3',
          border: '1px solid #fde047',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
        }}
      >
        <span>⚠️ Симуляция вставки нового элемента в начало списка:</span>
        <button
          onClick={() => {
            setShowInsertDemo(v => !v)
            setOffsetPage(1)
          }}
          style={{
            padding: '6px 14px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            background: showInsertDemo ? '#ef4444' : '#22c55e',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          {showInsertDemo ? 'Убрать вставку' : 'Вставить элемент'}
        </button>
        {showInsertDemo && mode === 'offset' && (
          <span style={{ color: '#b45309' }}>
            Перейдите на страницу 2 — элемент #05 задублируется!
          </span>
        )}
        {showInsertDemo && mode === 'cursor' && (
          <span style={{ color: '#15803d' }}>
            Cursor-пагинация не затронута — курсор привязан к ID, не к позиции.
          </span>
        )}
      </div>

      {mode === 'offset' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, color: '#374151' }}>
              Страница {offsetPage} из {totalPages}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>
              offset={((offsetPage - 1) * PAGE_SIZE)} limit={PAGE_SIZE}
            </span>
          </div>
          <div>
            {currentOffsetItems.map((item, idx) => {
              const dup = isDuplicated(item)
              return (
                <div key={`${item.id}-${idx}`} style={dup ? duplicatedCard : highlightCard}>
                  <span>
                    {dup ? '🔴 ' : ''}
                    {item.name}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                    id={item.id} · {item.createdAt}
                    {dup ? ' ← ДУБЛИКАТ!' : ''}
                  </span>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              onClick={handleOffsetPrev}
              disabled={offsetPage === 1}
              style={{
                padding: '8px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: offsetPage === 1 ? 'not-allowed' : 'pointer',
                background: offsetPage === 1 ? '#f1f5f9' : '#fff',
                color: offsetPage === 1 ? '#94a3b8' : '#374151',
              }}
            >
              ← Назад
            </button>
            <button
              onClick={handleOffsetNext}
              disabled={offsetPage === totalPages}
              style={{
                padding: '8px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: offsetPage === totalPages ? 'not-allowed' : 'pointer',
                background: offsetPage === totalPages ? '#f1f5f9' : '#3b82f6',
                color: offsetPage === totalPages ? '#94a3b8' : '#fff',
              }}
            >
              Вперёд →
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, color: '#374151' }}>
              Шаг {cursorStep + 1} — cursor: {currentCursor ?? 'null (начало)'}
            </span>
          </div>
          <div>
            {currentCursorItems.map(item => (
              <div key={item.id} style={highlightCard}>
                <span>{item.name}</span>
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                  id={item.id} · {item.createdAt}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              onClick={handleCursorPrev}
              disabled={cursorStep === 0}
              style={{
                padding: '8px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: cursorStep === 0 ? 'not-allowed' : 'pointer',
                background: cursorStep === 0 ? '#f1f5f9' : '#fff',
                color: cursorStep === 0 ? '#94a3b8' : '#374151',
              }}
            >
              ← Назад
            </button>
            <button
              onClick={handleCursorNext}
              disabled={!hasNextCursor}
              style={{
                padding: '8px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: !hasNextCursor ? 'not-allowed' : 'pointer',
                background: !hasNextCursor ? '#f1f5f9' : '#3b82f6',
                color: !hasNextCursor ? '#94a3b8' : '#fff',
              }}
            >
              Вперёд →
            </button>
          </div>
          {!hasNextCursor && (
            <p style={{ color: '#22c55e', marginTop: '8px', fontSize: '13px' }}>
              hasNextPage: false — все элементы загружены
            </p>
          )}
        </>
      )}
    </div>
  )
}

// ============================================
// Задание 5.2: Конструктор query-параметров
// ============================================

type SortOption = 'name' | '-name' | 'createdAt' | '-createdAt' | 'price' | '-price'
type StatusOption = '' | 'active' | 'draft' | 'archived'

interface FilterState {
  status: StatusOption
  priceMin: string
  priceMax: string
  dateFrom: string
  sort: SortOption
  page: number
  limit: number
}

interface MetaExample {
  totalCount: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

const SORT_LABELS: Record<SortOption, string> = {
  name: 'Название A→Z',
  '-name': 'Название Z→A',
  createdAt: 'Дата (старые)',
  '-createdAt': 'Дата (новые)',
  price: 'Цена ↑',
  '-price': 'Цена ↓',
}

function buildUrl(f: FilterState): string {
  const params: string[] = []
  if (f.status) params.push(`status=${f.status}`)
  if (f.priceMin) params.push(`price[gte]=${f.priceMin}`)
  if (f.priceMax) params.push(`price[lte]=${f.priceMax}`)
  if (f.dateFrom) params.push(`createdAt[gte]=${f.dateFrom}`)
  params.push(`sort=${f.sort}`)
  params.push(`page=${f.page}`)
  params.push(`limit=${f.limit}`)
  return `/api/products?${params.join('&')}`
}

function buildMeta(f: FilterState): MetaExample {
  const totalCount = 87
  const totalPages = Math.ceil(totalCount / f.limit)
  return {
    totalCount,
    page: f.page,
    limit: f.limit,
    totalPages,
    hasNextPage: f.page < totalPages,
    hasPrevPage: f.page > 1,
  }
}

export function Task5_2_Solution() {
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    priceMin: '',
    priceMax: '',
    dateFrom: '',
    sort: '-createdAt',
    page: 1,
    limit: 10,
  })

  const url = buildUrl(filters)
  const meta = buildMeta(filters)

  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value, ...(key !== 'page' ? { page: 1 } : {}) }))
  }

  const inputStyle: React.CSSProperties = {
    padding: '6px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    width: '100%',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#6b7280',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }
  const sectionStyle: React.CSSProperties = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
  }

  const highlightParam = (url: string) => {
    const [base, query] = url.split('?')
    if (!query) return <span style={{ color: '#7dd3fc' }}>{url}</span>
    const parts = query.split('&').map((p, i) => {
      const [k, v] = p.split('=')
      const color = k.startsWith('price') || k.startsWith('createdAt')
        ? '#86efac'
        : k === 'sort'
        ? '#fcd34d'
        : k === 'page' || k === 'limit'
        ? '#c4b5fd'
        : '#7dd3fc'
      return (
        <span key={i}>
          {i > 0 && <span style={{ color: '#64748b' }}>&amp;</span>}
          <span style={{ color: '#94a3b8' }}>{k}</span>
          <span style={{ color: '#64748b' }}>=</span>
          <span style={{ color }}>{v}</span>
        </span>
      )
    })
    return (
      <>
        <span style={{ color: '#7dd3fc' }}>{base}?</span>
        {parts}
      </>
    )
  }

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Конструктор query-параметров</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Настраивайте фильтры и наблюдайте, как меняется URL и мета-данные ответа.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        {/* Filters */}
        <div style={sectionStyle}>
          <div style={{ fontWeight: 700, marginBottom: '12px', color: '#374151' }}>
            Фильтрация
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Статус</label>
            <select
              value={filters.status}
              onChange={e => set('status', e.target.value as StatusOption)}
              style={inputStyle}
            >
              <option value="">Любой</option>
              <option value="active">active</option>
              <option value="draft">draft</option>
              <option value="archived">archived</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <div>
              <label style={labelStyle}>Цена от</label>
              <input
                type="number"
                placeholder="100"
                value={filters.priceMin}
                onChange={e => set('priceMin', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Цена до</label>
              <input
                type="number"
                placeholder="9999"
                value={filters.priceMax}
                onChange={e => set('priceMax', e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Дата создания от</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={e => set('dateFrom', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Sort + Pagination */}
        <div>
          <div style={{ ...sectionStyle, marginBottom: '12px' }}>
            <div style={{ fontWeight: 700, marginBottom: '12px', color: '#374151' }}>
              Сортировка
            </div>
            <select
              value={filters.sort}
              onChange={e => set('sort', e.target.value as SortOption)}
              style={inputStyle}
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map(k => (
                <option key={k} value={k}>{SORT_LABELS[k]}</option>
              ))}
            </select>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
              Минус перед полем = DESC ({'-'}) — конвенция GitHub API
            </p>
          </div>
          <div style={sectionStyle}>
            <div style={{ fontWeight: 700, marginBottom: '12px', color: '#374151' }}>
              Пагинация
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={labelStyle}>Страница</label>
                <input
                  type="number"
                  min={1}
                  max={meta.totalPages}
                  value={filters.page}
                  onChange={e => set('page', Math.max(1, Number(e.target.value)))}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Лимит</label>
                <select
                  value={filters.limit}
                  onChange={e => set('limit', Number(e.target.value))}
                  style={inputStyle}
                >
                  {[5, 10, 20, 50].map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* URL */}
      <div
        style={{
          background: '#1e293b',
          borderRadius: '8px',
          padding: '14px 16px',
          marginBottom: '16px',
          fontFamily: 'monospace',
          fontSize: '13px',
          wordBreak: 'break-all',
          lineHeight: '1.6',
        }}
      >
        {highlightParam(url)}
      </div>

      {/* Meta response */}
      <div
        style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: '10px', color: '#15803d' }}>
          Мета-данные ответа
        </div>
        <pre
          style={{
            margin: 0,
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#1e293b',
          }}
        >
          {JSON.stringify(
            {
              data: ['...массив товаров...'],
              meta: {
                totalCount: meta.totalCount,
                page: meta.page,
                limit: meta.limit,
                totalPages: meta.totalPages,
                hasNextPage: meta.hasNextPage,
                hasPrevPage: meta.hasPrevPage,
              },
            },
            null,
            2,
          )}
        </pre>
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: '12px',
          display: 'flex',
          gap: '16px',
          fontSize: '12px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { color: '#7dd3fc', label: 'Фильтр по полю' },
          { color: '#86efac', label: 'Оператор (gte/lte)' },
          { color: '#fcd34d', label: 'Сортировка' },
          { color: '#c4b5fd', label: 'Пагинация' },
        ].map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                background: color,
              }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Задание 5.3: Проектирование пагинации
// ============================================

interface Scenario {
  id: number
  title: string
  description: string
  requirements: string[]
  wrongAnswer: {
    type: 'offset' | 'cursor'
    label: string
    reason: string
  }
  correctAnswer: {
    type: 'offset' | 'cursor'
    label: string
    params: string
    justification: string[]
    responseExample: string
  }
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: 'Лента новостей',
    description:
      'Социальная сеть: пользователь листает ленту постов. Новые посты добавляются постоянно. Нужна навигация «вперёд/назад» без пропусков и дублей.',
    requirements: [
      'Посты добавляются в реальном времени',
      'Пользователь может вернуться к просмотренному',
      'Важна стабильность: нельзя пропустить пост',
      'Нет требования перейти на конкретную страницу',
    ],
    wrongAnswer: {
      type: 'offset',
      label: 'Offset (page/limit)',
      reason:
        'При добавлении нового поста в начало ленты все offset-ы сдвигаются. Переход на страницу 2 покажет пост, который уже был на странице 1. Пользователь пропустит или увидит дубли.',
    },
    correctAnswer: {
      type: 'cursor',
      label: 'Cursor-пагинация (after/before)',
      params: 'GET /api/feed?after=post_cursor_xyz&first=20',
      justification: [
        'Курсор привязан к конкретному посту, а не к позиции в списке',
        'Новые посты не влияют на позицию курсора',
        'Можно листать вперёд и назад без пропусков',
        'Масштабируется: не нужно считать COUNT(*) для всей таблицы',
      ],
      responseExample: `{
  "posts": [...],
  "pageInfo": {
    "hasNextPage": true,
    "hasPrevPage": true,
    "startCursor": "cursor_abc",
    "endCursor": "cursor_xyz"
  }
}`,
    },
  },
  {
    id: 2,
    title: 'Админ-панель заказов',
    description:
      'Внутренняя панель: оператор просматривает заказы. Нужна навигация по номерам страниц (1, 2, 3...), переход на конкретную страницу, отображение общего числа заказов.',
    requirements: [
      'Навигация по номерам страниц',
      'Переход на произвольную страницу',
      'Отображение "Страница 5 из 23"',
      'Данные меняются редко (в рамках одной сессии)',
    ],
    wrongAnswer: {
      type: 'cursor',
      label: 'Cursor-пагинация',
      reason:
        'Cursor-пагинация не позволяет перейти на произвольную страницу — нужно последовательно проходить курсоры. Также сложно показать общее количество страниц.',
    },
    correctAnswer: {
      type: 'offset',
      label: 'Offset-пагинация (page/limit)',
      params: 'GET /api/orders?page=5&limit=20&sort=-createdAt',
      justification: [
        'Переход на любую страницу: page=5 работает напрямую',
        'Общее число страниц: totalCount / limit',
        'Данные меняются редко — проблема consistency не критична',
        'Простота реализации и понятность для операторов',
      ],
      responseExample: `{
  "orders": [...],
  "meta": {
    "totalCount": 456,
    "page": 5,
    "limit": 20,
    "totalPages": 23,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}`,
    },
  },
  {
    id: 3,
    title: 'Бесконечный скролл товаров',
    description:
      'Маркетплейс: каталог товаров с бесконечной прокруткой. Товары активно добавляются и удаляются. При прокрутке вниз подгружаются следующие 20 товаров.',
    requirements: [
      'Товары добавляются и удаляются постоянно',
      'Только прокрутка вниз (нет кнопок страниц)',
      'Нельзя показывать дубликаты при прокрутке',
      'Важна скорость — высокий трафик',
    ],
    wrongAnswer: {
      type: 'offset',
      label: 'Offset (page/limit)',
      reason:
        'При активном обновлении каталога offset-пагинация даст дубликаты: пока пользователь листал, добавили 3 товара в начало — страница 2 начнётся с тех же товаров что заканчивала страница 1.',
    },
    correctAnswer: {
      type: 'cursor',
      label: 'Keyset / Cursor-пагинация',
      params: 'GET /api/products?after=prod_cursor_abc&first=20&sort=-popularity',
      justification: [
        'Стабильный cursor привязан к ID/полю товара — не к позиции',
        'Добавление новых товаров не влияет на текущий cursor',
        'Keyset-пагинация по индексированному полю очень быстрая',
        'Для бесконечного скролла переход на произвольную страницу не нужен',
      ],
      responseExample: `{
  "products": [...],
  "pageInfo": {
    "hasNextPage": true,
    "endCursor": "prod_cursor_xyz"
  }
}`,
    },
  },
]

export function Task5_3_Solution() {
  const [openScenario, setOpenScenario] = useState<number | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'offset' | 'cursor' | null>>({})
  const [showResult, setShowResult] = useState<Record<number, boolean>>({})

  const handleSelect = (scenarioId: number, type: 'offset' | 'cursor') => {
    if (showResult[scenarioId]) return
    setSelectedAnswers(prev => ({ ...prev, [scenarioId]: type }))
  }

  const handleCheck = (scenarioId: number) => {
    setShowResult(prev => ({ ...prev, [scenarioId]: true }))
    setOpenScenario(scenarioId)
  }

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Проектирование пагинации: self-check</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Для каждого сценария выберите подходящий тип пагинации, затем проверьте себя.
      </p>

      {SCENARIOS.map(scenario => {
        const selected = selectedAnswers[scenario.id]
        const revealed = showResult[scenario.id]
        const isCorrect = selected === scenario.correctAnswer.type
        const isOpen = openScenario === scenario.id

        return (
          <div
            key={scenario.id}
            style={{
              border: `2px solid ${revealed ? (isCorrect ? '#22c55e' : '#ef4444') : '#e2e8f0'}`,
              borderRadius: '10px',
              marginBottom: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                background: revealed
                  ? isCorrect
                    ? '#f0fdf4'
                    : '#fef2f2'
                  : '#f8fafc',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
              onClick={() => setOpenScenario(isOpen ? null : scenario.id)}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                  Сценарий {scenario.id}: {scenario.title}
                </div>
                <div style={{ fontSize: '14px', color: '#475569' }}>{scenario.description}</div>
              </div>
              <span style={{ fontSize: '18px', marginLeft: '12px' }}>
                {revealed ? (isCorrect ? '✅' : '❌') : isOpen ? '▲' : '▼'}
              </span>
            </div>

            {/* Body */}
            {isOpen && (
              <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
                {/* Requirements */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px', color: '#374151' }}>
                    Требования:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {scenario.requirements.map((r, i) => (
                      <li key={i} style={{ fontSize: '14px', color: '#475569', marginBottom: '4px' }}>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Answer choice */}
                {!revealed && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px', color: '#374151' }}>
                      Ваш выбор:
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {(['offset', 'cursor'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => handleSelect(scenario.id, type)}
                          style={{
                            padding: '10px 20px',
                            border: `2px solid ${selected === type ? '#3b82f6' : '#e2e8f0'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: selected === type ? '#eff6ff' : '#fff',
                            color: selected === type ? '#1d4ed8' : '#374151',
                            fontWeight: selected === type ? 700 : 400,
                          }}
                        >
                          {type === 'offset' ? 'Offset (page/limit)' : 'Cursor (after/first)'}
                        </button>
                      ))}
                    </div>
                    {selected && (
                      <button
                        onClick={() => handleCheck(scenario.id)}
                        style={{
                          marginTop: '10px',
                          padding: '8px 20px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          background: '#3b82f6',
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      >
                        Проверить
                      </button>
                    )}
                  </div>
                )}

                {/* Result */}
                {revealed && (
                  <div>
                    {!isCorrect && (
                      <div
                        style={{
                          background: '#fee2e2',
                          border: '1px solid #fca5a5',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '12px',
                        }}
                      >
                        <div style={{ fontWeight: 700, color: '#b91c1c', marginBottom: '6px' }}>
                          ❌ Неверно — {scenario.wrongAnswer.label}
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', color: '#7f1d1d' }}>
                          {scenario.wrongAnswer.reason}
                        </p>
                      </div>
                    )}

                    <div
                      style={{
                        background: '#f0fdf4',
                        border: '1px solid #86efac',
                        borderRadius: '8px',
                        padding: '14px',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#15803d', marginBottom: '8px' }}>
                        ✅ Правильный ответ: {scenario.correctAnswer.label}
                      </div>
                      <div
                        style={{
                          background: '#1e293b',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          fontFamily: 'monospace',
                          fontSize: '13px',
                          color: '#7dd3fc',
                          marginBottom: '10px',
                        }}
                      >
                        {scenario.correctAnswer.params}
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '18px' }}>
                        {scenario.correctAnswer.justification.map((j, i) => (
                          <li key={i} style={{ fontSize: '14px', color: '#166534', marginBottom: '4px' }}>
                            {j}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '6px', fontSize: '13px', color: '#374151' }}>
                        Пример ответа:
                      </div>
                      <pre
                        style={{
                          background: '#1e293b',
                          borderRadius: '6px',
                          padding: '12px',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          color: '#e2e8f0',
                          margin: 0,
                          overflowX: 'auto',
                        }}
                      >
                        {scenario.correctAnswer.responseExample}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
