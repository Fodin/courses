# 🔥 Уровень 4: Ключевое слово infer

## 🎯 Введение

Ключевое слово `infer` — один из самых мощных инструментов системы типов TypeScript. Оно позволяет **извлекать** (выводить) типы из других типов внутри условных выражений. Если conditional types — это `if/else` для типов, то `infer` — это «переменная», которую TypeScript заполняет автоматически.

Без `infer` многие задачи типизации были бы просто невозможны: извлечение типа возвращаемого значения функции, параметров, элементов массива, частей строковых типов.

## 🔥 Синтаксис infer

`infer` используется **только** внутри `extends` в условных типах:

```typescript
type MyType<T> = T extends SomePattern<infer U> ? U : FallbackType
```

Здесь `infer U` говорит TypeScript: «выведи тип, который стоит на месте `U`, и дай мне к нему доступ в true-ветке».

### Базовый пример

```typescript
// Извлечение типа элемента массива
type ArrayElement<T> = T extends (infer E)[] ? E : never

type A = ArrayElement<string[]>    // string
type B = ArrayElement<number[]>    // number
type C = ArrayElement<boolean>     // never — не массив
```

📌 Важно: `infer` может появляться только в true-ветке условного типа. Нельзя написать `infer` вне `extends ... ? ... : ...`.

## 🔥 Infer в возвращаемых типах функций

Самый классический пример — воссоздание встроенного `ReturnType<T>`:

```typescript
type MyReturnType<T extends (...args: unknown[]) => unknown> =
  T extends (...args: unknown[]) => infer R ? R : never

function getUser() {
  return { id: 1, name: 'Alice', active: true }
}

type User = MyReturnType<typeof getUser>
// { id: number; name: string; active: boolean }
```

### Unwrap промисов

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

type A = UnwrapPromise<Promise<string>>   // string
type B = UnwrapPromise<Promise<number[]>> // number[]
type C = UnwrapPromise<string>            // string (не промис — возвращаем как есть)
```

### Рекурсивный unwrap

```typescript
type DeepUnwrap<T> = T extends Promise<infer U> ? DeepUnwrap<U> : T

type D = DeepUnwrap<Promise<Promise<Promise<boolean>>>>  // boolean
```

💡 Встроенный `Awaited<T>` в TypeScript 4.5+ делает именно это.

## 🔥 Infer в параметрах функций

### Извлечение всех параметров

```typescript
type MyParameters<T> = T extends (...args: infer P) => unknown ? P : never

function createUser(name: string, age: number, active: boolean) {
  return { name, age, active }
}

type Params = MyParameters<typeof createUser>
// [name: string, age: number, active: boolean]
```

### Извлечение первого параметра

```typescript
type FirstParam<T> =
  T extends (first: infer P, ...rest: unknown[]) => unknown ? P : never

type F = FirstParam<typeof createUser>  // string
```

### Извлечение последнего параметра

```typescript
type LastParam<T> =
  T extends (...args: [...infer _, infer L]) => unknown ? L : never

type L = LastParam<typeof createUser>  // boolean
```

### Параметры конструктора

```typescript
type ConstructorParams<T> =
  T extends new (...args: infer P) => unknown ? P : never

class Database {
  constructor(host: string, port: number) {}
}

type DBParams = ConstructorParams<typeof Database>
// [host: string, port: number]
```

📌 Обратите внимание на `new` — конструкторы имеют сигнатуру `new (...args) => T`.

### Извлечение типа экземпляра

```typescript
type InstanceOf<T> = T extends new (...args: unknown[]) => infer I ? I : never

type DBInstance = InstanceOf<typeof Database>  // Database
```

## 🔥 Infer в шаблонных литеральных типах

Одна из самых мощных комбинаций — `infer` с template literal types. Это позволяет **парсить строковые типы** на уровне системы типов.

### Извлечение частей строки

```typescript
type ExtractDomain<T extends string> =
  T extends `${infer _User}@${infer Domain}` ? Domain : never

type D = ExtractDomain<'dev@example.com'>  // 'example.com'
```

### Парсинг параметров маршрута

```typescript
type ParseRoute<T extends string> =
  T extends `${infer _}:${infer Param}/${infer Rest}`
    ? Param | ParseRoute<`/${Rest}`>
    : T extends `${infer _}:${infer Param}`
      ? Param
      : never

