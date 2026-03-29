import { useState } from 'react'

// ============================================
// Задание 5.2: Polymorphic Handlers
// ============================================

// TODO: Создайте систему событий с discriminated union:
//   type AppEvent =
//     | { type: 'USER_LOGIN'; userId: string; timestamp: number }
//     | { type: 'USER_LOGOUT'; userId: string }
//     | { type: 'PAGE_VIEW'; url: string; referrer?: string }
//     | { type: 'ERROR'; code: number; message: string }

// TODO: Создайте тип EventHandler<T extends AppEvent['type']>:
//   Извлекает конкретный тип события из union по дискриминанту
//   Подсказка: Extract<AppEvent, { type: T }>

// TODO: Создайте type-safe map обработчиков:
//   type EventHandlerMap = { [K in AppEvent['type']]: (event: Extract<AppEvent, { type: K }>) => string }

// TODO: Реализуйте объект handlers: EventHandlerMap
//   Каждый обработчик возвращает строку-описание события

// TODO: Реализуйте функцию dispatch(event: AppEvent): string
//   Использует handlers для обработки любого события

export function Task5_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Реализуйте handlers и dispatch, затем протестируйте:
    // log.push(dispatch({ type: 'USER_LOGIN', userId: 'u-42', timestamp: Date.now() }))
    // log.push(dispatch({ type: 'USER_LOGOUT', userId: 'u-42' }))
    // log.push(dispatch({ type: 'PAGE_VIEW', url: '/dashboard' }))
    // log.push(dispatch({ type: 'ERROR', code: 404, message: 'Not found' }))

    // TODO: Покажите, что handlers типизирован — нельзя забыть обработчик
    // TODO: Попробуйте закомментировать один handler — увидите ошибку компиляции

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.2: Polymorphic Handlers</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
