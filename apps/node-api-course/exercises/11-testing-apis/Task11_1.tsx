import { useState } from 'react'

// ============================================
// Задание 11.1: Unit Testing
// ============================================

// TODO: Напишите unit-тесты для API-логики с помощью Vitest/Jest
// TODO: Протестируйте чистые функции: валидация, трансформация, бизнес-логика
// TODO: Используйте моки для внешних зависимостей (БД, HTTP-клиенты)
// TODO: Покажите test doubles: mock, stub, spy

export function Task11_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Unit Testing ===')
    log.push('')

    // TODO: Протестируйте validateEmail(), calculateDiscount(), formatUser()
    // TODO: Замокайте db.query через vi.mock/jest.mock
    // TODO: Используйте vi.spyOn для проверки вызовов
    // TODO: Покажите arrange-act-assert паттерн
    log.push('Unit Tests')
    log.push('  ... describe("validateEmail", () => { it("rejects invalid", ...) })')
    log.push('  ... vi.mock("./db", () => ({ query: vi.fn() }))')
    log.push('  ... expect(result).toEqual({ id: 1, name: "John" })')
    log.push('  ... expect(db.query).toHaveBeenCalledWith("SELECT...", [1])')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.1: Unit Testing</h2>
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
