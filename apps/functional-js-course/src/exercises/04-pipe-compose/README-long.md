# Pipe и Compose — углублённая теория

## Аналогия: конвейер на заводе

Представьте конвейер сборки автомобиля. Кузов въезжает в начало и проходит станцию за станцией: покраска, установка двигателя, сборка салона. Каждая станция получает полуфабрикат и передаёт дальше.

`pipe` — это именно конвейер. Данные входят с одного конца, трансформируются на каждом шаге, выходят готовым результатом. Порядок станций строго определён, и изменить его нельзя без изменения пайплайна.

## Математические основы

Из математики: `(f ∘ g)(x) = f(g(x))`. Знак `∘` — это compose. `f ∘ g` читается «f после g».

```js
// Математически: (addExclaim ∘ toLower)(x) = addExclaim(toLower(x))
const process = compose(addExclaim, toLower)
process('HELLO')  // toLower сначала: 'hello', addExclaim: 'hello!'
```

`pipe` — это compose с обратным порядком аргументов. Ничего принципиально другого, только удобство записи.

## Ассоциативность композиции

Важное свойство: `compose(f, compose(g, h))` === `compose(compose(f, g), h)` === `compose(f, g, h)`.

Это позволяет разбивать и собирать пайплайны произвольно:

```js
const parseStep     = pipe(trim, toLower, normalize)
const enrichStep    = pipe(addPrefix, addSuffix)
const formatStep    = pipe(capitalize, addExclaim)

// Три малых пайплайна образуют один большой
const fullPipeline  = pipe(parseStep, enrichStep, formatStep)
// Эквивалентно:
// pipe(trim, toLower, normalize, addPrefix, addSuffix, capitalize, addExclaim)
```

Это свойство критично для модульности: пишите маленькие именованные пайплайны, комбинируйте их в большие.

## Async composition

Обычный `pipe` не работает с промисами напрямую:

```js
// Плохо — fn2 получит Promise, а не его значение
const bad = pipe(fetchUser, enrichProfile)(1)

// Хорошо — asyncPipe ждёт каждый шаг
async function asyncPipe(...fns) {
  return async (value) => {
    let acc = value
    for (const fn of fns) {
      acc = await fn(acc)
    }
    return acc
  }
}
```

Альтернатива через `.then`:

```js
const asyncPipeAlt = (...fns) => (value) =>
  fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(value))
```

Обе версии эквивалентны, но первая (через `for...of`) понятнее при отладке.

## Типизация pipe в TypeScript

Ключевая сложность: каждый шаг меняет тип. TypeScript нужно это знать.

Решение — перегрузки (overloads):

```ts
function pipe<A>(value: A): A
function pipe<A, B>(value: A, fn1: (a: A) => B): B
function pipe<A, B, C>(value: A, fn1: (a: A) => B, fn2: (b: B) => C): C
function pipe<A, B, C, D>(value: A, fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D): D
// ... до нужной арности

function pipe(value: unknown, ...fns: Array<(x: unknown) => unknown>): unknown {
  return fns.reduce((acc, fn) => fn(acc), value)
}

// Теперь TypeScript знает типы на каждом шаге
const result = pipe(
  '  hello  ',
  (s: string) => s.trim(),     // string → string
  (s: string) => s.length,     // string → number
  (n: number) => n * 2,        // number → number
)
// result: number
```

Перегрузок нужно столько, сколько максимальная длина пайплайна. На практике 8-10 достаточно.

## Pipe в fp-ts и Effect

Библиотеки функционального программирования предоставляют готовый типизированный `pipe`.

**fp-ts:**

```ts
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

const result = pipe(
  O.some(42),
  O.map(n => n * 2),
  O.filter(n => n > 50),
  O.getOrElse(() => 0),
)
// result: 84
```

`pipe` в fp-ts принимает значение первым аргументом — это стиль «данные первыми». Удобно для чтения.

**Effect:**

```ts
import { Effect, pipe } from 'effect'

const program = pipe(
  fetchUserEffect(id),
  Effect.flatMap(enrichProfile),
  Effect.flatMap(validateAccess),
  Effect.map(formatResponse),
)
```

В Effect `pipe` используется повсеместно потому что методы не доступны напрямую на значениях — только через утилиты.

## Unix философия в коде

Unix pipes сделали командную строку мощным инструментом не случайно. Три принципа:

1. Каждая программа делает одно дело хорошо
2. Программы работают с текстом (единый формат)
3. Программы можно соединять через pipes

В функциональном программировании то же самое:
1. Каждая функция делает одно преобразование
2. Функции работают с неизменяемыми значениями
3. Функции соединяются через pipe/compose

```bash
# Unix
cat users.csv | grep active | awk -F, '{print $2}' | sort | uniq

# JavaScript
pipe(
  parseCSV,
  filter(isActive),
  map(getName),
  sort,
  uniq,
)(readFile('users.csv'))
```

## Transducers — продвинутая тема (тизер Level 8)

Обычный pipe с map/filter создаёт промежуточные массивы:

```js
[1, 2, 3, 4, 5]
  .map(x => x * 2)    // новый массив [2, 4, 6, 8, 10]
  .filter(x => x > 4) // ещё один массив [6, 8, 10]
  .reduce(sum, 0)      // 24
```

Transducers позволяют скомпоновать map и filter в одну операцию без промежуточных массивов:

```js
const xform = compose(
  map(x => x * 2),
  filter(x => x > 4),
)

transduce(xform, sum, 0, [1, 2, 3, 4, 5])  // 24, без промежуточных массивов
```

Это особенно важно для больших данных. Подробнее в Level 8 (Data Transformations).

## Сравнение с OOP builder

```js
// OOP Builder — мутирует внутреннее состояние
new ConfigBuilder()
  .withDatabase('postgres')
  .withPort(3000)
  .withLogging('info')
  .build()

// FP pipe — каждый шаг создаёт новый объект
pipe(
  withDatabase('postgres'),
  withPort(3000),
  withLogging('info'),
)({})
```

FP-версия:
- Чисто функциональна — нет мутаций, нет `this`
- Промежуточные состояния можно сохранить и переиспользовать
- Шаги — это просто функции, их легко тестировать по отдельности
- Шаги можно хранить в массиве и динамически выбирать

```js
const steps = [
  withDatabase('postgres'),
  isProduction ? withLogging('error') : withLogging('debug'),
  isPublicAPI ? withCors('*') : null,
].filter(Boolean)

const config = pipe(...steps)({})
```
