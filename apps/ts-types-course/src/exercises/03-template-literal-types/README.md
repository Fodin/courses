# 🔥 Уровень 3: Template Literal Types

## 🎯 Что такое Template Literal Types

Template Literal Types -- это типы, построенные на основе синтаксиса template literals JavaScript (обратные кавычки), но работающие на уровне системы типов. Они позволяют создавать и трансформировать **строковые литеральные типы** программно.

```typescript
type Greeting = `Hello, ${string}`
// Тип, описывающий любую строку, начинающуюся с "Hello, "

type World = `Hello, ${'World' | 'TypeScript'}`
// "Hello, World" | "Hello, TypeScript"
```

Эта возможность появилась в **TypeScript 4.1** и стала одним из ключевых инструментов для type-level программирования.

---

## 📌 Создание union-типов из template literals

Когда template literal содержит union-тип, TypeScript создаёт **декартово произведение** всех комбинаций:

```typescript
type Color = 'red' | 'green' | 'blue'
type Shade = 'light' | 'dark'

type ColorVariant = `${Shade}-${Color}`
// "light-red" | "light-green" | "light-blue" |
// "dark-red" | "dark-green" | "dark-blue"
// = 2 * 3 = 6 вариантов
```

### Три union-типа

```typescript
type Size = 'sm' | 'md' | 'lg'
type Color = 'red' | 'blue'
type Variant = 'outlined' | 'filled'

type ButtonClass = `btn-${Size}-${Color}-${Variant}`
// 3 * 2 * 2 = 12 вариантов!
```

### Практические примеры

```typescript
// CSS values
type CSSUnit = 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'
type CSSValue = `${number}${CSSUnit}`
// "10px", "1.5rem", "100%", "50vh" — все валидны

// API routes
type ApiVersion = 'v1' | 'v2'
type Resource = 'users' | 'posts'
type ApiRoute = `/api/${ApiVersion}/${Resource}`
// "/api/v1/users" | "/api/v1/posts" | "/api/v2/users" | "/api/v2/posts"

// Event handlers
type DOMEvent = 'click' | 'focus' | 'blur'
type EventHandler = `on${Capitalize<DOMEvent>}`
// "onClick" | "onFocus" | "onBlur"
```

⚠️ **Внимание:** будьте осторожны с комбинаторным взрывом. `5 x 5 x 5` даёт 125 вариантов, и TypeScript может замедлиться при слишком большом количестве комбинаций.

---

## 📌 Встроенные String Manipulation Types

TypeScript предоставляет 4 встроенных типа для трансформации строковых литералов:

```typescript
type A = Uppercase<'hello'>      // "HELLO"
type B = Lowercase<'HELLO'>      // "hello"
type C = Capitalize<'hello'>     // "Hello"
type D = Uncapitalize<'Hello'>   // "hello"
```

Эти типы работают **только** с литеральными строковыми типами, не с `string`:

```typescript
type E = Uppercase<string>  // string (не даёт конкретного результата)
type F = Uppercase<'hello'> // "HELLO" (литерал → литерал)
```

### Комбинация с union

```typescript
type Events = 'click' | 'scroll' | 'resize'
type Handlers = `on${Capitalize<Events>}`
// "onClick" | "onScroll" | "onResize"
```

---

## 📌 Кастомные трансформации строк

### CamelCase из kebab-case

```typescript
type CamelCase<S extends string> =
  S extends `${infer Head}-${infer Tail}`
    ? `${Lowercase<Head>}${CamelCase<Capitalize<Tail>>}`
    : S

type A = CamelCase<'background-color'>   // "backgroundColor"
type B = CamelCase<'border-top-width'>    // "borderTopWidth"
type C = CamelCase<'font-size'>           // "fontSize"
```

### Replace и ReplaceAll

```typescript
type Replace<S extends string, From extends string, To extends string> =
  S extends `${infer Head}${From}${infer Tail}`
    ? `${Head}${To}${Tail}`
    : S

type ReplaceAll<S extends string, From extends string, To extends string> =
  S extends `${infer Head}${From}${infer Tail}`
    ? ReplaceAll<`${Head}${To}${Tail}`, From, To>
    : S

type A = Replace<'hello world', ' ', '-'>     // "hello-world"
type B = ReplaceAll<'a.b.c.d', '.', '/'>       // "a/b/c/d"
```

### Trim

```typescript
type TrimStart<S extends string> =
  S extends ` ${infer Rest}` ? TrimStart<Rest> : S

type TrimEnd<S extends string> =
  S extends `${infer Rest} ` ? TrimEnd<Rest> : S

type Trim<S extends string> = TrimStart<TrimEnd<S>>

type A = Trim<'  hello  '>  // "hello"
```

---

## 📌 Парсинг строковых типов

