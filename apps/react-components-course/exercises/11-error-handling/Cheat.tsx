export function Cheat() {
  return (
    <div className="exercise-container">
      {/* Level 11: Error Boundaries — подсказки / hints */}
      <h2>Level 11: Error Boundaries — подсказки / hints</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          {/* 11.1 — Скелет ErrorBoundary / ErrorBoundary skeleton */}
          <strong>11.1 — Скелет ErrorBoundary / ErrorBoundary skeleton</strong>
          <pre style={{ fontSize: '0.8rem', marginTop: '0.5rem', overflow: 'auto' }}>{`class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[EB]', error, info.componentStack)
  }

  reset = () => this.setState({ hasError: false, error: null })

  render() {
    if (this.state.hasError)
      return this.props.fallback({ error: this.state.error!, resetErrorBoundary: this.reset })
    return this.props.children
  }
}`}</pre>
        </div>

        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          {/* 11.1 — Симуляция ошибки через state / Error simulation via state */}
          <strong>11.1 — Симуляция ошибки через state / Error simulation via state</strong>
          <pre style={{ fontSize: '0.8rem', marginTop: '0.5rem', overflow: 'auto' }}>{`function Widget() {
  const [broken, setBroken] = useState(false)
  // Бросаем в render — boundary поймает
  // Throw in render — boundary will catch it
  if (broken) throw new Error('Widget сломан')
  return (
    <div>
      <button onClick={() => setBroken(true)}>Сломать</button>
    </div>
  )
}`}</pre>
          <p style={{ fontSize: '0.82rem', color: '#555', margin: '0.5rem 0 0' }}>
            Прямой throw в onClick boundary не поймает — нужно сохранить в state и бросить в render.
            {/* Direct throw in onClick won't be caught by boundary — need to save to state and throw in render. */}
          </p>
        </div>

        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          {/* 11.2 — Сброс через key / Reset via key */}
          <strong>11.2 — Сброс через key / Reset via key</strong>
          <pre style={{ fontSize: '0.8rem', marginTop: '0.5rem', overflow: 'auto' }}>{`// При смене key React пересоздаёт ErrorBoundary полностью
// When key changes, React fully recreates the ErrorBoundary
// Это сбрасывает state boundary и все дочерние state
// This resets the boundary state and all child states
const [globalKey, setGlobalKey] = useState(0)

<ErrorBoundary key={\`widget-\${globalKey}\`} ...>
  <Widget />
</ErrorBoundary>

// «Перезагрузить все» — меняем общий ключ
// "Reload all" — change the common key
<button onClick={() => setGlobalKey(k => k + 1)}>
  Перезагрузить все
</button>`}</pre>
        </div>

        <div style={{ padding: '1rem', background: '#fff8e1', borderRadius: '8px' }}>
          {/* 11.3 — useErrorHandler: ключевая идея / key idea */}
          <strong>11.3 — useErrorHandler: ключевая идея / key idea</strong>
          <pre style={{ fontSize: '0.8rem', marginTop: '0.5rem', overflow: 'auto' }}>{`function useErrorHandler() {
  const [, setState] = useState<null>(null)
  return useCallback((error: Error) => {
    // setState updater вызывается в фазе рендеринга
    // setState updater is called during render phase
    // Ошибка в нём попадает в ближайший ErrorBoundary
    // Error in it reaches the nearest ErrorBoundary
    setState(() => { throw error })
  }, [])
}

// Для async:
// For async:
const handleError = useErrorHandler()
useEffect(() => {
  fetchData().catch(handleError)
}, [handleError])

// Для onClick:
// For onClick:
const handleError = useErrorHandler()
<button onClick={() => handleError(new Error('...'))} />`}</pre>
        </div>

        <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
          {/* Частые ошибки / Common mistakes */}
          <strong>Частые ошибки / Common mistakes</strong>
          <ul style={{ fontSize: '0.85rem', color: '#555', margin: '0.5rem 0 0', paddingLeft: '1.2rem', lineHeight: 1.8 }}>
            <li>Забыть import React в файле с class-компонентом
              {/* Forgot to import React in the class component file */}
            </li>
            <li>Throw в onClick — boundary не поймает (используй state + throw в render)
              {/* Throw in onClick — boundary won't catch it (use state + throw in render) */}
            </li>
            <li>Async/await в useEffect — оборачивай в try/catch и вызывай handleError
              {/* Async/await in useEffect — wrap in try/catch and call handleError */}
            </li>
            <li>Не передавать key при глобальном сбросе — boundary не пересоздаётся
              {/* Not passing key on global reset — boundary won't be recreated */}
            </li>
            <li>Fallback UI без кнопки «Восстановить» — пользователь застревает
              {/* Fallback UI without "Restore" button — user gets stuck */}
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}
