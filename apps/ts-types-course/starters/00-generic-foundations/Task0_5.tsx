import { useState } from 'react'

// ============================================
// Задание 0.5: Generic Factories
// ============================================

// TODO: Создайте интерфейс Serializable с методом serialize(): string
// TODO: Создайте классы UserModel и ProductModel, реализующие Serializable

// TODO: Реализуйте фабрику createModel<T extends Serializable>(ModelClass: new () => T): T
// TODO: Функция принимает конструктор и создаёт экземпляр

// TODO: Реализуйте фабрику createWithArgs<T, TArgs extends unknown[]>(ctor, ...args): T
// TODO: Поддерживает передачу аргументов конструктора (new (...args: TArgs) => T)

// TODO: Реализуйте Registry-фабрику с методами register(key, factory) и create(key)
// TODO: Тип Registry должен накапливать зарегистрированные ключи через цепочку вызовов

// TODO: Реализуйте Builder-фабрику createBuilder<T>(initial: T)
// TODO: Методы: set<K extends keyof T>(key, value) → this, build() → Readonly<T>

// TODO: Реализуйте Validator-фабрику createValidator<T>(check, typeName): Validator<T>
// TODO: Validator имеет validate(value): value is T и parse(value): T (бросает ошибку)

export function Task0_5() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте createModel:
    // const user = createModel(UserModel)
    // log.push(`createModel(UserModel) → ${user.serialize()}`)
    // const product = createModel(ProductModel)
    // log.push(`createModel(ProductModel) → ${product.serialize()}`)

    // TODO: Протестируйте createWithArgs:
    // const typedUser = createWithArgs(UserModel, 'Alice', 'admin')
    // log.push(`createWithArgs → ${typedUser.serialize()}`)

    // TODO: Протестируйте Registry:
    // const reg = createRegistry()
    //   .register('user', () => ({ name: 'Default User', role: 'viewer' }))
    //   .register('config', () => ({ theme: 'dark', lang: 'en' }))
    // log.push(`registry.create('user') → ${JSON.stringify(reg.create('user'))}`)

    // TODO: Протестируйте Builder:
    // const config = createBuilder({ host: 'localhost', port: 3000, debug: false })
    //   .set('port', 8080)
    //   .set('debug', true)
    //   .build()
    // log.push(`builder.build() → ${JSON.stringify(config)}`)

    // TODO: Протестируйте Validator:
    // const stringValidator = createValidator(
    //   (v: unknown): v is string => typeof v === 'string', 'string'
    // )
    // log.push(`validate('hello') → ${stringValidator.validate('hello')}`)
    // log.push(`validate(42) → ${stringValidator.validate(42)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.5: Generic Factories</h2>
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
