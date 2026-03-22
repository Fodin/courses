import { useState } from 'react'

// ============================================
// Task 0.1 Solution: Обновление до React 19
// ============================================

const packageJsonBefore = {
  dependencies: {
    react: '^18.2.0',
    'react-dom': '^18.2.0',
  },
  devDependencies: {
    '@types/react': '^18.2.0',
    '@types/react-dom': '^18.2.0',
  },
}

const packageJsonAfter = {
  dependencies: {
    react: '^19.0.0',
    'react-dom': '^19.0.0',
  },
  devDependencies: {
    '@types/react': '^19.0.0',
    '@types/react-dom': '^19.0.0',
  },
}

export function Task0_1_Solution() {
  const [showDiff, setShowDiff] = useState(false)

  return (
    <div className="exercise-container">
      <h2>Решение 0.1: Обновление до React 19</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <div
          style={{
            padding: '1rem',
            background: '#ffebee',
            borderRadius: '8px',
            border: '1px solid #ef5350',
          }}
        >
          <h3>До обновления (React 18)</h3>
          <pre style={{ fontSize: '0.85rem', overflow: 'auto' }}>
            {JSON.stringify(packageJsonBefore, null, 2)}
          </pre>
        </div>

        <div
          style={{
            padding: '1rem',
            background: '#e8f5e9',
            borderRadius: '8px',
            border: '1px solid #4caf50',
          }}
        >
          <h3>После обновления (React 19)</h3>
          <pre style={{ fontSize: '0.85rem', overflow: 'auto' }}>
            {JSON.stringify(packageJsonAfter, null, 2)}
          </pre>
        </div>
      </div>

      <button onClick={() => setShowDiff(!showDiff)} style={{ marginTop: '1rem' }}>
        {showDiff ? 'Скрыть команды' : 'Показать команды обновления'}
      </button>

      {showDiff && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#f5f5f5',
            borderRadius: '8px',
            fontFamily: 'monospace',
          }}
        >
          <p>
            <strong>npm:</strong>
          </p>
          <code>npm install react@19 react-dom@19</code>
          <br />
          <code>npm install -D @types/react@19 @types/react-dom@19</code>

          <p style={{ marginTop: '1rem' }}>
            <strong>Также обновите:</strong>
          </p>
          <ul>
            <li>
              <code>eslint-plugin-react-hooks</code> → v5+
            </li>
            <li>
              <code>@testing-library/react</code> → v16+
            </li>
            <li>Удалите <code>@types/react</code> если используете встроенные типы React 19</li>
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 0.2 Solution: React Codemod
// ============================================

interface CodemodExample {
  name: string
  before: string
  after: string
}

const codemodExamples: CodemodExample[] = [
  {
    name: 'ReactDOM.render → createRoot',
    before: `import ReactDOM from 'react-dom'
ReactDOM.render(<App />, document.getElementById('root'))`,
    after: `import { createRoot } from 'react-dom/client'
createRoot(document.getElementById('root')!).render(<App />)`,
  },
  {
    name: 'String ref → useRef',
    before: `class MyComponent extends React.Component {
  render() {
    return <input ref="myInput" />
  }
}`,
    after: `class MyComponent extends React.Component {
  myInput = React.createRef()
  render() {
    return <input ref={this.myInput} />
  }
}`,
  },
  {
    name: 'defaultProps → default parameters',
    before: `function Button({ color }) {
  return <button style={{ color }}/>
}
Button.defaultProps = { color: 'blue' }`,
    after: `function Button({ color = 'blue' }) {
  return <button style={{ color }}/>
}`,
  },
  {
    name: 'forwardRef → ref as prop',
    before: `const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />
})`,
    after: `function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />
}`,
  },
]

export function Task0_2_Solution() {
  const [activeExample, setActiveExample] = useState<number>(0)

  return (
    <div className="exercise-container">
      <h2>Решение 0.2: React Codemod</h2>

      <div style={{ marginTop: '1rem' }}>
        <p>
          Запуск codemod:{' '}
          <code
            style={{
              background: '#f5f5f5',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
            }}
          >
            npx codemod@latest react/19/migration-recipe
          </code>
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        {codemodExamples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setActiveExample(i)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: activeExample === i ? '#1976d2' : '#fff',
              color: activeExample === i ? '#fff' : '#333',
              cursor: 'pointer',
            }}
          >
            {ex.name}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        <div
          style={{
            padding: '1rem',
            background: '#ffebee',
            borderRadius: '8px',
            border: '1px solid #ef5350',
          }}
        >
          <h4>До (React 18)</h4>
          <pre style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
            {codemodExamples[activeExample].before}
          </pre>
        </div>
        <div
          style={{
            padding: '1rem',
            background: '#e8f5e9',
            borderRadius: '8px',
            border: '1px solid #4caf50',
          }}
        >
          <h4>После (React 19)</h4>
          <pre style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
            {codemodExamples[activeExample].after}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 0.3 Solution: Breaking Changes
// ============================================

interface BreakingChange {
  removed: string
  replacement: string
  category: string
}

const breakingChanges: BreakingChange[] = [
  {
    removed: 'defaultProps (function components)',
    replacement: 'ES6 default parameters',
    category: 'Components',
  },
  {
    removed: 'propTypes',
    replacement: 'TypeScript',
    category: 'Components',
  },
  {
    removed: 'String refs',
    replacement: 'useRef / callback refs',
    category: 'Refs',
  },
  {
    removed: 'Legacy Context (contextTypes, childContextTypes)',
    replacement: 'createContext / useContext',
    category: 'Context',
  },
  {
    removed: 'ReactDOM.render',
    replacement: 'createRoot().render()',
    category: 'ReactDOM',
  },
  {
    removed: 'ReactDOM.hydrate',
    replacement: 'hydrateRoot()',
    category: 'ReactDOM',
  },
  {
    removed: 'ReactDOM.unmountComponentAtNode',
    replacement: 'root.unmount()',
    category: 'ReactDOM',
  },
  {
    removed: 'ReactDOM.findDOMNode',
    replacement: 'useRef',
    category: 'ReactDOM',
  },
  {
    removed: 'react-test-renderer',
    replacement: '@testing-library/react',
    category: 'Testing',
  },
  {
    removed: 'Implicit children in FC type',
    replacement: 'Явно указывать children: ReactNode',
    category: 'Types',
  },
  {
    removed: 'useRef() без аргумента → MutableRefObject',
    replacement: 'useRef(null) / useRef(undefined)',
    category: 'Types',
  },
]

export function Task0_3_Solution() {
  const [filter, setFilter] = useState<string>('all')

  const categories = ['all', ...new Set(breakingChanges.map((bc) => bc.category))]
  const filtered =
    filter === 'all' ? breakingChanges : breakingChanges.filter((bc) => bc.category === filter)

  return (
    <div className="exercise-container">
      <h2>Решение 0.3: Breaking Changes в React 19</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: filter === cat ? '#1976d2' : '#fff',
              color: filter === cat ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {cat === 'all' ? 'Все' : cat}
          </button>
        ))}
      </div>

      <table
        style={{
          width: '100%',
          marginTop: '1rem',
          borderCollapse: 'collapse',
          fontSize: '0.9rem',
        }}
      >
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              Удалено / Изменено
            </th>
            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              Замена
            </th>
            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              Категория
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((bc, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem' }}>
                <code style={{ background: '#ffebee', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
                  {bc.removed}
                </code>
              </td>
              <td style={{ padding: '0.75rem' }}>
                <code style={{ background: '#e8f5e9', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
                  {bc.replacement}
                </code>
              </td>
              <td style={{ padding: '0.75rem', color: '#666' }}>{bc.category}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#fff3e0',
          borderRadius: '8px',
          border: '1px solid #ff9800',
        }}
      >
        <strong>Всего breaking changes:</strong> {breakingChanges.length} изменений
      </div>
    </div>
  )
}
