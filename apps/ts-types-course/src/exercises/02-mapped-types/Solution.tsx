import { useState } from 'react'

// ============================================
// Задание 2.1: Basic Mapped Types — Решение
// ============================================

export function Task2_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. MyReadonly — делает все свойства readonly
    type MyReadonly<T> = {
      readonly [K in keyof T]: T[K]
    }

    interface User {
      name: string
      age: number
      email: string
    }

    const readonlyUser: MyReadonly<User> = { name: 'Alice', age: 30, email: 'alice@test.com' }
    // readonlyUser.name = 'Bob' — ❌ Ошибка: Cannot assign to 'name' because it is a read-only property
    log.push('=== MyReadonly<T> ===')
    log.push(`readonlyUser = ${JSON.stringify(readonlyUser)}`)
    log.push(`readonlyUser.name is readonly — cannot reassign`)

    // 2. MyPartial — делает все свойства опциональными
    type MyPartial<T> = {
      [K in keyof T]?: T[K]
    }

    const partialUser: MyPartial<User> = { name: 'Bob' }
    log.push('')
    log.push('=== MyPartial<T> ===')
    log.push(`partialUser = ${JSON.stringify(partialUser)}`)
    log.push(`Only 'name' specified, rest are optional`)

    // 3. MyRequired — делает все свойства обязательными
    type MyRequired<T> = {
      [K in keyof T]-?: T[K]
    }

    interface Config {
      host?: string
      port?: number
      debug?: boolean
    }

    const requiredConfig: MyRequired<Config> = {
      host: 'localhost',
      port: 3000,
      debug: false,
    }
    log.push('')
    log.push('=== MyRequired<T> ===')
    log.push(`requiredConfig = ${JSON.stringify(requiredConfig)}`)
    log.push(`All optional properties are now required`)

    // 4. MyPick — выбирает подмножество ключей
    type MyPick<T, K extends keyof T> = {
      [P in K]: T[P]
    }

    type UserName = MyPick<User, 'name' | 'email'>
    const picked: UserName = { name: 'Charlie', email: 'charlie@test.com' }
    log.push('')
    log.push('=== MyPick<T, K> ===')
    log.push(`MyPick<User, 'name' | 'email'> = ${JSON.stringify(picked)}`)

    // 5. MyRecord — создаёт тип с заданными ключами и типом значений
    type MyRecord<K extends string | number | symbol, V> = {
      [P in K]: V
    }

    type StatusMap = MyRecord<'active' | 'inactive' | 'banned', { label: string; color: string }>
    const statuses: StatusMap = {
      active: { label: 'Active', color: 'green' },
      inactive: { label: 'Inactive', color: 'gray' },
      banned: { label: 'Banned', color: 'red' },
    }
    log.push('')
    log.push('=== MyRecord<K, V> ===')
    log.push(`statuses = ${JSON.stringify(statuses)}`)

    // 6. Nullable — делает все значения nullable
    type Nullable<T> = {
      [K in keyof T]: T[K] | null
    }

    const nullableUser: Nullable<User> = { name: 'Dave', age: null, email: null }
    log.push('')
    log.push('=== Nullable<T> ===')
    log.push(`nullableUser = ${JSON.stringify(nullableUser)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.1: Basic Mapped Types</h2>
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

// ============================================
// Задание 2.2: Key Remapping — Решение
// ============================================

export function Task2_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Getters — создаёт getter-интерфейс
    type Getters<T> = {
      [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K]
    }

    interface Person {
      name: string
      age: number
      active: boolean
    }

    // Getters<Person> = { getName: () => string, getAge: () => number, getActive: () => boolean }
    const personGetters: Getters<Person> = {
      getName: () => 'Alice',
      getAge: () => 30,
      getActive: () => true,
    }

    log.push('=== Getters<T> (key remapping with as) ===')
    log.push(`getName()   → "${personGetters.getName()}"`)
    log.push(`getAge()    → ${personGetters.getAge()}`)
    log.push(`getActive() → ${personGetters.getActive()}`)

    // 2. Setters
    type Setters<T> = {
      [K in keyof T as `set${Capitalize<K & string>}`]: (value: T[K]) => void
    }

    const state: Person = { name: 'Bob', age: 25, active: false }
    const personSetters: Setters<Person> = {
      setName: (v) => { state.name = v },
      setAge: (v) => { state.age = v },
      setActive: (v) => { state.active = v },
    }

    personSetters.setName('Charlie')
    personSetters.setAge(35)
    log.push('')
    log.push('=== Setters<T> ===')
    log.push(`After setName("Charlie"), setAge(35) → ${JSON.stringify(state)}`)

    // 3. Фильтрация ключей через as never
    type OmitByType<T, U> = {
      [K in keyof T as T[K] extends U ? never : K]: T[K]
    }

    interface Mixed {
      id: number
      name: string
      active: boolean
      count: number
      label: string
    }

    // OmitByType<Mixed, number> убирает все числовые свойства
    type WithoutNumbers = OmitByType<Mixed, number>
    const filtered: WithoutNumbers = { name: 'test', active: true, label: 'hello' }
    log.push('')
    log.push('=== OmitByType<T, U> (filter keys via as never) ===')
    log.push(`OmitByType<Mixed, number> = ${JSON.stringify(filtered)}`)
    log.push(`Removed: id, count (both number)`)

    // 4. ExtractByType — оставляет только ключи определённого типа
    type ExtractByType<T, U> = {
      [K in keyof T as T[K] extends U ? K : never]: T[K]
    }

    type OnlyStrings = ExtractByType<Mixed, string>
    const strings: OnlyStrings = { name: 'test', label: 'hello' }
    log.push('')
    log.push('=== ExtractByType<T, U> ===')
    log.push(`ExtractByType<Mixed, string> = ${JSON.stringify(strings)}`)

    // 5. Prefixed keys
    type Prefixed<T, P extends string> = {
      [K in keyof T as `${P}_${K & string}`]: T[K]
    }

    interface ApiData {
      userId: number
      userName: string
    }

    const prefixed: Prefixed<ApiData, 'api'> = {
      api_userId: 42,
      api_userName: 'Alice',
    }
    log.push('')
    log.push('=== Prefixed<T, P> ===')
    log.push(`Prefixed<ApiData, "api"> = ${JSON.stringify(prefixed)}`)

    // 6. EventHandlers — on{Event}
    type EventHandlers<T> = {
      [K in keyof T as `on${Capitalize<K & string>}Change`]: (newValue: T[K], oldValue: T[K]) => void
    }

    const handlers: EventHandlers<Person> = {
      onNameChange: (n, o) => log.push(`  name: "${o}" → "${n}"`),
      onAgeChange: (n, o) => log.push(`  age: ${o} → ${n}`),
      onActiveChange: (n, o) => log.push(`  active: ${o} → ${n}`),
    }

    log.push('')
    log.push('=== EventHandlers<T> ===')
    handlers.onNameChange('Dave', 'Charlie')
    handlers.onAgeChange(40, 35)
    handlers.onActiveChange(true, false)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.2: Key Remapping</h2>
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

// ============================================
// Задание 2.3: Modifier Manipulation — Решение
// ============================================

export function Task2_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Удаление readonly
    type Mutable<T> = {
      -readonly [K in keyof T]: T[K]
    }

    interface FrozenConfig {
      readonly host: string
      readonly port: number
      readonly debug: boolean
    }

    const mutableConfig: Mutable<FrozenConfig> = { host: 'localhost', port: 3000, debug: false }
    mutableConfig.host = '0.0.0.0' // ✅ Можно изменять
    mutableConfig.port = 8080

    log.push('=== Mutable<T> (remove readonly) ===')
    log.push(`mutableConfig = ${JSON.stringify(mutableConfig)}`)
    log.push(`Properties are now mutable!`)

    // 2. Удаление optional
    type Concrete<T> = {
      [K in keyof T]-?: T[K]
    }

    interface PartialForm {
      username?: string
      password?: string
      email?: string
      rememberMe?: boolean
    }

    const form: Concrete<PartialForm> = {
      username: 'alice',
      password: 'secret',
      email: 'alice@test.com',
      rememberMe: true,
    }

    log.push('')
    log.push('=== Concrete<T> (remove optional) ===')
    log.push(`form = ${JSON.stringify(form)}`)
    log.push(`All properties are now required!`)

    // 3. Комбинированные модификаторы
    type ReadonlyRequired<T> = {
      readonly [K in keyof T]-?: T[K]
    }

    interface Settings {
      theme?: string
      fontSize?: number
      language?: string
    }

    const settings: ReadonlyRequired<Settings> = {
      theme: 'dark',
      fontSize: 14,
      language: 'en',
    }
    // settings.theme = 'light' // ❌ readonly
    // Все три свойства обязательны

    log.push('')
    log.push('=== ReadonlyRequired<T> (readonly + required) ===')
    log.push(`settings = ${JSON.stringify(settings)}`)
    log.push(`All properties are readonly AND required`)

    // 4. Selective modifiers — применить к подмножеству ключей
    type ReadonlyPick<T, K extends keyof T> = {
      readonly [P in K]: T[P]
    } & {
      [P in Exclude<keyof T, K>]: T[P]
    }

    interface Document {
      id: string
      title: string
      content: string
      author: string
    }

    const doc: ReadonlyPick<Document, 'id' | 'author'> = {
      id: 'doc-1',
      title: 'Editable Title',
      content: 'Editable Content',
      author: 'Alice',
    }
    // doc.id = 'new-id' // ❌ readonly
    doc.title = 'Updated Title' // ✅ мутабельное
    doc.content = 'Updated Content'

    log.push('')
    log.push('=== ReadonlyPick<T, K> (selective readonly) ===')
    log.push(`doc = ${JSON.stringify(doc)}`)
    log.push(`id, author — readonly; title, content — mutable`)

    // 5. OptionalExcept — всё опционально кроме указанных ключей
    type OptionalExcept<T, K extends keyof T> = {
      [P in K]-?: T[P]
    } & {
      [P in Exclude<keyof T, K>]?: T[P]
    }

    interface Registration {
      username: string
      email: string
      phone: string
      address: string
      bio: string
    }

    const minimalReg: OptionalExcept<Registration, 'username' | 'email'> = {
      username: 'alice',
      email: 'alice@test.com',
      // phone, address, bio — опциональны
    }

    log.push('')
    log.push('=== OptionalExcept<T, K> ===')
    log.push(`minimalReg = ${JSON.stringify(minimalReg)}`)
    log.push(`username, email — required; rest — optional`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.3: Modifier Manipulation</h2>
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

// ============================================
// Задание 2.4: Deep Mapped Types — Решение
// ============================================

export function Task2_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. DeepPartial — рекурсивно делает всё опциональным
    type DeepPartial<T> = {
      [K in keyof T]?: T[K] extends object
        ? T[K] extends unknown[]
          ? T[K]
          : DeepPartial<T[K]>
        : T[K]
    }

    interface AppConfig {
      server: {
        host: string
        port: number
        ssl: {
          enabled: boolean
          cert: string
          key: string
        }
      }
      database: {
        host: string
        port: number
        name: string
      }
      logging: {
        level: string
        file: string
      }
    }

    const partialConfig: DeepPartial<AppConfig> = {
      server: {
        port: 8080,
        ssl: {
          enabled: true,
        },
      },
    }

    log.push('=== DeepPartial<T> ===')
    log.push(`partialConfig = ${JSON.stringify(partialConfig, null, 2)}`)
    log.push(`Only specified nested properties — rest omitted`)

    // 2. DeepReadonly
    type DeepReadonly<T> = {
      readonly [K in keyof T]: T[K] extends object
        ? T[K] extends unknown[]
          ? readonly T[K][number][]
          : DeepReadonly<T[K]>
        : T[K]
    }

    const frozenConfig: DeepReadonly<AppConfig> = {
      server: {
        host: 'localhost',
        port: 3000,
        ssl: { enabled: false, cert: '', key: '' },
      },
      database: { host: 'localhost', port: 5432, name: 'mydb' },
      logging: { level: 'info', file: '/var/log/app.log' },
    }
    // frozenConfig.server.port = 8080 // ❌ Ошибка: readonly
    // frozenConfig.server.ssl.enabled = true // ❌ Ошибка: readonly (глубокий уровень!)

    log.push('')
    log.push('=== DeepReadonly<T> ===')
    log.push(`frozenConfig.server.host = "${frozenConfig.server.host}"`)
    log.push(`All nested properties are readonly — even ssl.enabled!`)

    // 3. DeepRequired
    type DeepRequired<T> = {
      [K in keyof T]-?: T[K] extends object
        ? T[K] extends unknown[]
          ? T[K]
          : DeepRequired<T[K]>
        : T[K]
    }

    interface PartialSettings {
      ui?: {
        theme?: string
        sidebar?: {
          collapsed?: boolean
          width?: number
        }
      }
      notifications?: {
        email?: boolean
        push?: boolean
      }
    }

    const fullSettings: DeepRequired<PartialSettings> = {
      ui: {
        theme: 'dark',
        sidebar: {
          collapsed: false,
          width: 240,
        },
      },
      notifications: {
        email: true,
        push: false,
      },
    }

    log.push('')
    log.push('=== DeepRequired<T> ===')
    log.push(`fullSettings = ${JSON.stringify(fullSettings, null, 2)}`)
    log.push(`All nested optional properties are now required`)

    // 4. DeepNullable
    type DeepNullable<T> = {
      [K in keyof T]: T[K] extends object
        ? T[K] extends unknown[]
          ? T[K] | null
          : DeepNullable<T[K]> | null
        : T[K] | null
    }

    interface UserProfile {
      name: string
      address: {
        street: string
        city: string
        zip: string
      }
    }

    const nullableProfile: DeepNullable<UserProfile> = {
      name: 'Alice',
      address: {
        street: '123 Main St',
        city: null,
        zip: null,
      },
    }

    log.push('')
    log.push('=== DeepNullable<T> ===')
    log.push(`nullableProfile = ${JSON.stringify(nullableProfile)}`)
    log.push(`Any nested property can be null`)

    // 5. Practical: deep merge function
    function deepMerge<T extends Record<string, unknown>>(
      target: T,
      source: DeepPartial<T>
    ): T {
      const result = { ...target } as Record<string, unknown>
      for (const key of Object.keys(source)) {
        const sourceVal = (source as Record<string, unknown>)[key]
        const targetVal = result[key]
        if (
          sourceVal &&
          typeof sourceVal === 'object' &&
          !Array.isArray(sourceVal) &&
          targetVal &&
          typeof targetVal === 'object' &&
          !Array.isArray(targetVal)
        ) {
          result[key] = deepMerge(
            targetVal as Record<string, unknown>,
            sourceVal as DeepPartial<Record<string, unknown>>
          )
        } else if (sourceVal !== undefined) {
          result[key] = sourceVal
        }
      }
      return result as T
    }

    const defaults = { server: { host: 'localhost', port: 3000 }, debug: false }
    const overrides = { server: { port: 8080 } }
    const merged = deepMerge(defaults, overrides)

    log.push('')
    log.push('=== deepMerge with DeepPartial ===')
    log.push(`defaults  = ${JSON.stringify(defaults)}`)
    log.push(`overrides = ${JSON.stringify(overrides)}`)
    log.push(`merged    = ${JSON.stringify(merged)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.4: Deep Mapped Types</h2>
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