type Params = ParseRoute<'/users/:userId/posts/:postId'>
// 'userId' | 'postId'
```

### Преобразование kebab-case в camelCase

```typescript
type KebabToCamel<S extends string> =
  S extends `${infer Head}-${infer Char}${infer Rest}`
    ? `${Head}${Uppercase<Char>}${KebabToCamel<Rest>}`
    : S

type Result = KebabToCamel<'background-color'>  // 'backgroundColor'
type Long = KebabToCamel<'border-top-left-radius'>  // 'borderTopLeftRadius'
```

### Разбиение строки по разделителю

```typescript
type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}`
    ? [Head, ...Split<Tail, D>]
    : [S]

type Parts = Split<'a.b.c', '.'>  // ['a', 'b', 'c']
type Words = Split<'hello world', ' '>  // ['hello', 'world']
```

### Парсинг query-параметров URL

```typescript
type ParseQueryKey<T extends string> =
  T extends `${infer Key}=${infer _}` ? Key : T

type ParseQuery<T extends string> =
  T extends `${infer Param}&${infer Rest}`
    ? ParseQueryKey<Param> | ParseQuery<Rest>
    : ParseQueryKey<T>

type Keys = ParseQuery<'page=1&limit=10&sort=name'>
// 'page' | 'limit' | 'sort'
```

## 🔥 Infer в кортежах (Tuples)

Кортежи — это массивы фиксированной длины с известными типами элементов. `infer` позволяет разбирать их поэлементно.

### Первый и последний элементы

```typescript
type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never
type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never

type H = Head<[string, number, boolean]>  // string
type L = Last<[string, number, boolean]>  // boolean
```

### Хвост кортежа

```typescript
type Tail<T extends unknown[]> = T extends [unknown, ...infer R] ? R : never

type T = Tail<[1, 2, 3, 4]>  // [2, 3, 4]
```

### Разворот кортежа

```typescript
type Reverse<T extends unknown[]> =
  T extends [infer H, ...infer R]
    ? [...Reverse<R>, H]
    : []

type Rev = Reverse<[1, 2, 3]>  // [3, 2, 1]
```

### Flatten одного уровня

```typescript
type FlattenOnce<T extends unknown[]> =
  T extends [infer H, ...infer R]
    ? H extends unknown[]
      ? [...H, ...FlattenOnce<R>]
      : [H, ...FlattenOnce<R>]
    : []

type Flat = FlattenOnce<[[1, 2], [3], [4, 5]]>  // [1, 2, 3, 4, 5]
```

### Zip двух кортежей

```typescript
type Zip<A extends unknown[], B extends unknown[]> =
  A extends [infer AH, ...infer AR]
    ? B extends [infer BH, ...infer BR]
      ? [[AH, BH], ...Zip<AR, BR>]
      : []
    : []

type Z = Zip<['a', 'b'], [1, 2]>  // [['a', 1], ['b', 2]]
```

## 🔥 Infer с ограничениями (TypeScript 4.7+)

Начиная с TypeScript 4.7, `infer` можно использовать с `extends`-ограничениями прямо в позиции `infer`:

```typescript
// Извлечь тип, но только если это строка
type FirstString<T> =
  T extends [infer S extends string, ...unknown[]] ? S : never

type A = FirstString<['hello', 42]>  // 'hello'
type B = FirstString<[42, 'hello']>  // never
```

Это значительно упрощает код, который раньше требовал вложенных условий:

```typescript
// ❌ До TypeScript 4.7 — вложенные условия
type GetString<T> = T extends [infer S, ...unknown[]]
  ? S extends string ? S : never
  : never

// ✅ TypeScript 4.7+ — ограничение прямо в infer
type GetString<T> = T extends [infer S extends string, ...unknown[]]
  ? S
  : never
```

## 🔥 Практические паттерны

### Типизация EventEmitter

```typescript
type EventMap = {
  click: [x: number, y: number]
  change: [value: string]
  submit: [data: FormData]
}

type EventHandler<T extends keyof EventMap> =
  EventMap[T] extends infer Args
    ? Args extends unknown[]
      ? (...args: Args) => void
      : never
    : never

// (x: number, y: number) => void
type ClickHandler = EventHandler<'click'>
```

### Типизация pipe-функции

```typescript
type PipeReturn<Fns extends ((...args: unknown[]) => unknown)[]> =
  Fns extends [...unknown[], (...args: unknown[]) => infer R]
    ? R
    : never
```

