import { useState } from 'react'

// ============================================
// Задание 0.1: Type-Safe HTTP Client
// ============================================

// TODO: Определите тип HttpMethod как union литералов: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
// TODO: Define HttpMethod type as a union of string literals: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// TODO: Создайте обобщённый интерфейс ApiEndpoint<TResponse, TBody = never>
//   с полями: method (HttpMethod), path (string)
//   и фантомными полями: _responseType?: TResponse, _bodyType?: TBody
// TODO: Create a generic interface ApiEndpoint<TResponse, TBody = never>
//   with fields: method (HttpMethod), path (string)
//   and phantom fields: _responseType?: TResponse, _bodyType?: TBody

// TODO: Создайте фабричную функцию endpoint<TResponse, TBody>() для создания ApiEndpoint
// TODO: Create a factory function endpoint<TResponse, TBody>() to create ApiEndpoint instances

// TODO: Определите интерфейсы User, CreateUserBody, ApiError
// TODO: Define interfaces User, CreateUserBody, ApiError

// TODO: Создайте тип ApiResult<T> как discriminated union:
//   { ok: true, data: T } | { ok: false, error: ApiError }
// TODO: Create type ApiResult<T> as a discriminated union:
//   { ok: true, data: T } | { ok: false, error: ApiError }

// TODO: Определите объект api с типизированными эндпоинтами:
//   getUsers:  GET /api/users       -> User[]
//   getUser:   GET /api/users/:id   -> User
//   createUser: POST /api/users     -> User (body: CreateUserBody)
//   deleteUser: DELETE /api/users/:id -> { deleted: boolean }
// TODO: Define an api object with typed endpoints:
//   getUsers:  GET /api/users       -> User[]
//   getUser:   GET /api/users/:id   -> User
//   createUser: POST /api/users     -> User (body: CreateUserBody)
//   deleteUser: DELETE /api/users/:id -> { deleted: boolean }

// TODO: Реализуйте функцию typedFetch, которая:
//   - Принимает ApiEndpoint и опциональное body (обязательное для POST/PUT)
//   - Используйте conditional rest parameters: TBody extends never ? [] : [body: TBody]
//   - Возвращает Promise<ApiResult<TResponse>>
// TODO: Implement a typedFetch function that:
//   - Accepts an ApiEndpoint and optional body (required for POST/PUT)
//   - Use conditional rest parameters: TBody extends never ? [] : [body: TBody]
//   - Returns Promise<ApiResult<TResponse>>

export function Task0_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Type-Safe HTTP Client ===')
    log.push('')

    // TODO: Покажите определение эндпоинтов
    // TODO: Display endpoint definitions
    log.push('API endpoints defined:')
    log.push('  ... определите эндпоинты и выведите их path и method')
    log.push('')

    // TODO: Покажите гарантии типобезопасности
    // TODO: Demonstrate type safety guarantees
    log.push('Type safety guarantees:')
    log.push('  ... покажите примеры типобезопасного использования typedFetch')
    log.push('')

    // TODO: Симулируйте использование с mock-данными
    // TODO: Simulate usage with mock data
    log.push('Simulated fetch result:')
    log.push('  ... создайте mock ApiResult<User[]> и выведите данные')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.1: Type-Safe HTTP Client</h2>
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
