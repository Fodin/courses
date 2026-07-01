import { useState } from 'react'
import { useLanguage } from 'src/hooks'
// TODO: импортировать { pipe, flow } from 'fp-ts/function'
// TODO: импортировать * as A from 'fp-ts/Array'
// TODO: импортировать * as S from 'fp-ts/string'

// Тестовые данные
const NAMES = ['Alice', 'Bob', 'Carol', 'Dan', 'Eve', 'Frank', 'Al', 'Ed']

type Mode = 'pipe' | 'flow' | 'native'

// TODO: реализовать через pipe с A.filter, A.map, A.sort, join
// Pipeline: фильтр (длина > 3) → uppercase → сортировка → join(', ')
function processWithPipe(names: string[]): string {
  // TODO: pipe(names, A.filter(...), A.map(S.toUpperCase), A.sort(S.Ord), ...)
  return ''
}

// TODO: реализовать через flow — должна возвращать ФУНКЦИЮ, а не результат
// const processNames = flow(A.filter<string>(...), ...)
// Использование: const result = processWithFlow(names)
function processWithFlow(names: string[]): string {
  // TODO: создать функцию через flow и применить к names
  return ''
}

function processNative(names: string[]): string {
  return names
    .filter(name => name.length > 3)
    .map(name => name.toUpperCase())
    .sort()
    .join(', ')
}

export function Task10_2() {
  const { t } = useLanguage()
  const [mode, setMode] = useState<Mode>('pipe')

  // TODO: использовать processWithPipe, processWithFlow, processNative
  const resultMap: Record<Mode, string> = {
    pipe: 'TODO',
    flow: 'TODO',
    native: processNative(NAMES),
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.10.2')}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <span>Режим: </span>
        {(['pipe', 'flow', 'native'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              marginRight: '0.5rem',
              padding: '0.3rem 0.8rem',
              background: mode === m ? '#1e3a5f' : '#374151',
              color: mode === m ? '#93c5fd' : '#e5e7eb',
              border: '1px solid #4b5563',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p>Входные данные: <code>{JSON.stringify(NAMES)}</code></p>
        <p>Режим: <strong>{mode}</strong></p>
        {/* TODO: отобразить resultMap[mode] */}
        <p>Результат: <strong>{resultMap[mode]}</strong></p>
      </div>

      <div style={{ background: '#1f2937', padding: '1rem', borderRadius: '8px' }}>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
          Подсказка: pipe(data, fn1, fn2) vs flow(fn1, fn2)(data) — оба дают одинаковый результат
        </p>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
          S.Ord — экземпляр Ord для строк, используйте в A.sort(S.Ord)
        </p>
      </div>
    </div>
  )
}
