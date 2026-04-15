# Уровень 12: React Compiler — автоматическая мемоизация

## Проблема: мемоизация вручную — это ловушка

Опытный React-разработчик знает боль: `useMemo`, `useCallback`, `React.memo` — всё это нужно
добавлять вручную, правильно указывать зависимости, обновлять при рефакторинге. Ошибиться легко.
Забыть — ещё легче. И когда кто-то новый приходит в команду, он видит половину компонентов с
мемоизацией, половину без — и непонятно, было ли это осознанное решение или просто забыли.

React Compiler решает эту проблему иначе: **он анализирует ваш код статически и сам расставляет
кэширование там, где это нужно**.

```
До компилятора:
  разработчик → думает «а нужен ли тут useMemo?» → ошибается → профилирует → исправляет

После компилятора:
  разработчик → пишет обычный код → компилятор вставляет кэширование → всё работает оптимально
```

---

## Что делает React Compiler

Compiler — это **Babel-плагин**, который трансформирует ваш код во время сборки. На входе —
обычный React-компонент. На выходе — тот же компонент, но с автоматическим кэшированием через
внутренний хук `useMemoCache`.

```tsx
// Исходный код — пишете вы
function ProductCard({ product, onAddToCart }) {
  const formattedPrice = formatPrice(product.price)
  const handleClick = () => onAddToCart(product.id)

  return (
    <div style={{ padding: 16, border: '1px solid #e2e8f0' }}>
      <h3>{product.name}</h3>
      <span>{formattedPrice}</span>
      <button onClick={handleClick}>Добавить</button>
    </div>
  )
}

// Что генерирует компилятор — видите только в dev tools
function ProductCard({ product, onAddToCart }) {
  const $ = useMemoCache(6)

  let formattedPrice
  if ($[0] !== product.price) {
    formattedPrice = formatPrice(product.price)
    $[0] = product.price
    $[1] = formattedPrice
  } else {
    formattedPrice = $[1]
  }

  let handleClick
  if ($[2] !== onAddToCart || $[3] !== product.id) {
    handleClick = () => onAddToCart(product.id)
    $[2] = onAddToCart
    $[3] = product.id
    $[4] = handleClick
  } else {
    handleClick = $[4]
  }

  // ... JSX тоже кэшируется
}
```

💡 Заметьте: вы пишете простой понятный код. Компилятор сам решает что кэшировать и по каким
зависимостям.

---

## Как работает: статический анализ AST

Compilation pipeline выглядит так:

```
Ваш код (source)
    ↓
Парсинг в AST (Abstract Syntax Tree)
    ↓
Преобразование в HIR (High-level Intermediate Representation)
    ↓
Анализ ReactiveScopes — что от чего зависит
    ↓
Codegen — генерация кода с useMemoCache
```

На этапе ReactiveScopes компилятор строит **граф зависимостей** для каждого значения внутри
компонента. `formattedPrice` зависит от `product.price` — значит, пересчитывается только когда
изменится `product.price`. `handleClick` зависит от `onAddToCart` и `product.id` — значит,
пересоздаётся только при их изменении.

---

## useMemoCache: внутренний хук кэширования

`useMemoCache(n)` — это низкоуровневый хук React, недоступный разработчику напрямую. Он создаёт
массив из `n` ячеек, который сохраняется между рендерами.

```tsx
const $ = useMemoCache(6)  // массив из 6 ячеек-кэшей

// Паттерн проверки: если ключ изменился — пересчитай
if ($[0] !== product.price) {
  $[0] = product.price   // обновить ключ
  $[1] = formatPrice(product.price)  // обновить значение
}
const formattedPrice = $[1]
```

📌 Это эффективнее `useMemo`, потому что один хук на весь компонент вместо N хуков.

---

## Rules of React: что должно выполняться

Компилятор работает только с **чистым кодом**. Если компонент нарушает "Rules of React" —
компилятор либо откажется его оптимизировать, либо оптимизация будет некорректной.

Три главных правила:

**1. Чистота рендера** — компонент возвращает один и тот же результат для одних и тех же props/state.

**2. Нет мутаций во время рендера** — нельзя изменять props, внешние переменные, DOM.

**3. Нет чтения мутируемых глобалов** — `Date.now()`, `Math.random()`, `ref.current` во время рендера делают его непредсказуемым.

```tsx
// ✅ Чистый рендер — компилятор оптимизирует
function Counter({ count }) {
  return <div>{count * 2}</div>
}

// ❌ Нарушение: мутация props
function BadList({ items }) {
  items.push({ id: 'extra' })  // мутация — рендер непредсказуем
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
}

// ❌ Нарушение: нестабильный вывод
function Timestamp() {
  return <div>{Date.now()}</div>  // разный результат каждый рендер
}
```

---

## Что компилятор НЕ может оптимизировать

- Компоненты, нарушающие Rules of React
- Class components (только функциональные компоненты и хуки)
- Generator functions
- Динамические вызовы хуков (хуки внутри условий)
- Компоненты с директивой `'use no memo'`

---

## "use no memo": ручной opt-out

Если нужно исключить компонент из оптимизации компилятором:

```tsx
function MyComponent() {
  'use no memo'  // директива в начале функции
  // этот компонент не будет тронут компилятором
  return <div>{Date.now()}</div>
}
```

⚠️ Это не постоянное решение — используйте только для отладки или в крайних случаях.

---

## ⚠️ Распространённые ошибки новичков

### 1. Думать что мутация объекта в рендере — безвредна

```tsx
// ❌ Мутация делает компонент непригодным для компилятора
function SortedList({ items }) {
  items.sort((a, b) => a.name.localeCompare(b.name))  // мутирует props!
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
}

// ✅ Создаём копию
function SortedList({ items }) {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name))
  return <ul>{sorted.map(i => <li key={i.id}>{i.name}</li>)}</ul>
}
```

### 2. Использовать Date.now() или Math.random() в рендере

```tsx
// ❌ Нестабильный вывод — компилятор не оптимизирует
function Card({ title }) {
  const key = Math.random()  // новый ключ каждый рендер
  return <div key={key}>{title}</div>
}

// ✅ Генерировать один раз вне рендера или использовать useId()
import { useId } from 'react'
function Card({ title }) {
  const id = useId()
  return <div id={id}>{title}</div>
}
```

### 3. Читать ref.current для рендера

```tsx
// ❌ ref.current — мутируемый, компилятор не может отследить зависимость
function TimerDisplay({ timerRef }) {
  return <div>Время: {timerRef.current}</div>  // мутируемое чтение в рендере
}

// ✅ Хранить отображаемое значение в state
function TimerDisplay() {
  const [elapsed, setElapsed] = useState(0)
  return <div>Время: {elapsed}</div>
}
```

---

## Резюме

```
Вы пишете       →  Компилятор анализирует  →  Генерирует оптимизированный код
чистый код         AST → HIR → Scopes         с useMemoCache
```

📌 React Compiler — не магия. Это инструмент, который работает только с чистым кодом.
Следуйте Rules of React — и компилятор возьмёт мемоизацию на себя.
