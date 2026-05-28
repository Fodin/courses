import { useState } from 'react'

// ============================================
// Base64URL helpers / Хелперы Base64URL
// ============================================

function b64urlEncode(obj: unknown): string {
  return btoa(JSON.stringify(obj))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function b64urlDecode(part: string): string {
  let s = part.replace(/-/g, '+').replace(/_/g, '/')
  while (s.length % 4) s += '='
  return atob(s)
}

// Deterministic example token / Детерминированный пример токена
const EXAMPLE_HEADER = { alg: 'HS256', typ: 'JWT' }
const EXAMPLE_PAYLOAD = {
  sub: '42',
  iss: 'https://auth.shop',
  iat: 1700000000,
  exp: 2000000000, // 2033 — заведомо в будущем / well in the future
  scope: 'orders:read orders:write',
  role: 'editor',
}
const EXAMPLE_TOKEN = `${b64urlEncode(EXAMPLE_HEADER)}.${b64urlEncode(EXAMPLE_PAYLOAD)}.dBjftJeZ4CVP_mB92K27uhbUJU1p1r_wW1gFWFOEjXk`

const CLAIM_DESCRIPTIONS: Record<string, string> = {
  sub: 'subject — кто это (id пользователя)',
  iss: 'issuer — кто выдал токен',
  iat: 'issued at — когда выдан',
  exp: 'expiration — когда истекает',
  scope: 'разрешения токена (OAuth 2.0)',
  role: 'роль для RBAC',
  aud: 'audience — для кого предназначен',
}

// ============================================
// Task 12.1: JWT Decoder / Декодер JWT
// ============================================

export function Task12_1_Solution() {
  const [token, setToken] = useState(EXAMPLE_TOKEN)

  const parts = token.split('.')
  const isStructurallyValid = parts.length === 3

  let header: Record<string, unknown> | null = null
  let payload: Record<string, unknown> | null = null
  let error: string | null = null

  if (!token.trim()) {
    error = 'Вставьте JWT в поле выше'
  } else if (!isStructurallyValid) {
    error = `Это не похоже на JWT: ожидается 3 части через точку, найдено ${parts.length}`
  } else {
    try {
      header = JSON.parse(b64urlDecode(parts[0]))
      payload = JSON.parse(b64urlDecode(parts[1]))
    } catch {
      error = 'Не удалось декодировать Base64URL — токен повреждён'
    }
  }

  const exp = payload && typeof payload.exp === 'number' ? (payload.exp as number) : null
  const nowSec = Math.floor(Date.now() / 1000)
  const isExpired = exp !== null && exp < nowSec
  const secondsLeft = exp !== null ? exp - nowSec : null

  const formatLeft = (s: number) => {
    if (s <= 0) return 'истёк'
    const d = Math.floor(s / 86400)
    const h = Math.floor((s % 86400) / 3600)
    const m = Math.floor((s % 3600) / 60)
    if (d > 0) return `${d} дн ${h} ч`
    if (h > 0) return `${h} ч ${m} мин`
    return `${m} мин`
  }

  const partColors = ['#dc2626', '#7c3aed', '#0891b2'] // header, payload, signature
  const partNames = ['header', 'payload', 'signature']

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Декодер JWT</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Разбор Bearer-токена: три части, claims и срок жизни
      </p>

      <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.85rem' }}>JWT</label>
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        spellCheck={false}
        style={{
          width: '100%',
          minHeight: '70px',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          padding: '0.6rem',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          resize: 'vertical',
          wordBreak: 'break-all',
        }}
      />

      {/* Цветная разбивка на части / Colored split */}
      {isStructurallyValid && (
        <div style={{ marginTop: '0.75rem', fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all', lineHeight: 1.8 }}>
          {parts.map((p, i) => (
            <span key={i}>
              <span style={{ background: partColors[i], color: '#fff', padding: '2px 4px', borderRadius: '3px' }}>{p}</span>
              {i < 2 && <span style={{ color: '#94a3b8', fontWeight: 700 }}> . </span>}
            </span>
          ))}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            {partNames.map((n, i) => (
              <span key={n} style={{ color: partColors[i], fontWeight: 700 }}>● {n}</span>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#b91c1c', fontSize: '0.85rem' }}>
          ⚠️ {error}
        </div>
      )}

      {header && payload && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: partColors[0], marginBottom: '0.3rem', fontSize: '0.85rem' }}>header</div>
              <pre style={{ background: '#0f172a', color: '#e2e8f0', padding: '0.7rem', borderRadius: '6px', fontSize: '0.75rem', margin: 0, overflow: 'auto' }}>
                {JSON.stringify(header, null, 2)}
              </pre>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: partColors[1], marginBottom: '0.3rem', fontSize: '0.85rem' }}>payload</div>
              <pre style={{ background: '#0f172a', color: '#e2e8f0', padding: '0.7rem', borderRadius: '6px', fontSize: '0.75rem', margin: 0, overflow: 'auto' }}>
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Статус срока действия / Expiry status */}
          {exp !== null && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.7rem 1rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.9rem',
                background: isExpired ? '#fef2f2' : '#f0fdf4',
                color: isExpired ? '#b91c1c' : '#15803d',
                border: `1px solid ${isExpired ? '#fecaca' : '#bbf7d0'}`,
              }}
            >
              {isExpired ? '⏱️ Токен истёк' : `✅ Токен действителен · осталось ~${formatLeft(secondsLeft as number)}`}
            </div>
          )}

          {/* Таблица claims / Claims table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>claim</th>
                <th style={{ padding: '0.5rem' }}>значение</th>
                <th style={{ padding: '0.5rem' }}>смысл</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(payload).map(([k, v]) => (
                <tr key={k} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontWeight: 700 }}>{k}</td>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#475569' }}>{String(v)}</td>
                  <td style={{ padding: '0.5rem', color: '#64748b' }}>{CLAIM_DESCRIPTIONS[k] ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Заголовок запроса / Request header */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.3rem' }}>Как токен уходит в запросе:</div>
            <pre style={{ background: '#1e293b', color: '#86efac', padding: '0.7rem', borderRadius: '6px', fontSize: '0.75rem', margin: 0, overflow: 'auto' }}>
              {`GET /orders HTTP/1.1\nHost: api.shop\nAuthorization: Bearer ${parts[0].slice(0, 12)}...`}
            </pre>
          </div>
        </>
      )}

      {/* Предупреждение / Warning */}
      <div style={{ marginTop: '1.25rem', padding: '0.8rem 1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', fontSize: '0.83rem', color: '#92400e' }}>
        <strong>⚠️ payload не зашифрован.</strong> Это обычный Base64URL — его прочитает любой, у кого есть токен.
        Подпись защищает только от <em>подделки</em>, но не скрывает содержимое. Никогда не кладите в payload пароли и секреты.
      </div>
    </div>
  )
}

