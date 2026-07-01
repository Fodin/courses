import { useState } from 'react'

// ============================================
// Задание 13.4: Util & Misc
// ============================================

// TODO: Изучите полезные утилиты Node.js:
//   util модуль:
//     - util.promisify(fn) — конвертация callback → Promise
//     - util.callbackify(fn) — обратная конвертация Promise → callback
//     - util.inspect(obj, options) — красивый вывод объектов
//     - util.format(fmt, ...args) — форматирование строк (%s, %d, %j, %o)
//     - util.types — проверки типов (isPromise, isDate, isRegExp, isProxy)
//     - util.deprecate(fn, msg) — пометка функции как устаревшей
//     - util.TextEncoder / util.TextDecoder — работа с кодировками
//
// TODO: Study useful Node.js utilities:
//   - promisify, callbackify, inspect, format, types, deprecate

export function Task13_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Util & Misc ===')
    log.push('')

    // TODO: Реализуйте собственные версии утилит:
    //   1. myPromisify(fn) — конвертация error-first callback в Promise
    //   2. myInspect(obj, depth) — рекурсивный вывод объекта (как JSON.stringify,
    //      но с поддержкой циклических ссылок, Map, Set, Date, RegExp)
    //   3. myFormat(template, ...args) — подстановка %s, %d, %j
    // TODO: Implement your own versions of util functions

    log.push('myPromisify:')
    log.push('  ... конвертируйте callback-функцию в промис')
    log.push('')

    log.push('myInspect:')
    log.push('  ... красиво выведите сложный объект')
    log.push('')

    log.push('myFormat:')
    log.push('  ... реализуйте форматирование строк')
    log.push('')

    // TODO: Реализуйте myDeprecate — обёртку, которая при первом вызове
    //   выводит предупреждение с указанием замены
    //   const oldFn = myDeprecate(fn, 'Use newFn instead')
    // TODO: Implement myDeprecate wrapper

    log.push('myDeprecate:')
    log.push('  ... реализуйте пометку устаревших функций')
    log.push('')

    // TODO: Покажите работу с TextEncoder/TextDecoder:
    //   Конвертация строки в Uint8Array и обратно
    //   Поддержка разных кодировок: utf-8, utf-16, windows-1251
    // TODO: Show TextEncoder/TextDecoder usage
    log.push('TextEncoder/TextDecoder:')
    log.push('  ... покажите конвертацию строк и байтов')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.4: Util & Misc</h2>
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
