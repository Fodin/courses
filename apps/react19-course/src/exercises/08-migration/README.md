# Уровень 8: Финальная миграция

## Введение

Этот уровень объединяет всё, что вы узнали о React 19. Вы проведёте аудит React 18 приложения, выполните пошаговую миграцию и создадите финальный компонент с использованием всех новых API.

---

## Чеклист миграции React 18 → 19

### 1. Обновление зависимостей

```bash
npm install react@19 react-dom@19
npm install -D @types/react@19 @types/react-dom@19
```

Дополнительно:
- `eslint-plugin-react-hooks` → v5+
- `@testing-library/react` → v16+

### 2. Запуск codemod

```bash
npx codemod@latest react/19/migration-recipe
```

Codemod автоматически исправит:
- `ReactDOM.render` → `createRoot`
- String refs → `createRef`
- `defaultProps` → default parameters
- `forwardRef` → ref as prop

### 3. Ручные изменения

#### Удалённые API (breaking changes)

| API | Замена |
|-----|--------|
| `defaultProps` (функции) | ES6 default parameters |
| `propTypes` | TypeScript |
| String refs | `useRef` / `createRef` |
| Legacy Context | `createContext` / `useContext` |
| `ReactDOM.render` | `createRoot().render()` |
| `ReactDOM.hydrate` | `hydrateRoot()` |
| `ReactDOM.findDOMNode` | `useRef` |

#### Новые API (что добавить)

| API | Что делает |
|-----|-----------|
| `use(Promise)` | Чтение async-данных с Suspense |
| `use(Context)` | Замена useContext (можно вызывать условно) |
| `useActionState` | Состояние формы + action |
| `useFormStatus` | Pending-статус формы |
| `useOptimistic` | Оптимистичные обновления |
| ref as prop | Без forwardRef |
| ref cleanup | Return функции из ref callback |
| `<title>` в JSX | Метаданные в компонентах |

---

## Стратегия миграции

### Подход: Постепенная миграция

1. **Обновите зависимости** — убедитесь, что проект компилируется
2. **Запустите codemod** — автоматические исправления
3. **Исправьте breaking changes** — удалённые API
4. **Мигрируйте формы** — onSubmit → action (опционально)
5. **Добавьте новые API** — use(), useOptimistic и т.д. (по мере необходимости)
6. **Тестируйте** — убедитесь, что всё работает

### Что НЕ нужно менять сразу

- `useContext` → `use(Context)` — работает и так, меняйте постепенно
- `Context.Provider` → `Context` — оба синтаксиса работают
- Существующие формы — `onSubmit` продолжает работать

---

## Пример: До и После

### До (React 18)

```tsx
import React, { forwardRef, useContext, useState, useEffect } from 'react'

const ThemeContext = React.createContext('light')

const Input = forwardRef((props, ref) => {
  const theme = useContext(ThemeContext)
  return <input ref={ref} className={theme} {...props} />
})
Input.defaultProps = { placeholder: 'Введите...' }

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(d => {
      setData(d)
      setLoading(false)
    })
  }, [])

  return (
    <ThemeContext.Provider value="dark">
      {loading ? <p>Загрузка...</p> : <div>{data}</div>}
    </ThemeContext.Provider>
  )
}
```

### После (React 19)

```tsx
import { use, Suspense, useState } from 'react'
import { createContext } from 'react'

const ThemeContext = createContext('light')

function Input({ ref, placeholder = 'Введите...', ...props }) {
  const theme = use(ThemeContext)
  return <input ref={ref} className={theme} placeholder={placeholder} {...props} />
}

const dataPromise = fetch('/api/data').then(r => r.json())

function DataView() {
  const data = use(dataPromise)
  return <div>{data}</div>
}

function App() {
  return (
    <ThemeContext value="dark">
      <title>Приложение</title>
      <Suspense fallback={<p>Загрузка...</p>}>
        <DataView />
      </Suspense>
    </ThemeContext>
  )
}
```

---

## Итого

Миграция на React 19 — это:
1. Обновление пакетов
2. Запуск codemod
3. Исправление breaking changes
4. Постепенное внедрение новых API

Не нужно менять всё сразу. React 19 обратно совместим для большинства паттернов.
