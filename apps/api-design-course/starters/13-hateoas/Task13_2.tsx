import { useState } from 'react'

// TODO: Implement State-driven _links Builder / Реализуй конструктор _links по состоянию
//
// State: status (pending/paid/shipped/delivered/cancelled), role (customer/admin)
//
// linksFor(status, role): возвращает объект _links (всегда есть self):
//   pending  → pay, cancel
//   paid     → ship, refund(adminOnly)
//   shipped  → track, refund(adminOnly)
//   delivered→ review, refund(adminOnly)
//   cancelled→ (только self)
//   refund добавляется только если role === 'admin'
//
// UI:
//   - переключатель состояния и роли
//   - JSON-ответ ресурса с _links (href + method)
//   - список «почему эти ссылки» (reason для каждого rel)
//   - блок «недоступно в этом состоянии»: ALL_ACTIONS минус активные, с причиной

export function Task13_2() {
  const [status, setStatus] = useState('pending')
  const [role, setRole] = useState('customer')

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Конструктор _links по состоянию / State-driven _links Builder</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Состояние ресурса определяет доступные переходы / State determines available transitions
      </p>

      {/* TODO: переключатели состояния и роли / state & role switches */}
      {/* TODO: JSON-ответ с _links / JSON response */}
      {/* TODO: пояснения «почему эти ссылки» / explanations */}
      {/* TODO: блок недоступных действий / forbidden actions block */}

      <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{status} / {role}</p>
    </div>
  )
}
