# 🔥 Уровень 12: Продвинутые обобщённые типы

## 🎯 Зачем нужны продвинутые паттерны generics

На предыдущих уровнях мы изучили основы generics: constraints, inference, conditional types. Теперь переходим к паттернам, которые используются в продвинутых библиотеках: fp-ts, Effect, Zod, tRPC. Эти паттерны позволяют писать максимально абстрактный и переиспользуемый код с полной типобезопасностью.

---

## 📌 Higher-Kinded Types (Типы высшего порядка)

### Проблема

В Haskell, Scala и Rust можно абстрагироваться над конструкторами типов:

```haskell
-- Haskell: Functor работает с любым конструктором типа
class Functor f where
  fmap :: (a -> b) -> f a -> f b
```

В TypeScript нельзя написать:

```typescript
// ❌ TypeScript не поддерживает это
type Functor<F<_>> = {
  map: <A, B>(fa: F<A>, f: (a: A) => B) => F<B>
}
```

### Решение: URI-паттерн (дефункционализация)

Идея: вместо передачи конструктора типа напрямую, используем строковый URI как "ключ" в реестре:

```typescript
// Шаг 1: Реестр — отображает URI на конструктор типа
interface URItoKind<A> {
  Array: A[]
  Option: A | null
  Promise: Promise<A>
}

// Шаг 2: Тип-обёртка для обращения к реестру
type URIS = keyof URItoKind<unknown>
type Kind<F extends URIS, A> = URItoKind<A>[F]

// Kind<'Array', number> = number[]
// Kind<'Option', string> = string | null
// Kind<'Promise', boolean> = Promise<boolean>
```

### Functor через URI-паттерн

```typescript
// Шаг 3: Интерфейс Functor
interface Functor<F extends URIS> {
  readonly URI: F
  map: <A, B>(fa: Kind<F, A>, f: (a: A) => B) => Kind<F, B>
}

// Шаг 4: Реализации
const arrayFunctor: Functor<'Array'> = {
  URI: 'Array',
  map: (fa, f) => fa.map(f),
}

const optionFunctor: Functor<'Option'> = {
  URI: 'Option',
  map: (fa, f) => fa === null ? null : f(fa),
}
```

### Обобщённые функции

```typescript
// Функция, работающая с ЛЮБЫМ функтором
function doubleAll<F extends URIS>(
  F: Functor<F>,
  fa: Kind<F, number>
): Kind<F, number> {
  return F.map(fa, n => n * 2)
}

doubleAll(arrayFunctor, [1, 2, 3])     // [2, 4, 6]
doubleAll(optionFunctor, 5)             // 10
doubleAll(optionFunctor, null)           // null
```

### Расширение реестра через declaration merging

```typescript
// В модуле вашего типа:
declare module './hkt' {
  interface URItoKind<A> {
    Either: { _tag: 'Left'; error: Error } | { _tag: 'Right'; value: A }
  }
}

// Теперь 'Either' доступен во всех обобщённых функциях!
```

💡 Этот паттерн используется в **fp-ts** — самой популярной FP-библиотеке для TypeScript.

---

## 📌 Inference Tricks

### Trick 1: const T — сохранение литеральных типов

```typescript
// Без const: тип расширяется
function wrap<T extends string>(value: T): T { return value }
const status = wrap('active') // type: string (расширен!)

// ✅ С const: литеральный тип сохраняется
function narrow<const T extends string>(value: T): T { return value }
const status = narrow('active') // type: 'active'

// Работает и с массивами
function narrowArray<const T extends readonly string[]>(values: T): T {
  return values
}
const roles = narrowArray(['admin', 'user', 'guest'])
// type: readonly ['admin', 'user', 'guest']
```

📌 **Ключевое слово `const`** в generic-позиции заставляет TypeScript выводить самый узкий (литеральный) тип.

### Trick 2: NoInfer<T> — контроль точки вывода

```typescript
// Проблема: T выводится из обоих аргументов
function createAction<T extends string>(type: T, payload: T) {
  return { type, payload }
}
// createAction('reset', 'increment')
// T = 'reset' | 'increment' — объединение! Не то, что нужно

// ✅ NoInfer блокирует вывод из второй позиции
type NoInfer<T> = T extends infer U ? U : never

function createAction<T extends string>(
  type: T,
  payload: NoInfer<T> extends 'increment' ? number : string
) {
  return { type, payload }
}
```

📌 **NoInfer** (доступен нативно в TypeScript 5.4+) предотвращает вывод типа из определённой позиции.

### Trick 3: Distributive Object Types

Преобразование объектного типа в дискриминированное объединение:

```typescript
type EventMap = {
  click: { x: number; y: number }
  keydown: { key: string }
  scroll: { offset: number }
}

type DistributiveMap<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    key: K
    value: T[K]
    handler: (value: T[K]) => void
  }
}[keyof T]

type EventEntries = DistributiveMap<EventMap>
// | { key: 'click';   value: {x, y};      handler: (v: {x, y}) => void }
// | { key: 'keydown'; value: {key};        handler: (v: {key}) => void }
// | { key: 'scroll';  value: {offset};     handler: (v: {offset}) => void }
```

📌 **Паттерн**: `{ [K in keyof T]: F<K, T[K]> }[keyof T]` — сначала создаём mapped type, затем индексируем всеми ключами, получая union.

### Trick 4: Satisfies + вывод

