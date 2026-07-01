import { useState } from 'react'

// ============================================
// Задание 3.1: Template Literal Basics
// ============================================

// TODO: Создайте тип Greeting = `Hello, ${string}` — строка начинающаяся с "Hello, "
// TODO: Создайте функцию greet(msg: Greeting): string

// TODO: Создайте union через template literals:
//   type Color = 'red' | 'green' | 'blue'
//   type Shade = 'light' | 'dark'
//   type ColorVariant = `${Shade}-${Color}` — генерирует 6 вариантов

// TODO: Создайте тип для CSS-значений:
//   type CSSUnit = 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'
//   type CSSValue = `${number}${CSSUnit}`
//   Создайте функцию setCSSValue(prop: string, value: CSSValue): string

// TODO: Создайте тип EventHandler = `on${Capitalize<DOMEvent>}`
//   где DOMEvent = 'click' | 'focus' | 'blur' | 'input' | 'change'

// TODO: Создайте тип ApiRoute = `/api/${ApiVersion}/${Resource}`
//   ApiVersion = 'v1' | 'v2', Resource = 'users' | 'posts' | 'comments'

// TODO: Создайте тип LogEntry = `[${HttpMethod}] ${StatusCode}`
//   Посчитайте количество комбинаций

export function Task3_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте greet:
    // log.push(`greet("Hello, World") → "${greet('Hello, World')}"`)

    // TODO: Создайте массив всех ColorVariant и выведите:
    // const allVariants: ColorVariant[] = ['light-red', 'light-green', ...]
    // log.push(`All variants (${allVariants.length}): ${allVariants.join(', ')}`)

    // TODO: Протестируйте setCSSValue:
    // log.push(setCSSValue('width', '100px'))
    // log.push(setCSSValue('font-size', '1.5rem'))

    // TODO: Создайте массив EventHandler и выведите:
    // const handlers: EventHandler[] = ['onClick', 'onFocus', ...]

    // TODO: Создайте массив ApiRoute и выведите:
    // const routes: ApiRoute[] = ['/api/v1/users', ...]
    // log.push(`Routes (${routes.length}):`)

    // TODO: Создайте примеры LogEntry:
    // const logs: LogEntry[] = ['[GET] 200', '[POST] 201', ...]

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.1: Template Literal Basics</h2>
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
