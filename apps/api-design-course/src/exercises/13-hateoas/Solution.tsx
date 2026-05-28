import { useState } from 'react'

// ============================================
// Task 13.1: Hypermedia Navigator / Навигатор по гипермедиа
// ============================================

interface NavLink {
  href: string
  method: string
  to: string // ключ следующего ресурса / key of the next resource
}

interface NavResource {
  data: Record<string, unknown>
  links: Record<string, NavLink | { href: string }>
}

const MOCK_API: Record<string, NavResource> = {
  pending: {
    data: { orderId: 123, status: 'pending', totalAmount: 99.99 },
    links: {
      self: { href: '/orders/123' },
      pay: { href: '/orders/123/payment', method: 'POST', to: 'paid' },
      cancel: { href: '/orders/123', method: 'DELETE', to: 'cancelled' },
    },
  },
  paid: {
    data: { orderId: 123, status: 'paid', totalAmount: 99.99 },
    links: {
      self: { href: '/orders/123' },
      ship: { href: '/orders/123/shipment', method: 'POST', to: 'shipped' },
      refund: { href: '/orders/123/refund', method: 'POST', to: 'cancelled' },
    },
  },
  shipped: {
    data: { orderId: 123, status: 'shipped', totalAmount: 99.99 },
    links: {
      self: { href: '/orders/123' },
      track: { href: '/orders/123/tracking', method: 'GET', to: 'shipped' },
      return: { href: '/orders/123/return', method: 'POST', to: 'cancelled' },
    },
  },
  cancelled: {
    data: { orderId: 123, status: 'cancelled', totalAmount: 99.99 },
    links: {
      self: { href: '/orders/123' },
    },
  },
}

function isNavLink(l: NavLink | { href: string }): l is NavLink {
  return (l as NavLink).to !== undefined
}

