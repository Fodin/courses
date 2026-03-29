import { useState } from 'react'

// ============================================
// Задание 8.1: Interface Merging — Решение
// ============================================

export function Task8_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Базовое слияние интерфейсов
    interface User {
      id: number
      name: string
    }

    interface User {
      email: string
      role: string
    }

    // Оба объявления сливаются в одно
    const user: User = {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      role: 'admin'
    }
    log.push(`1. Merged User: ${JSON.stringify(user)}`)

    // 2. Слияние с методами
    interface Logger {
      log(message: string): void
    }

    interface Logger {
      log(message: string, level: number): void
      warn(message: string): void
    }

    // Методы с одинаковым именем создают перегрузки (overloads)
    const logger: Logger = {
      log: (message: string, level?: number) => {
        if (level !== undefined) {
          log.push(`2. Logger.log("${message}", level=${level})`)
        } else {
          log.push(`2. Logger.log("${message}")`)
        }
      },
      warn: (message: string) => {
        log.push(`2. Logger.warn("${message}")`)
      }
    }
    logger.log('Hello')
    logger.log('Error', 3)
    logger.warn('Careful!')

    // 3. Порядок перегрузок при слиянии
    // Правило: более поздние объявления имеют приоритет,
    // но строковые литералы поднимаются наверх

    interface Overloaded {
      process(input: string): string
      process(input: number): number
    }

    interface Overloaded {
      process(input: 'special'): boolean  // string literal — приоритет!
      process(input: boolean): void
    }

    // Итоговый порядок перегрузок:
    // 1. process(input: 'special'): boolean  — literal из второго block
    // 2. process(input: boolean): void       — из второго block
    // 3. process(input: string): string      — из первого block
    // 4. process(input: number): number      — из первого block
    log.push('3. Overload order: string literals first, then later declarations')

    // 4. Конфликты при слиянии свойств
    interface Config {
      debug: boolean
      version: string
    }

    interface Config {
      // debug: string  // ❌ Error! Тип свойства должен совпадать
      version: string   // ✅ OK — тот же тип
      timeout: number
    }

    const config: Config = {
      debug: true,
      version: '1.0.0',
      timeout: 5000
    }
    log.push(`4. Merged Config: debug=${config.debug}, version="${config.version}", timeout=${config.timeout}`)

    // 5. Слияние с generic интерфейсами
    interface Container<T> {
      value: T
      getValue(): T
    }

    interface Container<T> {
      setValue(newValue: T): void
      isEmpty(): boolean
    }

    const container: Container<string> = {
      value: 'hello',
      getValue() { return this.value },
      setValue(newValue: string) { this.value = newValue },
      isEmpty() { return this.value === '' }
    }
    log.push(`5. Container<string>: value="${container.getValue()}", empty=${container.isEmpty()}`)

    // 6. Практический пример: расширение Window
    // В реальном проекте:
    // interface Window {
    //   myApp: { version: string }
    // }
    // Это добавляет свойство myApp к глобальному Window
    log.push('6. Practical: extend Window interface to add custom properties')

    // 7. Слияние interface + class (interface расширяет класс)
    class BaseEvent {
      timestamp = Date.now()
    }

    interface BaseEvent {
      source: string
    }

    // Class и interface с тем же именем сливаются
    const event: BaseEvent = Object.assign(new BaseEvent(), { source: 'user' })
    log.push(`7. Class+Interface merge: timestamp=${event.timestamp}, source="${event.source}"`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.1: Interface Merging</h2>
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
// Задание 8.2: Module Augmentation — Решение
// ============================================

export function Task8_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Концепция module augmentation
    // declare module 'library-name' { ... }
    // позволяет добавить типы к существующему модулю

    log.push('1. Module Augmentation: declare module "library" { ... }')
    log.push('   Adds types to an existing module without modifying source')

    // 2. Пример: расширение стороннего модуля
    // В реальном проекте (в .d.ts файле):
    //
    // declare module 'express' {
    //   interface Request {
    //     user?: {
    //       id: string
    //       role: string
    //     }
    //   }
    // }
    //
    // Теперь req.user типизирован

    log.push('2. Example: extend Express Request with user property')
    log.push('   declare module "express" { interface Request { user?: User } }')

    // 3. Расширение встроенных типов
    // declare global {
    //   interface Array<T> {
    //     customMethod(): T[]
    //   }
    // }
    //
    // Добавляет customMethod ко всем массивам

    log.push('3. Extend built-in types: add methods to Array<T>')

    // 4. Демонстрация паттерна augmentation локально
    interface OriginalAPI {
      getData(): string
      getVersion(): string
    }

    // Симулируем augmentation — добавляем метод
    interface OriginalAPI {
      getExtendedData(): { data: string; metadata: Record<string, string> }
    }

    const api: OriginalAPI = {
      getData: () => 'original data',
      getVersion: () => '1.0.0',
      getExtendedData: () => ({
        data: 'extended data',
        metadata: { source: 'augmentation' }
      })
    }

    log.push(`4. Original: "${api.getData()}", version="${api.getVersion()}"`)
    log.push(`   Augmented: "${api.getExtendedData().data}", meta=${JSON.stringify(api.getExtendedData().metadata)}`)

    // 5. Паттерн: plugin system через module augmentation
    interface PluginRegistry {
      core: { version: string }
    }

    // Plugin A добавляет свои типы
    interface PluginRegistry {
      auth: { login: (user: string) => boolean }
    }

    // Plugin B добавляет свои типы
    interface PluginRegistry {
      analytics: { track: (event: string) => void }
    }

    const plugins: PluginRegistry = {
      core: { version: '2.0' },
      auth: { login: (user: string) => user === 'admin' },
      analytics: { track: (event: string) => { /* noop */ } }
    }

    log.push(`5. Plugin Registry: core v${plugins.core.version}`)
    log.push(`   auth.login("admin"): ${plugins.auth.login('admin')}`)
    log.push(`   analytics.track registered: ${typeof plugins.analytics.track === 'function'}`)

    // 6. Augmentation и namespace merging
    // В реальном коде:
    // declare module 'lodash' {
    //   interface LoDashStatic {
    //     customUtil(input: string): string
    //   }
    // }
    //
    // Теперь _.customUtil() типизирован

    log.push('6. Namespace: declare module "lodash" { interface LoDashStatic { ... } }')

    // 7. Ограничения module augmentation
    log.push('7. Limitations:')
    log.push('   - Cannot add new top-level declarations to a module')
    log.push('   - Can only augment existing declarations (interfaces, namespaces)')
    log.push('   - The augmenting file must be a module (have import/export)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.2: Module Augmentation</h2>
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
// Задание 8.3: Ambient Declarations — Решение
// ============================================

// 4. declare namespace — группировка объявлений
// Симулируем namespace merging
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace MathUtils {
  export function add(a: number, b: number): number {
    return a + b
  }
  export function multiply(a: number, b: number): number {
    return a * b
  }
}

// Namespace merging — добавляем новые функции
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace MathUtils {
  export function subtract(a: number, b: number): number {
    return a - b
  }
  export const PI = 3.14159
}

// 6. Enum + namespace merging
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE'
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Color {
  export function fromHex(hex: string): Color {
    const map: Record<string, Color> = {
      '#FF0000': Color.Red,
      '#00FF00': Color.Green,
      '#0000FF': Color.Blue
    }
    return map[hex] ?? Color.Red
  }

  export function toLabel(color: Color): string {
    const labels: Record<Color, string> = {
      [Color.Red]: 'Red',
      [Color.Green]: 'Green',
      [Color.Blue]: 'Blue'
    }
    return labels[color]
  }
}

// 7. Class + namespace merging — static members
class Validator {
  validate(input: string): boolean {
    return input.length > 0
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Validator {
  export interface Options {
    strict: boolean
    maxLength: number
  }

  export const defaults: Options = {
    strict: false,
    maxLength: 255
  }

  export function create(options?: Partial<Options>): Validator {
    return new Validator()
  }
}

export function Task8_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Концепция ambient declarations
    log.push('1. Ambient declarations: describe types for external code')
    log.push('   Used in .d.ts files with "declare" keyword')

    // 2. declare var / let / const — глобальные переменные
    // declare const __VERSION__: string
    // declare const __DEV__: boolean
    // declare const process: { env: Record<string, string | undefined> }
    log.push('2. declare const __VERSION__: string')
    log.push('   Tells TS about globals injected by bundler/runtime')

    // 3. declare function — глобальные функции
    // declare function require(path: string): unknown
    // declare function setTimeout(cb: () => void, ms: number): number
    log.push('3. declare function require(path: string): unknown')
    log.push('   Describes global functions without implementation')

    // 4. declare namespace — группировка объявлений (see namespace MathUtils above)
    log.push(`4. Namespace MathUtils.add(2, 3) = ${MathUtils.add(2, 3)}`)
    log.push(`   MathUtils.multiply(4, 5) = ${MathUtils.multiply(4, 5)}`)
    log.push(`   MathUtils.subtract(10, 3) = ${MathUtils.subtract(10, 3)}`)
    log.push(`   MathUtils.PI = ${MathUtils.PI}`)

    // 5. Global augmentation из модуля
    // В .ts файле с import/export:
    //
    // declare global {
    //   interface Window {
    //     analytics: {
    //       track(event: string): void
    //     }
    //   }
    //
    //   var __APP_VERSION__: string
    // }
    //
    // export {} // делает файл модулем

    log.push('5. declare global { ... } — augment global scope from a module')
    log.push('   Requires file to be a module (have import/export)')

    // 6. Enum + namespace merging (see enum Color above)
    log.push(`6. Enum+Namespace: Color.fromHex("#00FF00") = ${Color.fromHex('#00FF00')}`)
    log.push(`   Color.toLabel(Color.Blue) = "${Color.toLabel(Color.Blue)}"`)

    // 7. Class + namespace merging (see class Validator above)
    const validator = Validator.create({ strict: true })
    log.push(`7. Class+Namespace: Validator.defaults = ${JSON.stringify(Validator.defaults)}`)
    log.push(`   Validator.create().validate("hello") = ${validator.validate('hello')}`)

    // 8. Triple-slash directives
    // /// <reference path="./globals.d.ts" />
    // /// <reference types="node" />
    // /// <reference lib="es2022" />
    log.push('8. Triple-slash directives:')
    log.push('   /// <reference path="./globals.d.ts" /> — include file')
    log.push('   /// <reference types="node" /> — include @types package')
    log.push('   /// <reference lib="es2022" /> — include lib')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.3: Ambient Declarations</h2>
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
