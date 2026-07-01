import { useState } from 'react'

// TODO: Implement Hypermedia Navigator / Реализуй навигатор по гипермедиа
//
// Mock API / Мок-API: объект { [key]: { data, links: { rel: { href, method, to } } } }
//   pending  → links: self, pay(→paid), cancel(→cancelled)
//   paid     → links: self, ship(→shipped), refund(→cancelled)
//   shipped  → links: self, track, return(→cancelled)
//   cancelled→ links: self  (терминальное состояние)
//
// State: currentKey (ключ ресурса), history (массив пройденных rel)
//
// Logic / Логика:
//   resource = MOCK_API[currentKey]
//   actions = Object.entries(resource.links).filter(([rel]) => rel !== 'self')
//   follow(rel, link): setCurrentKey(link.to) + добавить rel в history
//
// UI:
//   - лог переходов (entry → pay → ship ...)
//   - текущий ресурс как JSON с _links
//   - self отдельно (адрес ресурса, не действие)
//   - кнопки по actions (подпись: rel + method + href)
//   - терминальное состояние: «переходов нет, только self»
//   - кнопка «Сбросить» к pending

export function Task13_1() {
  const [currentKey, setCurrentKey] = useState('pending')

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Навигатор по гипермедиа / Hypermedia Navigator</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Двигайся по API только через _links / Traverse the API only through _links
      </p>

      {/* TODO: лог переходов / transition log */}
      {/* TODO: текущий ресурс как JSON с _links / current resource JSON */}
      {/* TODO: self отдельно / self separately */}
      {/* TODO: кнопки переходов из _links / transition buttons */}
      {/* TODO: кнопка сброса / reset button */}

      <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Текущее состояние: {currentKey}</p>
    </div>
  )
}
