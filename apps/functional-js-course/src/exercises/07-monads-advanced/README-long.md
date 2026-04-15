# Монады: продвинуто — углублённая теория

## IO в Haskell и зачем это нужно в JS

В Haskell вся программа — одна большая `IO`-монада. Тип `main :: IO ()` говорит: "эта функция описывает последовательность IO-действий, которые выполнит рантайм". Чистый код возвращает значения; IO-код возвращает **описания действий**. Рантайм сам решает, когда и как их выполнять.

В JavaScript всё наоборот: большинство функций выполняют эффекты немедленно и неявно. IO-монада привносит дисциплину: код, работающий с внешним миром, явно помечается типом и откладывается до явного запуска.

```ts
// Haskell (для иллюстрации)
readConfig :: IO Config
connectDB  :: Config -> IO Connection
queryUsers :: Connection -> IO [User]

main :: IO ()
main = readConfig >>= connectDB >>= queryUsers >>= print

// JavaScript с IO-монадой
const pipeline: IO<string> = readConfig
  .flatMap(connectDB)
  .flatMap(queryUsers)
  .flatMap(formatReport)

// В точке входа приложения — единственный run()
pipeline.run()
```

Граница между "чистым" и "нечистым" кодом становится явной в типах.

---

## Lazy vs Eager evaluation

**Eager (энергичное) вычисление** — результат вычисляется немедленно при создании:

```ts
const result = computeExpensiveValue() // вычислилось прямо здесь
const promise = fetch('/api')          // HTTP-запрос пошёл прямо здесь
```

**Lazy (ленивое) вычисление** — вычисление откладывается до явного запроса:

```ts
const io     = new IO(() => computeExpensiveValue()) // ничего не вычислено
const task   = new Task(() => fetch('/api'))          // HTTP-запрос не пошёл

// Только здесь:
io.run()
task.run()
```

Ленивость даёт несколько преимуществ:

1. **Переиспользование**: один Task можно запустить много раз, получив свежий результат каждый раз
2. **Отложенное выполнение**: можно собрать сложный пайплайн, не запуская его
3. **Тестируемость**: легко подменить `run()` — вместо реального HTTP можно передать мок
4. **Параллелизм**: `Task.parallel` запускает все Task одновременно, тогда как с Promise это невозможно сделать отложенно

---

## Task vs Promise: подробное сравнение

Promise был разработан для удобства работы с асинхронностью, но "энергичность" заложена в его спецификацию:

```ts
// Promise — энергичный: запрос пошёл при вызове конструктора
const p = new Promise((resolve) => {
  console.log('запрос пошёл!')    // выполняется немедленно
  setTimeout(() => resolve(42), 1000)
})

// Task — ленивый: ничего не произошло
const t = new Task(() => new Promise((resolve) => {
  console.log('запрос пошёл!')    // выполняется только в t.run()
  setTimeout(() => resolve(42), 1000)
}))

t.run()  // только сейчас появится лог
t.run()  // и ещё раз — новый Promise, новый запрос
```

Разница проявляется при параллельном выполнении:

```ts
// Promise: нельзя "подождать" с запуском
const [a, b] = await Promise.all([fetch('/a'), fetch('/b')])
// Оба запроса пошли сразу при передаче в Promise.all — это нормально,
// но невозможно отложить оба и запустить позже как единицу

// Task: параллельный Task создаётся лениво
const parallelTask = Task.parallel([fetchA, fetchB])
// Запросы не пошли!
const [a, b] = await parallelTask.run()  // только сейчас — оба одновременно
```

---

## Do-нотация в Haskell vs генераторы в JS

В Haskell Do-нотация — встроенный синтаксический сахар для `>>=` (bind / flatMap):

```haskell
-- Haskell: do-нотация
parseConfig :: Input -> Either String Config
parseConfig input = do
  host   <- parseHost   (inputHost input)    -- yield
  port   <- parsePort   (inputPort input)
  dbName <- parseDbName (inputDbName input)
  return Config { host, port, dbName }       -- Right

-- Эквивалент без do-нотации
parseConfig input =
  parseHost (inputHost input) >>= \host ->
  parsePort (inputPort input) >>= \port ->
  parseDbName (inputDbName input) >>= \dbName ->
  Right $ Config { host, port, dbName }
```

В JavaScript генераторы позволяют реализовать то же самое:

