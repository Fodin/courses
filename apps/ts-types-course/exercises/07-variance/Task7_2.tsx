import { useState } from 'react'

// ============================================
// Задание 7.2: Strict Function Types
// ============================================

// TODO: Продемонстрируйте strictFunctionTypes:
//   При strictFunctionTypes: true параметры функций проверяются контравариантно
//   При strictFunctionTypes: false — бивариантно (менее безопасно)

// TODO: Создайте примеры с callback-функциями:
//   interface Animal { name: string }
//   interface Dog extends Animal { breed: string }
//
//   type AnimalCallback = (animal: Animal) => void
//   type DogCallback = (dog: Dog) => void
//
//   AnimalCallback можно присвоить DogCallback (контравариантность)
//   DogCallback НЕЛЬЗЯ присвоить AnimalCallback

// TODO: Покажите разницу между method и function syntax в интерфейсах:
//   interface Obj1 { callback(arg: Dog): void } // Method syntax — бивариантно
//   interface Obj2 { callback: (arg: Dog) => void } // Function syntax — контравариантно

// TODO: Создайте практический пример с EventEmitter:
//   Покажите, как правильно типизировать обработчики событий
//   с учётом вариантности

// TODO: Продемонстрируйте использование in/out модификаторов (TS 4.7+):
//   interface Producer<out T> { produce: () => T } // явная ковариантность
//   interface Consumer<in T> { consume: (value: T) => void } // явная контравариантность

export function Task7_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Создайте Animal/Dog и продемонстрируйте:
    // const animalCb: AnimalCallback = (a) => log.push(`Animal: ${a.name}`)
    // const dogCb: DogCallback = animalCb // OK — контравариантно
    // dogCb({ name: 'Rex', breed: 'Lab' })

    // TODO: Покажите, что обратное присвоение невозможно:
    // const specificDogCb: DogCallback = (d) => log.push(`Dog: ${d.name}, breed: ${d.breed}`)
    // const badAnimalCb: AnimalCallback = specificDogCb // Ошибка при strict!
    // log.push('DogCallback нельзя присвоить AnimalCallback')

    // TODO: Продемонстрируйте method vs function syntax:
    // log.push('method syntax: callback(arg: Dog) — бивариантно')
    // log.push('function syntax: callback: (arg: Dog) => void — контравариантно')

    // TODO: Продемонстрируйте in/out модификаторы:
    // interface Producer<out T> { produce: () => T }
    // const dogProducer: Producer<Dog> = { produce: () => ({ name: 'Rex', breed: 'Lab' }) }
    // const animalProducer: Producer<Animal> = dogProducer // OK — out = covariant
    // log.push(`Producer<out T>: ${animalProducer.produce().name}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.2: Strict Function Types</h2>
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
