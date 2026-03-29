# 🔥 Уровень 2: Mapped Types

## 🎯 Что такое Mapped Types

Mapped Types (маппированные/проецируемые типы) -- это механизм TypeScript, который позволяет создавать **новые типы на основе существующих**, итерируя по их ключам. Это аналог `Array.map()`, но для типов.

```typescript
type Mapped<T> = {
  [K in keyof T]: NewValueType
}
```

Mapped types -- основа большинства встроенных утилитных типов TypeScript (`Partial`, `Required`, `Readonly`, `Pick`, `Record`).

---

## 📌 Синтаксис Mapped Types

### Базовая структура

```typescript
type MyMapped<T> = {
  [K in keyof T]: T[K]
}
// Это identity mapped type — создаёт копию T
```

Разберём по частям:
- `K` -- переменная итерации (имя ключа)
- `in` -- оператор итерации
- `keyof T` -- множество ключей для итерации
- `T[K]` -- indexed access type (тип значения по ключу K)

### Итерация по произвольному union

```typescript
type FromUnion = {
  [K in 'a' | 'b' | 'c']: string
}
// { a: string; b: string; c: string }
```

---

## 📌 Базовые Mapped Types

### Readonly — запрет модификации

```typescript
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

interface User {
  name: string
  age: number
}

type ReadonlyUser = MyReadonly<User>
// { readonly name: string; readonly age: number }

const user: ReadonlyUser = { name: 'Alice', age: 30 }
user.name = 'Bob' // ❌ Cannot assign to 'name' because it is a read-only property
```

### Partial — все свойства опциональны

```typescript
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

type PartialUser = MyPartial<User>
// { name?: string; age?: number }
```

### Required — все свойства обязательны

```typescript
type MyRequired<T> = {
  [K in keyof T]-?: T[K]
}
```

💡 `-?` -- это модификатор, **убирающий** опциональность. Аналогично, `-readonly` убирает readonly.

### Pick — подмножество ключей

```typescript
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type UserName = MyPick<User, 'name'>
// { name: string }
```

### Record — тип с заданными ключами

```typescript
type MyRecord<K extends string | number | symbol, V> = {
  [P in K]: V
}

type StatusMap = MyRecord<'active' | 'inactive', boolean>
// { active: boolean; inactive: boolean }
```

---

## 📌 Key Remapping (переименование ключей)

С TypeScript 4.1 в mapped types можно использовать **`as`-clause** для трансформации ключей:

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K]
}

interface Person {
  name: string
  age: number
}

type PersonGetters = Getters<Person>
// { getName: () => string; getAge: () => number }
```

### Фильтрация ключей через as never

Если `as`-выражение разрешается в `never`, ключ **исключается** из результата:

```typescript
// Убрать все ключи, значения которых — числа
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K]
}

interface Data {
  id: number
  name: string
  count: number
  label: string
}

type WithoutNumbers = OmitByType<Data, number>
// { name: string; label: string }
```

### Префиксы и суффиксы

```typescript
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}_${K & string}`]: T[K]
}

type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<K & string>}Change`]: (value: T[K]) => void
}
```

💡 `K & string` нужен потому, что `keyof T` может содержать `number` и `symbol`, а template literals работают только со `string`.

---

## 📌 Модификаторы (Modifier Manipulation)

### Добавление модификаторов

```typescript
// Добавить readonly
type Frozen<T> = { readonly [K in keyof T]: T[K] }

// Добавить optional
type Loose<T> = { [K in keyof T]?: T[K] }
```

### Удаление модификаторов

```typescript
// Убрать readonly
type Mutable<T> = { -readonly [K in keyof T]: T[K] }

