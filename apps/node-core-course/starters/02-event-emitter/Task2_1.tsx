import { useState } from 'react'

// ============================================
// Задание 2.1: Basic on/emit/off
// ============================================

// TODO: Реализуйте собственный EventEmitter с нуля:
//   - on(event, listener) — подписка на событие
//   - emit(event, ...args) — вызов всех слушателей
//   - off(event, listener) — отписка конкретного слушателя
//   - removeAllListeners(event?) — удаление всех слушателей
//   - listenerCount(event) — количество слушателей
//
// TODO: Implement your own EventEmitter from scratch:
//   - on(event, listener) — subscribe to event
//   - emit(event, ...args) — call all listeners
//   - off(event, listener) — unsubscribe specific listener
//   - removeAllListeners(event?) — remove all listeners
//   - listenerCount(event) — count listeners

export function Task2_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Basic EventEmitter ===')
    log.push('')

    // TODO: Реализуйте класс MyEventEmitter
    // TODO: Implement MyEventEmitter class

    // class MyEventEmitter {
    //   private listeners: Map<string, Array<(...args: unknown[]) => void>>
    //
    //   on(event: string, listener: (...args: unknown[]) => void): this { ... }
    //   emit(event: string, ...args: unknown[]): boolean { ... }
    //   off(event: string, listener: (...args: unknown[]) => void): this { ... }
    //   removeAllListeners(event?: string): this { ... }
    //   listenerCount(event: string): number { ... }
    // }

    // TODO: Создайте экземпляр и протестируйте все методы:
    //   1. Подпишитесь на 'data' и 'error' события
    //   2. Эмитируйте события с данными
    //   3. Проверьте listenerCount
    //   4. Отпишите один обработчик, эмитируйте снова
    //   5. Удалите все обработчики
    // TODO: Create instance and test all methods

    log.push('Testing on/emit:')
    log.push('  ... подпишитесь и эмитируйте события')
    log.push('')
    log.push('Testing off:')
    log.push('  ... отпишите слушателя и проверьте')
    log.push('')
    log.push('Listener count:')
    log.push('  ... проверьте количество слушателей')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.1: Basic on/emit/off</h2>
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
