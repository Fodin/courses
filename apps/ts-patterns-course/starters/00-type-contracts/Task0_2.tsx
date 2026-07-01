import { useState } from 'react'

// ============================================
// Задание 0.2: Type Guards
// ============================================

// TODO: Создайте интерфейсы SuccessResponse и ErrorResponse
// с полем status: 'success' | 'error'

// TODO: Создайте тип ApiResponse = SuccessResponse | ErrorResponse

// TODO: Создайте type guard isErrorResponse(resp): resp is ErrorResponse

// TODO: Создайте type guard isSuccessResponse(resp): resp is SuccessResponse

// TODO: Создайте интерфейсы Circle, Rectangle, Triangle с полем kind

// TODO: Создайте type Shape = Circle | Rectangle | Triangle

// TODO: Создайте type guards isCircle, isRectangle

// TODO: Создайте функцию getArea(shape: Shape): number

// TODO: Создайте функцию isNonNullable<T>(value: T): value is NonNullable<T>

export function Task0_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Продемонстрируйте API response guards
    // TODO: Продемонстрируйте shape guards и getArea
    // TODO: Продемонстрируйте isNonNullable для фильтрации массива

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.2: Type Guards</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