```ts
// JS: Do через генераторы
function parseConfig(input: Input): Either<string, Config> {
  return Do(function* () {
    const host   = yield parseHost(input.host)    // ← как <- в Haskell
    const port   = yield parsePort(input.port)
    const dbName = yield parseDbName(input.dbName)
    return { host, port, dbName }                  // ← как return в Haskell
  })
}
```

Механика `Do`:

```
1. Создаём генератор
2. Вызываем iterator.next() — генератор выполняется до первого yield
3. yield возвращает Either наружу в Do
4. Do проверяет: если Left — немедленно возвращает Left (short-circuit)
5. Если Right — передаём распакованное значение обратно в генератор через iterator.next(value)
6. Генератор "видит" распакованное значение как результат yield
7. Повторяем до конца генератора
8. return генератора оборачиваем в Right
```

---

## async/await как встроенная Do-нотация для Promise

Это не просто аналогия — это буквально та же идея, только вшитая в спецификацию языка:

```ts
// async/await — Do-нотация для Promise
async function getData(): Promise<Result> {
  const users    = await fetchUsers()     // yield + unwrap Promise
  const products = await fetchProducts()
  return { users, products }              // автоматически Promise.resolve({...})
}

// Эквивалент с Do и Task
function getData(): Task<Result> {
  return Do(function* () {
    const users    = yield fetchUsersTask    // yield + unwrap Task
    const products = yield fetchProductsTask
    return { users, products }
  })
}
```

Когда Promise отклоняется, `await` прерывает выполнение async-функции — точно так же, как `Left` прерывает генератор в `Do`. Оба механизма реализуют **short-circuit**: при первой ошибке дальнейшее выполнение пропускается.

---

## Законы монад применительно к IO и Task

Монадические законы, проверенные на IO:

```ts
// 1. Left identity: IO.of(x).flatMap(f) ≡ f(x)
IO.of(42).flatMap(x => IO.of(x * 2))  // IO<84>
new IO(() => 42 * 2)                   // IO<84> — то же самое

// 2. Right identity: m.flatMap(IO.of) ≡ m
readConfig.flatMap(IO.of)  // ≡ readConfig

// 3. Associativity: (m.flatMap(f)).flatMap(g) ≡ m.flatMap(x => f(x).flatMap(g))
readConfig
  .flatMap(connectDB)
  .flatMap(queryUsers)
// ≡
readConfig.flatMap(config => connectDB(config).flatMap(queryUsers))
```

Ассоциативность означает: не важно, как вы группируете шаги — результат одинаков. Это позволяет безопасно рефакторить цепочки.

---

## Практические паттерны

### Внедрение зависимостей через IO

```ts
// Вместо глобальных объектов — IO с конфигом
const createApp = (config: Config) => {
  const readConfig  = IO.of(config)
  const connectDB   = (cfg: Config) => new IO(() => db.connect(cfg.dbUrl))
  const startServer = (conn: Connection) => new IO(() => http.listen(conn, cfg.port))

  return readConfig.flatMap(connectDB).flatMap(startServer)
}

// Тест: подменяем IO на мок
const testApp = createApp(mockConfig)
testApp.run()  // тест
```

### Retry через Task

```ts
function withRetry<T>(task: Task<T>, attempts: number): Task<T> {
  return new Task(async () => {
    for (let i = 0; i < attempts; i++) {
      try {
        return await task.run()
      } catch (e) {
        if (i === attempts - 1) throw e
        await new Promise(r => setTimeout(r, 1000 * (i + 1)))  // exponential backoff
      }
    }
    throw new Error('unreachable')
  })
}
```

### Timeout через Task

```ts
function withTimeout<T>(task: Task<T>, ms: number): Task<T> {
  return new Task(() =>
    Promise.race([
      task.run(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
      ),
    ])
  )
}
```

---

## Почему это важно для архитектуры

Без IO/Task побочные эффекты разбросаны по всему коду — тестировать сложно, предсказывать поведение тяжело. С IO/Task:

```
Чистый код            IO/Task граница        Внешний мир
─────────────────────────────────────────────────────────
  parse(input)    │   new IO(() => ...)  │   console.log
  validate(data)  │   new Task(() => ..) │   fetch('/api')
  transform(x)    │   pipeline.run()     │   db.query()
─────────────────────────────────────────────────────────
  Легко тестировать     Единая точка         Изолирован
                        запуска эффектов
```

Эта архитектура называется **functional core, imperative shell** — чистое ядро, нечистая оболочка.
