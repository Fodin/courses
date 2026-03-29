import { useState } from 'react'

// ============================================
// Задание 7.1: Covariance & Contravariance — Решение
// ============================================

export function Task7_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Базовая иерархия типов
    interface Animal {
      name: string
    }

    interface Dog extends Animal {
      breed: string
    }

    interface GuideDog extends Dog {
      handler: string
    }

    // 1. Ковариантность массивов (output position)
    // Array<Dog> может быть присвоен Array<Animal> — ковариантность
    const dogs: Dog[] = [
      { name: 'Rex', breed: 'Shepherd' },
      { name: 'Buddy', breed: 'Labrador' }
    ]
    const animals: readonly Animal[] = dogs
    log.push('1. Covariance: Dog[] -> readonly Animal[]')
    log.push(`   animals[0].name = "${animals[0].name}"`)

    // 2. Контравариантность параметров функций (input position)
    type AnimalHandler = (animal: Animal) => void
    type DogHandler = (dog: Dog) => void

    const handleAnimal: AnimalHandler = (a: Animal) => {
      log.push(`   handleAnimal: ${a.name}`)
    }

    // AnimalHandler можно использовать как DogHandler — контравариантность
    // Функция, принимающая Animal, безопасно принимает и Dog
    const usedAsDogHandler: DogHandler = handleAnimal
    usedAsDogHandler({ name: 'Rex', breed: 'Shepherd' })
    log.push('2. Contravariance: AnimalHandler -> DogHandler')

    // 3. Ковариантность возвращаемых типов
    type AnimalFactory = () => Animal
    type DogFactory = () => Dog

    const makeDog: DogFactory = () => ({ name: 'Spot', breed: 'Dalmatian' })

    // DogFactory можно использовать как AnimalFactory — ковариантность
    const makeAnimal: AnimalFactory = makeDog
    const created = makeAnimal()
    log.push(`3. Return type covariance: DogFactory -> AnimalFactory`)
    log.push(`   created.name = "${created.name}"`)

    // 4. Демонстрация бивариантности методов (до strictFunctionTypes)
    interface EventHandler {
      handle(event: Event): void
    }

    // В strict mode метод и свойство-функция ведут себя по-разному
    interface StrictHandler {
      handle: (event: Event) => void  // property — contravariant
    }

    interface BivariantHandler {
      handle(event: Event): void  // method — bivariant
    }

    log.push('4. Method syntax: bivariant (allows both wider and narrower types)')
    log.push('   Property syntax: contravariant (strict with strictFunctionTypes)')

    // 5. Практический пример: Promise — ковариантный
    // Promise<Dog> совместим с Promise<Animal>
    const dogPromise: Promise<Dog> = Promise.resolve({ name: 'Max', breed: 'Poodle' })
    const animalPromise: Promise<Animal> = dogPromise
    log.push('5. Promise<Dog> -> Promise<Animal>: covariant')

    // 6. Generic с ковариантными и контравариантными позициями
    interface Producer<T> {
      produce(): T  // T в output position — covariant
    }

    interface Consumer<T> {
      consume(value: T): void  // T в input position — contravariant
    }

    const dogProducer: Producer<Dog> = {
      produce: () => ({ name: 'Lucky', breed: 'Beagle' })
    }
    // Producer<Dog> -> Producer<Animal>: ok (covariant)
    const animalProducer: Producer<Animal> = dogProducer
    log.push(`6. Producer<Dog> -> Producer<Animal>: "${animalProducer.produce().name}"`)

    const animalConsumer: Consumer<Animal> = {
      consume: (a: Animal) => { /* use a.name */ }
    }
    // Consumer<Animal> -> Consumer<Dog>: ok (contravariant)
    const dogConsumer: Consumer<Dog> = animalConsumer
    dogConsumer.consume({ name: 'Fido', breed: 'Corgi' })
    log.push('7. Consumer<Animal> -> Consumer<Dog>: contravariant')

    // 7. Invariant position — T в обоих позициях
    interface Box<T> {
      get(): T         // output — covariant
      set(value: T): void  // input — contravariant
    }

    // Box<Dog> нельзя присвоить Box<Animal> и наоборот — инвариантность
    log.push('8. Box<T> (get+set): invariant — neither Dog->Animal nor Animal->Dog')

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

// ============================================
// Задание 7.2: Strict Function Types — Решение
// ============================================

