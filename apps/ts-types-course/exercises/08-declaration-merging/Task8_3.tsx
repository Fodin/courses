import { useState } from 'react'

// ============================================
// Задание 8.3: Ambient Declarations
// ============================================

// TODO: Создайте ambient declarations для внешней библиотеки:
//   declare function $(selector: string): HTMLElement
//   declare namespace $ { function ajax(url: string): Promise<unknown> }
//   Покажите, как описать типы для нетипизированных библиотек

// TODO: Продемонстрируйте declare const / declare function / declare class:
//   declare const API_URL: string
//   declare function logMessage(msg: string): void
//   declare class ExternalService { fetch(url: string): Promise<unknown> }

// TODO: Покажите паттерн .d.ts файлов:
//   Объясните разницу между .ts и .d.ts
//   Когда нужно создавать свои declaration files

// TODO: Продемонстрируйте declare module для JSON/CSS модулей:
//   declare module '*.json' { const value: Record<string, unknown>; export default value }
//   declare module '*.css' { const classes: Record<string, string>; export default classes }

// TODO: Покажите triple-slash directives:
//   /// <reference types="..." />
//   /// <reference path="..." />

export function Task8_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Продемонстрируйте ambient declarations:
    // log.push('=== Ambient Declarations ===')
    // log.push('declare const API_URL: string — объявляет глобальную переменную')
    // log.push('declare function fn(): void — объявляет глобальную функцию')
    // log.push('declare class Service {} — объявляет внешний класс')

    // TODO: Объясните .d.ts файлы:
    // log.push('')
    // log.push('=== Declaration Files (.d.ts) ===')
    // log.push('.d.ts — содержит ТОЛЬКО типы, без runtime-кода')
    // log.push('.ts — содержит код + типы')
    // log.push('Создавайте .d.ts для нетипизированных JS-библиотек')

    // TODO: Покажите wildcard module declarations:
    // log.push('')
    // log.push('=== Wildcard Module Declarations ===')
    // log.push("declare module '*.css' — типизирует все CSS-импорты")
    // log.push("declare module '*.svg' — типизирует все SVG-импорты")
    // log.push("declare module '*.json' — типизирует все JSON-импорты")

    // TODO: Объясните triple-slash:
    // log.push('')
    // log.push('=== Triple-Slash Directives ===')
    // log.push('/// <reference types="node" /> — подключает @types/node')
    // log.push('/// <reference path="./types.d.ts" /> — подключает файл типов')

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
