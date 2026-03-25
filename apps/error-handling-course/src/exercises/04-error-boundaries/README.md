# 🔥 Уровень 4: Error Boundaries в React

## 🎯 Введение

В React ошибка в одном компоненте может обрушить всё дерево. Error Boundary — специальный компонент, который ловит ошибки рендера своих потомков и показывает fallback UI вместо белого экрана.

## ✅ Что ловят Error Boundaries

- ✅ Ошибки в методах жизненного цикла
- ✅ Ошибки в `render()`
- ✅ Ошибки в конструкторах дочерних компонентов

## ❌ Что НЕ ловят Error Boundaries

- ❌ Ошибки в обработчиках событий (`onClick`, `onChange`)
- ❌ Асинхронный код (`setTimeout`, `fetch`)
- ❌ Серверный рендеринг (SSR)
- ❌ Ошибки в самом Error Boundary

## 🔥 Создание Error Boundary

📌 Error Boundary — это **классовый** компонент с `getDerivedStateFromError` и/или `componentDidCatch`:

```typescript
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // Вызывается при ошибке — обновляет состояние
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  // Вызывается после ошибки — для логирования
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Ошибка:', error)
    console.error('Компонент:', errorInfo.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return <h2>Что-то пошло не так</h2>
    }
    return this.props.children
  }
}
```

### Использование

```jsx
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

## 💡 Fallback UI

Вместо простого текста можно показывать информативный UI:

```typescript
interface FallbackProps {
  error: Error
  resetError: () => void
}

class ErrorBoundary extends Component<
  { children: ReactNode; fallback: (props: FallbackProps) => ReactNode },
  ErrorBoundaryState
> {
  // ...

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback({
        error: this.state.error,
        resetError: () => this.setState({ hasError: false, error: null }),
      })
    }
    return this.props.children
  }
}

// Использование
<ErrorBoundary
  fallback={({ error, resetError }) => (
    <div>
      <h2>Ошибка: {error.message}</h2>
      <button onClick={resetError}>Попробовать снова</button>
    </div>
  )}
>
  <UserProfile />
</ErrorBoundary>
```

## 🔥 Восстановление после ошибки

💡 Ключевой приём — сброс состояния через `key`:

```typescript
class RecoverableErrorBoundary extends Component<Props, State> {
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      resetKey: this.state.resetKey + 1,
    })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />
    }
    // key заставляет React пересоздать дерево
    return <div key={this.state.resetKey}>{this.props.children}</div>
  }
}
```

## 🔥 Вложенные Error Boundaries

Можно изолировать разные части приложения:

```jsx
function App() {
  return (
    <ErrorBoundary fallback={<AppCrashPage />}>
      {/* Глобальный boundary — последняя линия обороны */}

      <Header />

      <ErrorBoundary fallback={<SidebarFallback />}>
        <Sidebar />
      </ErrorBoundary>

      <ErrorBoundary fallback={<ContentFallback />}>
        <MainContent />
      </ErrorBoundary>

      <Footer />
    </ErrorBoundary>
  )
}
```

💡 Если `Sidebar` упадёт — `MainContent` продолжит работать. Если `MainContent` упадёт — `Header` и `Footer` останутся.

### 🎯 Стратегия размещения

| Уровень | Что защищает | Fallback |
|---------|-------------|----------|
| 🔴 Корень приложения | Всё | "Приложение упало, перезагрузите" |
| 🟡 Страница/роут | Контент страницы | "Страница недоступна" |
| 🟢 Виджет/секция | Отдельный блок | "Секция недоступна" |

## Обработка ошибок в обработчиках событий

⚠️ Error Boundaries **НЕ** ловят ошибки из `onClick` и т.д. Для них нужен обычный `try/catch`:

```typescript
function SubmitButton() {
  const [error, setError] = useState<Error | null>(null)

  const handleClick = () => {
    try {
      doSomethingRisky()
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    }
  }

  if (error) {
    return <div>Ошибка: {error.message}</div>
  }

  return <button onClick={handleClick}>Отправить</button>
}
```

## React 19 и Error Boundaries

📌 В React 19 появилась поддержка Error Boundaries для функциональных компонентов, но классовый подход остаётся основным.

## ⚠️ Частые ошибки новичков

### ❌ Один Error Boundary на всё приложение

```jsx
// ❌ Плохо: один boundary на весь App
function App() {
  return (
    <ErrorBoundary>
      <Header />
      <Sidebar />
      <MainContent />
      <Footer />
    </ErrorBoundary>
  )
}
```

> Почему это ошибка: если упадёт `Sidebar`, пользователь потеряет **весь** UI — шапку, контент, футер. Вместо локальной проблемы пользователь видит глобальный крах.

```jsx
// ✅ Хорошо: гранулярные boundaries изолируют ошибки
function App() {
  return (
    <ErrorBoundary fallback={<AppCrashPage />}>
      <Header />
      <ErrorBoundary fallback={<SidebarFallback />}>
        <Sidebar />
      </ErrorBoundary>
      <ErrorBoundary fallback={<ContentFallback />}>
        <MainContent />
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  )
}
```

### ❌ Ожидание, что Error Boundary поймает ошибку из `onClick`

```typescript
// ❌ Плохо: Error Boundary НЕ поймает эту ошибку
function DeleteButton() {
  const handleClick = () => {
    throw new Error('Что-то пошло не так') // 💥 Uncaught Error!
  }
  return <button onClick={handleClick}>Удалить</button>
}
```

> Почему это ошибка: Error Boundary перехватывает только ошибки **рендера** (в `render()`, хуках, lifecycle). Ошибки в обработчиках событий проходят мимо — они вызываются асинхронно, вне стека рендера React. Результат — необработанная ошибка и потенциальный крах.

```typescript
// ✅ Хорошо: обработчик событий обёрнут в try/catch
function DeleteButton() {
  const [error, setError] = useState<Error | null>(null)

  const handleClick = () => {
    try {
      doSomethingRisky()
    } catch (e) {
      if (e instanceof Error) setError(e)
    }
  }

  if (error) return <div>Ошибка: {error.message}</div>
  return <button onClick={handleClick}>Удалить</button>
}
```

### ❌ Отсутствие кнопки восстановления в fallback UI

```jsx
// ❌ Плохо: тупик — пользователь не может ничего сделать
<ErrorBoundary
  fallback={<p>Ошибка загрузки</p>}
>
  <Dashboard />
</ErrorBoundary>
```

> Почему это ошибка: пользователь видит сообщение об ошибке, но не может ничего предпринять — только перезагрузить всю страницу. Это плохой UX: многие ошибки временные и решаются повторной попыткой.

```jsx
// ✅ Хорошо: fallback с возможностью восстановления
<ErrorBoundary
  fallback={({ error, resetError }) => (
    <div>
      <p>Ошибка: {error.message}</p>
      <button onClick={resetError}>Попробовать снова</button>
    </div>
  )}
>
  <Dashboard />
</ErrorBoundary>
```

## 📌 Итоги

- ✅ Error Boundary ловит ошибки рендера дочерних компонентов
- ✅ Реализуется как классовый компонент с `getDerivedStateFromError`
- ✅ `componentDidCatch` — для логирования
- ✅ Fallback UI — вместо белого экрана
- 💡 `key` trick — для восстановления после ошибки
- 💡 Вложенные boundaries — изоляция частей приложения
- ⚠️ Обработчики событий обрабатываются через обычный `try/catch`
