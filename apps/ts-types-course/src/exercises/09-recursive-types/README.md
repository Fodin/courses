# 🔥 Уровень 9: Рекурсивные типы

## 🎯 Введение

Рекурсивные типы — одна из самых мощных возможностей системы типов TypeScript. Тип называется **рекурсивным**, когда он ссылается на самого себя в своём определении. Это позволяет моделировать структуры произвольной глубины: деревья, JSON, связные списки, а также создавать продвинутые утилитарные типы вроде `DeepReadonly`, `DeepPartial`, и строковые трансформации.

Рекурсивные типы критически важны для:
- Моделирования вложенных данных (JSON, AST, DOM)
- Глубоких трансформаций объектов (`DeepReadonly`, `DeepPartial`)
- Манипуляций с template literal types (парсинг, CamelCase)
- Type-safe работы с dot-notation путями (`'server.host'`)

## 🔥 Рекурсивные структуры данных

### JSON Type

Классический пример рекурсивного типа — представление JSON:

```typescript
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]                    // массив JSON значений
  | { [key: string]: JsonValue }   // объект с JSON значениями

const data: JsonValue = {
  name: 'Alice',
  scores: [95, 87, 92],
  address: {
    city: 'Moscow',
    coords: { lat: 55.75, lng: 37.62 }  // сколько угодно уровней
  }
}
```

### Дерево (Tree)

```typescript
interface TreeNode<T> {
  value: T
  children: TreeNode<T>[]  // рекурсивная ссылка
}

const tree: TreeNode<string> = {
  value: 'root',
  children: [
    {
      value: 'child-1',
      children: [
        { value: 'grandchild', children: [] }
      ]
    },
    { value: 'child-2', children: [] }
  ]
}
```

### Связный список (Linked List)

```typescript
interface LinkedList<T> {
  value: T
  next: LinkedList<T> | null  // null — конец списка
}

const list: LinkedList<number> = {
  value: 1,
  next: { value: 2, next: { value: 3, next: null } }
}
```

### AST (Abstract Syntax Tree)

```typescript
type Expression =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'binary'; op: '+' | '-'; left: Expression; right: Expression }
  | { type: 'unary'; op: '-' | '!'; operand: Expression }

// 1 + 2 * 3
const expr: Expression = {
  type: 'binary',
  op: '+',
  left: { type: 'number', value: 1 },
  right: {
    type: 'binary',
    op: '*',
    left: { type: 'number', value: 2 },
    right: { type: 'number', value: 3 }
  }
}
```

## 🔥 Рекурсивные условные типы

### DeepReadonly

Рекурсивно делает **все вложенные свойства** `readonly`:

```typescript
type DeepReadonly<T> = T extends object
  ? T extends Function
    ? T  // функции не трогаем
    : { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T

interface Config {
  server: {
    host: string
    port: number
    ssl: { enabled: boolean }
  }
}

const config: DeepReadonly<Config> = {
  server: { host: 'localhost', port: 3000, ssl: { enabled: true } }
}

// config.server.ssl.enabled = false // ❌ Error: readonly
```

### DeepPartial

Рекурсивно делает **все вложенные свойства** optional:

```typescript
type DeepPartial<T> = T extends object
  ? T extends Function
    ? T
    : { [K in keyof T]?: DeepPartial<T[K]> }
  : T

// Можно указать только часть конфигурации
const update: DeepPartial<Config> = {
  server: { port: 8080 }  // host и ssl не нужны
}
```

### DeepRequired

Рекурсивно убирает **все optional модификаторы**:

```typescript
type DeepRequired<T> = T extends object
  ? T extends Function
    ? T
    : { [K in keyof T]-?: DeepRequired<T[K]> }
  : T
```

### DeepAwaited — разворачивание Promise