Template literals с `infer` позволяют **разбирать строки** на части на уровне типов:

### Split

```typescript
type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}`
    ? [Head, ...Split<Tail, D>]
    : [S]

type A = Split<'a.b.c', '.'>      // ["a", "b", "c"]
type B = Split<'hello-world', '-'> // ["hello", "world"]
```

### Join

```typescript
type Join<T extends string[], D extends string> =
  T extends [infer First extends string]
    ? First
    : T extends [infer First extends string, ...infer Rest extends string[]]
      ? `${First}${D}${Join<Rest, D>}`
      : ''

type A = Join<['a', 'b', 'c'], '.'>  // "a.b.c"
```

### Извлечение параметров из URL

```typescript
type ParseRouteParams<S extends string> =
  S extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ParseRouteParams<Rest>
    : S extends `${string}:${infer Param}`
      ? Param
      : never

type A = ParseRouteParams<'/users/:id/posts/:postId'>
// "id" | "postId"

type B = ParseRouteParams<'/api/:version/resources/:resourceId'>
// "version" | "resourceId"
```

### Извлечение домена из email

```typescript
type ExtractDomain<S extends string> =
  S extends `${string}@${infer Domain}` ? Domain : never

type A = ExtractDomain<'alice@example.com'>  // "example.com"
```

---

## 📌 Практические паттерны

### Type-safe event emitter

```typescript
type EventMap = {
  click: { x: number; y: number }
  input: { value: string }
  error: { message: string; code: number }
}

type EventName = keyof EventMap
type OnEvent = `on${Capitalize<EventName & string>}`

// Type-safe listener signatures
type Listeners = {
  [K in EventName as `on${Capitalize<K & string>}`]: (payload: EventMap[K]) => void
}
// {
//   onClick: (payload: { x: number; y: number }) => void
//   onInput: (payload: { value: string }) => void
//   onError: (payload: { message: string; code: number }) => void
// }
```

### CSS-in-JS property conversion

```typescript
type CSSProperty = 'background-color' | 'border-radius' | 'font-size' | 'z-index'

type CSSToJS = {
  [K in CSSProperty as CamelCase<K>]: string
}
// {
//   backgroundColor: string
//   borderRadius: string
//   fontSize: string
//   zIndex: string
// }
```

---

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Комбинаторный взрыв

```typescript
// ❌ Слишком много комбинаций
type Letter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j'
type ThreeLetterCode = `${Letter}${Letter}${Letter}`
// 10 * 10 * 10 = 1000 вариантов! TypeScript замедлится

// ✅ Используйте string с runtime-проверкой
type ThreeLetterCode = `${string}${string}${string}`
function isValidCode(s: string): boolean {
  return /^[a-j]{3}$/.test(s)
}
```

### Ошибка 2: Забывают K & string при Capitalize

```typescript
// ❌ keyof T может быть number | string | symbol
type Bad<T> = {
  [K in keyof T as `get${Capitalize<K>}`]: T[K]
  //                              ^ Error!
}

// ✅ Пересечение с string
type Good<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: T[K]
}
```

### Ошибка 3: Рекурсия без базового случая

```typescript
// ❌ Бесконечная рекурсия для пустой строки
type BadSplit<S extends string> =
  S extends `${infer H}${infer T}` ? [H, ...BadSplit<T>] : never

// ✅ Базовый случай — вернуть пустой tuple
type GoodSplit<S extends string> =
  S extends `${infer H}${infer T}` ? [H, ...GoodSplit<T>] : []
```

### Ошибка 4: Жадный infer

```typescript
// ⚠️ infer захватывает максимально возможную строку
type First<S extends string> = S extends `${infer F}${infer _}` ? F : S
// First<'hello'> → 'h' (один символ, потому что это минимальный match)

// Но:
type BeforeDot<S extends string> = S extends `${infer F}.${infer _}` ? F : S
// BeforeDot<'a.b.c'> → 'a' (первый match разделителя)
```

---

## 💡 Best Practices

1. **Контролируйте размер union.** Template literals с большими union-типами создают декартово произведение. Избегайте комбинаций больше ~100 вариантов.

2. **Используйте встроенные Uppercase/Lowercase/Capitalize/Uncapitalize.** Они оптимизированы компилятором и работают быстрее самописных аналогов.

3. **Разбивайте сложные парсеры на промежуточные типы.** Вместо одного монстра с 5 infer -- несколько шагов.

4. **Тестируйте edge-cases:** пустые строки, строки без разделителя, строки с одним символом.

5. **Используйте template literals для DSL.** Маршруты, CSS-значения, event-имена -- всё это отличные кандидаты для type-safe строковых шаблонов.

6. **Помните о читаемости.** Сложные рекурсивные template literal types трудно понять. Документируйте с примерами.