```typescript
type Config = Record<string, { enabled: boolean; value: string | number }>

// satisfies проверяет форму, но сохраняет литеральные типы
const config = {
  debug: { enabled: true, value: 'verbose' },
  maxRetries: { enabled: false, value: 3 },
} satisfies Config

// config.debug.value → type: 'verbose' (не string!)
// config.maxRetries.value → type: 3 (не number!)
```

---

## 📌 Curried Generics

### Проблема: частичное применение generics

```typescript
// ❌ TypeScript не поддерживает частичное применение generics
type MapOf<K> = Map<K, _>  // Нельзя!
type StringMap = MapOf<string>  // Нельзя!
```

### Решение 1: Карринг через вложенные функции

```typescript
function mapOf<K>() {
  return function <V>(entries: [K, V][]): Map<K, V> {
    return new Map(entries)
  }
}

// Фиксируем K = string, V выводится позже
const stringMap = mapOf<string>()
const m = stringMap([['a', 1], ['b', 2]])  // Map<string, number>
```

### Решение 2: Builder с прогрессивным наращиванием типа

```typescript
class TypedBuilder<Schema extends Record<string, unknown> = Record<string, never>> {
  private data: Partial<Schema>

  constructor(data?: Partial<Schema>) {
    this.data = data ?? {}
  }

  field<K extends string, V>(
    key: K,
    value: V
  ): TypedBuilder<Schema & Record<K, V>> {
    return new TypedBuilder({
      ...this.data,
      [key]: value,
    } as Partial<Schema & Record<K, V>>)
  }

  build(): Schema {
    return this.data as Schema
  }
}

const config = new TypedBuilder()
  .field('host', 'localhost')   // TypedBuilder<{ host: string }>
  .field('port', 3000)          // TypedBuilder<{ host: string } & { port: number }>
  .field('debug', true)         // TypedBuilder<... & { debug: boolean }>
  .build()
// config: { host: string } & { port: number } & { debug: boolean }
```

### Решение 3: Каррированные валидаторы

```typescript
function validatorFor<T>() {
  return {
    field<K extends keyof T & string>(key: K) {
      return {
        check(predicate: (value: T[K]) => boolean) {
          return {
            key,
            validate(obj: T): boolean {
              return predicate(obj[key])
            },
          }
        },
      }
    },
  }
}

interface User { name: string; age: number }

const nameCheck = validatorFor<User>()
  .field('name')
  .check(name => name.length > 0)

nameCheck.validate({ name: 'Alice', age: 25 }) // true
```

### Решение 4: Каррированный Event Emitter

```typescript
function typedEmitter<Events extends Record<string, unknown>>() {
  const handlers = new Map<string, Array<(p: unknown) => void>>()

  return {
    on<K extends keyof Events & string>(
      event: K,
      handler: (payload: Events[K]) => void
    ) {
      const list = handlers.get(event) ?? []
      list.push(handler as (p: unknown) => void)
      handlers.set(event, list)
      return this
    },

    emit<K extends keyof Events & string>(event: K, payload: Events[K]) {
      (handlers.get(event) ?? []).forEach(h => h(payload))
    },
  }
}

interface AppEvents {
  login: { userId: string }
  logout: { reason: string }
}

const emitter = typedEmitter<AppEvents>()
emitter.on('login', p => console.log(p.userId))  // ✅ Autocomplete!
emitter.emit('login', { userId: 'u-42' })         // ✅ Type-safe!
emitter.emit('login', { reason: 'timeout' })       // ❌ Error!
```

---

## ⚠️ Частые ошибки новичков

### Ошибка 1: Попытка передать конструктор типа как generic

```typescript
// ❌ TypeScript не поддерживает HKTs напрямую
interface Functor<F<_>> { map: ... }

// ✅ Используйте URI-паттерн
interface Functor<F extends URIS> {
  map: <A, B>(fa: Kind<F, A>, f: (a: A) => B) => Kind<F, B>
}
```

### Ошибка 2: const T сужает слишком агрессивно

```typescript
// ❌ const делает массив readonly — может сломать сигнатуры
function process<const T extends string[]>(items: T) { /* ... */ }
// T = readonly ['a', 'b'] — не совместимо с string[]

// ✅ Используйте readonly в сигнатуре
function process<const T extends readonly string[]>(items: T) { /* ... */ }
```

### Ошибка 3: Builder без правильного наращивания типа

```typescript
// ❌ Тип не накапливается
class BadBuilder<T> {
  field<K extends string, V>(key: K, value: V): BadBuilder<T> {
    return this // Тип T не меняется!
  }
}

// ✅ Возвращаем новый тип с расширенным Schema
field<K, V>(key: K, value: V): TypedBuilder<Schema & Record<K, V>> {
  return new TypedBuilder(...)
}
```

### Ошибка 4: Забыть про declaration merging для URI

```typescript
// ❌ Добавление нового URI без merging
const myURI = 'MyType' // Просто строка, не в реестре

// ✅ Declaration merging добавляет в реестр
declare module './hkt' {
  interface URItoKind<A> {
    MyType: MyType<A>
  }
}
```

---

## 💡 Best Practices

1. **URI-паттерн для HKT** — используйте, когда нужно абстрагироваться над контейнерными типами (Array, Option, Either)
2. **const T** — используйте для API, которые должны сохранять точные литеральные типы (routers, config builders)
3. **Карринг generics** — используйте, когда один generic известен раньше другого
4. **TypedBuilder** — используйте для API с прогрессивным конфигурированием
5. **NoInfer** — используйте, когда вывод из нескольких позиций создаёт нежелательное объединение
6. **Distributive objects** — используйте для генерации дискриминированных объединений из объектных типов