// ============================================
// Task 12.2: Access Matrix (RBAC / scopes) / Матрица доступа
// ============================================

interface Endpoint {
  method: string
  path: string
  requiredScope?: string
  requiredRole?: string
}

interface Identity {
  id: string
  label: string
  token: { role: string; scopes: string[] } | null
}

const ENDPOINTS: Endpoint[] = [
  { method: 'GET', path: '/orders', requiredScope: 'orders:read' },
  { method: 'POST', path: '/orders', requiredScope: 'orders:write' },
  { method: 'DELETE', path: '/orders/{id}', requiredRole: 'admin' },
  { method: 'GET', path: '/profile', requiredScope: 'profile:read' },
  { method: 'GET', path: '/admin/stats', requiredRole: 'admin' },
]

const IDENTITIES: Identity[] = [
  { id: 'anon', label: 'Аноним (без токена)', token: null },
  { id: 'viewer', label: 'viewer', token: { role: 'viewer', scopes: ['orders:read', 'profile:read'] } },
  { id: 'editor', label: 'editor', token: { role: 'editor', scopes: ['orders:read', 'orders:write', 'profile:read'] } },
  { id: 'admin', label: 'admin', token: { role: 'admin', scopes: ['orders:read', 'orders:write', 'profile:read'] } },
]

