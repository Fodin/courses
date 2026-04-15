# Уровень 4: Функции, композиция и рекурсия — подробная теория

## Чистые функции: детерминизм + отсутствие побочных эффектов

Чистая функция — это математическое понятие, перенесённое в программирование. В математике функция — это отображение: каждому входному значению строго соответствует одно выходное. Никакого «вчера вернула 5, а сегодня 7».

Чистая функция в программировании обязана:
1. **Быть детерминированной**: одинаковые аргументы → всегда одинаковый результат
2. **Не производить наблюдаемых побочных эффектов**: не пишет в лог, не мутирует аргументы, не делает HTTP-запросы, не трогает DOM

```typescript
// Нечистая — нарушает детерминизм
function getCurrentAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear // зависит от времени
}

// Нечистая — побочный эффект (мутация аргумента)
function sortUsers(users: User[]): User[] {
  return users.sort((a, b) => a.name.localeCompare(b.name)) // мутирует оригинал!
}

// Нечистая — скрытая зависимость
let baseUrl = 'https://api.example.com'
function buildUrl(path: string): string {
  return `${baseUrl}${path}` // зависит от глобальной переменной
}

// Чистые версии:
function getCurrentAge(birthYear: number, currentYear: number): number {
  return currentYear - birthYear
}

function sortUsers(users: User[]): User[] {
  return [...users].sort((a, b) => a.name.localeCompare(b.name))
}

function buildUrl(baseUrl: string, path: string): string {
  return `${baseUrl}${path}`
}
```

### Преимущества чистых функций

**Тестируемость.** Тест — это просто пара вход/выход. Никаких моков, никаких зависимостей от среды:

```typescript
// Тест чистой функции — три строки
it('calculateTax should apply correct rate', () => {
  expect(calculateTax(100, 0.2)).toBe(120)
  expect(calculateTax(50, 0.1)).toBe(55)
})

// Тест нечистой функции — сначала настрой моки, потом убери за собой
it('calculateTax should apply tax', () => {
  jest.spyOn(Config, 'getTaxRate').mockReturnValue(0.2)
  const result = calculateTax(100)
  expect(result).toBe(120)
  jest.restoreAllMocks() // забудешь — сломаешь другой тест
})
```

**Мемоизация (кэширование).** Если функция детерминирована — её результат для одного и того же аргумента всегда одинаков. Можно кэшировать:

```typescript
function memoize<TArg, TResult>(fn: (arg: TArg) => TResult): (arg: TArg) => TResult {
  const cache = new Map<TArg, TResult>()
  return (arg: TArg) => {
    if (!cache.has(arg)) {
      cache.set(arg, fn(arg))
    }
    return cache.get(arg)!
  }
}

const expensiveParse = memoize((json: string) => JSON.parse(json))
expensiveParse('{"a": 1}') // вычислено
expensiveParse('{"a": 1}') // из кэша — мгновенно
```

Мемоизация нечистой функции сломается: закешированный результат может быть неактуальным.

**Параллелизм.** Чистые функции не разделяют изменяемое состояние — их безопасно выполнять параллельно без мьютексов и блокировок.

### Функциональное ядро, императивная оболочка

Архитектурный паттерн: чистая логика в центре, побочные эффекты — по периметру. Придуман Гэри Бернхардтом и называется Functional Core, Imperative Shell.

```typescript
// Функциональное ядро — чистая бизнес-логика
function processOrder(order: Order, inventory: Inventory): OrderResult {
  if (inventory[order.productId] < order.quantity) {
    return { type: 'error', reason: 'insufficient_stock' }
  }
  const newInventory = {
    ...inventory,
    [order.productId]: inventory[order.productId] - order.quantity,
  }
  return { type: 'success', updatedInventory: newInventory, total: order.quantity * order.price }
}

// Императивная оболочка — все эффекты здесь
async function handleOrderRequest(orderId: string): Promise<void> {
  const order = await db.orders.findById(orderId)       // эффект: чтение БД
  const inventory = await db.inventory.getAll()         // эффект: чтение БД

  const result = processOrder(order, inventory)         // чистая функция

  if (result.type === 'success') {
    await db.inventory.update(result.updatedInventory)  // эффект: запись БД
    await emailService.sendConfirmation(order.userId)   // эффект: email
  } else {
    await logger.warn('Order failed', { orderId, reason: result.reason })
  }
}
```

