# Функции высшего порядка — углублённая теория

## Лексическое окружение и область видимости

Когда функция создаётся, движок JS запоминает не только её код, но и лексическое
окружение (lexical environment) — все переменные, которые были видны в месте создания
функции. Это и есть механизм замыкания.

```js
function outer() {
  const secret = 42   // переменная в outer scope

  function inner() {
    // inner "видит" secret через цепочку scope
    console.log(secret)
  }

  return inner
}

const fn = outer()   // outer выполнился и вернул inner
fn()                  // 42 — secret всё ещё живёт в памяти!
```

Почему `secret` не удалился сборщиком мусора? Потому что `inner` держит на него ссылку
через своё замыкание. Пока `fn` жива — жив и `secret`.

## Цепочка областей видимости (Scope Chain)

```mermaid
flowchart LR
  G[Global Scope] --> O["outer() Scope\nsecret = 42"]
  O --> I["inner() Scope\n(нет своих переменных)"]
  I -->|"ищет secret"| O
  O -->|"нашёл"| I
```

Когда `inner` обращается к `secret`:
1. Смотрит в свой собственный scope — не нашёл
2. Идёт вверх по цепочке в outer scope — нашёл
3. Если бы не нашёл там — продолжил бы до Global

## HOF как кондитерская фабрика

Аналогия: представьте кондитерскую фабрику. Фабрика — это HOF. Она принимает
описание рецепта (конфигурацию) и возвращает готовую функцию-рецепт для конкретного торта.

```js
// Фабрика тортов (HOF)
function createCakeRecipe(baseIngredients) {
  // Внутри — общая логика для всех тортов
  const validate = (portions) => portions > 0 && portions <= 20

  // Возвращаем рецепт для конкретного торта
  return function bake(portions) {
    if (!validate(portions)) throw new Error('Invalid portions')
    return {
      ingredients: baseIngredients.map(i => ({ ...i, amount: i.amount * portions })),
      portions,
      ready: false,
    }
  }
}

const chocolateCakeRecipe = createCakeRecipe([
  { name: 'flour',   amount: 200 },
  { name: 'cocoa',   amount: 50  },
])

const vanillaCakeRecipe = createCakeRecipe([
  { name: 'flour',   amount: 200 },
  { name: 'vanilla', amount: 10  },
])

chocolateCakeRecipe(2)   // торт на 2 порции
vanillaCakeRecipe(5)     // другой торт на 5 порций
```

Фабрика один раз описывает общее поведение (валидацию, структуру), а рецепты
специализируются только в нужных местах.

## map / filter / reduce как абстракции итерации

До HOF код выглядел так:

```js
// Императивный стиль
const result = []
for (let i = 0; i < items.length; i++) {
  if (items[i].price > 100) {
    result.push({ ...items[i], price: items[i].price * 0.9 })
  }
}
```

HOF абстрагируют шаблонный код итерации, оставляя только суть:

```js
// Декларативный стиль — говорим ЧТО, а не КАК
const result = items
  .filter(item => item.price > 100)
  .map(item => ({ ...item, price: item.price * 0.9 }))
```

Второй вариант читается как предложение: "возьми дорогие товары и примени скидку".

### Как устроен reduce

`reduce` — самый мощный из трёх, через него можно выразить `map` и `filter`:

```js
// map через reduce
const doubled = [1, 2, 3].reduce((acc, n) => [...acc, n * 2], [])

// filter через reduce
const evens = [1, 2, 3, 4].reduce((acc, n) => n % 2 === 0 ? [...acc, n] : acc, [])

// groupBy через reduce — то, чего нет в стандарте
const grouped = products.reduce((acc, p) => {
  const key = p.category
  return { ...acc, [key]: [...(acc[key] ?? []), p] }
}, {})
// { electronics: [...], education: [...] }
```

## Паттерны HOF

### 1. Middleware (промежуточный обработчик)

