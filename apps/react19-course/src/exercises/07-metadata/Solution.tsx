import { useState } from 'react'

// ============================================
// Task 7.1 Solution: Document metadata
// ============================================

function PageWithMetadata({ title, description }: { title: string; description: string }) {
  return (
    <div
      style={{
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '8px',
        marginTop: '0.5rem',
      }}
    >
      <title>{title}</title>
      <meta name="description" content={description} />
      <h3>{title}</h3>
      <p style={{ color: '#666' }}>{description}</p>
      <p style={{ fontSize: '0.85rem', color: '#999' }}>
        ↑ Этот компонент рендерит {'<title>'} и {'<meta>'} прямо в JSX. React 19 автоматически поднимает их в {'<head>'}.
      </p>
    </div>
  )
}

export function Task7_1_Solution() {
  const [page, setPage] = useState<'home' | 'about' | 'contacts'>('home')

  const pages = {
    home: { title: 'Главная — React 19', description: 'Добро пожаловать на главную страницу' },
    about: { title: 'О нас — React 19', description: 'Информация о компании' },
    contacts: { title: 'Контакты — React 19', description: 'Как с нами связаться' },
  }

  return (
    <div className="exercise-container">
      <h2>Решение 7.1: Document Metadata</h2>

      <p>
        В React 19 можно рендерить <code>{'<title>'}</code>, <code>{'<meta>'}</code> и <code>{'<link>'}</code> прямо в
        компонентах. React автоматически поднимает их в <code>{'<head>'}</code>.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        {(Object.keys(pages) as Array<keyof typeof pages>).map((key) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: page === key ? '#1976d2' : '#fff',
              color: page === key ? '#fff' : '#333',
              cursor: 'pointer',
            }}
          >
            {pages[key].title.split(' — ')[0]}
          </button>
        ))}
      </div>

      <PageWithMetadata {...pages[page]} />

      <pre
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '0.8rem',
          overflow: 'auto',
        }}
      >
        {`function ProductPage({ product }) {
  return (
    <article>
      <title>{product.name} — Магазин</title>
      <meta name="description" content={product.description} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </article>
  )
}`}
      </pre>
    </div>
  )
}

// ============================================
// Task 7.2 Solution: Stylesheet precedence
// ============================================

export function Task7_2_Solution() {
  const [theme, setTheme] = useState<'default' | 'blue' | 'green'>('default')

  const themes = {
    default: { bg: '#ffffff', text: '#333333', accent: '#1976d2' },
    blue: { bg: '#e3f2fd', text: '#0d47a1', accent: '#1565c0' },
    green: { bg: '#e8f5e9', text: '#1b5e20', accent: '#2e7d32' },
  }

  const currentTheme = themes[theme]

  return (
    <div className="exercise-container">
      <h2>Решение 7.2: Stylesheet Precedence</h2>

      <p>
        React 19 поддерживает атрибут <code>precedence</code> для <code>{'<link rel="stylesheet">'}</code>.
        Это управляет порядком подключения стилей.
      </p>

      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#fff3e0',
          borderRadius: '8px',
          fontSize: '0.85rem',
        }}
      >
        <strong>Примечание:</strong> В реальном приложении используются настоящие CSS-файлы.
        Здесь мы демонстрируем концепцию inline.
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        {(Object.keys(themes) as Array<keyof typeof themes>).map((key) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: theme === key ? themes[key].accent : '#fff',
              color: theme === key ? '#fff' : '#333',
              cursor: 'pointer',
            }}
          >
            {key === 'default' ? 'По умолчанию' : key === 'blue' ? 'Синяя' : 'Зелёная'}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '1.5rem',
          background: currentTheme.bg,
          color: currentTheme.text,
          borderRadius: '8px',
          border: `2px solid ${currentTheme.accent}`,
          transition: 'all 0.3s',
        }}
      >
        <h3 style={{ color: currentTheme.accent }}>Тема: {theme}</h3>
        <p>Этот блок стилизован текущей темой.</p>
      </div>

      <pre
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px',
          fontSize: '0.8rem',
          overflow: 'auto',
        }}
      >
        {`// React 19: precedence управляет порядком стилей
function Component() {
  return (
    <>
      <link rel="stylesheet" href="/base.css" precedence="default" />
      <link rel="stylesheet" href="/theme.css" precedence="high" />
      <link rel="stylesheet" href="/overrides.css" precedence="high" />
      <div>Контент</div>
    </>
  )
}

// precedence="default" загружается первым
// precedence="high" загружается после и может переопределить стили`}
      </pre>
    </div>
  )
}

// ============================================
// Task 7.3 Solution: Preload API
// ============================================

export function Task7_3_Solution() {
  const [loaded, setLoaded] = useState<string[]>([])

  const preloadExamples = [
    {
      name: 'preinit',
      description: 'Загружает и выполняет скрипт немедленно',
      code: `import { preinit } from 'react-dom'\npreinit('/analytics.js', { as: 'script' })`,
    },
    {
      name: 'preload',
      description: 'Предзагружает ресурс (но не выполняет)',
      code: `import { preload } from 'react-dom'\npreload('/hero-image.jpg', { as: 'image' })`,
    },
    {
      name: 'prefetchDNS',
      description: 'Предварительно резолвит DNS для домена',
      code: `import { prefetchDNS } from 'react-dom'\nprefetchDNS('https://api.example.com')`,
    },
    {
      name: 'preconnect',
      description: 'Устанавливает соединение заранее (DNS + TCP + TLS)',
      code: `import { preconnect } from 'react-dom'\npreconnect('https://cdn.example.com')`,
    },
    {
      name: 'preinitModule',
      description: 'Загружает и выполняет ES-модуль',
      code: `import { preinitModule } from 'react-dom'\npreinitModule('/widget.js', { as: 'script' })`,
    },
  ]

  return (
    <div className="exercise-container">
      <h2>Решение 7.3: Preload API</h2>

      <p>
        React 19 предоставляет набор функций для предзагрузки ресурсов.
        Они вызываются во время рендера компонента.
      </p>

      <div style={{ marginTop: '1rem' }}>
        {preloadExamples.map((example) => (
          <div
            key={example.name}
            style={{
              padding: '1rem',
              margin: '0.5rem 0',
              background: loaded.includes(example.name) ? '#e8f5e9' : '#f5f5f5',
              borderRadius: '8px',
              border: loaded.includes(example.name) ? '1px solid #4caf50' : '1px solid #ddd',
              transition: 'all 0.3s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#1976d2' }}>{example.name}()</strong>
                <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>{example.description}</p>
              </div>
              <button
                onClick={() => setLoaded((prev) => [...prev, example.name])}
                disabled={loaded.includes(example.name)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  background: loaded.includes(example.name) ? '#4caf50' : '#fff',
                  color: loaded.includes(example.name) ? '#fff' : '#333',
                  cursor: loaded.includes(example.name) ? 'default' : 'pointer',
                }}
              >
                {loaded.includes(example.name) ? '✓ Вызвано' : 'Симулировать'}
              </button>
            </div>
            <pre
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                background: '#fff',
                borderRadius: '4px',
                fontSize: '0.8rem',
                overflow: 'auto',
              }}
            >
              {example.code}
            </pre>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '0.85rem',
        }}
      >
        <strong>Когда использовать:</strong>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li><code>prefetchDNS</code> — для сторонних API</li>
          <li><code>preconnect</code> — для CDN или API, к которым будет запрос</li>
          <li><code>preload</code> — для критических изображений, шрифтов</li>
          <li><code>preinit</code> — для аналитики и виджетов</li>
        </ul>
      </div>
    </div>
  )
}
