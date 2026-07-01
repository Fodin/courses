import { useState } from 'react'

// ============================================
// Задание 0.4: Conditional Inference
// ============================================

// TODO: Создайте тип IsString<T> — возвращает true если T extends string, иначе false
// TODO: Создайте runtime-функцию isString(value): 'yes' | 'no'

// TODO: Создайте тип UnwrapPromise<T> — извлекает тип из Promise<T>, иначе возвращает T
// TODO: Используйте конструкцию T extends Promise<infer U> ? U : T

// TODO: Создайте тип ElementType<T> — извлекает тип элемента массива
// TODO: T extends (infer E)[] ? E : T

// TODO: Создайте тип MyReturnType<T> — извлекает тип возвращаемого значения функции
// TODO: T extends (...args: unknown[]) => infer R ? R : never

// TODO: Создайте тип EventMap и условный тип EventHandler<K>, который классифицирует
// TODO: события как 'mouse-event', 'keyboard-event' или 'other-event'

// TODO: Создайте рекурсивный тип DeepUnwrap<T> — рекурсивно разворачивает Promise

export function Task0_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Продемонстрируйте IsString:
    // log.push(`isString("hello") → ${isString('hello')}`)
    // log.push(`isString(42) → ${isString(42)}`)

    // TODO: Продемонстрируйте UnwrapPromise (compile-time):
    // log.push('UnwrapPromise<Promise<number>> → number')

    // TODO: Продемонстрируйте ElementType:
    // function getElementType(arr: unknown[]): string {
    //   if (arr.length === 0) return 'unknown'
    //   return typeof arr[0]
    // }
    // log.push(`getElementType([1, 2, 3]) → ${getElementType([1, 2, 3])}`)

    // TODO: Продемонстрируйте MyReturnType:
    // function getSum(a: number, b: number): number { return a + b }
    // log.push(`getSum(2, 3) → ${getSum(2, 3)} (return type: number)`)

    // TODO: Создайте EventMap с типами click, keypress, scroll
    // TODO: Реализуйте classifyEvent и протестируйте

    // TODO: Выведите примеры type-level типов:
    // log.push('--- Type-level examples (compile-time only) ---')
    // log.push('type A = IsString<"hello"> // true')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.4: Conditional Inference</h2>
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
