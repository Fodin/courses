# Уровень 2: Хук use()

## Введение

React 19 добавляет новый API — `use()`. Это **не хук** в классическом понимании: его можно вызывать внутри условий, циклов и после раннего return. Он работает с двумя типами значений: **Promise** и **Context**.

---

## use(Promise) — чтение асинхронных данных

### Как это работает

```tsx
import { use, Suspense } from 'react'

// Промис создаётся ВНЕ компонента (или кэшируется)
const dataPromise = fetch('/api/users').then(r => r.json())

function UserList() {
  const users = use(dataPromise)  // "приостанавливает" компонент
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}

// Обязательно оберните в Suspense!
function App() {
  return (
    <Suspense fallback={<p>Загрузка...</p>}>
      <UserList />
    </Suspense>
  )
}
```

### Важные правила

1. **Не создавайте промис в рендере** — это вызовет бесконечный цикл
2. **Промис должен быть стабильным** — кэшируйте или создавайте вне компонента
3. **Suspense обязателен** — без него React бросит ошибку

### Сравнение с useEffect

| Подход | Бойлерплейт | Loading state | Error handling |
|--------|-------------|---------------|----------------|
| `useEffect` + `useState` | Много (3 состояния) | Ручной | Ручной |
| `use(Promise)` | Минимум | Suspense | ErrorBoundary |

---

## use(Context) — замена useContext

```tsx
import { use, createContext } from 'react'

const ThemeContext = createContext('light')

function ThemedButton() {
  const theme = use(ThemeContext)
  return <button className={theme}>Кнопка</button>
}
```

### Что нового в React 19

Провайдер контекста упрощён:

```tsx
// React 18
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// React 19
<ThemeContext value="dark">
  <App />
</ThemeContext>
```

---

## Условный вызов use()

Главное преимущество `use()` перед хуками — его можно вызывать условно:

```tsx
function UserGreeting({ isLoggedIn }) {
  if (isLoggedIn) {
    // ✅ Это работает!
    const user = use(UserContext)
    return <p>Привет, {user.name}!</p>
  }
  return <p>Войдите в систему</p>
}
```

С `useContext` такой код **невозможен** — хуки нельзя вызывать условно.

### Когда это полезно

- Компонент, который рендерит разный UI в зависимости от состояния
- Условная загрузка данных
- Early return перед чтением контекста

---

## Паттерн: Suspense + use + ErrorBoundary

Полный паттерн обработки асинхронных данных:

```tsx
<ErrorBoundary fallback={<ErrorMessage />}>
  <Suspense fallback={<Spinner />}>
    <DataComponent />
  </Suspense>
</ErrorBoundary>
```

### Порядок работы

1. Компонент вызывает `use(promise)`
2. React «приостанавливает» компонент → показывается Suspense fallback
3. Когда промис resolve → компонент рендерится с данными
4. Если промис reject → ErrorBoundary ловит ошибку

### ErrorBoundary

```tsx
class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return <p>Ошибка: {this.state.error.message}</p>
    }
    return this.props.children
  }
}
```

---

## Итого

| API | Принимает | Когда использовать |
|-----|-----------|-------------------|
| `use(Promise)` | Promise | Чтение async-данных с Suspense |
| `use(Context)` | Context | Замена useContext, особенно условная |

Ключевое отличие от хуков: `use()` можно вызывать в условиях и циклах.
