# Каррирование — углублённая теория

## История: Шёнфинкель и Карри

В 1924 году Мозес Шёнфинкель опубликовал работу, в которой показал: любую функцию от многих аргументов
можно представить как последовательность функций от одного аргумента. Позже Хаскелл Карри независимо
разработал ту же идею и популяризировал её в теории типов. Операция получила имя «каррирование» в честь Карри,
хотя справедливее было бы называть её «шёнфинкелирование».

Математически: функция `f: A × B → C` преобразуется в `curry(f): A → (B → C)`.
То есть вместо функции двух аргументов получаем функцию, возвращающую функцию одного аргумента.

## Автоматическое каррирование с variadic аргументами

Стандартная реализация `curry` опирается на `fn.length` — количество формальных параметров.
Это создаёт ограничение: variadic функции (`...args`) имеют `length === 0`.

```js
function curry(fn) {
  const arity = fn.length  // только явно объявленные параметры

  return function curried(...args) {
    if (args.length >= arity) {
      return fn(...args)
    }
    return function(...moreArgs) {
      return curried(...args, ...moreArgs)
    }
  }
}

// Работает: явная арность
const add3 = curry((a, b, c) => a + b + c)  // fn.length === 3
add3(1)(2)(3)  // 6

// Не работает: variadic
const sum = curry((...nums) => nums.reduce((a, b) => a + b, 0))  // fn.length === 0
sum(1)(2)  // возвращает функцию, а не вызывает — arity === 0 значит вызов при первом args.length >= 0
```

Решение — явно передавать арность:

```js
function curryN(arity, fn) {
  return function curried(...args) {
    if (args.length >= arity) return fn(...args)
    return (...more) => curried(...args, ...more)
  }
}

const sum3 = curryN(3, (...nums) => nums.reduce((a, b) => a + b, 0))
sum3(1)(2)(3)  // 6
```

## TypeScript: типизация каррированных функций

Точная типизация curry в TypeScript — нетривиальная задача. Для фиксированных арностей можно
использовать перегрузки:

```ts
// Для функций арности 2
function curry2<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C
function curry2<A, B, C>(fn: (a: A, b: B) => C) {
  return (a: A) => (b: B) => fn(a, b)
}

// Для функций арности 3
function curry3<A, B, C, D>(fn: (a: A, b: B, c: C) => D): (a: A) => (b: B) => (c: C) => D
function curry3<A, B, C, D>(fn: (a: A, b: B, c: C) => D) {
  return (a: A) => (b: B) => (c: C) => fn(a, b, c)
}

const add = curry2((a: number, b: number) => a + b)
const add5 = add(5)  // (b: number) => number
add5(3)              // 8
```

Для полноценной общей реализации нужны условные типы:

```ts
type Curry<F extends (...args: unknown[]) => unknown> =
  F extends (first: infer A, ...rest: infer R) => infer C
    ? R extends []
      ? (a: A) => C
      : (a: A) => Curry<(...args: R) => C>
    : never

// Это рекурсивный тип — работает для фиксированных арностей
```

На практике в строго типизированных проектах чаще используют curry2/curry3 — они проще и безопаснее.

## Ramda и lodash/fp

Библиотеки функционального программирования предоставляют готовые каррированные утилиты.

**Ramda** — все функции каррированы по умолчанию:

```js
import * as R from 'ramda'

const getActive = R.filter(R.prop('active'))
const getNames  = R.map(R.prop('name'))
const sortNames = R.sortBy(R.identity)

const pipeline = R.pipe(getActive, getNames, sortNames)
pipeline(users)  // активные пользователи по алфавиту
```

**lodash/fp** — функциональная версия lodash с автокаррированием:

```js
import { filter, map, sortBy, flow } from 'lodash/fp'

const pipeline = flow(
  filter('active'),
  map('name'),
  sortBy(x => x),
)
pipeline(users)
```

Разница от обычного lodash: в lodash/fp аргументы идут в порядке «итератор/предикат сначала, данные последними»,
что делает возможным частичное применение и point-free стиль.

## Point-free: плюсы и минусы

### Плюсы

Код описывает **что** делается, а не **как**:

```js
// Point-free — читается как описание трансформации данных
const processOrders = pipe(
  filter(isCompleted),
  map(extractAmount),
  sum,
)

// Легко тестировать каждый шаг отдельно
const isCompleted = order => order.status === 'done'
const extractAmount = order => order.amount
```

Функции легко переиспользовать и переставлять в конвейере.

### Минусы

При сложной логике point-free вредит читаемости:

```js
// Плохо — почти нечитаемо
const process = pipe(
  map(compose(multiply(1.2), prop('price'))),
  filter(compose(lt(100), prop('price'))),
  sortBy(compose(negate, prop('score'))),
)

// Лучше с явными переменными
const process = items => items
  .map(item => ({ ...item, price: item.price * 1.2 }))
  .filter(item => item.price > 100)
  .sort((a, b) => b.score - a.score)
```

Правило: point-free хорош для **простых** трансформаций из одного-трёх шагов с читаемыми именами.

## Порядок аргументов: данные — последними

Это ключевое соглашение для каррированных функций. Если данные стоят последними, функцию легко
частично применить:

```js
// Хорошо: конфиг/предикат сначала, данные последними
const filter = pred => data => data.filter(pred)
const map    = fn   => data => data.map(fn)
const reduce = fn => init => data => data.reduce(fn, init)

// Теперь можно строить переиспользуемые трансформаторы
const getActive = filter(u => u.active)    // данные не нужны до вызова
const getNames  = map(u => u.name)

// Плохо: данные первыми
const filter = (data, pred) => data.filter(pred)
// partial(filter, users) — зафиксировали данные, а не предикат — смысл теряется
```

## Аналогия: конвейер сборки

Каррирование — как конвейер на заводе. Каждый рабочий на конвейере умеет делать ровно одну операцию.
Вы не запускаете весь конвейер сразу — сначала настраиваете каждую станцию (частичное применение),
а потом подаёте заготовку (данные).

```
Станция 1: filter(isActive)  ← настроена
Станция 2: map(getName)      ← настроена
Станция 3: sort(alpha)       ← настроена

Подаём данные → каждая станция обрабатывает и передаёт следующей → результат
```

Это то, что делает `pipe` — соединяет настроенные станции в конвейер. Level 4 посвящён именно `pipe`.

## Связь с pipe (тизер Level 4)

Каррирование и `pipe` — нераздельная пара. Каррированные функции могут принимать данные последними,
что делает их готовыми к встраиванию в `pipe`:

```js
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

// Каждая функция в pipe получает один аргумент (данные) и возвращает трансформированные данные
pipe(
  filterBy(isActive),   // (users) => users.filter(isActive)
  mapWith(getName),     // (filtered) => filtered.map(getName)
  sortBy(alpha),        // (names) => [...names].sort(alpha)
)(users)
```

Без каррирования каждую функцию пришлось бы оборачивать вручную:
`pipe(users => users.filter(isActive), ...)` — это уже verbose стиль.

## Итог

| Концепция | Суть | Когда использовать |
|---|---|---|
| Currying | f(a,b,c) → f(a)(b)(c) | Нужна максимальная гибкость применения |
| Partial application | partial(f, a) → f'(b,c) | Нужно зафиксировать N первых аргументов |
| Point-free | функции без аргументов | Короткие конвейеры с читаемыми именами |
| Данные последними | (config)(data) | Любые каррированные утилиты |