function evaluate(ep: Endpoint, identity: Identity): { code: 200 | 401 | 403; why: string } {
  if (!identity.token) return { code: 401, why: 'нет токена — личность не установлена' }
  if (ep.requiredRole && identity.token.role !== ep.requiredRole) {
    return { code: 403, why: `нужна роль "${ep.requiredRole}", а у токена "${identity.token.role}"` }
  }
  if (ep.requiredScope && !identity.token.scopes.includes(ep.requiredScope)) {
    return { code: 403, why: `нет scope "${ep.requiredScope}"` }
  }
  return { code: 200, why: 'права достаточны' }
}

const CODE_COLOR: Record<number, string> = { 200: '#22c55e', 403: '#f59e0b', 401: '#ef4444' }

export function Task12_2_Solution() {
  const [identityId, setIdentityId] = useState('anon')
  const identity = IDENTITIES.find((i) => i.id === identityId) as Identity

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Матрица доступа</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Аутентификация vs авторизация: кто прислал запрос и что ему можно
      </p>

      {/* Переключатель личности / Identity switch */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {IDENTITIES.map((i) => (
          <button
            key={i.id}
            onClick={() => setIdentityId(i.id)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              border: identityId === i.id ? '2px solid #6366f1' : '1px solid #e2e8f0',
              background: identityId === i.id ? '#eef2ff' : '#fff',
              fontWeight: identityId === i.id ? 700 : 400,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {i.label}
          </button>
        ))}
      </div>

      {/* Панель токена / Token panel */}
      <div style={{ background: '#0f172a', color: '#e2e8f0', padding: '0.8rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
        {identity.token ? (
          <>
            <div>role: <span style={{ color: '#fbbf24' }}>{identity.token.role}</span></div>
            <div>scopes: <span style={{ color: '#86efac' }}>[{identity.token.scopes.join(', ')}]</span></div>
          </>
        ) : (
          <div style={{ color: '#fca5a5' }}>— токена нет — каждый защищённый эндпоинт ответит 401 —</div>
        )}
      </div>

      {/* Матрица / Matrix */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem' }}>Эндпоинт</th>
            <th style={{ padding: '0.5rem' }}>Требует</th>
            <th style={{ padding: '0.5rem' }}>Результат</th>
            <th style={{ padding: '0.5rem' }}>Почему</th>
          </tr>
        </thead>
        <tbody>
          {ENDPOINTS.map((ep) => {
            const res = evaluate(ep, identity)
            return (
              <tr key={`${ep.method} ${ep.path}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>
                  <strong>{ep.method}</strong> {ep.path}
                </td>
                <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#64748b' }}>
                  {ep.requiredRole ? `role: ${ep.requiredRole}` : `scope: ${ep.requiredScope}`}
                </td>
                <td style={{ padding: '0.5rem' }}>
                  <span style={{ background: CODE_COLOR[res.code], color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontFamily: 'monospace' }}>
                    {res.code}
                  </span>
                </td>
                <td style={{ padding: '0.5rem', color: '#64748b' }}>{res.why}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Легенда / Legend */}
      <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
        <span><span style={{ color: CODE_COLOR[200], fontWeight: 700 }}>200</span> — можно</span>
        <span><span style={{ color: CODE_COLOR[401], fontWeight: 700 }}>401</span> — «не знаю, кто ты» (нет токена)</span>
        <span><span style={{ color: CODE_COLOR[403], fontWeight: 700 }}>403</span> — «знаю, но тебе нельзя» (нет прав)</span>
      </div>
    </div>
  )
}

// ============================================
// Task 12.3: API Protection Design / Проектирование защиты API
// ============================================

interface SecurityScenario {
  icon: string
  title: string
  description: string
  reference: { auth: string; authz: string; encryption: string; logging: string }
}

const SCENARIOS: SecurityScenario[] = [
  {
    icon: '🌐',
    title: 'Публичный API для разработчиков',
    description: 'Тысячи внешних клиентов, сторонние приложения действуют от имени пользователей.',
    reference: {
      auth: 'OAuth 2.0: access-токен (JWT, exp ~15 мин) + долгоживущий refresh-токен.',
      authz: 'Scopes (orders:read, orders:write) — каждому приложению минимально необходимый набор (least privilege).',
      encryption: 'Только HTTPS + HSTS. Секреты подписи JWT — в KMS, не в коде.',
      logging: 'request-id, client-id, метод, путь, статус. Токены маскировать (Bearer ***).',
    },
  },
  {
    icon: '🔗',
    title: 'Внутренний API между микросервисами',
    description: '8 сервисов в приватной сети, конечного пользователя нет.',
    reference: {
      auth: 'mTLS (взаимные сертификаты) или короткоживущие service-токены.',
      authz: 'RBAC по service-identity: какому сервису какой эндпоинт разрешён.',
      encryption: 'mTLS закрывает и личность, и канал; обычно через service mesh.',
      logging: 'Сквозной trace-id для распределённой трассировки. Без PII.',
    },
  },
  {
    icon: '🏦',
    title: 'Банковский / финтех API',
    description: 'Деньги, регуляторика (PCI DSS), высокая цена ошибки.',
    reference: {
      auth: 'OAuth 2.0 + строгий MFA на чувствительные операции. Короткий exp.',
      authz: 'ABAC (владелец счёта, лимиты, рабочие окна) поверх RBAC.',
      encryption: 'TLS + подпись тела запроса (HMAC/X-Signature) для платежей. Идемпотентность.',
      logging: 'Полный неизменяемый аудит транзакций. Маскирование PAN/CVV/PII, ограниченный доступ и срок хранения.',
    },
  },
]

const LAYER_META: Array<{ key: keyof SecurityScenario['reference']; label: string; color: string }> = [
  { key: 'auth', label: '🔑 Аутентификация', color: '#6366f1' },
  { key: 'authz', label: '🛂 Авторизация', color: '#0891b2' },
  { key: 'encryption', label: '🔒 Шифрование', color: '#16a34a' },
  { key: 'logging', label: '📓 Логирование', color: '#b45309' },
]

export function Task12_3_Solution() {
  const [selected, setSelected] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const scenario = SCENARIOS[selected]

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Проектирование защиты API</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Спроектируй четыре слоя защиты для каждого сценария, затем сравни с эталоном
      </p>

      {/* Карточки сценариев / Scenario cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {SCENARIOS.map((s, i) => (
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
        placeholder="Опиши 4 слоя: аутентификация / авторизация / шифрование / логирование"
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '0.6rem',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          resize: 'vertical',
          fontSize: '0.85rem',
          fontFamily: 'inherit',
        }}
      />

      <button
        onClick={() => setRevealed((prev) => ({ ...prev, [selected]: !prev[selected] }))}
        style={{
          marginTop: '0.75rem',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: 'none',
          background: '#6366f1',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        {revealed[selected] ? '🙈 Скрыть эталон' : '💡 Показать эталонное решение'}
      </button>

      {/* Эталон / Reference */}
      {revealed[selected] && (
        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.6rem' }}>
          {LAYER_META.map((layer) => (
            <div key={layer.key} style={{ border: `1px solid ${layer.color}33`, borderLeft: `4px solid ${layer.color}`, borderRadius: '6px', padding: '0.7rem 0.9rem', background: '#fff' }}>
              <div style={{ fontWeight: 700, color: layer.color, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{layer.label}</div>
              <div style={{ fontSize: '0.84rem', color: '#334155' }}>{scenario.reference[layer.key]}</div>
            </div>
          ))}
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.3rem' }}>
            Закономерность: чем выше цена ошибки, тем строже все четыре слоя — больше ABAC, mTLS, подписи и аудита.
          </div>
        </div>
      )}
    </div>
  )
}
