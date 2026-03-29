import { useState } from 'react'

// ============================================
// Задание 11.2: AbortController
// ============================================

// TODO: Изучите AbortController для отмены асинхронных операций:
//   - const ac = new AbortController()
//   - ac.signal — AbortSignal, передаётся в операцию
//   - ac.abort(reason?) — отмена операции
//   - signal.aborted — проверка статуса
//   - signal.addEventListener('abort', cb)
//   - signal.reason — причина отмены
//   - AbortSignal.timeout(ms) — автоматическая отмена по таймауту
//   - AbortSignal.any([signal1, signal2]) — отмена при любом сигнале
//   - Поддерживается в: fetch, fs, timers, child_process, streams
//
// TODO: Study AbortController for cancelling async operations

export function Task11_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== AbortController ===')
    log.push('')

    // TODO: Реализуйте функции с поддержкой отмены:
    //   1. cancellableFetch(url, signal): Promise<Response>
    //      — симуляция fetch с проверкой signal.aborted
    //   2. cancellableDelay(ms, signal): Promise<void>
    //      — задержка, которую можно отменить
    //   3. cancellableReadFile(path, signal): Promise<string>
    //      — симуляция чтения файла с отменой
    // TODO: Implement cancellable async functions

    log.push('Cancellable delay:')
    log.push('  ... создайте отменяемую задержку')
    log.push('')

    // TODO: Покажите паттерн timeout для любой операции:
    //   async function withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>, ms: number): Promise<T>
    //   Использует AbortSignal.timeout(ms) или ручной AbortController + setTimeout
    // TODO: Implement timeout wrapper for any operation

    log.push('Timeout wrapper:')
    log.push('  ... оберните операцию в таймаут')
    log.push('')

    // TODO: Покажите AbortSignal.any() для комбинации сигналов:
    //   Пример: отмена по таймауту ИЛИ по действию пользователя
    //   const userAbort = new AbortController()
    //   const signal = AbortSignal.any([AbortSignal.timeout(5000), userAbort.signal])
    // TODO: Show AbortSignal.any() for combining signals
    log.push('Combined signals:')
    log.push('  ... комбинируйте несколько сигналов отмены')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.2: AbortController</h2>
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
