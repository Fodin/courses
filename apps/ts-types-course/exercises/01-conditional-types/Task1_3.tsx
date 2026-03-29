import { useState } from 'react'

// ============================================
// Задание 1.3: Nested Conditionals
// ============================================

// TODO: Создайте тип TypeName<T> — многоуровневое ветвление:
//   string → 'string', number → 'number', boolean → 'boolean',
//   undefined → 'undefined', null → 'null', unknown[] → 'array',
//   (...args) => unknown → 'function', остальное → 'object'
// TODO: Создайте runtime-функцию getTypeName(value: unknown): string

// TODO: Создайте рекурсивный тип DeepUnwrap<T>:
//   Promise<infer U> → DeepUnwrap<U>
//   Array<infer E> → DeepUnwrap<E>
//   Set<infer S> → DeepUnwrap<S>
//   Map<unknown, infer V> → DeepUnwrap<V>
//   иначе → T

// TODO: Создайте тип ResponseType<M extends HttpMethod>:
//   GET → { data: unknown; cached: boolean }
//   POST → { data: unknown; id: string }
//   PUT → { data: unknown; updated: boolean }
//   DELETE → { success: boolean }
// TODO: Создайте функцию simulateRequest<M>(method): ResponseType<M>

// TODO: Создайте тип SeverityAction<S extends Severity>:
//   'debug' | 'info' → 'log', 'warn' → 'alert', 'error' | 'fatal' → 'notify'

export function Task1_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте TypeName/getTypeName на разных значениях:
    // const testValues: [string, unknown][] = [
    //   ['string "hello"', 'hello'], ['number 42', 42], ['boolean true', true],
    //   ['undefined', undefined], ['null', null], ['array [1,2]', [1, 2]],
    //   ['function', () => {}], ['object {}', {}],
    // ]
    // for (const [label, value] of testValues) {
    //   log.push(`${label.padEnd(20)} → "${getTypeName(value)}"`)
    // }

    // TODO: Выведите compile-time примеры DeepUnwrap:
    // log.push('DeepUnwrap<Promise<string>> → string')
    // log.push('DeepUnwrap<Set<Map<string, boolean>>> → boolean')

    // TODO: Протестируйте simulateRequest:
    // log.push(`GET    → ${JSON.stringify(simulateRequest('GET'))}`)
    // log.push(`POST   → ${JSON.stringify(simulateRequest('POST'))}`)
    // log.push(`DELETE → ${JSON.stringify(simulateRequest('DELETE'))}`)

    // TODO: Протестируйте SeverityAction:
    // for (const s of ['debug', 'info', 'warn', 'error', 'fatal']) {
    //   log.push(`${s.padEnd(8)} → action: "${getAction(s)}"`)
    // }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.3: Nested Conditionals</h2>
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
