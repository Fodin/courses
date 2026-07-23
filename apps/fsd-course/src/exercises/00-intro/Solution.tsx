import { useState } from 'react'

// ============================================
// Задание 0.1: Карта слоёв FSD — интерактивный обзор
// ============================================

interface Layer {
  id: string
  title: string
  what: string
  example: string
  canImport: string
}

const LAYERS: Layer[] = [
  {
    id: 'app',
    title: 'app',
    what: 'Инициализация приложения: провайдеры, роутинг, глобальные стили.',
    example: '<AppProviders>, роутер, подключение store',
    canImport: 'pages, widgets, features, entities, shared',
  },
  {
    id: 'pages',
    title: 'pages',
    what: 'Страницы-композиции под маршруты. Собирают виджеты и фичи.',
    example: 'ProfilePage, CartPage',
    canImport: 'widgets, features, entities, shared',
  },
  {
    id: 'widgets',
    title: 'widgets',
    what: 'Самостоятельные блоки интерфейса из фич и сущностей.',
    example: 'Header, Sidebar, ProductCardWidget',
    canImport: 'features, entities, shared',
  },
  {
    id: 'features',
    title: 'features',
    what: 'Пользовательские сценарии — действия, приносящие ценность.',
    example: 'add-to-cart, login, toggle-favorite',
    canImport: 'entities, shared',
  },
  {
    id: 'entities',
    title: 'entities',
    what: 'Бизнес-сущности предметной области.',
    example: 'user, product, order',
    canImport: 'shared (и @x других сущностей)',
  },
  {
    id: 'shared',
    title: 'shared',
    what: 'Переиспользуемый код без бизнес-смысла.',
    example: 'Button, apiClient, useDebounce',
    canImport: 'ничего из слоёв выше (только внешние пакеты)',
  },
]

export function Task0_1_Solution() {
  const [active, setActive] = useState<string>('features')
  const layer = LAYERS.find(l => l.id === active)!

  return (
    <div className="exercise-container">
      <h2>Карта слоёв FSD</h2>
      <p style={{ color: 'var(--clr-text-muted)' }}>
        Слои идут сверху вниз. Каждый импортирует только те, что ниже. Кликните по слою, чтобы
        увидеть его ответственность и что ему разрешено импортировать.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 520 }}>
        {LAYERS.map((l, i) => (
          <button
            key={l.id}
            onClick={() => setActive(l.id)}
            style={{
              textAlign: 'left',
              padding: '10px 14px',
              borderRadius: 6,
              border: '1px solid var(--clr-border)',
              cursor: 'pointer',
              fontWeight: l.id === active ? 700 : 500,
              background: l.id === active ? 'rgba(59,130,246,0.15)' : 'var(--clr-bg-secondary)',
              color: 'var(--clr-text)',
              opacity: 1 - i * 0.05,
            }}
          >
            {l.title}
            <span style={{ float: 'right', color: 'var(--clr-text-muted)', fontSize: 12 }}>
              уровень {i}
            </span>
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 8,
          border: '1px solid var(--clr-border)',
          background: 'var(--clr-bg-secondary)',
          maxWidth: 520,
        }}
      >
        <h3 style={{ marginTop: 0 }}>{layer.title}</h3>
        <p>{layer.what}</p>
        <p style={{ fontSize: 14 }}>
          <strong>Примеры:</strong> {layer.example}
        </p>
        <p style={{ fontSize: 14, color: 'var(--clr-text-muted)' }}>
          <strong>Может импортировать:</strong> {layer.canImport}
        </p>
      </div>

      <p style={{ marginTop: 16, fontSize: 14 }}>
        📌 Обратите внимание: чем ниже слой, тем меньше он знает о мире и тем чаще переиспользуется.
        Вверх по стрелкам импортировать нельзя.
      </p>
    </div>
  )
}
