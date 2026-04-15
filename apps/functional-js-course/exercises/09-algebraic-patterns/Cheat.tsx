/**
 * Cheat Sheet: Level 9 — Алгебраические паттерны
 *
 * Используйте этот файл как справочник при выполнении заданий.
 * Не копируйте код напрямую — попробуйте написать самостоятельно.
 */

// ============================================================
// 1. Интерфейсы Semigroup и Monoid
// ============================================================

interface Semigroup<T> {
  concat: (a: T, b: T) => T
}

interface Monoid<T> extends Semigroup<T> {
  empty: T
}

// ============================================================
// 2. Инстансы Monoid
// ============================================================

const Sum: Monoid<number>     = { concat: (a, b) => a + b,        empty: 0         }
const Product: Monoid<number> = { concat: (a, b) => a * b,        empty: 1         }
const All: Monoid<boolean>    = { concat: (a, b) => a && b,       empty: true      }
const Any: Monoid<boolean>    = { concat: (a, b) => a || b,       empty: false     }
const Min: Monoid<number>     = { concat: (a, b) => Math.min(a, b), empty: Infinity  }
const Max: Monoid<number>     = { concat: (a, b) => Math.max(a, b), empty: -Infinity }

// First — Semigroup, НЕ Monoid (нельзя определить empty для произвольного T)
const First: Semigroup<string | null> = {
  concat: (a, _b) => a   // всегда возвращает первый аргумент
}

// Закон нейтрального элемента (проверьте вручную):
// Sum:     Sum.concat(5, 0)         === 5
// Product: Product.concat(5, 1)     === 5
// All:     All.concat(true, true)   === true
// Any:     Any.concat(false, false) === false
// Min:     Min.concat(7, Infinity)  === 7
// Max:     Max.concat(7, -Infinity) === 7

// ============================================================
// 3. fold и foldMap
// ============================================================

function fold<T>(M: Monoid<T>, xs: T[]): T {
  return xs.reduce(M.concat, M.empty)
}

function foldMap<A, M>(monoid: Monoid<M>, f: (a: A) => M, xs: A[]): M {
  return fold(monoid, xs.map(f))
}

// Примеры:
// fold(Sum, [1, 2, 3])                     // 6
// fold(Max, [7, 2, 9])                     // 9
// foldMap(Sum, (s: string) => s.length, ['a', 'bb', 'ccc'])  // 6
// foldMap(Any, (x: number) => x > 5, [1, 2, 3])             // false

// ============================================================
// 4. Закон ассоциативности — почему fold параллелизуем
// ============================================================

// concat(concat(a, b), c) === concat(a, concat(b, c))
//
// Это значит: можно разбить массив на части, свернуть каждую независимо,
// затем объединить результаты:
//
// fold(Sum, [1, 2, 3, 4])
//   = fold(Sum, [fold(Sum, [1, 2]), fold(Sum, [3, 4])])  // параллельно!
//   = fold(Sum, [3, 7])
//   = 10

// ============================================================
// 5. Program — DSL для key-value хранилища
// ============================================================

// Используем конкретный (не параметризованный) тип для простоты:
type Program =
  | { tag: 'Get';    key: string; next: (value: string | null) => Program }
  | { tag: 'Set';    key: string; value: string; next: Program }
  | { tag: 'Delete'; key: string; next: Program }
  | { tag: 'Return'; value: string }

// В учебных материалах тип часто пишут как StoreOp<A> (с type-параметром),
// но для демонстрации достаточно конкретного Program.

// Вспомогательные конструкторы:
const get = (key: string, next: (v: string | null) => Program): Program =>
  ({ tag: 'Get', key, next })

const set = (key: string, value: string, next: Program): Program =>
  ({ tag: 'Set', key, value, next })

const del = (key: string, next: Program): Program =>
  ({ tag: 'Delete', key, next })

const ret = (value: string): Program =>
  ({ tag: 'Return', value })

// Пример программы (строится как вложенная структура данных):
const exampleProgram: Program =
  set('user', 'Alice',
    get('user', userVal =>
      set('greeting', `Hello, ${userVal ?? 'guest'}`,
        ret('done')
      )
    )
  )
// Программа НЕ выполняется при объявлении — это просто объект!

// ============================================================
// 6. runInMemory — интерпретатор на Map
// ============================================================

function runInMemory(op: Program, store: Map<string, string>):
  { result: string; store: Map<string, string> } {
  if (op.tag === 'Return') return { result: op.value, store: new Map(store) }
  if (op.tag === 'Get') {
    const val = store.get(op.key) ?? null
    return runInMemory(op.next(val), store)  // store не мутируется Get-ом
  }
  const newStore = new Map(store)  // ВСЕГДА создаём копию перед изменением!
  if (op.tag === 'Set') {
    newStore.set(op.key, op.value)
    return runInMemory(op.next, newStore)
  }
  // Delete
  newStore.delete(op.key)
  return runInMemory(op.next, newStore)
}

// runInMemory(exampleProgram, new Map())
// → { result: 'done', store: Map { 'user' → 'Alice', 'greeting' → 'Hello, Alice' } }

// ============================================================
// 7. runAsLog — интерпретатор-журнал (без выполнения)
// ============================================================

function runAsLog(op: Program, log: string[] = []): string[] {
  if (op.tag === 'Return') return log
  if (op.tag === 'Get') {
    return runAsLog(op.next(null), [...log, `GET ${op.key}`])
    // null — значение неизвестно без выполнения
  }
  if (op.tag === 'Set') {
    return runAsLog(op.next, [...log, `SET ${op.key} = ${op.value}`])
  }
  // Delete
  return runAsLog(op.next, [...log, `DELETE ${op.key}`])
}

// runAsLog(exampleProgram)
// → ['SET user = Alice', 'GET user', 'SET greeting = Hello, null']
// Заметьте: greeting = 'Hello, null', потому что GET вернул null!

// ============================================================
// 8. Ключевые отличия двух интерпретаторов
// ============================================================

// runInMemory:
//   + знает реальное состояние хранилища
//   + GET возвращает правильное значение
//   - выполняет реальные операции

// runAsLog:
//   + не требует хранилища
//   + можно запустить без side-effects
//   + результат можно сериализовать
//   - GET всегда получает null (не знает состояния)

// Один и тот же AST → разное поведение → это и есть суть паттерна интерпретатора

// ============================================================
// 9. Типичные ошибки
// ============================================================

// Ошибка 1: Мутация Map в runInMemory
// Плохо:
//   store.set(op.key, op.value)  // мутируем входящий Map!
//   return runInMemory(op.next, store)
//
// Хорошо:
//   const newStore = new Map(store)
//   newStore.set(op.key, op.value)
//   return runInMemory(op.next, newStore)

// Ошибка 2: Попытка "выполнить" GET в runAsLog
// Плохо:
//   const mockStore = new Map()
//   const val = mockStore.get(op.key) ?? null  // всегда null — зачем создавать Map?
//
// Хорошо:
//   return runAsLog(op.next(null), [...log, `GET ${op.key}`])

// Ошибка 3: Неправильный empty для Max/Min
// Плохо:  const Max = { concat: Math.max, empty: 0 }  // сломается на отрицательных числах
// Хорошо: const Max = { concat: Math.max, empty: -Infinity }

// Помечаем как используемые (для отключения lint-ошибок)
void Sum
void Product
void All
void Any
void Min
void Max
void First
void fold
void foldMap
void get
void set
void del
void ret
void exampleProgram
void runInMemory
void runAsLog

export {}  // файл только для чтения, не для импорта
