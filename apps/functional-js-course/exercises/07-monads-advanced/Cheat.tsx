/**
 * Cheat Sheet: Level 7 — Монады: продвинуто
 *
 * Используйте этот файл как справочник при выполнении заданий.
 * Не копируйте код напрямую — попробуйте написать самостоятельно.
 */

// ============================================================
// 1. IO<T> — синхронная ленивая монада
// ============================================================

class IO<T> {
  constructor(private effect: () => T) {}

  // Поднимает значение в IO (без побочных эффектов)
  static of<T>(value: T): IO<T> {
    return new IO(() => value)
  }

  // Трансформирует результат, НЕ вызывая effect
  map<U>(fn: (value: T) => U): IO<U> {
    return new IO(() => fn(this.effect()))
  }

  // Цепочка IO — fn должна возвращать IO<U>
  flatMap<U>(fn: (value: T) => IO<U>): IO<U> {
    return new IO(() => fn(this.effect()).run())
  }

  // Единственное место выполнения эффекта
  run(): T {
    return this.effect()
  }
}

// Пример использования:
// const pipeline = IO.of(42)
//   .map(x => x * 2)
//   .flatMap(x => new IO(() => x + 1))
// pipeline.run()  // 85 — только здесь вычисляется

// ============================================================
// 2. Task<T> — асинхронная ленивая монада
// ============================================================

class Task<T> {
  constructor(private fork: () => Promise<T>) {}

  static of<T>(value: T): Task<T> {
    return new Task(() => Promise.resolve(value))
  }

  map<U>(fn: (value: T) => U): Task<U> {
    return new Task(() => this.fork().then(fn))
  }

  flatMap<U>(fn: (value: T) => Task<U>): Task<U> {
    return new Task(() => this.fork().then(v => fn(v).run()))
  }

  // Единственное место запуска Promise
  run(): Promise<T> {
    return this.fork()
  }

  // Параллельный запуск массива Task
  static parallel<U>(tasks: Task<U>[]): Task<U[]> {
    return new Task(() => Promise.all(tasks.map(t => t.run())))
  }
}

// Разница Promise vs Task:
// const p = fetch('/api')         // запрос пошёл немедленно!
// const t = new Task(() => fetch('/api'))  // ничего не произошло
// t.run()  // только теперь пошёл запрос

// ============================================================
// 3. Either для Do-нотации
// ============================================================

type Either<L, R> = { tag: 'Left'; value: L } | { tag: 'Right'; value: R }

function Left<L>(value: L): Either<L, never> { return { tag: 'Left', value } }
function Right<R>(value: R): Either<never, R> { return { tag: 'Right', value } }

function eitherFlatMap<L, R, R2>(e: Either<L, R>, fn: (v: R) => Either<L, R2>): Either<L, R2> {
  return e.tag === 'Right' ? fn(e.value) : e
}

// ============================================================
// 4. Do-нотация через генераторы
// ============================================================

function Do<L, R>(gen: () => Generator<Either<L, unknown>, R, unknown>): Either<L, R> {
  const iterator = gen()
  let result = iterator.next()
  while (!result.done) {
    const either = result.value as Either<L, unknown>
    if (either.tag === 'Left') return either as Either<L, R>
    result = iterator.next(either.value)  // передаём распакованное значение
  }
  return Right(result.value)
}

// Сравнение flatMap vs Do (оба дают идентичный результат):

// flatMap вариант (уходит вправо):
// eitherFlatMap(parseA(x), a =>
//   eitherFlatMap(parseB(y), b =>
//     eitherFlatMap(parseC(z), c =>
//       Right({ a, b, c })
//     )
//   )
// )

// Do-нотация (линейный стиль):
// Do(function* () {
//   const a = yield parseA(x)  // если Left — немедленный выход
//   const b = yield parseB(y)
//   const c = yield parseC(z)
//   return { a, b, c }         // автоматически Right(...)
// })

// ============================================================
// 5. Аналогия: async/await = Do-нотация для Promise
// ============================================================

// Do(function* () {           // async function() {
//   const a = yield taskA     //   const a = await promiseA
//   const b = yield taskB     //   const b = await promiseB
//   return { a, b }           //   return { a, b }
// })                          // }

// Left в Do  ←→  throw/reject в async/await
// yield      ←→  await
// return     ←→  return (оборачивается в Right / Promise.resolve)

// ============================================================
// 6. Правила выбора монады
// ============================================================

// IO:   синхронный побочный эффект, который нужно отложить
// Task: асинхронный побочный эффект (HTTP, таймеры, I/O)
// Do:   цепочка flatMap из 3+ шагов, каждый зависит от предыдущего

// ============================================================
// 7. Типовые ошибки
// ============================================================

// Ошибка 1: вызов this.effect() внутри map ДО обёртки в IO
// ПЛОХО:
// map<U>(fn: (value: T) => U): IO<U> {
//   const value = this.effect()  // эффект выполнился при вызове map!
//   return new IO(() => fn(value))
// }
// ХОРОШО: return new IO(() => fn(this.effect()))

// Ошибка 2: забыть вызвать .run()
// const pipeline = buildPipeline()  // IO<Report>
// console.log(pipeline)             // выведет объект IO, не результат
// console.log(pipeline.run())       // выведет отчёт

// Ошибка 3: передать Task в Promise.all без .run()
// ПЛОХО: Promise.all([task1, task2])       // task1 и task2 — объекты, не Promise
// ХОРОШО: Task.parallel([task1, task2]).run()

// Помечаем символы как используемые (для отключения lint-ошибок)
void IO
void Task
void Left
void Right
void eitherFlatMap
void Do

export {}  // файл только для чтения, не для импорта