// Убрать optional
type Concrete<T> = { [K in keyof T]-?: T[K] }
```

### Комбинированные модификаторы

```typescript
// Одновременно readonly + required
type ReadonlyRequired<T> = {
  readonly [K in keyof T]-?: T[K]
}
```

### Селективные модификаторы

Часто нужно применить модификатор к **подмножеству** ключей:

```typescript
type ReadonlyPick<T, K extends keyof T> =
  { readonly [P in K]: T[P] } &
  { [P in Exclude<keyof T, K>]: T[P] }

type OptionalExcept<T, K extends keyof T> =
  { [P in K]-?: T[P] } &
  { [P in Exclude<keyof T, K>]?: T[P] }
```

---

## 📌 Deep Mapped Types

Обычные mapped types работают только с первым уровнем вложенности. Для глубокой трансформации нужна **рекурсия**:

### DeepPartial

```typescript
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends unknown[]
      ? T[K]                  // массивы не трогаем
      : DeepPartial<T[K]>    // рекурсия для объектов
    : T[K]                   // примитивы оставляем как есть
}
```

### DeepReadonly

```typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends unknown[]
      ? readonly T[K][number][]
      : DeepReadonly<T[K]>
    : T[K]
}
```

### DeepRequired

```typescript
type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object
    ? T[K] extends unknown[]
      ? T[K]
      : DeepRequired<T[K]>
    : T[K]
}
```

### Практический пример: deep merge

```typescript
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: DeepPartial<T>
): T {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    const sv = source[key], tv = result[key]
    if (sv && typeof sv === 'object' && !Array.isArray(sv) &&
        tv && typeof tv === 'object' && !Array.isArray(tv)) {
      result[key] = deepMerge(tv, sv)
    } else if (sv !== undefined) {
      result[key] = sv
    }
  }
  return result
}
```

---

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Забывают K & string при key remapping

```typescript
// ❌ Ошибка: Type 'K' is not assignable to type 'string'
type Bad<T> = {
  [K in keyof T as `get${Capitalize<K>}`]: T[K]
}

// ✅ Пересекаем с string
type Good<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: T[K]
}
```

### Ошибка 2: DeepPartial без проверки на массив

```typescript
// ❌ Массивы будут развёрнуты как объекты
type BadDeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? BadDeepPartial<T[K]> : T[K]
}
// Array<number> станет { 0?: number; 1?: number; length?: number; ... }

// ✅ Проверяем на массив отдельно
type GoodDeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends unknown[] ? T[K] : GoodDeepPartial<T[K]>
    : T[K]
}
```

### Ошибка 3: Intersection вместо single mapped type

```typescript
// ❌ Intersection создаёт визуально сложный тип в IDE
type Verbose<T> = Readonly<T> & Partial<T>

// ✅ Один mapped type — чище
type Clean<T> = {
  readonly [K in keyof T]?: T[K]
}
```

### Ошибка 4: Забывают -? для Required

```typescript
// ❌ Это identity, а не Required!
type NotRequired<T> = {
  [K in keyof T]: T[K]
}

// ✅ Нужен -? для удаления optional
type IsRequired<T> = {
  [K in keyof T]-?: T[K]
}
```

---

## 💡 Best Practices

1. **Используйте встроенные утилитные типы** (`Partial`, `Required`, `Readonly`, `Pick`, `Record`) вместо самописных, когда это возможно.

2. **Key remapping (`as`) -- мощный инструмент.** Используйте для создания getter/setter-интерфейсов, фильтрации ключей, prefixed-типов.

3. **Для deep-трансформаций всегда проверяйте на массив.** `unknown[]` нужно обрабатывать отдельно от обычных объектов.

4. **Разделяйте сложные mapped types.** Вместо одного монстра с 10 условиями -- несколько промежуточных типов.

5. **Помните о homomorphism.** Mapped types вида `{ [K in keyof T]: ... }` сохраняют модификаторы исходного типа (readonly, optional). Это называется homomorphic mapped type.

6. **Тестируйте с optional/readonly свойствами.** Убедитесь, что ваш mapped type корректно обрабатывает модификаторы.
