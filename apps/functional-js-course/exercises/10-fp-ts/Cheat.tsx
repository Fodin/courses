/**
 * Cheat Sheet: Level 10 — fp-ts
 *
 * Используйте этот файл как справочник при выполнении заданий.
 * Не копируйте код напрямую — попробуйте написать самостоятельно.
 */

import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import * as A from 'fp-ts/Array'
import * as S from 'fp-ts/string'
import { pipe, flow } from 'fp-ts/function'

// ============================================================
// 1. Option — безопасная работа с null/undefined
// ============================================================

// Создание
const some = O.some(42)           // Some<number>
const none = O.none               // None
const fromNull = O.fromNullable(null)   // None
const fromNull2 = O.fromNullable('hi')  // Some<string>

// Трансформация
const doubled = pipe(
  O.some(5),
  O.map(x => x * 2)              // Some(10)
)

const flattened = pipe(
  O.some(5),
  O.flatMap(x =>                 // flatMap когда функция возвращает Option!
    x > 0 ? O.some(x * 10) : O.none
  )
)

// Извлечение — getOrElse ПРИНИМАЕТ THUNK ()=>A, НЕ ЗНАЧЕНИЕ!
const value = pipe(
  O.none,
  O.getOrElse(() => 'default')   // 'default'
)

// ============================================================
// 2. Either — типизированные ошибки
// ============================================================

// Создание
const ok: E.Either<string, number> = E.right(42)
const err: E.Either<string, number> = E.left('ошибка')

// Цепочка с short-circuit
const result = pipe(
  E.right(10),
  E.flatMap(n => n > 0 ? E.right(n) : E.left('Не положительное')),
  E.map(n => Math.sqrt(n).toFixed(2))
)

// Проверка типа
if (E.isLeft(result)) {
  console.log('Ошибка:', result.left)
} else {
  console.log('Успех:', result.right)
}

// fold — трансформация любого случая
const msg = pipe(
  result,
  E.fold(
    err => `Error: ${err}`,
    val => `Result: ${val}`
  )
)

// ============================================================
// 3. pipe — трансформация данных
// ============================================================

const names = ['Alice', 'Bob', 'Carol', 'Dan']

const pipeResult = pipe(
  names,
  A.filter(n => n.length > 3),    // ['Alice', 'Carol']
  A.map(S.toUpperCase),           // ['ALICE', 'CAROL']
  A.sort(S.Ord),                  // ['ALICE', 'CAROL'] (уже отсортированы)
  ns => ns.join(', ')             // 'ALICE, CAROL'
)

// ============================================================
// 4. flow — создание функции-трансформации
// ============================================================

// flow создаёт функцию, данные передаются позже
const processNames = flow(
  A.filter<string>(n => n.length > 3),
  A.map(S.toUpperCase),
  A.sort(S.Ord),
  (ns: string[]) => ns.join(', ')
)

const flowResult = processNames(names)    // 'ALICE, CAROL'
const flowResult2 = processNames(['Fedor', 'Al', 'Bob'])  // переиспользование!

// ============================================================
// 5. TaskEither — async с типизированными ошибками
// ============================================================

// Тип: () => Promise<Either<E, A>>  — ЛЕНИВЫЙ!
interface ApiError { code: number; message: string }
interface User { id: string; name: string }

// Создание TaskEither
const fetchUser = (id: string): TE.TaskEither<ApiError, User> =>
  () => fetch(`/api/users/${id}`)
    .then(async r => r.ok
      ? E.right(await r.json() as User)
      : E.left<ApiError, User>({ code: r.status, message: r.statusText })
    )
    .catch(err => E.left<ApiError, User>({ code: 0, message: String(err) }))

// Через трансформеры (проще для примеров и тестов)
const alwaysOk: TE.TaskEither<never, number> = TE.right(42)
const alwaysFail: TE.TaskEither<string, never> = TE.left('oops')

// Создание через конструктор
function delayedTask(fail: boolean): TE.TaskEither<string, number> {
  return () => new Promise(resolve =>
    setTimeout(() =>
      resolve(fail ? E.left('failed') : E.right(42))
    , 500)
  )
}

// Цепочка TaskEither
const workflow = pipe(
  delayedTask(false),
  TE.flatMap(n => n > 10          // зависимый шаг
    ? TE.right(n * 2)
    : TE.left('Too small')
  ),
  TE.map(n => `Result: ${n}`),    // синхронная трансформация
  TE.mapLeft(err => `Error: ${err}`)  // трансформация ошибки
)

// ЗАПУСК — не забудьте ()!
async function runWorkflow() {
  const outcome = await workflow()   // Either<string, string>
  if (E.isLeft(outcome)) {
    console.log(outcome.left)        // 'Error: ...'
  } else {
    console.log(outcome.right)       // 'Result: 84'
  }
}

// ============================================================
// 6. Типовые ошибки
// ============================================================

// ОШИБКА 1: getOrElse без thunk
// pipe(opt, O.getOrElse('default'))     // TypeError!
// pipe(opt, O.getOrElse(() => 'default')) // правильно

// ОШИБКА 2: map вместо flatMap
// pipe(O.some(5), O.map(x => O.some(x * 2)))  // Option<Option<number>>!
// pipe(O.some(5), O.flatMap(x => O.some(x * 2))) // Option<number>

// ОШИБКА 3: await без ()
// const r = await workflow   // не Promise! возвращает функцию
// const r = await workflow() // правильно

export {}
