import { useState } from 'react'

// ============================================
// Задание 2.1: Step Builder
// ============================================

// TODO: Определите интерфейс HttpRequest { method, url, headers, body?, timeout? }
// TODO: Define interface HttpRequest { method, url, headers, body?, timeout? }

// TODO: Создайте цепочку step-интерфейсов, каждый возвращает следующий шаг:
//   RequestBuilderStep1: get(url)->Step3, post(url)->Step2, put(url)->Step2, delete(url)->Step3
//   RequestBuilderStep2: body(data)->Step3 (обязательный шаг для POST/PUT)
//   RequestBuilderStep3: header(k,v)->Step3, timeout(ms)->Step3, build()->HttpRequest
//   Ключевая идея: GET/DELETE пропускают body, POST/PUT требуют его
// TODO: Create a chain of step interfaces, each returning the next step:
//   RequestBuilderStep1: get(url)->Step3, post(url)->Step2, put(url)->Step2, delete(url)->Step3
//   RequestBuilderStep2: body(data)->Step3 (required step for POST/PUT)
//   RequestBuilderStep3: header(k,v)->Step3, timeout(ms)->Step3, build()->HttpRequest
//   Key idea: GET/DELETE skip body, POST/PUT require it

// TODO: Реализуйте createRequestBuilder() -> RequestBuilderStep1
//   Внутри используйте замыкание с Partial<HttpRequest> для накопления данных
// TODO: Implement createRequestBuilder() -> RequestBuilderStep1
//   Use closure with Partial<HttpRequest> to accumulate data

export function Task2_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Step Builder ===')
    log.push('')

    // TODO: Создайте GET запрос (без body шага)
    // TODO: Create GET request (no body step)
    log.push('GET request:')
    log.push('  ... createRequestBuilder().get("/api/users").header(...).build()')
    log.push('')

    // TODO: Создайте POST запрос (body шаг обязателен)
    // TODO: Create POST request (body step required)
    log.push('POST request:')
    log.push('  ... createRequestBuilder().post("/api/users").body({...}).build()')
    log.push('')

    // TODO: Покажите compile-time ошибки:
    //   .get("/url").body(...)     — нет метода body на Step3
    //   .post("/url").build()      — нет build на Step2
    // TODO: Show compile-time errors

    log.push('Step enforcement (compile-time):')
    log.push('  createRequestBuilder().get("/url").body(...)  // Error: no body on GET')
    log.push('  createRequestBuilder().post("/url").build()   // Error: must call body first')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.1: Step Builder</h2>
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
