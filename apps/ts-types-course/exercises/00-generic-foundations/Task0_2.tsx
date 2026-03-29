import { useState } from 'react'

// ============================================
// Задание 0.2: Default Type Parameters
// ============================================

// TODO: Создайте интерфейс ApiResponse<TData, TError> с дефолтами:
//   TData = unknown, TError = Error
//   Поля: data: TData | null, error: TError | null, status: number

// TODO: Создайте интерфейс Collection<TItem, TKey> где:
//   TKey extends keyof TItem = keyof TItem (дефолт — любой ключ TItem)
//   Поля: items: TItem[], indexBy: TKey

// TODO: Создайте функцию-фабрику createStore<TState = Record<string, unknown>>(initialState):
//   Возвращает объект с getState(), setState(partial), state

// TODO: Создайте интерфейс TypedEvent<T extends EventPayload = EventPayload>
//   где EventPayload = { timestamp: number }
//   Поля: type: string, payload: T

export function Task0_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Создайте ApiResponse без параметров (используя дефолты):
    // const genericResp: ApiResponse = { data: null, error: null, status: 200 }
    // log.push(`ApiResponse<> (defaults) → status: ${genericResp.status}`)

    // TODO: Создайте ApiResponse с конкретным типом данных:
    // const typedResp: ApiResponse<{ name: string }> = { data: { name: 'Alice' }, error: null, status: 200 }
    // log.push(`ApiResponse<{name}> → data.name: ${typedResp.data?.name}`)

    // TODO: Создайте Collection<Product, 'id'> и Collection<Product> (с дефолтным ключом):
    // interface Product { id: number; sku: string; name: string }

    // TODO: Создайте createStore и протестируйте:
    // const store = createStore({ count: 0, name: 'default' })
    // store.setState({ count: 10 })
    // log.push(`createStore → after setState: ${JSON.stringify(store.getState())}`)

    // TODO: Создайте TypedEvent с дефолтным и кастомным payload:
    // interface UserPayload extends EventPayload { userId: string; action: string }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.2: Default Type Parameters</h2>
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