export function Task13_1_Solution() {
  const [currentKey, setCurrentKey] = useState('pending')
  const [history, setHistory] = useState<string[]>([])

  const resource = MOCK_API[currentKey]
  const actions = Object.entries(resource.links).filter(([rel]) => rel !== 'self')

  const follow = (rel: string, link: NavLink) => {
    setCurrentKey(link.to)
    setHistory((prev) => [...prev, rel])
  }

  const reset = () => {
    setCurrentKey('pending')
    setHistory([])
  }

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Навигатор по гипермедиа</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Двигайся по API только через _links — без знания URL заранее
      </p>

      {/* Лог переходов / Transition log */}
      <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
        <span style={{ color: '#64748b' }}>Путь: </span>
        <span style={{ fontFamily: 'monospace' }}>
          entry{history.map((rel, i) => (
            <span key={i}> → <span style={{ color: '#6366f1', fontWeight: 700 }}>{rel}</span></span>
          ))}
        </span>
      </div>

      {/* Текущий ресурс / Current resource */}
      <pre style={{ background: '#0f172a', color: '#e2e8f0', padding: '0.9rem', borderRadius: '6px', fontSize: '0.78rem', margin: 0, overflow: 'auto' }}>
        {JSON.stringify({ ...resource.data, _links: resource.links }, null, 2)}
      </pre>

      {/* self / self */}
      <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
        🔗 <code>self</code>: <span style={{ fontFamily: 'monospace' }}>{(resource.links.self as { href: string }).href}</span> — адрес самого ресурса (не действие)
      </div>

      {/* Кнопки переходов / Transition buttons */}
      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Доступные действия:</div>
        {actions.length === 0 ? (
          <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>
            Терминальное состояние — переходов нет, только self
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {actions.map(([rel, link]) =>
              isNavLink(link) ? (
                <button
                  key={rel}
                  onClick={() => follow(rel, link)}
                  style={{
                    padding: '0.5rem 0.9rem',
                    borderRadius: '6px',
                    border: '1px solid #6366f1',
                    background: '#eef2ff',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#4338ca', fontSize: '0.85rem' }}>{rel}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#64748b' }}>{link.method} {link.href}</div>
                </button>
              ) : null,
            )}
          </div>
        )}
      </div>

      <button
        onClick={reset}
        style={{ marginTop: '1.25rem', padding: '0.45rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}
      >
        ↺ Сбросить к точке входа
      </button>
    </div>
  )
}

// ============================================
// Task 13.2: State-driven _links Builder / Конструктор _links по состоянию
// ============================================

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
type Role = 'customer' | 'admin'

interface LinkSpec {
  href: string
  method: string
  reason: string
  adminOnly?: boolean
}

// Все возможные действия (кроме self) для блока «недоступные» / all possible actions
const ALL_ACTIONS = ['pay', 'cancel', 'ship', 'refund', 'track', 'review'] as const

function linksFor(status: OrderStatus, role: Role): Record<string, LinkSpec> {
  const links: Record<string, LinkSpec> = {
    self: { href: '/orders/123', method: 'GET', reason: 'адрес самого ресурса — есть всегда' },
  }
  const add = (rel: string, spec: LinkSpec) => {
    if (spec.adminOnly && role !== 'admin') return
    links[rel] = spec
  }
  switch (status) {
    case 'pending':
      add('pay', { href: '/orders/123/payment', method: 'POST', reason: 'заказ ещё не оплачен' })
      add('cancel', { href: '/orders/123', method: 'DELETE', reason: 'неоплаченный заказ можно отменить' })
      break
    case 'paid':
      add('ship', { href: '/orders/123/shipment', method: 'POST', reason: 'оплаченный заказ можно отгрузить' })
      add('refund', { href: '/orders/123/refund', method: 'POST', reason: 'возврат средств — только admin', adminOnly: true })
      break
    case 'shipped':
      add('track', { href: '/orders/123/tracking', method: 'GET', reason: 'отгруженный заказ можно отслеживать' })
      add('refund', { href: '/orders/123/refund', method: 'POST', reason: 'возврат средств — только admin', adminOnly: true })
      break
    case 'delivered':
      add('review', { href: '/orders/123/review', method: 'POST', reason: 'доставленный заказ можно оценить' })
      add('refund', { href: '/orders/123/refund', method: 'POST', reason: 'возврат средств — только admin', adminOnly: true })
      break
    case 'cancelled':
      // только self / self only
      break
  }
  return links
}

const STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

export function Task13_2_Solution() {
  const [status, setStatus] = useState<OrderStatus>('pending')
  const [role, setRole] = useState<Role>('customer')

  const links = linksFor(status, role)
  const activeRels = Object.keys(links)
  const forbidden = ALL_ACTIONS.filter((a) => !activeRels.includes(a))

  const responseObj = {
    orderId: 123,
    status,
    _links: Object.fromEntries(
      Object.entries(links).map(([rel, spec]) => [rel, { href: spec.href, method: spec.method }]),
    ),
  }

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Конструктор _links по состоянию</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Состояние ресурса определяет, какие переходы доступны
      </p>

      {/* Переключатели / Switches */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>Состояние заказа</div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                style={{
                  padding: '0.4rem 0.7rem',
                  borderRadius: '6px',
                  border: status === s ? '2px solid #6366f1' : '1px solid #e2e8f0',
                  background: status === s ? '#eef2ff' : '#fff',
                  fontWeight: status === s ? 700 : 400,
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.35rem' }}>Роль</div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {(['customer', 'admin'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  padding: '0.4rem 0.7rem',
                  borderRadius: '6px',
                  border: role === r ? '2px solid #0891b2' : '1px solid #e2e8f0',
                  background: role === r ? '#ecfeff' : '#fff',
                  fontWeight: role === r ? 700 : 400,
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* JSON-ответ / JSON response */}
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.3rem' }}>Гипермедиа-ответ</div>
          <pre style={{ background: '#0f172a', color: '#e2e8f0', padding: '0.8rem', borderRadius: '6px', fontSize: '0.74rem', margin: 0, overflow: 'auto' }}>
            {JSON.stringify(responseObj, null, 2)}
          </pre>
        </div>

        {/* Пояснения / Explanations */}
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.3rem' }}>Почему эти ссылки</div>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem' }}>
            {Object.entries(links).map(([rel, spec]) => (
              <li key={rel} style={{ marginBottom: '0.3rem' }}>
                <code style={{ color: '#4338ca', fontWeight: 700 }}>{rel}</code> — {spec.reason}
              </li>
            ))}
          </ul>

          {forbidden.length > 0 && (
            <>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', margin: '0.8rem 0 0.3rem' }}>Недоступно в этом состоянии</div>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                {forbidden.map((rel) => (
                  <li key={rel} style={{ marginBottom: '0.2rem' }}>
                    <s>{rel}</s> — не допускается при статусе «{status}»{rel === 'refund' && role !== 'admin' ? ' / только admin' : ''}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 13.3: HATEOAS API Design / Проектирование HATEOAS API
// ============================================

interface HateoasScenario {
  icon: string
  title: string
  description: string
  states: Array<{ state: string; rels: string[] }>
  rule: string
}

const HATEOAS_SCENARIOS: HateoasScenario[] = [
  {
    icon: '💳',
    title: 'Платёж',
    description: 'Жизненный цикл платежа от создания до возврата.',
    states: [
      { state: 'created', rels: ['self', 'authorize', 'cancel'] },
      { state: 'authorized', rels: ['self', 'capture', 'void'] },
      { state: 'captured', rels: ['self', 'refund'] },
      { state: 'refunded', rels: ['self'] },
    ],
    rule: 'После capture нельзя void — только refund. Терминальные состояния несут только self.',
  },
  {
    icon: '📝',
    title: 'Статья в блоге',
    description: 'Черновик → публикация → архив.',
    states: [
      { state: 'draft', rels: ['self', 'edit', 'publish', 'delete'] },
      { state: 'published', rels: ['self', 'edit', 'unpublish', 'archive'] },
      { state: 'archived', rels: ['self', 'restore'] },
    ],
    rule: 'delete доступен только в draft. Опубликованную статью снимают с публикации (unpublish), а не удаляют напрямую.',
  },
  {
    icon: '🏖️',
    title: 'Заявка на отпуск',
    description: 'Согласование с участием ролей.',
    states: [
      { state: 'submitted', rels: ['self', 'approve', 'reject', 'withdraw'] },
      { state: 'approved', rels: ['self', 'cancel'] },
      { state: 'rejected', rels: ['self', 'resubmit'] },
      { state: 'cancelled', rels: ['self'] },
    ],
    rule: 'approve/reject — у согласующего, withdraw/cancel — у заявителя. Набор ссылок зависит и от состояния, и от роли.',
  },
]

export function Task13_3_Solution() {
  const [selected, setSelected] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const scenario = HATEOAS_SCENARIOS[selected]

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Проектирование HATEOAS API</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Продумай состояния и переходы (_links), затем сравни с эталоном
      </p>

      {/* Карточки / Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {HATEOAS_SCENARIOS.map((s, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              textAlign: 'left',
              padding: '0.8rem',
              borderRadius: '8px',
              border: selected === i ? '2px solid #6366f1' : '1px solid #e2e8f0',
              background: selected === i ? '#eef2ff' : '#fff',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '1.3rem' }}>{s.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', margin: '0.3rem 0' }}>{s.title}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{s.description}</div>
          </button>
        ))}
      </div>

      {/* Ответ студента / Student answer */}
      <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.85rem' }}>
        Твоё решение для «{scenario.title}»
      </label>
      <textarea
        value={answers[selected] ?? ''}
        onChange={(e) => setAnswers((prev) => ({ ...prev, [selected]: e.target.value }))}
        placeholder="Перечисли состояния и для каждого — какие _links (rel) доступны"
        style={{ width: '100%', minHeight: '120px', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', resize: 'vertical', fontSize: '0.85rem', fontFamily: 'inherit' }}
      />

      <button
        onClick={() => setRevealed((prev) => ({ ...prev, [selected]: !prev[selected] }))}
        style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
      >
        {revealed[selected] ? '🙈 Скрыть эталон' : '💡 Показать эталонное решение'}
      </button>

      {/* Эталон / Reference */}
      {revealed[selected] && (
        <div style={{ marginTop: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Состояние</th>
                <th style={{ padding: '0.5rem' }}>Доступные _links (rel)</th>
              </tr>
            </thead>
            <tbody>
              {scenario.states.map((row) => (
                <tr key={row.state} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontWeight: 700 }}>{row.state}</td>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#475569' }}>{row.rels.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '0.7rem', padding: '0.7rem 0.9rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '0.83rem', color: '#1e40af' }}>
            <strong>Ключевое правило:</strong> {scenario.rule}
          </div>
        </div>
      )}
    </div>
  )
}
