/**
 * Cheat Sheet: Level 8 — Трансформации данных
 *
 * Используйте этот файл как справочник при выполнении заданий.
 * Не копируйте код напрямую — попробуйте написать самостоятельно.
 */

// ============================================================
// 1. Lens<S, A> — иммутабельный фокус на поле структуры
// ============================================================

type Lens<S, A> = {
  get: (source: S) => A           // прочитать поле
  set: (value: A, source: S) => S // вернуть НОВУЮ структуру (не мутировать!)
}

function lens<S, A>(get: (s: S) => A, set: (a: A, s: S) => S): Lens<S, A> {
  return { get, set }
}

// Три операции:
function view<S, A>(l: Lens<S, A>, s: S): A {
  return l.get(s)
}

function lset<S, A>(l: Lens<S, A>, a: A, s: S): S {
  return l.set(a, s)
}

function over<S, A>(l: Lens<S, A>, fn: (a: A) => A, s: S): S {
  return l.set(fn(l.get(s)), s)
}

// Пример простой линзы:
interface User { name: string; age: number }
const nameLens = lens<User, string>(
  u => u.name,
  (name, u) => ({ ...u, name })  // spread — не мутируем u!
)

// const user = { name: 'Alice', age: 30 }
// view(nameLens, user)              // 'Alice'
// lset(nameLens, 'Bob', user)       // { name: 'Bob', age: 30 } — user не изменён
// over(nameLens, s => s.toUpperCase(), user)  // { name: 'ALICE', age: 30 }

// ============================================================
// 2. composeLens — композиция линз
// ============================================================

function composeLens<A, B, C>(outer: Lens<A, B>, inner: Lens<B, C>): Lens<A, C> {
  return {
    get: (s: A) => inner.get(outer.get(s)),
    set: (c: C, s: A) => outer.set(inner.set(c, outer.get(s)), s),
  }
}

// Диаграмма:
// Company → (departmentLens) → Department → (managerLens) → Manager → (nameLens) → string
//
// const dept0ManagerName = composeLens(
//   composeLens(departmentLens(0), managerLens),
//   managerNameLens
// )
// view(dept0ManagerName, company)  // 'Alice'

// ============================================================
// 3. Три закона Lens
// ============================================================

// Закон 1 (get-set): если set вернул то же — структура не изменилась по значению
// lset(l, view(l, s), s) эквивалентно s

// Закон 2 (set-get): после set — get вернёт новое значение
// view(l, lset(l, a, s)) === a

// Закон 3 (set-set): два set подряд — побеждает последний
// lset(l, b, lset(l, a, s)) эквивалентно lset(l, b, s)

// ============================================================
// 4. Transducers — примитивы
// ============================================================

type Reducer<A, B> = (acc: A, item: B) => A
type Transducer<A, B> = <R>(reducer: Reducer<R, B>) => Reducer<R, A>

function mapping<A, B>(fn: (a: A) => B): Transducer<A, B> {
  return function<R>(reducer: Reducer<R, B>): Reducer<R, A> {
    return (acc: R, item: A) => reducer(acc, fn(item))
  }
}

function filtering<A>(pred: (a: A) => boolean): Transducer<A, A> {
  return function<R>(reducer: Reducer<R, A>): Reducer<R, A> {
    return (acc: R, item: A) => pred(item) ? reducer(acc, item) : acc
  }
}

function taking<A>(n: number): Transducer<A, A> {
  return function<R>(reducer: Reducer<R, A>): Reducer<R, A> {
    let count = 0
    return (acc: R, item: A) => {
      if (count >= n) return acc
      count++
      return reducer(acc, item)
    }
  }
}

// ВАЖНО: taking хранит состояние в замыкании!
// Создавайте НОВЫЙ экземпляр taking для каждого вызова transduce:
// const xf1 = composeTransducers(..., taking(10))   // для первого transduce
// const xf2 = composeTransducers(..., taking(10))   // для второго transduce (новый!)

// ============================================================
// 5. composeTransducers и transduce
// ============================================================

function composeTransducers<A, B, C>(t1: Transducer<A, B>, t2: Transducer<B, C>): Transducer<A, C> {
  return function<R>(reducer: Reducer<R, C>): Reducer<R, A> {
    return t1(t2(reducer))
  }
}

// ВНИМАНИЕ: порядок как в pipe, не как в compose!
// composeTransducers(filtering, mapping, taking):
//   filtering применяется ПЕРВЫМ к данным

function transduce<A, B, R>(xf: Transducer<A, B>, reducer: Reducer<R, B>, init: R, arr: A[]): R {
  const xfReducer = xf(reducer)
  let acc = init
  for (const item of arr) {
    acc = xfReducer(acc, item)
  }
  return acc
}

// Пример — один проход, 0 промежуточных массивов:
// const xf = composeTransducers(
//   composeTransducers(
//     filtering<number>(x => x > 10),
//     mapping<number, number>(x => x * 2)
//   ),
//   taking<number>(3)
// )
// transduce(xf, (acc, item) => [...acc, item], [], [5, 15, 20, 25, 30])
// → [30, 40, 50]

// ============================================================
// 6. Either и pipeChain для пайплайна
// ============================================================

type Either<L, R> = { tag: 'Left'; value: L } | { tag: 'Right'; value: R }

function pipeRight<L, R>(value: R): Either<L, R> { return { tag: 'Right', value } }
function pipeLeft<L, R>(value: L): Either<L, R> { return { tag: 'Left', value } }

function pipeChain<L, A, B>(e: Either<L, A>, fn: (v: A) => Either<L, B>): Either<L, B> {
  return e.tag === 'Right' ? fn(e.value) : e
}

// Railway-oriented: Left "пробегает" через все pipeChain без вызова fn:
// const result = pipeChain(
//   pipeChain(
//     pipeChain(parseJSON(input), validateEvents),
//     enrichEvents
//   ),
//   formatResults
// )
// if (result.tag === 'Left') console.error(result.value)
// else console.log(result.value)

// ============================================================
// 7. Чистые функции в пайплайне: что нельзя делать
// ============================================================

// Плохо — побочный эффект внутри чистой функции:
// function validate(events: unknown[]): Either<string, unknown[]> {
//   console.log('validating...')  // побочный эффект!
//   ...
// }

// Плохо — недетерминированность:
// function enrich(events: unknown[]) {
//   const now = new Date()  // разное значение каждый раз
//   ...
// }
// Решение: передавать дату как аргумент

// Хорошо — только трансформация входных данных:
// function enrich(events: ValidEvent[], now: Date): Either<string, EnrichedEvent[]> {
//   return pipeRight(events.map(e => ({ ...e, processedAt: now })))
// }

// ============================================================
// 8. Итоговое сравнение: chain vs transducer
// ============================================================

// Chain (3 массива, N итераций):
// arr.filter(pred)   → массив #1 (N элементов)
//    .map(fn)        → массив #2 (N элементов, если all pass)
//    .slice(0, k)    → массив #3 (k элементов)
// Итераций: N + filtered_count + k

// Transducer (0 массивов, минимум итераций):
// transduce(composeTransducers(filtering(pred), mapping(fn), taking(k)), ...)
// Остановится сразу после k элементов: итераций = минимально необходимое

// Помечаем символы как используемые (для отключения lint-ошибок)
void lens
void view
void lset
void over
void nameLens
void composeLens
void mapping
void filtering
void taking
void composeTransducers
void transduce
void pipeRight
void pipeLeft
void pipeChain

export {}  // файл только для чтения, не для импорта