```js
// Express-style middleware
function withLogging(handler) {
  return (req, res) => {
    console.log(`${req.method} ${req.url}`)
    return handler(req, res)
  }
}

function withAuth(handler) {
  return (req, res) => {
    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized')
    }
    return handler(req, res)
  }
}

// Оборачиваем handler цепочкой middleware
const protectedHandler = withLogging(withAuth(getUser))
```

### 2. Decorator (декоратор поведения)

```js
function memoize(fn) {
  const cache = new Map()   // замыкание!

  return (...args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

const expensiveCalc = memoize((n) => {
  // дорогое вычисление...
  return n * n
})

expensiveCalc(5)   // вычисляет
expensiveCalc(5)   // берёт из кэша
```

### 3. Factory (фабрика функций)

```js
// Создаём семейство функций с параметризованным поведением
function createSorter(field, direction = 'asc') {
  return (a, b) => {
    const sign = direction === 'asc' ? 1 : -1
    return a[field] > b[field] ? sign : -sign
  }
}

const byPrice = createSorter('price')
const byPriceDesc = createSorter('price', 'desc')
const byName = createSorter('name')

products.sort(byPrice)
products.sort(byPriceDesc)
```

## Каррирование как HOF (тизер следующего уровня)

Каррирование — трансформация функции с несколькими аргументами в цепочку
одноаргументных функций. Это частный случай фабрики:

```js
// Обычная функция
const add = (a, b) => a + b
add(2, 3)  // 5

// Каррированная версия
const curriedAdd = (a) => (b) => a + b
const add2 = curriedAdd(2)   // HOF вернул новую функцию
add2(3)  // 5
add2(10) // 12

// Применение: частичное применение аргументов
const numbers = [1, 2, 3, 4, 5]
numbers.map(curriedAdd(10))  // [11, 12, 13, 14, 15]
```

На следующем уровне мы разберём каррирование, `partial application` и автокаррирование.

## Производительность: осторожно с цепочками

Каждый вызов `filter`, `map`, `reduce` создаёт новый массив и итерирует по всем
элементам. На миллионах элементов это важно:

```js
// Три прохода по массиву
const result = bigArray
  .filter(predicate)    // проход 1, новый массив
  .map(transform)       // проход 2, новый массив
  .reduce(fold, init)   // проход 3

// Один проход через reduce (transducer-стиль)
const result = bigArray.reduce((acc, item) => {
  if (!predicate(item)) return acc
  return fold(acc, transform(item))
}, init)
```

Для большинства задач (сотни/тысячи элементов) цепочки читабельнее и быстрее
в разработке. Оптимизируйте только там где профайлер показал проблему.

## Распространённые ошибки

**1. Создание HOF в теле компонента без useCallback:**

```jsx
// Плохо — новая функция при каждом рендере
function Component({ items }) {
  const filtered = items.filter(createFilter(query))  // createFilter вызывается каждый рендер
  // ...
}

// Хорошо
function Component({ items }) {
  const filter = useMemo(() => createFilter(query), [query])
  const filtered = useMemo(() => items.filter(filter), [items, filter])
}
```

**2. Потеря контекста при передаче метода:**

```js
// Плохо
class Counter {
  count = 0
  increment() { this.count++ }
}
const c = new Counter()
[1, 2, 3].forEach(c.increment)  // this === undefined!

// Хорошо — bind или стрелочная функция
[1, 2, 3].forEach(c.increment.bind(c))
[1, 2, 3].forEach(() => c.increment())
```

**3. Накопление замыканий (memory leak):**

```js
// Плохо — каждый вызов добавляет listener, но не удаляет
function setupTracking(userId) {
  // При каждом вызове создаётся новое замыкание с userId
  document.addEventListener('click', () => track(userId))
}

// Хорошо — сохраняем ссылку и убираем listener
function setupTracking(userId) {
  const handler = () => track(userId)
  document.addEventListener('click', handler)
  return () => document.removeEventListener('click', handler)  // cleanup
}
```
