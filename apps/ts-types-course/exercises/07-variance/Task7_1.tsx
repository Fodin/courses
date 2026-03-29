import { useState } from 'react'

// ============================================
// Задание 7.1: Covariance & Contravariance
// ============================================

// TODO: Создайте иерархию типов:
//   interface Animal { name: string }
//   interface Dog extends Animal { breed: string }
//   interface GoldenRetriever extends Dog { trained: boolean }

// TODO: Продемонстрируйте ковариантность (covariance) — readonly позиции:
//   Создайте тип ReadonlyBox<T> = { readonly value: T }
//   ReadonlyBox<Dog> можно присвоить ReadonlyBox<Animal> (ковариантно)
//   Потому что мы только читаем value

// TODO: Продемонстрируйте контравариантность (contravariance) — write позиции:
//   Создайте тип Processor<T> = { process: (value: T) => void }
//   Processor<Animal> можно присвоить Processor<Dog> (контравариантно)
//   Потому что функция, принимающая Animal, может принять и Dog

// TODO: Продемонстрируйте инвариантность:
//   Создайте тип MutableBox<T> = { value: T } (read + write)
//   MutableBox<Dog> НЕЛЬЗЯ присвоить MutableBox<Animal> — инвариантно

// TODO: Покажите практические последствия:
//   Массивы в TS ковариантны (хотя это unsound!)
//   Функции контравариантны по параметрам (при strictFunctionTypes)

export function Task7_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Создайте иерархию Animal → Dog → GoldenRetriever

    // TODO: Продемонстрируйте ковариантность:
    // const dogBox: ReadonlyBox<Dog> = { value: { name: 'Rex', breed: 'Labrador' } }
    // const animalBox: ReadonlyBox<Animal> = dogBox // OK — ковариантно
    // log.push(`Covariance: animalBox.value.name = "${animalBox.value.name}"`)

    // TODO: Продемонстрируйте контравариантность:
    // const animalProcessor: Processor<Animal> = { process: (a) => log.push(`Processing: ${a.name}`) }
    // const dogProcessor: Processor<Dog> = animalProcessor // OK — контравариантно
    // dogProcessor.process({ name: 'Rex', breed: 'Labrador' })

    // TODO: Объясните инвариантность:
    // log.push('MutableBox<Dog> и MutableBox<Animal> — инвариантны')
    // log.push('Нельзя присвоить друг другу, т.к. есть и чтение и запись')

    // TODO: Покажите проблему с массивами:
    // const dogs: Dog[] = [{ name: 'Rex', breed: 'Lab' }]
    // const animals: Animal[] = dogs // TS разрешает (unsound!)
    // log.push('TS массивы ковариантны — это unsound но удобно')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.1: Covariance & Contravariance</h2>
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