```typescript
type DeepAwaited<T> = T extends Promise<infer U>
  ? DeepAwaited<U>  // рекурсивно разворачиваем Promise
  : T extends object
    ? { [K in keyof T]: DeepAwaited<T[K]> }
    : T

type Result = DeepAwaited<Promise<Promise<string>>>  // string

type AsyncData = {
  user: Promise<{ name: string; age: Promise<number> }>
}
type SyncData = DeepAwaited<AsyncData>
// { user: { name: string; age: number } }
```

### Flatten — уплощение вложенных массивов

```typescript
type Flatten<T> = T extends Array<infer U>
  ? Flatten<U>
  : T

type Deep = number[][][]
type Flat = Flatten<Deep>  // number
```

### DeepNullable

```typescript
type DeepNullable<T> = T extends object
  ? T extends Function
    ? T
    : { [K in keyof T]: DeepNullable<T[K]> | null }
  : T | null
```

## 🔥 Рекурсивные строковые типы

### Split — разбиение строки

```typescript
type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}`
    ? [Head, ...Split<Tail, D>]
    : S extends ''
      ? []
      : [S]

type Parts = Split<'a.b.c', '.'>  // ['a', 'b', 'c']
```

### Join — объединение tuple в строку

```typescript
type Join<T extends string[], D extends string> =
  T extends []
    ? ''
    : T extends [infer H extends string]
      ? H
      : T extends [infer H extends string, ...infer Rest extends string[]]
        ? `${H}${D}${Join<Rest, D>}`
        : string

type Joined = Join<['a', 'b', 'c'], '-'>  // 'a-b-c'
```

### ReplaceAll — замена всех вхождений

```typescript
type ReplaceAll<S extends string, From extends string, To extends string> =
  From extends ''
    ? S
    : S extends `${infer Head}${From}${infer Tail}`
      ? `${Head}${To}${ReplaceAll<Tail, From, To>}`
      : S

type Result = ReplaceAll<'hello world hello', 'hello', 'hi'>
// 'hi world hi'
```

### CamelCase — из snake_case

```typescript
type CamelCase<S extends string> =
  S extends `${infer Head}_${infer Char}${infer Tail}`
    ? `${Lowercase<Head>}${Uppercase<Char>}${CamelCase<Tail>}`
    : Lowercase<S>

type CC = CamelCase<'user_first_name'>  // 'userFirstName'
```

### KebabCase — из camelCase

```typescript
type KebabCase<S extends string> =
  S extends `${infer H}${infer T}`
    ? T extends Uncapitalize<T>
      ? `${Lowercase<H>}${KebabCase<T>}`
      : `${Lowercase<H>}-${KebabCase<T>}`
    : S

type KB = KebabCase<'helloWorld'>  // 'hello-world'
```

### Dot-Notation Paths

```typescript
type PathKeys<T> =
  T extends object
    ? {
        [K in keyof T & string]: K | `${K}.${PathKeys<T[K]>}`
      }[keyof T & string]
    : never

interface Config {
  server: { host: string; port: number }
  db: { url: string }
}

type Paths = PathKeys<Config>
// 'server' | 'server.host' | 'server.port' | 'db' | 'db.url'
```

## 🔥 Лимиты рекурсии и оптимизация

### Лимиты TypeScript

TypeScript имеет **ограничение глубины рекурсии** для предотвращения бесконечных циклов:

- Условные типы: ~50 уровней
- Type instantiation: ~50 уровней
- Ошибка: `Type instantiation is excessively deep and possibly infinite`

### Tail-Recursive Optimization (TypeScript 4.5+)

TypeScript 4.5 добавил оптимизацию **хвостовой рекурсии** для условных типов. Тип считается хвосто-рекурсивным, если рекурсивный вызов находится в **последней позиции**:

```typescript
// ❌ НЕ хвостовая рекурсия — рекурсия внутри spread
type NaiveReverse<T extends unknown[]> =
  T extends [infer H, ...infer Rest]
    ? [...NaiveReverse<Rest>, H]  // рекурсия НЕ в последней позиции
    : []

