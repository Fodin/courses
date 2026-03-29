# 🔥 Уровень 10: Type-Level Programming

## 🎯 Зачем нужно программирование на уровне типов

Type-level programming -- это написание алгоритмов, которые выполняются **компилятором**, а не рантаймом. Результат вычислений -- это типы, а не значения. Это позволяет обнаруживать целые классы ошибок на этапе компиляции, ещё до запуска программы.

### Проблема без type-level вычислений

```typescript
// ❌ Без type-level programming: ошибки обнаруживаются в runtime
function getElement(tuple: unknown[], index: number): unknown {
  return tuple[index] // Может вернуть undefined
}

const result = getElement([1, 'hello', true], 5) // Нет ошибки компиляции
console.log(result.toString()) // 💥 Runtime error!
```

### Решение с type-level programming

```typescript
// ✅ С type-level programming: ошибки обнаруживаются при компиляции
type NthElement<T extends unknown[], N extends number> =
  T[N] extends undefined ? never : T[N]

// Компилятор знает точные типы каждого элемента кортежа
type First = [1, 'hello', true][0]  // 1
type Second = [1, 'hello', true][1] // 'hello'
```

---

## 📌 Кортежи как числа: арифметика Пеано

Основа type-level арифметики -- представление чисел как **длин кортежей** (tuple types). Это аналог чисел Пеано в теории типов.

### BuildTuple -- создание кортежа заданной длины

```typescript
type BuildTuple<N extends number, T extends unknown[] = []> =
  T['length'] extends N ? T : BuildTuple<N, [...T, unknown]>

type Three = BuildTuple<3>  // [unknown, unknown, unknown]
type Zero = BuildTuple<0>   // []
```

💡 **Как это работает**: рекурсивно добавляем элементы в кортеж, пока его длина не станет равна N.

### Add -- сложение

```typescript
type Add<A extends number, B extends number> =
  [...BuildTuple<A>, ...BuildTuple<B>]['length'] extends infer R extends number
    ? R
    : never

type Seven = Add<3, 4>     // 7
type Twenty = Add<10, 10>  // 20
```

📌 **Принцип**: конкатенируем два кортежа и берём длину результата.

### Subtract -- вычитание

```typescript
type Subtract<A extends number, B extends number> =
  BuildTuple<A> extends [...BuildTuple<B>, ...infer Rest]
    ? Rest['length']
    : never

type Four = Subtract<7, 3>  // 4
type Zero = Subtract<5, 5>  // 0
```

📌 **Принцип**: деструктурируем кортеж длины A, "отрезая" B элементов с начала. Длина остатка -- результат.

### Multiply -- умножение

```typescript
type Multiply<A extends number, B extends number, Acc extends unknown[] = []> =
  B extends 0
    ? Acc['length']
    : Multiply<A, Subtract<B, 1> & number, [...Acc, ...BuildTuple<A>]>

type Twelve = Multiply<3, 4>   // 12
type TwentyFive = Multiply<5, 5> // 25
```

📌 **Принцип**: рекурсивно добавляем кортеж длины A в аккумулятор B раз.

### Сравнение чисел

```typescript
type IsGreater<A extends number, B extends number> =
  BuildTuple<A> extends [...BuildTuple<B>, ...infer Rest]
    ? Rest extends [unknown, ...unknown[]]
      ? true
      : false
    : false

type Yes = IsGreater<5, 3>  // true
type No = IsGreater<2, 7>   // false
```

---

## 📌 Type-Level коллекции

### Map -- преобразование каждого элемента кортежа

```typescript
// "Функторы" для type-level map
type ToStringF = { type: 'toString' }
type WrapArrayF = { type: 'wrapArray' }

type ApplyF<T, F> =
  F extends ToStringF ? `${T & (string | number | boolean)}`
  : F extends WrapArrayF ? T[]
  : never

type TupleMap<T extends unknown[], F> =
  T extends [infer Head, ...infer Tail]
    ? [ApplyF<Head, F>, ...TupleMap<Tail, F>]
    : []

type Result = TupleMap<[1, 2, 3], ToStringF>  // ["1", "2", "3"]
```

### Filter -- фильтрация элементов кортежа

```typescript
type TupleFilter<T extends unknown[], Predicate> =
  T extends [infer Head, ...infer Tail]
    ? Head extends Predicate
      ? [Head, ...TupleFilter<Tail, Predicate>]
      : TupleFilter<Tail, Predicate>
    : []

type OnlyStrings = TupleFilter<[1, 'a', 2, 'b', true], string>
// ['a', 'b']
```

### Reduce -- свёртка кортежа (Flatten)

```typescript
type TupleReduce<T extends unknown[], Acc extends unknown[] = []> =
  T extends [infer Head, ...infer Tail]
    ? Head extends unknown[]
      ? TupleReduce<Tail, [...Acc, ...Head]>
      : TupleReduce<Tail, [...Acc, Head]>
    : Acc

type Flattened = TupleReduce<[[1, 2], [3, 4], [5]]>
// [1, 2, 3, 4, 5]
```

---

## 📌 Type-Level строковые операции

Template literal types позволяют манипулировать строками на уровне типов.

### Split

```typescript
type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}`
    ? [Head, ...Split<Tail, D>]
    : S extends ''
      ? []
      : [S]

type Parts = Split<'a-b-c', '-'>  // ['a', 'b', 'c']
```

### Join

```typescript
type Join<T extends string[], D extends string> =
  T extends []
    ? ''
    : T extends [infer H extends string]
      ? H
      : T extends [infer H extends string, ...infer R extends string[]]
        ? `${H}${D}${Join<R, D>}`
        : never

