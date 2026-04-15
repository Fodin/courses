# Уровень 12 (расширенная теория): React Compiler под капотом

## Почему ручная мемоизация — системная проблема

Представьте компонент ProductCard, который рендерится в списке из 200 товаров. Каждый раз при
изменении корзины перерисовывается родительский компонент. Без мемоизации — все 200 карточек
заново. С `React.memo` — только те, у которых изменились props.

Проблема в том, что мемоизация правильная только до первого рефакторинга:

```tsx
// Было: стабильные props → React.memo помогает
const ProductCard = React.memo(({ product, onAdd }) => { ... })

// Добавили новый prop theme — и забыли проверить, стабилен ли он
const ProductCard = React.memo(({ product, onAdd, theme }) => { ... })
// Если theme = { color: 'blue' } создаётся inline → мемоизация ломается незаметно
```

React Compiler устраняет эту проблему: он анализирует граф зависимостей статически и генерирует
правильное кэширование автоматически. Вы больше не думаете о мемоизации — вы думаете о логике.

---

## Compilation Pipeline: от кода до оптимизированного вывода

```
Source Code
    │
    ▼
┌─────────────────────────────┐
│  Babel Parser               │  source → AST (Abstract Syntax Tree)
│  @babel/parser              │  стандартный JS/TS парсинг
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  HIR Builder                │  AST → HIR (High-level IR)
│  (flattenning control flow) │  if/while/ternary → явные блоки
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  ReactiveScopes Analysis    │  граф зависимостей каждой переменной
│  (dependency inference)     │  какие переменные от каких зависят
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  Codegen                    │  ReactiveScopes → useMemoCache паттерн
│  (emit optimized code)      │  генерация if-блоков для каждого scope
└─────────────────────────────┘
    │
    ▼
Optimized Output
```

### HIR: промежуточное представление

HIR (High-level Intermediate Representation) — это упрощённая форма AST, где поток управления
представлен явно. Компилятор "разворачивает" вложенные конструкции:

```tsx
// Исходный код (условный рендер)
function Alert({ type, message }) {
  const color = type === 'error' ? 'red' : 'blue'
  return <div style={{ color }}>{message}</div>
}

// В HIR ternary разворачивается в явные блоки:
//   block 1: compute (type === 'error')
//   block 2: if true → color = 'red'
//   block 3: if false → color = 'blue'
//   block 4: merge → color
//   block 5: JSX с color
```

Это позволяет компилятору точно определить: в каком блоке что вычисляется и от чего зависит.

---

## ReactiveScopes: граф зависимостей

ReactiveScopes — ключевой этап компиляции. Компилятор строит граф: какие переменные читаются,
какие записываются, между какими есть зависимость.

Пример анализа:

```tsx
function Dashboard({ userId, filter }) {
  // scope 1: зависит от userId
  const user = fetchUser(userId)           // deps: [userId]

  // scope 2: зависит от user.data и filter
  const filteredItems = user.data          // deps: [user.data, filter]
    .filter(item => item.category === filter)

  // scope 3: зависит от filteredItems
  const totalCount = filteredItems.length  // deps: [filteredItems]

  // scope 4: зависит от totalCount и user.name
  return (                                 // deps: [totalCount, user.name]
    <div>
      <h2>{user.name}</h2>
      <span>{totalCount} элементов</span>
      <List items={filteredItems} />
    </div>
  )
}
```

Компилятор видит: если изменился `userId` — пересчитать всё начиная с scope 1. Если изменился
только `filter` — scope 1 пропустить (user не изменился), пересчитать только scope 2, 3, 4.

---

## useMemoCache: внутренний механизм кэширования

`useMemoCache(n)` — это внутренний хук React (не экспортируется из 'react'), который создаёт
persistent array из n ячеек. Каждая ячейка — либо `Symbol(react.memo_cache_sentinel)` (пустая),
либо сохранённое значение.

```tsx
// Псевдокод useMemoCache внутри React:
function useMemoCache(size: number): Array<unknown> {
  const fiber = getCurrentFiber()
  let cache = fiber.memoizedState?.cache

  if (cache === null || cache === undefined) {
    // Первый рендер: создать массив sentinel-значений
    cache = new Array(size).fill(REACT_MEMO_CACHE_SENTINEL)
    // Сохранить в memoizedState хука
    fiber.memoizedState = { cache }
  }

  return cache
}
```

Паттерн, который генерирует компилятор для каждого ReactiveScope:

```tsx
// Паттерн "check-and-update"
let t0  // переменная для cached value

if ($[0] !== dep1 || $[1] !== dep2) {
  // Зависимости изменились → пересчитать
  t0 = expensiveComputation(dep1, dep2)
  // Сохранить новые зависимости и результат
  $[0] = dep1
  $[1] = dep2
  $[2] = t0
} else {
  // Зависимости не изменились → взять из кэша
  t0 = $[2]
}
```

### Почему это лучше useMemo?

| | useMemo | useMemoCache |
|---|---|---|
| Хуков на компонент | N (по одному на каждое кэшируемое значение) | 1 (один массив) |
| Deps array | Отдельный массив для каждого | Ячейки внутри общего массива |
| Overhead | N аллокаций deps array | 1 аллокация |
| Гранулярность | Выбирает разработчик | Компилятор (оптимально) |

