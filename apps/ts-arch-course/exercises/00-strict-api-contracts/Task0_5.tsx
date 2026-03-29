import { useState } from 'react'

// ============================================
// Задание 0.5: Contract Testing
// ============================================

// TODO: Определите тип TypeGuard<T> = (value: unknown) => value is T
// TODO: Define type TypeGuard<T> = (value: unknown) => value is T

// TODO: Реализуйте базовые гарды: isString, isNumber, isBoolean
// TODO: Implement basic guards: isString, isNumber, isBoolean

// TODO: Реализуйте комбинатор isArray<T>(guard) -> TypeGuard<T[]>
//   Проверяет Array.isArray и каждый элемент через guard
// TODO: Implement combinator isArray<T>(guard) -> TypeGuard<T[]>
//   Checks Array.isArray and every element via guard

// TODO: Реализуйте комбинатор isObject<T>(schema) -> TypeGuard<T>
//   schema — объект { [K in keyof T]: TypeGuard<T[K]> }
//   Проверяет typeof === 'object', !== null и каждый ключ через свой guard
// TODO: Implement combinator isObject<T>(schema) -> TypeGuard<T>
//   schema — object { [K in keyof T]: TypeGuard<T[K]> }
//   Checks typeof === 'object', !== null and each key via its guard

// TODO: Реализуйте isOneOf<T extends string>(...values) -> TypeGuard<T>
// TODO: Implement isOneOf<T extends string>(...values) -> TypeGuard<T>

// TODO: Создайте интерфейс ContractValidationResult { valid: boolean, errors: string[] }
//   и функцию validateContract<T>(guard, data, label) -> ContractValidationResult
// TODO: Create interface ContractValidationResult { valid: boolean, errors: string[] }
//   and function validateContract<T>(guard, data, label) -> ContractValidationResult

// TODO: Скомпонуйте валидатор для интерфейса ContractUser:
//   { id: number, name: string, email: string, role: 'admin'|'user'|'guest', active: boolean }
//   Используя isObject, isNumber, isString, isOneOf, isBoolean
// TODO: Compose a validator for ContractUser interface:
//   { id: number, name: string, email: string, role: 'admin'|'user'|'guest', active: boolean }
//   Using isObject, isNumber, isString, isOneOf, isBoolean

export function Task0_5() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Contract Testing ===')
    log.push('')

    // TODO: Проверьте валидные данные
    // TODO: Validate correct data
    log.push('Valid user object:')
    log.push('  ... проверьте корректный объект пользователя')
    log.push('')

    // TODO: Проверьте данные с неправильным role
    // TODO: Validate data with wrong role
    log.push('Invalid role:')
    log.push('  ... проверьте объект с role: "superadmin"')
    log.push('')

    // TODO: Проверьте данные с отсутствующими полями
    // TODO: Validate data with missing fields
    log.push('Missing fields:')
    log.push('  ... проверьте неполный объект')
    log.push('')

    // TODO: Проверьте массив пользователей через isArray(isContractUser)
    // TODO: Validate user array via isArray(isContractUser)
    log.push('Array validation:')
    log.push('  ... проверьте массив валидных и невалидных пользователей')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.5: Contract Testing</h2>
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
