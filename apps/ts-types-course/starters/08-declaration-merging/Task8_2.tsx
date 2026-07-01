import { useState } from 'react'

// ============================================
// Задание 8.2: Module Augmentation
// ============================================

// TODO: Продемонстрируйте module augmentation — расширение существующих модулей:
//   Для расширения модуля используется: declare module 'module-name' { ... }

// TODO: Создайте пример расширения глобального объекта Window:
//   declare global {
//     interface Window { myAppConfig: { apiUrl: string; debug: boolean } }
//   }

// TODO: Создайте пример расширения Array prototype (на уровне типов):
//   declare global {
//     interface Array<T> { customLast(): T | undefined }
//   }
//   Array.prototype.customLast = function() { return this[this.length - 1] }

// TODO: Покажите паттерн «plugin system» через module augmentation:
//   Базовый интерфейс расширяется плагинами
//   interface PluginRegistry {}
//   // plugin-a: declare module '...' { interface PluginRegistry { pluginA: PluginAConfig } }
//   // plugin-b: declare module '...' { interface PluginRegistry { pluginB: PluginBConfig } }

export function Task8_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Продемонстрируйте Window augmentation:
    // (window as Window & typeof globalThis).myAppConfig = { apiUrl: '/api', debug: true }
    // log.push('Module augmentation: Window extended')
    // log.push(`window.myAppConfig.apiUrl = "${window.myAppConfig?.apiUrl}"`)

    // TODO: Продемонстрируйте Array augmentation:
    // log.push(`[1, 2, 3].customLast() → ${[1, 2, 3].customLast()}`)
    // log.push(`['a', 'b'].customLast() → "${['a', 'b'].customLast()}"`)

    // TODO: Объясните ограничения module augmentation:
    // log.push('Module augmentation может добавлять новые свойства')
    // log.push('Но не может изменять типы существующих свойств')
    // log.push('Работает только с именованными модулями или global scope')

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
