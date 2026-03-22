# Уровень 5: useTransition, Suspense и useDeferredValue в React 19

## Введение

React 19 значительно расширяет возможности concurrent-рендеринга. Ключевые обновления: `startTransition` теперь принимает **async-функции**, `useDeferredValue` получил параметр `initialValue`, а `Suspense` стал ещё удобнее для навигации.

---

## 1. Обновления `useTransition` в React 19

### Базовый API (не изменился)

```tsx
import { useTransition } from 'react'

const [isPending, startTransition] = useTransition()
```

- **`isPending`** — `true`, пока переход выполняется
- **`startTransition`** — функция для оборачивания «не срочных» обновлений

### Зачем нужен useTransition?

Не все обновления состояния одинаково важны. Например, при переключении вкладок:
- **Срочно:** показать, что кнопка нажата
- **Не срочно:** отрендерить содержимое новой вкладки

```tsx
function Tabs() {
  const [tab, setTab] = useState('home')
  const [isPending, startTransition] = useTransition()

  function handleTabChange(newTab: string) {
    startTransition(() => {
      setTab(newTab)  // не срочное обновление
    })
  }

  return (
    <div>
      <TabBar activeTab={tab} onChange={handleTabChange} />
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        <TabContent tab={tab} />
      </div>
    </div>
  )
}
```

---

## 2. Async transitions — async функции в `startTransition`

### Что нового в React 19

В React 18 `startTransition` принимал **только синхронные функции**. В React 19 можно передавать **async функции**:

```tsx
// React 18 — нельзя
startTransition(async () => {
  const data = await fetch('/api/data')
  setData(data) // не работало корректно
})

// React 19 — работает!
startTransition(async () => {
  const data = await fetchData()
  setData(data)
})
```

### Преимущества

- **`isPending`** остаётся `true` на протяжении всей async-операции
- Не нужен отдельный `useState` для loading-состояния
- Ошибки перехватываются Error Boundaries
- Можно комбинировать с `useOptimistic`

### Полный пример

```tsx
function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [isPending, startTransition] = useTransition()

  function loadUsers() {
    startTransition(async () => {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    })
  }

  return (
    <div>
      <button onClick={loadUsers} disabled={isPending}>
        {isPending ? 'Загрузка...' : 'Загрузить'}
      </button>
      <ul>
        {users.map(u => <li key={u.id}>{u.name}</li>)}
      </ul>
    </div>
  )
}
```

---

## 3. Suspense fallback при навигации

### Как Suspense работает с навигацией

Когда `React.lazy()` загружает компонент впервые, Suspense показывает fallback. При навигации через `useTransition` поведение отличается:

1. **Первая загрузка** — показывается `fallback`
2. **Переход через transition** — старый контент остаётся видимым (с `isPending`), пока новый загружается

```tsx
const HomePage = lazy(() => import('./HomePage'))
const AboutPage = lazy(() => import('./AboutPage'))

function App() {
  const [page, setPage] = useState('home')
  const [isPending, startTransition] = useTransition()

  function navigate(newPage: string) {
    startTransition(() => {
      setPage(newPage)
    })
  }

  const PageComponent = page === 'home' ? HomePage : AboutPage

  return (
    <div>
      <nav>
        <button onClick={() => navigate('home')}>Главная</button>
        <button onClick={() => navigate('about')}>О нас</button>
      </nav>

      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        <Suspense fallback={<div>Загрузка страницы...</div>}>
          <PageComponent />
        </Suspense>
      </div>
    </div>
  )
}
```

### Ключевые моменты

- `Suspense fallback` показывается **только при первой загрузке** компонента
- При последующих переходах `isPending` из `useTransition` управляет визуальным состоянием
- Старый контент остаётся интерактивным во время перехода

---

## 4. `useDeferredValue` с `initialValue` (новое в React 19)

### Что нового

В React 19 `useDeferredValue` принимает **второй аргумент** — начальное значение:

```tsx
const deferredValue = useDeferredValue(value, initialValue)
```

### Как это работает

```tsx
const deferredQuery = useDeferredValue(query, '')
```

1. При **первом рендере**: `deferredQuery === ''` (initialValue)
2. React **сразу** планирует повторный рендер с реальным значением `query`
3. При **изменениях**: `deferredQuery` обновляется с низким приоритетом

### Зачем нужен `initialValue`?

Без `initialValue` первый рендер использует реальное значение, что может вызвать задержку при тяжёлом контенте. С `initialValue` первый рендер мгновенный:

```tsx
// Без initialValue — первый рендер может быть медленным
const deferredQuery = useDeferredValue(query)

// С initialValue — первый рендер мгновенный с пустым результатом
const deferredQuery = useDeferredValue(query, '')
```

### Полный пример — Поиск

```tsx
function Search() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query, '')
  const isStale = deferredQuery !== query

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Поиск..."
      />

      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <SearchResults query={deferredQuery} />
      </div>
    </div>
  )
}

// memo важен! Без него компонент будет ререндериться при каждом нажатии
const SearchResults = memo(function SearchResults({ query }: { query: string }) {
  // тяжёлый рендеринг...
  const results = expensiveSearch(query)
  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
})
```

### Сравнение с debounce

| `debounce`                    | `useDeferredValue`             |
| ----------------------------- | ------------------------------ |
| Задержка фиксированная       | Адаптивная (зависит от устройства) |
| Работает на уровне событий   | Работает на уровне рендеринга  |
| Нужна библиотека (lodash)    | Встроен в React                |
| Не прерываемый               | Прерываемый (concurrent)       |

---

## Резюме

| Инструмент                       | Что нового в React 19                    |
| -------------------------------- | ---------------------------------------- |
| `startTransition(async fn)`      | Поддержка async-функций                  |
| `isPending`                      | Остаётся true на время всей async-операции |
| `Suspense` + `useTransition`     | Плавная навигация без мерцания fallback  |
| `useDeferredValue(val, initial)` | Параметр initialValue для быстрого первого рендера |