// ✅ Хвостовая рекурсия — с аккумулятором
type Reverse<T extends unknown[], Acc extends unknown[] = []> =
  T extends [infer H, ...infer Rest]
    ? Reverse<Rest, [H, ...Acc]>  // рекурсия в последней позиции
    : Acc
```

С tail recursion optimization `Reverse` работает для массивов из **1000+ элементов**, тогда как `NaiveReverse` падает на ~45.

### Паттерн: аккумулятор

```typescript
// BuildTuple — создаёт tuple заданной длины
type BuildTuple<N extends number, Acc extends unknown[] = []> =
  Acc['length'] extends N
    ? Acc
    : BuildTuple<N, [...Acc, unknown]>

type T100 = BuildTuple<100>  // tuple из 100 элементов — работает!
```

### Паттерн: depth limiter

Для предотвращения бесконечной рекурсии можно добавить счётчик глубины:

```typescript
type MaxDepth = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

type SafeDeepReadonly<T, D extends number = 10> =
  [D] extends [never]
    ? T  // достигли лимита
    : T extends object
      ? T extends Function
        ? T
        : { readonly [K in keyof T]: SafeDeepReadonly<T[K], MaxDepth[D]> }
      : T
```

`MaxDepth[D]` декрементирует счётчик: `MaxDepth[10]` = 9, `MaxDepth[1]` = 0, `MaxDepth[0]` = never.

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Забыли base case

```typescript
// ❌ Бесконечная рекурсия — нет условия остановки
type Infinite<T> = { value: Infinite<T> }

// ✅ Есть base case
type Finite<T> = { value: T } | { value: Finite<T> }
```

### Ошибка 2: Не исключают Function из рекурсии по объекту

```typescript
// ❌ Function тоже object — будет попытка рекурсии по свойствам Function
type BadDeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: BadDeepReadonly<T[K]> }
  : T

// ✅ Исключаем Function
type GoodDeepReadonly<T> = T extends object
  ? T extends Function
    ? T
    : { readonly [K in keyof T]: GoodDeepReadonly<T[K]> }
  : T
```

### Ошибка 3: Не хвостовая рекурсия для больших данных

```typescript
// ❌ Достигает лимита на ~45 элементах
type NaiveLength<T extends unknown[]> =
  T extends [infer _, ...infer Rest]
    ? 1 + NaiveLength<Rest>  // НЕ хвостовая
    : 0

// ✅ Хвостовая рекурсия с аккумулятором
type Length<T extends unknown[], Acc extends unknown[] = []> =
  T extends [infer _, ...infer Rest]
    ? Length<Rest, [...Acc, unknown]>
    : Acc['length']
```

### Ошибка 4: Забыли обработать пустую строку в Split

```typescript
// ❌ Split<'', '.'> вернёт [''] вместо []
type BadSplit<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}` ? [H, ...BadSplit<T, D>] : [S]

// ✅ Обрабатываем пустую строку
type GoodSplit<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}`
    ? [H, ...GoodSplit<T, D>]
    : S extends '' ? [] : [S]
```

## 📌 Итоги

| Техника | Применение | Пример |
|---------|-----------|--------|
| Рекурсивные интерфейсы | Деревья, JSON, AST | `TreeNode<T>` |
| DeepReadonly/Partial | Глубокие трансформации | `DeepReadonly<Config>` |
| Строковая рекурсия | Парсинг, CamelCase | `Split<S, D>` |
| Tail recursion | Большие данные (1000+) | `BuildTuple<N>` |
| Depth limiter | Защита от бесконечности | `SafeDeep<T, D>` |

💡 **Ключевые принципы**:
1. Всегда определяйте base case (условие остановки)
2. Исключайте Function из рекурсии по объектам
3. Используйте аккумулятор для хвостовой рекурсии
4. Добавляйте depth limiter для production-кода
5. Тестируйте с реалистичными размерами данных
