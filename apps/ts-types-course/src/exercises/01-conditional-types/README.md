# 🔥 Уровень 1: Условные типы (Conditional Types)

## 🎯 Что такое условные типы

Условные типы -- это механизм TypeScript для создания типов, которые **зависят от условия**. Они работают аналогично тернарному оператору в JavaScript, но на уровне системы типов:

```typescript
type Result = T extends U ? X : Y
//   Если T совместим с U → X, иначе → Y
```

Это одна из самых мощных возможностей TypeScript, позволяющая создавать **вычисляемые типы** -- типы, которые определяются на основе других типов.

---

## 📌 Базовые условные типы

### Простая проверка типа

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<'hello'>   // true
type B = IsString<42>        // false
type C = IsString<string>    // true
```

### Проверка на массив

```typescript
type IsArray<T> = T extends unknown[] ? true : false

type A = IsArray<number[]>    // true
type B = IsArray<string>      // false
type C = IsArray<[1, 2, 3]>  // true (tuple extends unknown[])
```

### Извлечение типа с infer

Ключевое слово `infer` позволяет **объявить переменную типа** внутри условного выражения и использовать её в true-ветке:

```typescript
// Извлечь тип возвращаемого значения функции
type ReturnOf<T> = T extends (...args: any[]) => infer R ? R : never

type A = ReturnOf<() => string>           // string
type B = ReturnOf<(x: number) => boolean> // boolean
type C = ReturnOf<string>                 // never (не функция)
```

```typescript
// Извлечь тип элемента массива
type ElementOf<T> = T extends (infer E)[] ? E : T

type A = ElementOf<string[]>   // string
type B = ElementOf<number[]>   // number
type C = ElementOf<boolean>    // boolean (не массив — возвращаем как есть)
```

```typescript
// Извлечь тип из Promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

type A = UnwrapPromise<Promise<string>>  // string
type B = UnwrapPromise<number>           // number
```

---

## 📌 Дистрибутивные условные типы

Это одна из самых контринтуитивных особенностей TypeScript. Когда условный тип применяется к **naked type parameter** (не обёрнутому в другой тип), он **распределяется** по union:

```typescript
type ToArray<T> = T extends unknown ? T[] : never

// Naked type parameter T — распределение по union:
type Result = ToArray<string | number>
// = ToArray<string> | ToArray<number>
// = string[] | number[]
// НЕ (string | number)[]!
```

### Как это работает пошагово

```
ToArray<string | number>

Шаг 1: Распределить union
  = ToArray<string> | ToArray<number>

Шаг 2: Применить conditional к каждому члену
  = (string extends unknown ? string[] : never) | (number extends unknown ? number[] : never)

Шаг 3: Упростить
  = string[] | number[]
```

### Предотвращение дистрибутивности

Обернув `T` в tuple `[T]`, мы предотвращаем распределение:

```typescript
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never

type Result = ToArrayNonDist<string | number>
// = (string | number)[]
// Один массив, содержащий string | number
```

### Практическое применение: Extract и Exclude

Стандартные утилитные типы `Extract` и `Exclude` работают именно благодаря дистрибутивности:

```typescript
// Оставить только члены union, совместимые с U
type MyExtract<T, U> = T extends U ? T : never

type A = MyExtract<string | number | boolean, string | number>
// = string | number

// Исключить члены union, совместимые с U
type MyExclude<T, U> = T extends U ? never : T

type B = MyExclude<string | number | boolean, boolean>
// = string | number
```

### never и дистрибутивность

`never` -- это пустой union (union с нулём членов). Дистрибутивный conditional по `never` всегда возвращает `never`:

```typescript
// ❌ Не работает для never!
type BadIsNever<T> = T extends never ? true : false
type Test = BadIsNever<never> // never (не true!)

// ✅ Оборачиваем в tuple
type IsNever<T> = [T] extends [never] ? true : false
type Test = IsNever<never> // true
```

---

## 📌 Вложенные условные типы

Условные типы можно вкладывать друг в друга для создания многоуровневого ветвления:

```typescript
type TypeName<T> =
  T extends string ? 'string' :
  T extends number ? 'number' :
  T extends boolean ? 'boolean' :
  T extends undefined ? 'undefined' :
  T extends null ? 'null' :
  T extends unknown[] ? 'array' :
  T extends (...args: any[]) => any ? 'function' :
  'object'

