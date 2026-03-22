import { type Ref, useRef, useState } from 'react'

// ============================================
// Task 1.1 Solution: JSX без import React
// ============================================

// Обратите внимание: нет `import React from 'react'`!
// Новый JSX transform (React 17+) не требует этого импорта.
// В React 19 новый JSX transform обязателен.

export function Task1_1_Solution() {
  const [count, setCount] = useState(0)

  return (
    <div className="exercise-container">
      <h2>Решение 1.1: JSX без import React</h2>

      <div
        style={{
          padding: '1rem',
          background: '#e8f5e9',
          borderRadius: '8px',
          border: '1px solid #4caf50',
          marginTop: '1rem',
        }}
      >
        <p>
          Этот компонент работает <strong>без</strong> <code>import React from 'react'</code>
        </p>
        <p>
          Мы импортируем только то, что используем: <code>useState</code>
        </p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p>Счётчик: {count}</p>
        <button onClick={() => setCount((c) => c + 1)}>+1</button>
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
        }}
      >
        <p>
          <span style={{ color: '#ef5350', textDecoration: 'line-through' }}>
            import React from 'react'
          </span>
        </p>
        <p style={{ color: '#4caf50' }}>
          {"import { useState } from 'react'"}
        </p>
      </div>
    </div>
  )
}

// ============================================
// Task 1.2 Solution: ref как prop
// ============================================

// В React 19 ref — это обычный prop, forwardRef не нужен!
function FancyInput({
  ref,
  placeholder = 'Введите текст...',
  ...props
}: {
  ref?: Ref<HTMLInputElement>
  placeholder?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      ref={ref}
      placeholder={placeholder}
      {...props}
      style={{
        padding: '0.75rem',
        border: '2px solid #1976d2',
        borderRadius: '8px',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        width: '100%',
        maxWidth: '400px',
        ...((props.style as object) || {}),
      }}
    />
  )
}

export function Task1_2_Solution() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')

  const handleFocus = () => {
    inputRef.current?.focus()
  }

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
    setValue('')
  }

  return (
    <div className="exercise-container">
      <h2>Решение 1.2: ref как prop</h2>

      <div
        style={{
          padding: '1rem',
          background: '#e3f2fd',
          borderRadius: '8px',
          border: '1px solid #1976d2',
          marginTop: '1rem',
          fontSize: '0.9rem',
        }}
      >
        <code>{'function FancyInput({ ref, ...props })'}</code> — ref как обычный prop!
      </div>

      <div style={{ marginTop: '1rem' }}>
        <FancyInput
          ref={inputRef}
          placeholder="FancyInput с ref как prop"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button onClick={handleFocus}>Фокус на input</button>
        <button onClick={handleClear}>Очистить</button>
      </div>

      {value && (
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          Значение: <strong>{value}</strong>
        </p>
      )}
    </div>
  )
}

// ============================================
// Task 1.3 Solution: ref cleanup function
// ============================================

export function Task1_3_Solution() {
  const [showInput, setShowInput] = useState(true)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

  return (
    <div className="exercise-container">
      <h2>Решение 1.3: ref cleanup function</h2>

      <button onClick={() => setShowInput((v) => !v)} style={{ marginTop: '1rem' }}>
        {showInput ? 'Скрыть input' : 'Показать input'}
      </button>

      {showInput && (
        <div style={{ marginTop: '1rem' }}>
          <input
            ref={(node) => {
              if (node) {
                node.focus()
                addLog('ref setup: элемент добавлен в DOM, фокус установлен')
              }
              // Cleanup function — вызывается при размонтировании
              return () => {
                addLog('ref cleanup: элемент удалён из DOM')
              }
            }}
            placeholder="Этот input использует ref cleanup"
            style={{
              padding: '0.75rem',
              border: '2px solid #9c27b0',
              borderRadius: '8px',
              fontSize: '1rem',
              width: '100%',
              maxWidth: '400px',
            }}
          />
        </div>
      )}

      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px',
          maxHeight: '200px',
          overflow: 'auto',
        }}
      >
        <h4>Лог событий:</h4>
        {logs.length === 0 ? (
          <p style={{ color: '#999' }}>Нажмите кнопку для генерации событий...</p>
        ) : (
          logs.map((log, i) => (
            <p
              key={i}
              style={{
                margin: '0.25rem 0',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: log.includes('cleanup') ? '#ef5350' : '#4caf50',
              }}
            >
              {log}
            </p>
          ))
        )}
      </div>

      <button onClick={() => setLogs([])} style={{ marginTop: '0.5rem' }}>
        Очистить лог
      </button>
    </div>
  )
}

// ============================================
// Task 1.4 Solution: Убрать forwardRef
// ============================================

// React 19 стиль: ref как обычный prop, без forwardRef
function NewInput({
  ref,
  ...props
}: {
  ref?: Ref<HTMLInputElement>
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      ref={ref}
      {...props}
      style={{
        padding: '0.75rem',
        border: '2px solid #4caf50',
        borderRadius: '8px',
        fontSize: '1rem',
        width: '100%',
        maxWidth: '400px',
        ...((props.style as object) || {}),
      }}
    />
  )
}

export function Task1_4_Solution() {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="exercise-container">
      <h2>Решение 1.4: Убрать forwardRef</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <div
          style={{
            padding: '1rem',
            background: '#ffebee',
            borderRadius: '8px',
            border: '1px solid #ef5350',
          }}
        >
          <h4>React 18 (forwardRef)</h4>
          <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
{`const OldInput = forwardRef<
  HTMLInputElement, Props
>((props, ref) => {
  return <input ref={ref} {...props} />
})

OldInput.displayName = 'OldInput'`}
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
          <h4>React 19 (ref as prop)</h4>
          <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
{`function NewInput({
  ref, ...props
}: Props & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}`}
          </pre>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <NewInput ref={inputRef} placeholder="Новый компонент без forwardRef" />
      </div>

      <button onClick={() => inputRef.current?.focus()} style={{ marginTop: '0.5rem' }}>
        Фокус на NewInput
      </button>
    </div>
  )
}