export function Task7_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // 1. Method declaration vs function property — разница в вариантности
    interface Animal {
      name: string
    }

    interface Dog extends Animal {
      breed: string
    }

    interface Cat extends Animal {
      indoor: boolean
    }

    // Method syntax — бивариантность (TS разрешает и super, и sub типы)
    interface BivariantCollection {
      add(item: Dog): void          // method syntax
      find(predicate: (item: Dog) => boolean): Dog | undefined
    }

    // Property syntax — строгая контравариантность
    interface StrictCollection {
      add: (item: Dog) => void      // property syntax
      find: (predicate: (item: Dog) => boolean) => Dog | undefined
    }

    log.push('1. Method syntax: add(item: Dog) — bivariant')
    log.push('   Property syntax: add: (item: Dog) => void — contravariant')

    // 2. Почему бивариантность методов нужна — DOM совместимость
    // addEventListener('click', (e: MouseEvent) => ...) должен работать
    // хотя EventListener принимает Event (супертип MouseEvent)
    interface EventMap {
      click: MouseEvent
      keydown: KeyboardEvent
    }

    // Метод addEventListener бивариантен для обратной совместимости с DOM
    log.push('2. DOM compatibility: addEventListener needs bivariant methods')
    log.push('   Handler for MouseEvent assignable to Handler for Event')

    // 3. Создание variance-safe API с readonly
    interface ReadonlyRepo<T> {
      getAll: () => T[]            // T only in output — covariant
      getById: (id: string) => T | undefined
    }

    interface WriteRepo<T> {
      save: (item: T) => void      // T only in input — contravariant
      delete: (item: T) => void
    }

    // ReadonlyRepo<Dog> -> ReadonlyRepo<Animal>: safe (covariant)
    const dogRepo: ReadonlyRepo<Dog> = {
      getAll: () => [{ name: 'Rex', breed: 'Shepherd' }],
      getById: (id: string) => ({ name: 'Rex', breed: 'Shepherd' })
    }
    const animalRepo: ReadonlyRepo<Animal> = dogRepo
    log.push(`3. ReadonlyRepo<Dog> -> ReadonlyRepo<Animal>: safe`)
    log.push(`   getAll()[0].name = "${animalRepo.getAll()[0].name}"`)

    // 4. Callback вариантность в реальном коде
    type Callback<T> = (value: T) => void

    // Callback<Animal> может быть присвоен Callback<Dog> — контравариантность
    const logAnimal: Callback<Animal> = (a) => {
      log.push(`   logAnimal: ${a.name}`)
    }
    const logDog: Callback<Dog> = logAnimal
    logDog({ name: 'Buddy', breed: 'Labrador' })
    log.push('4. Callback<Animal> -> Callback<Dog>: contravariant')

    // 5. Опасность бивариантности — unsound assignment
    // С method syntax можно случайно присвоить несовместимый handler
    interface UnsafeEventEmitter {
      on(event: string, handler: (data: Dog) => void): void // method — bivariant
    }

    interface SafeEventEmitter {
      on: (event: string, handler: (data: Dog) => void) => void // property — contravariant
    }

    log.push('5. Bivariance risk: method syntax allows unsound assignments')
    log.push('   Use property syntax for type-safe event emitters')

    // 6. Explicit variance annotations (TypeScript 4.7+)
    // interface Producer<out T> { produce(): T }    — explicitly covariant
    // interface Consumer<in T> { consume(v: T): void } — explicitly contravariant
    // interface Box<in out T> { get(): T; set(v: T): void } — invariant
    log.push('6. TS 4.7+: explicit variance annotations')
    log.push('   out T = covariant, in T = contravariant, in out T = invariant')

    // 7. Паттерн: разделение read/write для безопасности
    interface ReadableStream<out T> {
      read(): T
    }

    interface WritableStream<in T> {
      write(value: T): void
    }

    interface DuplexStream<T> extends ReadableStream<T>, WritableStream<T> {}

    log.push('7. Pattern: split Read/Write interfaces for variance safety')
    log.push('   ReadableStream<out T> + WritableStream<in T> = DuplexStream<T>')

    // 8. Функция высшего порядка и вариантность
    type Mapper<A, B> = (a: A) => B

    // Mapper contravariant в A, covariant в B
    const dogToString: Mapper<Dog, string> = (d) => `${d.name} (${d.breed})`
    const animalToString: Mapper<Animal, string> = (a) => a.name

    // Array<Dog>.map принимает Mapper<Dog, string>
    // animalToString: Mapper<Animal, string> совместим благодаря контравариантности в A
    const dogs: Dog[] = [{ name: 'Rex', breed: 'Shepherd' }]
    const names = dogs.map(animalToString)
    log.push(`8. Mapper<Animal,string> used as Mapper<Dog,string>: "${names[0]}"`)

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