type A = TypeName<'hello'>     // 'string'
type B = TypeName<42>          // 'number'
type C = TypeName<number[]>    // 'array'
type D = TypeName<() => void>  // 'function'
```

### Рекурсивное разворачивание

```typescript
type DeepUnwrap<T> =
  T extends Promise<infer U> ? DeepUnwrap<U> :
  T extends Array<infer E> ? DeepUnwrap<E> :
  T extends Set<infer S> ? DeepUnwrap<S> :
  T extends Map<any, infer V> ? DeepUnwrap<V> :
  T

type A = DeepUnwrap<Promise<string>>           // string
type B = DeepUnwrap<Promise<number[]>>         // number
type C = DeepUnwrap<Set<Map<string, boolean>>> // boolean
```

### Условный возврат в функциях

```typescript
type HttpMethod = 'GET' | 'POST' | 'DELETE'

type ResponseType<M extends HttpMethod> =
  M extends 'GET' ? { data: unknown; cached: boolean } :
  M extends 'POST' ? { data: unknown; id: string } :
  M extends 'DELETE' ? { success: boolean } :
  never
```

---

## 📌 Условные типы с Generics

Комбинация условных типов и generics позволяет создавать мощные утилитные типы:

### Извлечение ключей по типу значения

```typescript
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]

interface Service {
  name: string
  version: number
  login: (user: string) => boolean
  logout: () => void
}

type FK = FunctionKeys<Service>  // 'login' | 'logout'
```

### Условные типы для формирования API

```typescript
type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

interface Config {
  host?: string
  port?: number
  debug?: boolean
}

type ProductionConfig = MakeRequired<Config, 'host' | 'port'>
// { host: string; port: number; debug?: boolean }
```

---

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Забывают про дистрибутивность

```typescript
// ❌ Ожидают (string | number)[], получают string[] | number[]
type ToArray<T> = T extends any ? T[] : never
type Result = ToArray<string | number>  // string[] | number[]

// ✅ Если нужен один массив — оберните в tuple
type ToArray<T> = [T] extends [any] ? T[] : never
type Result = ToArray<string | number>  // (string | number)[]
```

### Ошибка 2: Проверка на never без обёртки

```typescript
// ❌ Всегда возвращает never для never
type Bad<T> = T extends never ? 'empty' : 'not empty'
type Test = Bad<never>  // never

// ✅ Оборачиваем в tuple
type Good<T> = [T] extends [never] ? 'empty' : 'not empty'
type Test = Good<never>  // 'empty'
```

### Ошибка 3: infer в неправильной позиции

```typescript
// ❌ infer можно использовать ТОЛЬКО в extends-части условного типа
type Bad<T> = T extends infer U ? U : never  // Работает, но бесполезно
type AlsoBad = infer U  // ❌ Ошибка: infer вне conditional type

// ✅ infer в осмысленной позиции
type Good<T> = T extends Promise<infer U> ? U : T
```

### Ошибка 4: Слишком глубокая вложенность

```typescript
// ❌ Трудно читать и поддерживать
type Complex<T> =
  T extends string ? T extends `${infer A}.${infer B}` ?
    A extends `${infer C}-${infer D}` ? [C, D, B] : [A, B]
  : [T] : never

// ✅ Разбейте на промежуточные типы
type SplitDot<T extends string> = T extends `${infer A}.${infer B}` ? [A, B] : [T]
type SplitDash<T extends string> = T extends `${infer A}-${infer B}` ? [A, B] : [T]
```

---

## 💡 Best Practices

1. **Разбивайте сложные условные типы** на промежуточные типы с понятными именами.

2. **Помните о дистрибутивности** каждый раз, когда conditional type получает union. Если не хотите распределения -- оборачивайте в `[T]`.

3. **Используйте never как fallback** в conditional types для обозначения невозможных комбинаций.

4. **Тестируйте с edge-cases:** `never`, `any`, `unknown`, пустые union, вложенные generic-и.

5. **Ограничивайте глубину рекурсии.** TypeScript имеет лимит (~50 уровней). Для глубокой рекурсии используйте хвостовые conditional types (tail-call optimization доступна с TS 4.5+).

6. **Документируйте сложные conditional types** комментариями с примерами входа/выхода.