Преимущество: ядро тестируется без единого мока. Оболочку тестируют интеграционными тестами.

---

## Ссылочная прозрачность и equational reasoning

Ссылочная прозрачность (referential transparency) — свойство выражения: его можно заменить его значением без изменения поведения программы.

```typescript
// Ссылочно прозрачные выражения:
const x = 2 + 3       // можно заменить на 5
const y = x * 2       // можно заменить на 10

// Можно рассуждать как об алгебре:
// y = (2 + 3) * 2 = 5 * 2 = 10

// НЕ ссылочно прозрачные:
const ts = Date.now()   // каждый раз новое значение
const id = Math.random() // непредсказуемо

// Проблема:
const a = Date.now()
const b = Date.now()
// a !== b, хотя «один и тот же» вызов
```

### Примеры: что прозрачно, а что нет

| Выражение | Прозрачно? | Почему |
|-----------|-----------|--------|
| `Math.sqrt(4)` | Да | Всегда 2 |
| `Date.now()` | Нет | Зависит от времени |
| `[1,2,3].map(x => x * 2)` | Да | Чистая операция |
| `fetch('/api/data')` | Нет | Сетевой запрос, побочный эффект |
| `Math.random()` | Нет | Недетерминированно |
| `arr.slice(1)` | Да | Возвращает новый массив |
| `arr.push(1)` | Нет | Мутирует arr |

### Equational reasoning

Ссылочная прозрачность позволяет рассуждать о коде как об уравнениях. Это мощно при рефакторинге:

```typescript
// Если функции ссылочно прозрачны:
const process = pipe(validate, normalize, transform)

// Мы можем мысленно «раскрыть» и убедиться в правильности:
// process(x) = transform(normalize(validate(x)))
// Если normalize(validate(x)) === normalize(y) для некоторого y
// То process(x) === transform(normalize(y))

// Это нельзя сделать с нечистыми функциями:
// fetchUser(id) !== fetchUser(id) (могут вернуть разные данные)
```

---

## Функциональная композиция

### compose: справа налево

Математическая запись f ∘ g означает «сначала g, потом f». В коде это compose(f, g):

```typescript
const compose = <T>(...fns: Array<(x: T) => T>) =>
  (x: T): T => fns.reduceRight((acc, fn) => fn(acc), x)

const double = (x: number) => x * 2
const addOne = (x: number) => x + 1
const square = (x: number) => x * x

// compose(f, g, h)(x) = f(g(h(x)))
const transform = compose(double, addOne, square)
transform(3) // double(addOne(square(3))) = double(addOne(9)) = double(10) = 20
```

### pipe: слева направо

Pipe — это то, что реально используется в производственном коде. Читается как рецепт: «взять x, сделать A, затем B, затем C»:

```typescript
const pipe = <T>(...fns: Array<(x: T) => T>) =>
  (x: T): T => fns.reduce((acc, fn) => fn(acc), x)

// Те же функции, другой порядок мышления
const transform = pipe(square, addOne, double)
transform(3) // square(3) → addOne(9) → double(10) = 20

// Реальный пример: обработка строки
const normalizeInput = pipe(
  (s: string) => s.trim(),
  (s: string) => s.toLowerCase(),
  (s: string) => s.replace(/\s+/g, '-'),
)

normalizeInput('  Hello World  ') // 'hello-world'
```

```mermaid
graph LR
  A["Вход"] --> B["trim"]
  B --> C["toLowerCase"]
  C --> D["replace spaces"]
  D --> E["Выход"]
```

### Типизированный pipe в TypeScript

Ограничение простой реализации выше — все функции должны работать с одним типом `T`. Типизированный pipe умеет трансформировать тип:

```typescript
// Двухэтапный вариант (для демонстрации):
function pipe2<A, B, C>(
  fn1: (a: A) => B,
  fn2: (b: B) => C,
): (a: A) => C {
  return (a: A) => fn2(fn1(a))
}

const parseAndDouble = pipe2(
  (s: string) => parseInt(s, 10),
  (n: number) => n * 2,
)

parseAndDouble('21') // 42
```