type Joined = Join<['hello', 'world'], '-'>  // 'hello-world'
```

### Replace и ReplaceAll

```typescript
type Replace<S extends string, From extends string, To extends string> =
  From extends ''
    ? S
    : S extends `${infer Before}${From}${infer After}`
      ? `${Before}${To}${After}`
      : S

type ReplaceAll<S extends string, From extends string, To extends string> =
  From extends ''
    ? S
    : S extends `${infer Before}${From}${infer After}`
      ? ReplaceAll<`${Before}${To}${After}`, From, To>
      : S

type R1 = Replace<'hello world', 'world', 'TS'>     // 'hello TS'
type R2 = ReplaceAll<'a-b-c', '-', '_'>              // 'a_b_c'
```

### Trim

```typescript
type Whitespace = ' ' | '\t' | '\n'

type TrimLeft<S extends string> =
  S extends `${Whitespace}${infer Rest}` ? TrimLeft<Rest> : S

type TrimRight<S extends string> =
  S extends `${infer Rest}${Whitespace}` ? TrimRight<Rest> : S

type Trim<S extends string> = TrimLeft<TrimRight<S>>

type Trimmed = Trim<'  hello  '>  // 'hello'
```

---

## 📌 Type-Level Pattern Matching

Паттерн-матчинг на уровне типов через conditional types и template literal inference:

### Извлечение структуры из строки

```typescript
type ExtractRoute<S extends string> =
  S extends `/${infer Resource}/${infer Id}/${infer Action}`
    ? { resource: Resource; id: Id; action: Action }
    : S extends `/${infer Resource}/${infer Id}`
      ? { resource: Resource; id: Id }
      : S extends `/${infer Resource}`
        ? { resource: Resource }
        : never

type R = ExtractRoute<'/users/123/edit'>
// { resource: 'users'; id: '123'; action: 'edit' }
```

### Обобщённый Match

```typescript
type _ = { __brand: 'wildcard' }
type PatternCase<P, R> = { pattern: P; result: R }

type Match<Value, Cases extends PatternCase<unknown, unknown>[]> =
  Cases extends [infer Head extends PatternCase<unknown, unknown>, ...infer Tail extends PatternCase<unknown, unknown>[]]
    ? Value extends Head['pattern']
      ? Head['result']
      : Head['pattern'] extends _
        ? Head['result']
        : Match<Value, Tail>
    : never

type Status = Match<404, [
  PatternCase<200, 'OK'>,
  PatternCase<404, 'Not Found'>,
  PatternCase<_, 'Unknown'>,
]>  // 'Not Found'
```

---

## 📌 Type-Safe Builder (SQL пример)

Капстоун: комбинируем все техники в type-safe SQL builder.

```typescript
interface DBSchema {
  users: { id: number; name: string; email: string; active: boolean }
  posts: { id: number; title: string; author_id: number }
}

type TableName = keyof DBSchema
type ColumnOf<T extends TableName> = keyof DBSchema[T] & string

class SQLBuilder<T extends TableName, Selected extends ColumnOf<T> = ColumnOf<T>> {
  select<C extends ColumnOf<T>>(...cols: C[]): SQLBuilder<T, C> { /* ... */ }
  where(col: ColumnOf<T>, op: string, val: unknown): this { /* ... */ }
  toSQL(): string { /* ... */ }
  execute(): Pick<DBSchema[T], Selected>[] { /* ... */ }
}

// Type-safe!
from('users').select('id', 'name').where('active', '=', true)
// Result type: Pick<DBSchema['users'], 'id' | 'name'>[]

// Compile errors:
from('users').select('nonexistent')       // ❌
from('users').where('fake_col', '=', 1)   // ❌
from('nonexistent')                        // ❌
```

---

## ⚠️ Частые ошибки новичков

### Ошибка 1: Забыть базовый случай рекурсии

```typescript
// ❌ Бесконечная рекурсия — нет базового случая
type BadSplit<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}`
    ? [H, ...BadSplit<T, D>]
    : never  // Должно быть [S] или [], а не never!

// ✅ Корректно
type Split<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}`
    ? [H, ...Split<T, D>]
    : S extends '' ? [] : [S]
```

### Ошибка 2: Превышение лимита рекурсии

```typescript
// ❌ Рекурсия слишком глубока для больших чисел
type Add<A extends number, B extends number> =
  [...BuildTuple<A>, ...BuildTuple<B>]['length']
// Add<500, 500> — Error: Type instantiation is excessively deep

// ✅ Учитывайте лимит ~999 (varies by TS version)
// Для больших чисел используйте итеративные подходы
```

### Ошибка 3: Забыть infer extends

```typescript
// ❌ Без infer extends — тип может не сузиться
type GetLength<T extends unknown[]> =
  T['length']  // type is number, not literal

// ✅ С infer extends
type GetLength<T extends unknown[]> =
  T['length'] extends infer L extends number ? L : never
```

### Ошибка 4: Неправильный порядок паттернов

```typescript
// ❌ Wildcard первым — остальные паттерны недостижимы
type Match<V, Cases> =
  Cases extends [PatternCase<_, infer R>, ...infer _] ? R : never

// ✅ Wildcard последним
type Match<V, Cases> =
  Cases extends [infer H, ...infer T]
    ? V extends H['pattern'] ? H['result'] : Match<V, T>
    : never
```

---

## 💡 Best Practices

1. **Начинайте с простых случаев** и добавляйте сложность постепенно
2. **Тестируйте каждый тип отдельно** с помощью type assertions: `const _: ExpectedType = actualValue`
3. **Помните о лимитах рекурсии** TypeScript (~999 уровней)
4. **Используйте вспомогательные типы** вместо монолитных определений
5. **Документируйте сложные типы** комментариями с примерами
6. **Не злоупотребляйте** type-level programming — используйте его только когда compile-time проверка даёт реальную ценность