### Извлечение generic-параметра

```typescript
type ExtractGeneric<T> =
  T extends Map<infer K, infer V> ? { key: K; value: V } :
  T extends Set<infer E> ? { element: E } :
  T extends Promise<infer R> ? { result: R } :
  never

type MapInfo = ExtractGeneric<Map<string, number>>
// { key: string; value: number }
```

## ⚠️ Частые ошибки начинающих

### Ошибка 1: infer вне условного типа

```typescript
// ❌ Синтаксическая ошибка — infer только в extends
type Bad<T> = infer U

// ✅ Правильно — внутри условного типа
type Good<T> = T extends Array<infer U> ? U : never
```

### Ошибка 2: использование infer в false-ветке

```typescript
// ❌ U доступен только в true-ветке
type Wrong<T> = T extends Promise<infer U> ? string : U

// ✅ U используется в true-ветке
type Right<T> = T extends Promise<infer U> ? U : never
```

### Ошибка 3: infer с одинаковыми именами

```typescript
// ⚠️ Два infer с одним именем создают intersection
type Ambiguous<T> = T extends {
  a: infer U
  b: infer U
} ? U : never

type Result = Ambiguous<{ a: string; b: number }>
// string & number = never!
```

Когда один и тот же `infer U` встречается в **ковариантных** позициях — получается union. В **контравариантных** (параметры функций) — intersection.

```typescript
type CovariantInfer<T> = T extends {
  a: () => infer U
  b: () => infer U
} ? U : never

type R = CovariantInfer<{ a: () => string; b: () => number }>
// string | number  (union в ковариантной позиции)
```

### Ошибка 4: забыть distributive behavior

```typescript
type Unbox<T> = T extends Array<infer U> ? U : T

// Union распределяется!
type R = Unbox<string[] | number[]>
// string | number  (не (string | number)[])
```

### Ошибка 5: слишком жадный infer в строках

```typescript
// ⚠️ infer по умолчанию «жадный» — захватывает максимум
type GetFirst<S extends string> =
  S extends `${infer First}.${infer _Rest}` ? First : S

type A = GetFirst<'a.b.c'>  // 'a' — First останавливается на первой точке

// Но при вложенных шаблонах порядок infer важен!
type GetLast<S extends string> =
  S extends `${infer _}.${infer Rest}` ? GetLast<Rest> : S

type B = GetLast<'a.b.c'>  // 'c'
```

## 💡 Best practices

1. **Используйте встроенные utility types, когда возможно**: `ReturnType`, `Parameters`, `Awaited`, `InstanceType` — всё это использует `infer` под капотом

2. **Давайте infer-переменным понятные имена**: `infer R` для return, `infer P` для params, `infer E` для element

3. **Комбинируйте infer с generic constraints** (TS 4.7+) для раннего отсечения невалидных типов

4. **Помните о рекурсии**: `infer` в комбинации с рекурсивными типами может создавать мощные парсеры, но TypeScript ограничивает глубину рекурсии (обычно ~1000 уровней)

5. **Тестируйте edge cases**: пустые массивы, never, unknown, union-типы — все они могут вести себя неожиданно с `infer`

6. **Используйте `_` для неиспользуемых infer-переменных**: `infer _Start` вместо `infer Start`, если переменная не нужна в результате

## 📌 Резюме

| Паттерн | Пример | Результат |
|---------|--------|-----------|
| Return type | `T extends () => infer R` | Тип возвращаемого значения |
| Parameters | `T extends (...args: infer P) => any` | Кортеж параметров |
| Array element | `T extends (infer E)[]` | Тип элемента |
| Promise unwrap | `T extends Promise<infer U>` | Внутренний тип промиса |
| Template literal | `` T extends `${infer A}:${infer B}` `` | Части строкового типа |
| Tuple head | `T extends [infer H, ...any]` | Первый элемент кортежа |
| Tuple tail | `T extends [any, ...infer R]` | Остаток кортежа |
| Constructor | `T extends new (...args: infer P) => any` | Параметры конструктора |
| Constrained infer | `T extends [infer S extends string]` | С ограничением типа |

`infer` — это ключ к type-level программированию в TypeScript. Освоив его, вы сможете создавать типы, которые автоматически подстраиваются под структуру данных.