Библиотека `fp-ts` предоставляет полностью типизированный `pipe` с поддержкой до 19 функций через перегрузки.

### Pointfree стиль

Pointfree (tacit programming) — стиль, где функция определяется без явного упоминания аргументов:

```typescript
// Обычный стиль (point-ful)
const doubleAll = (nums: number[]) => nums.map(n => n * 2)

// Pointfree стиль
const double = (n: number) => n * 2
const doubleAll = (nums: number[]) => nums.map(double)

// Ещё более pointfree с каррированием:
const map = <T, R>(fn: (x: T) => R) => (arr: T[]) => arr.map(fn)
const doubleAll = map(double) // нет упоминания массива!
```

⚠️ Pointfree хорош для простых трансформаций, но может ухудшить читаемость при сложной логике. Это инструмент, а не самоцель.

---

## Каррирование и частичное применение

### Каррирование

Каррирование — преобразование функции `f(a, b, c)` в `f(a)(b)(c)`. Названо в честь математика Хаскелла Карри.

```typescript
// Некаррированная функция
const multiply = (a: number, b: number) => a * b

// Каррированная вручную
const curriedMultiply = (a: number) => (b: number) => a * b

// Использование: частичное применение
const double = curriedMultiply(2)  // b => 2 * b
const triple = curriedMultiply(3)  // b => 3 * b

double(5)  // 10
triple(5)  // 15

// В pipe каррирование раскрывает всю мощь
const processNumbers = pipe(
  (nums: number[]) => nums.filter(n => n > 0),
  (nums: number[]) => nums.map(curriedMultiply(2)),
  (nums: number[]) => nums.reduce((a, b) => a + b, 0),
)

processNumbers([-1, 2, 3, -4, 5]) // (2+3+5)*2 = 20
```

### Частичное применение

Частичное применение — фиксация части аргументов функции без полного каррирования:

```typescript
// Функция с несколькими аргументами
function request(method: string, baseUrl: string, path: string): string {
  return `${method} ${baseUrl}${path}`
}

// Частичное применение через bind
const getFromApi = request.bind(null, 'GET', 'https://api.example.com')
getFromApi('/users')   // 'GET https://api.example.com/users'
getFromApi('/orders')  // 'GET https://api.example.com/orders'

// Или через замыкание (более явно)
const makeRequest = (baseUrl: string) => (method: string) => (path: string) =>
  request(method, baseUrl, path)

const fromApi = makeRequest('https://api.example.com')
const getFromApi = fromApi('GET')
getFromApi('/users')
```

---

## Ленивые вычисления

Ленивость — вычислять значение только тогда, когда оно действительно понадобится. Противоположность — строгие (eager) вычисления, когда выражение вычисляется немедленно.

### Thunk: простейшая ленивость

Thunk — это функция без аргументов, оборачивающая вычисление:

```typescript
type Thunk<T> = () => T

// Строгое вычисление — происходит немедленно
const value = expensiveOperation() // вычислено!

// Ленивое — thunk откладывает вычисление
const lazyValue: Thunk<number> = () => expensiveOperation() // ещё нет
// ...
const result = lazyValue() // вот теперь вычислено

// Практический пример: условное логирование
function log(level: 'debug' | 'info', getMessage: Thunk<string>): void {
  if (shouldLog(level)) {
    console.log(getMessage()) // getMessage() вызывается только если нужно
  }
}

// Без thunk:
log('debug', `Processed ${JSON.stringify(largeObject)}`) // stringify всегда!

// С thunk:
log('debug', () => `Processed ${JSON.stringify(largeObject)}`) // только если debug
```

### Генераторы: ленивые последовательности

Генераторы — это функции, которые умеют «замораживаться» в середине выполнения через `yield`:

```typescript
// Бесконечная последовательность чисел Фибоначчи
function* fibonacci(): Generator<number> {
  let [a, b] = [0, 1]
  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
}

function take<T>(n: number, gen: Generator<T>): T[] {
  const result: T[] = []
  for (let i = 0; i < n; i++) {
    const { value, done } = gen.next()
    if (done) break
    result.push(value)
  }
  return result
}

take(8, fibonacci()) // [0, 1, 1, 2, 3, 5, 8, 13]
// Вся последовательность никогда не вычисляется целиком

// Ленивая обработка большого файла построчно:
async function* readLines(path: string): AsyncGenerator<string> {
  const stream = createReadStream(path)
  let buffer = ''
  for await (const chunk of stream) {
    buffer += chunk
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? '' // последняя строка может быть неполной
    for (const line of lines) yield line
  }
  if (buffer) yield buffer
}

// Читаем только первые 100 строк из файла в 10 ГБ
for await (const line of readLines('huge.log')) {
  processLine(line)
}
```

### Ленивые цепочки через итераторы

JavaScript поддерживает ленивые итераторы через протокол `Symbol.iterator`:

```typescript
// Array.prototype методы — строгие (создают промежуточные массивы)
const result = [1, 2, 3, 4, 5]
  .filter(n => n % 2 === 0)  // создаёт новый массив [2, 4]
  .map(n => n * 10)           // создаёт новый массив [20, 40]
  .slice(0, 1)                // [20]

// Генераторы — ленивые (промежуточных массивов нет)
function* lazyFilter<T>(iter: Iterable<T>, pred: (x: T) => boolean): Generator<T> {
  for (const x of iter) if (pred(x)) yield x
}

function* lazyMap<T, R>(iter: Iterable<T>, fn: (x: T) => R): Generator<R> {
  for (const x of iter) yield fn(x)
}

function first<T>(iter: Iterable<T>): T | undefined {
  for (const x of iter) return x
}

const numbers = [1, 2, 3, 4, 5]
const result = first(
  lazyMap(
    lazyFilter(numbers, n => n % 2 === 0),
    n => n * 10,
  ),
) // 20 — вычислено за один проход, без промежуточных массивов
```

Это особенно важно при работе с большими коллекциями.

---

## Рекурсия vs циклы

### Когда рекурсия естественнее

Рекурсия — инструмент для задач, которые сами по себе рекурсивны по природе. Попытка обойти дерево циклом требует явного стека и громоздкого кода:

```typescript
type TreeNode = {
  value: number
  left?: TreeNode
  right?: TreeNode
}

// Рекурсивно — красиво и очевидно
function sumTree(node: TreeNode | undefined): number {
  if (!node) return 0
  return node.value + sumTree(node.left) + sumTree(node.right)
}

// Итеративно — нужен явный стек
function sumTreeIterative(root: TreeNode): number {
  const stack: TreeNode[] = [root]
  let total = 0
  while (stack.length > 0) {
    const node = stack.pop()!
    total += node.value
    if (node.right) stack.push(node.right)
    if (node.left) stack.push(node.left)
  }
  return total
}
```

Другие типично рекурсивные задачи: парсинг вложенных структур (JSON, HTML), алгоритмы «разделяй и властвуй» (quicksort, mergesort), обход файловой системы.

### Хвостовая рекурсия (Tail Call Optimization)

Хвостовой вызов — это когда рекурсивный вызов является последним действием функции. Оптимизатор может переиспользовать кадр стека:

```typescript
// НЕ хвостовая рекурсия: после рекурсивного вызова ещё нужно умножить
function factorial(n: number): number {
  if (n <= 1) return 1
  return n * factorial(n - 1) // умножение ещё не сделано → нельзя переиспользовать стек
}

// Хвостовая рекурсия: рекурсивный вызов — последнее действие
function factorialTail(n: number, acc = 1): number {
  if (n <= 1) return acc
  return factorialTail(n - 1, n * acc) // накапливаем в acc
}
```

⚠️ JavaScript (ES2015+) требует TCO в strict mode, но на практике большинство движков (V8, SpiderMonkey) не реализуют её из-за сложностей с отладкой. Не полагайтесь на TCO в реальном коде.

### Трамплинирование: обходной путь

Трамплин (trampoline) — паттерн для рекурсии без роста стека. Вместо прямого вызова рекурсия возвращает функцию:

```typescript
type TrampolineResult<T> = T | (() => TrampolineResult<T>)

function trampoline<T>(fn: () => TrampolineResult<T>): T {
  let result: TrampolineResult<T> = fn()
  while (typeof result === 'function') {
    result = (result as () => TrampolineResult<T>)()
  }
  return result
}

// «Рекурсивная» функция возвращает thunk вместо прямого вызова
function factorialTrampoline(n: number, acc = 1): TrampolineResult<number> {
  if (n <= 1) return acc
  return () => factorialTrampoline(n - 1, n * acc) // thunk вместо вызова
}

const result = trampoline(() => factorialTrampoline(100000))
// Стек никогда не превысит 1 кадр!
```

Трамплин превращает рекурсию в итерацию вручную, без переписывания алгоритма в цикл.

---

## Частые ошибки

### Путаница между compose и pipe

```typescript
// ❌ Неправильный порядок: думали pipe, написали compose
const process = compose(trim, toLowerCase, slugify)
// Фактически: slugify(toLowerCase(trim(x))) — порядок обратный!

// ✅ Явно определите, какой порядок вы имеете в виду
const process = pipe(trim, toLowerCase, slugify)
// Чётко: trim → toLowerCase → slugify
```

### Нечаянное создание нечистой функции

```typescript
// ❌ Функция читает из closure — нечистая
const createFormatter = (locale: string) => {
  const format = new Intl.DateTimeFormat(locale) // создаётся один раз
  return (date: Date) => format.format(date) // зависит от format в closure
}

// Это на самом деле нормально! format не мутируется, результат детерминирован.
// ❌ РЕАЛЬНАЯ проблема — мутабельный closure:
let cache: Record<string, string> = {}
const fetchWithCache = (url: string): string => {
  if (cache[url]) return cache[url] // зависит от внешнего мутабельного состояния
  const result = httpGetSync(url)
  cache[url] = result // побочный эффект — изменение внешнего объекта
  return result
}

// ✅ Изолируйте состояние явно
function createCachedFetch() {
  const cache: Record<string, string> = {} // состояние явно в фабрике
  return (url: string): string => {
    if (cache[url]) return cache[url]
    const result = httpGetSync(url)
    cache[url] = result
    return result
  }
}
```

### Рекурсия без базового случая

```typescript
// ❌ Бесконечная рекурсия — нет базового случая
function sum(nums: number[]): number {
  return nums[0] + sum(nums.slice(1)) // если nums пустой — TypeError!
}

// ✅ Базовый случай обязателен
function sum(nums: number[]): number {
  if (nums.length === 0) return 0 // базовый случай
  return nums[0] + sum(nums.slice(1))
}
```

### Генераторы: забыть про `done`

```typescript
// ❌ for...of с конечным генератором — нет проблем
// Но при ручном вызове .next() — опасность:
function* range(n: number): Generator<number> {
  for (let i = 0; i < n; i++) yield i
}

const gen = range(3)
gen.next() // { value: 0, done: false }
gen.next() // { value: 1, done: false }
gen.next() // { value: 2, done: false }
gen.next() // { value: undefined, done: true } ← value === undefined!

// ❌ Не проверяем done — получаем undefined
const values = [gen.next().value, gen.next().value, gen.next().value, gen.next().value]
// [0, 1, 2, undefined]

// ✅ Всегда проверяйте done или используйте for...of
for (const value of range(3)) {
  console.log(value) // 0, 1, 2
}
```

---

## Лучшие практики

**Пишите маленькие, однозадачные функции.** Функция, умещающаяся на экране, легче тестируется и понятнее называется.

**Предпочитайте pipe для цепочек.** Читается как алгоритм — слева направо, шаг за шагом.

**Делайте каррированными функции, которые будете использовать в map/filter.** `users.map(formatUser(locale))` читается лучше, чем `users.map(u => formatUser(u, locale))`.

**Используйте генераторы для больших коллекций.** Если обрабатываете потоки данных или знаете что нужна только часть коллекции — генераторы спасут память.

**Для рекурсии по деревьям — рекурсия.** Для больших плоских коллекций (N > 10 000) — цикл или трамплин.

**Не злоупотребляйте pointfree.** Это инструмент, а не стиль ради стиля. Если pointfree усложняет понимание — добавьте явный аргумент.
