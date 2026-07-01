import { useState } from 'react'

// ============================================
// Задание 12.1: Higher-Kinded Types
// ============================================

// TODO: Проблема: TypeScript не поддерживает Higher-Kinded Types напрямую
//   Нельзя написать: type Apply<F<_>, A> = F<A>
//   Но можно эмулировать через паттерны

// TODO: Создайте эмуляцию HKT через интерфейс-реестр:
//   interface TypeRegistry { /* расширяется через declaration merging */ }
//   type Kind<F extends keyof TypeRegistry, A> = (TypeRegistry & { readonly _A: A })[F]

// TODO: Создайте Functor — обобщённый map:
//   interface Functor<F extends keyof TypeRegistry> {
//     map<A, B>(fa: Kind<F, A>, f: (a: A) => B): Kind<F, B>
//   }

// TODO: Реализуйте Functor для Array:
//   Зарегистрируйте: interface TypeRegistry { Array: this['_A'][] }
//   const arrayFunctor: Functor<'Array'> = { map: (fa, f) => fa.map(f) }

// TODO: Реализуйте Functor для Option (Some/None):
//   Зарегистрируйте Option в TypeRegistry
//   const optionFunctor: Functor<'Option'> = { ... }

// TODO: Создайте generic функцию, работающую с любым Functor:
//   function doubleAll<F extends keyof TypeRegistry>(functor: Functor<F>, fa: Kind<F, number>): Kind<F, number>

export function Task12_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Продемонстрируйте Array Functor:
    // const doubled = arrayFunctor.map([1, 2, 3], x => x * 2)
    // log.push(`arrayFunctor.map([1,2,3], x*2) → [${doubled}]`)

    // TODO: Продемонстрируйте Option Functor:
    // const some5 = some(5)
    // const doubled5 = optionFunctor.map(some5, x => x * 2)
    // log.push(`optionFunctor.map(some(5), x*2) → ${JSON.stringify(doubled5)}`)
    //
    // const noneVal = none
    // const doubledNone = optionFunctor.map(noneVal, x => x * 2)
    // log.push(`optionFunctor.map(none, x*2) → ${JSON.stringify(doubledNone)}`)

    // TODO: Покажите generic функцию:
    // log.push(`doubleAll(arrayFunctor, [1,2,3]) → [${doubleAll(arrayFunctor, [1,2,3])}]`)

    // TODO: Объясните ограничения паттерна:
    // log.push('')
    // log.push('HKT в TS — эмуляция через TypeRegistry + declaration merging')
    // log.push('Не так гибко как в Haskell/Scala, но позволяет писать generic код')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.1: Higher-Kinded Types</h2>
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
