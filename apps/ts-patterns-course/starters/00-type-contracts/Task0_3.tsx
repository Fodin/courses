import { useState } from 'react'

// ============================================
// Задание 0.3: Discriminated Unions
// ============================================

// TODO: Создайте интерфейс ClickEvent с полями type: 'click', x, y, target

// TODO: Создайте интерфейс SubmitEvent с полями type: 'submit', formId, data

// TODO: Создайте интерфейс NavigateEvent с полями type: 'navigate', from, to

// TODO: Создайте тип AppEvent = ClickEvent | SubmitEvent | NavigateEvent

// TODO: Создайте функцию handleEvent(event: AppEvent): string
// Используйте switch по event.type
// В default добавьте exhaustive check: const _never: never = event

// TODO: Создайте функцию formatEvent(event: AppEvent): string
// Добавьте иконки для каждого типа события

export function Task0_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Создайте массив событий разных типов
    // TODO: Обработайте каждое через handleEvent/formatEvent
    // TODO: Добавьте результаты в log

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.3: Discriminated Unions</h2>
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