---

## Rules of React: подробный разбор

Четыре правила, которые должен соблюдать код для работы компилятора:

### Правило 1: Idempotent Render

Один и тот же компонент с одними и теми же props/state должен всегда возвращать одинаковый JSX.

```tsx
// ✅ Idempotent: результат детерминирован
function Greeting({ name }) {
  return <h1>Привет, {name}!</h1>
}

// ❌ Не idempotent: результат меняется при каждом вызове
function RandomGreeting({ name }) {
  const emoji = ['👋', '🙌', '✌️'][Math.floor(Math.random() * 3)]
  return <h1>{emoji} Привет, {name}!</h1>
}
```

### Правило 2: No Side Effects in Render

Рендер — это чистая функция. Побочные эффекты (запросы, мутации DOM, логирование) — только в
`useEffect` или обработчиках событий.

```tsx
// ❌ Side effect в рендере
function Logger({ message }) {
  console.log('Rendering:', message)  // side effect → компилятор не оптимизирует
  sendAnalytics(message)              // тем более нельзя
  return <div>{message}</div>
}

// ✅ Логирование в useEffect
function Logger({ message }) {
  useEffect(() => {
    console.log('Rendering:', message)
  }, [message])
  return <div>{message}</div>
}
```

### Правило 3: Immutable Props and State

Props и state — иммутабельны. Компилятор предполагает, что их значения не изменятся между
рендерами без явного setState.

```tsx
// ❌ Мутация props — грубое нарушение
function SortedList({ items }) {
  items.sort()          // мутирует оригинальный массив!
  items.push({ id: 'extra' })  // ещё хуже
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
}

// ✅ Создаём новый массив
function SortedList({ items }) {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name))
  return <ul>{sorted.map(i => <li key={i.id}>{i.name}</li>)}</ul>
}
```

### Правило 4: Stable Return for Same Inputs

Компонент с одними и теми же props/state должен возвращать структурно одинаковый JSX. Разное
количество JSX-узлов при одних и тех же входах — нарушение.

```tsx
// ⚠️ Потенциальная проблема: разная структура JSX
function Widget({ isAdmin }) {
  if (isAdmin) {
    return <div><AdminPanel /><UserList /></div>
  }
  return <div><UserList /></div>  // другая структура — но это нормально, это условный рендер
}
// Это допустимо — структура детерминирована от isAdmin

// ❌ Реальная проблема: структура зависит от внешнего мутируемого состояния
let globalFlag = false
function BadWidget() {
  if (globalFlag) return <div>A</div>
  return <div>B</div>  // globalFlag может измениться между рендерами
}
```

---

## Что нарушает rules на практике

Вот конкретные антипаттерны, которые мешают компилятору:

```tsx
// ❌ 1. Date.now() в рендере → нестабильный вывод
function Timestamp() {
  return <time>{new Date(Date.now()).toLocaleString()}</time>
}
// Исправление: обновлять через setInterval → setState

// ❌ 2. Math.random() как ключ
function DynamicList({ items }) {
  return items.map(item => (
    <li key={Math.random()}>{item.name}</li>  // новый ключ каждый рендер
  ))
}
// Исправление: item.id или стабильный индекс

// ❌ 3. ref.current для отображения
function ProgressBar({ progressRef }) {
  return <div style={{ width: `${progressRef.current}%` }} />
  // Компилятор не знает когда ref.current изменится
}
// Исправление: useState для отображаемого прогресса

// ❌ 4. Мутация объекта в рендере
function UserCard({ user }) {
  user.displayName = `${user.firstName} ${user.lastName}`  // мутация!
  return <div>{user.displayName}</div>
}
// Исправление: const displayName = `${user.firstName} ${user.lastName}`

// ❌ 5. Вызов хука условно
function ConditionalHook({ isLoggedIn }) {
  if (isLoggedIn) {
    const data = useFetchData()  // условный хук — React запрещает
  }
  return <div>...</div>
}
```

---

## Пример: ручная мемоизация vs compiler output

Рассмотрим реальный компонент и сравним два подхода:

```tsx
// Исходный компонент (никакой мемоизации)
function ProductList({ products, category, onAddToCart }) {
  const filtered = products.filter(p => p.category === category)
  const total = filtered.reduce((sum, p) => sum + p.price, 0)
  const handleAdd = (id) => onAddToCart(id)

  return (
    <div>
      <h2>Итого: {total}₽</h2>
      {filtered.map(p => (
        <ProductCard key={p.id} product={p} onAdd={handleAdd} />
      ))}
    </div>
  )
}
```

```tsx
// Ручная мемоизация — как писали раньше
function ProductList({ products, category, onAddToCart }) {
  const filtered = useMemo(
    () => products.filter(p => p.category === category),
    [products, category]
  )
  const total = useMemo(
    () => filtered.reduce((sum, p) => sum + p.price, 0),
    [filtered]
  )
  const handleAdd = useCallback(
    (id) => onAddToCart(id),
    [onAddToCart]
  )

  return useMemo(() => (
    <div>
      <h2>Итого: {total}₽</h2>
      {filtered.map(p => (
        <ProductCard key={p.id} product={p} onAdd={handleAdd} />
      ))}
    </div>
  ), [total, filtered, handleAdd])
}
```

