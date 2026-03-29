import { useState } from 'react'

// ============================================
// Задание 1.1: Basic Conditional Types
// ============================================

// TODO: Создайте тип IsString<T> — возвращает true если T extends string, иначе false

// TODO: Создайте тип IsArray<T> — возвращает true если T extends unknown[], иначе false

// TODO: Создайте тип ExtractReturnType<T> — извлекает возвращаемый тип функции
// TODO: Если T — функция (...args: unknown[]) => infer R, вернуть R, иначе never

// TODO: Создайте тип ExtractPromiseType<T> — извлекает тип из Promise
// TODO: Если T extends Promise<infer U>, вернуть U, иначе T

// TODO: Создайте тип NonNullableCustom<T> — исключает null и undefined
// TODO: Если T extends null | undefined, вернуть never, иначе T
// TODO: Реализуйте функцию filterNullable<T>(values: T[]): NonNullableCustom<T>[]

export function Task1_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Создайте runtime-функцию checkIsString и протестируйте:
    // log.push('=== IsString<T> ===')
    // log.push(`checkIsString("hello") → ${checkIsString('hello')}`)
    // log.push(`checkIsString(42) → ${checkIsString(42)}`)

    // TODO: Создайте runtime-функцию checkIsArray и протестируйте:
    // log.push('=== IsArray<T> ===')
    // log.push(`checkIsArray([1,2]) → ${checkIsArray([1, 2])}`)

    // TODO: Создайте функции для демонстрации ExtractReturnType:
    // function getSum(a: number, b: number): number { return a + b }
    // function getName(): string { return 'Alice' }
    // log.push('=== ExtractReturnType<T> ===')
    // log.push(`getSum(2, 3) = ${getSum(2, 3)}`)

    // TODO: Продемонстрируйте ExtractPromiseType (compile-time):
    // log.push('=== ExtractPromiseType<T> ===')
    // log.push('ExtractPromiseType<Promise<string>> → string')

    // TODO: Реализуйте filterNullable и протестируйте:
    // const mixed = ['hello', null, 'world', undefined, 'ts']
    // const filtered = filterNullable(mixed)
    // log.push('=== NonNullableCustom<T> ===')
    // log.push(`Filtered: [${filtered.map(v => `"${v}"`).join(', ')}]`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.1: Basic Conditional Types</h2>
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