```tsx
// Compiler output (упрощённо) — что генерирует компилятор из исходного кода
function ProductList({ products, category, onAddToCart }) {
  const $ = useMemoCache(8)

  // scope 1: filtered зависит от products и category
  let filtered
  if ($[0] !== products || $[1] !== category) {
    filtered = products.filter(p => p.category === category)
    $[0] = products
    $[1] = category
    $[2] = filtered
  } else {
    filtered = $[2]
  }

  // scope 2: total зависит от filtered
  let total
  if ($[3] !== filtered) {
    total = filtered.reduce((sum, p) => sum + p.price, 0)
    $[3] = filtered
    $[4] = total
  } else {
    total = $[4]
  }

  // scope 3: handleAdd зависит от onAddToCart
  let handleAdd
  if ($[5] !== onAddToCart) {
    handleAdd = (id) => onAddToCart(id)
    $[5] = onAddToCart
    $[6] = handleAdd
  } else {
    handleAdd = $[6]
  }

  // scope 4: JSX зависит от total, filtered, handleAdd
  let jsx
  if ($[7] !== total || $[3] !== filtered || $[6] !== handleAdd) {
    jsx = (
      <div>
        <h2>Итого: {total}₽</h2>
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onAdd={handleAdd} />
        ))}
      </div>
    )
    $[7] = jsx
  }

  return jsx
}
```

📌 Ключевые отличия:
- Компилятор точнее отслеживает зависимости (не нужно помнить все deps)
- Один `useMemoCache` вместо N хуков
- Область кэширования определяется автоматически (scope boundaries)

---

## Ограничения компилятора

Компилятор **не оптимизирует**:

```tsx
// 1. Class components — только функциональные
class MyComponent extends React.Component {
  render() { return <div>{this.props.value}</div> }
}

// 2. Generator functions
function* MyGenerator() {
  yield <div>А</div>
  yield <div>Б</div>
}

// 3. Динамические хуки (условные вызовы)
function Bad({ flag }) {
  const value = flag ? useState(0) : useRef(null)  // нарушение rules
}

// 4. Компоненты с 'use no memo'
function OptOut() {
  'use no memo'
  return <div>{Date.now()}</div>
}
```

---

## Как включить React Compiler

### Babel plugin

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // опционально: указать конкретные файлы/компоненты
      // sources: (filename) => filename.indexOf('src/') !== -1,
    }]
  ]
}
```

### Vite config (через @vitejs/plugin-react)

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']]
      }
    })
  ]
})
```

### ESLint plugin для проверки Rules of React

```js
// eslint.config.js
import reactCompilerPlugin from 'eslint-plugin-react-compiler'

export default [
  {
    plugins: { 'react-compiler': reactCompilerPlugin },
    rules: {
      'react-compiler/react-compiler': 'error'
    }
  }
]
```

ESLint plugin подсвечивает нарушения Rules of React — прямо в редакторе, до запуска компилятора.
Запустите его на существующей кодовой базе чтобы увидеть, сколько компонентов готово к компиляции.

---

## Практическое руководство по переходу

Порядок действий при внедрении компилятора в существующий проект:

```
1. Установить eslint-plugin-react-compiler
   → Находит нарушения Rules of React в текущем коде

2. Исправить нарушения (начните с самых частых):
   → Мутации props/state → создавать копии
   → Date.now()/Math.random() в рендере → перенести в useEffect/useState
   → ref.current в рендере → заменить на state

3. Включить компилятор в режиме "opt-in" для отдельных компонентов
   → Используйте 'use memo' директиву (противоположность 'use no memo')

4. Включить для всего проекта
   → Убрать вручную написанные useMemo/useCallback (компилятор заменит)

5. Оставить React.memo только там где это явный контракт API
   → Например, для библиотечных компонентов
```

---

## Диаграмма: pipeline компилятора

```
Source.tsx  ──────────────────────────────────────────────────────────────────►  Output.js
                                                                                
   │                                                                            │
   ▼                                                                            ▼
[Babel Parser]  ──►  AST  ──►  [HIR Builder]  ──►  HIR  ──►  [ReactiveScopes]  ──►  [Codegen]
                                                              (dependency graph)      useMemoCache
```

---

## Резюме: что изменяет компилятор

| До компилятора | После компилятора |
|---|---|
| `useMemo`, `useCallback` вручную | Автоматически через `useMemoCache` |
| `React.memo` на каждый компонент | Компилятор кэширует JSX сам |
| Легко забыть обновить deps | Deps вычисляются статически |
| N хуков мемоизации на компонент | 1 хук `useMemoCache` на компонент |
| Рефакторинг ломает мемоизацию | Компилятор перегенерирует при сборке |

🔥 Главный вывод: React Compiler не делает код быстрее магически — он делает правильную мемоизацию
дешёвой (не нужно думать). Код становится проще, а производительность — предсказуемой.
