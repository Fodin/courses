# Level 4: Higher-Order Components — Подробная теория

## Откуда взялась идея: аналогия с декораторами

В Python и Java есть декораторы — способ добавить поведение функции или классу без изменения её кода. В JavaScript это паттерн "функция высшего порядка":

```js
// Обычная функция
function greet(name) {
  return `Привет, ${name}!`
}

// Декоратор — добавляет логирование
function withLogging(fn) {
  return function(...args) {
    console.log('Вызов с аргументами:', args)
    const result = fn(...args)
    console.log('Результат:', result)
    return result
  }
}

const greetWithLogging = withLogging(greet)
greetWithLogging('Алиса') // логирует и выполняет
```

HOC в React — это тот же паттерн, но для компонентов:

```tsx
// HOC принимает компонент → возвращает улучшенный компонент
function withLogging<P>(Component: React.ComponentType<P>) {
  return function WithLogging(props: P) {
    console.log(`Рендер ${Component.name}`, props)
    return <Component {...props} />
  }
}
```

Аналогия: HOC — это как специя. Берёте блюдо (компонент) и добавляете специю (поведение), не меняя рецепт самого блюда.

## Анатомия HOC: три части

```tsx
// ЧАСТЬ 1: Функция-фабрика (принимает компонент)
function withLoading<P extends object>(
  Component: React.ComponentType<P>         // WrappedComponent
) {
  // ЧАСТЬ 2: Возвращаемый компонент (принимает объединённые пропсы)
  const WithLoading = ({ isLoading, ...props }: P & { isLoading: boolean }) => {
    // ЧАСТЬ 3: Логика сквозного поведения
    if (isLoading) {
      return <div style={{ padding: '2rem', textAlign: 'center' }}>⏳ Загрузка...</div>
    }
    return <Component {...(props as P)} />
  }

  // Обязательно: читаемое имя в DevTools
  WithLoading.displayName = `withLoading(${Component.displayName ?? Component.name})`
  return WithLoading
}
```

## Типизация HOC: разбор по шагам

Типизация HOC — одно из самых сложных мест в TypeScript + React. Разберём подробно.

### Шаг 1: Generic параметр P

```tsx
function withLoading<P extends object>(Component: React.ComponentType<P>)
```

`P extends object` — ограничение говорит: "P — это тип пропсов оборачиваемого компонента, и это объект". Без ограничения `P` мог бы быть `string` или `number`.

### Шаг 2: Тип возвращаемого компонента

HOC добавляет новые пропсы к существующим. Это выражается через пересечение типов:

```tsx
// P — пропсы оригинала
// { isLoading: boolean } — новые пропсы HOC
// P & { isLoading: boolean } — пропсы оборачивающего компонента
({ isLoading, ...props }: P & { isLoading: boolean }) => { ... }
```

### Шаг 3: Деструктуризация и spread

```tsx
// Извлекаем isLoading (нужен HOC)
// Остаток передаём в оригинальный компонент
const { isLoading, ...rest } = allProps
<Component {...(rest as P)} />
```

Приведение `rest as P` необходимо: TypeScript не всегда может вывести, что после удаления `isLoading` из `P & { isLoading: boolean }` останется именно `P`.

### Полный пример с комментариями типов

```tsx
// HOC для обработки ошибок
interface WithErrorProps {
  error?: Error | null
}

function withError<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & WithErrorProps> {  // явный тип возврата
  const WithError = ({ error, ...props }: P & WithErrorProps) => {
    if (error) {
      return (
        <div style={{ color: 'red', padding: '1rem' }}>
          Ошибка: {error.message}
        </div>
      )
    }
    return <Component {...(props as P)} />
  }

  WithError.displayName = `withError(${Component.displayName ?? Component.name})`
  return WithError
}
```

## withAuth: контекст авторизации

`withAuth` — классический пример HOC с React Context. HOC сам обращается к контексту, освобождая оборачиваемый компонент от этой заботы.

```tsx
// Определяем контекст авторизации
interface AuthContextValue {
  isAuthenticated: boolean
  user: { name: string; role: string } | null
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
})

// HOC: проверяет авторизацию, показывает заглушку если не авторизован
function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType
) {
  const WithAuth = (props: P) => {
    const { isAuthenticated } = useContext(AuthContext)

    if (!isAuthenticated) {
      return FallbackComponent
        ? <FallbackComponent />
        : <div>Пожалуйста, войдите в систему</div>
    }

    return <Component {...props} />
  }

  WithAuth.displayName = `withAuth(${Component.displayName ?? Component.name})`
  return WithAuth
}

// Использование
const ProtectedDashboard = withAuth(Dashboard, LoginPage)
```

Обратите внимание: `withAuth` использует `useContext` — это нормально. HOC может использовать хуки, потому что возвращаемая функция — это функциональный компонент.

## Композиция HOC: функция compose

Несколько HOC часто применяются вместе. Без compose это выглядит так:

```tsx
// ❌ Нечитаемая вложенность
const Enhanced = withErrorBoundary(withAuth(withLoading(MyComponent)))
```

Результат: при ошибке в `MyComponent` сначала сработает `ErrorBoundary`, потом `Auth`, потом `Loading`. Порядок оборачивания важен, и в такой записи легко запутаться.

Функция `compose` решает это:

```tsx
// Типизированная compose для произвольного числа HOC
type HOC<P> = (Component: React.ComponentType<P>) => React.ComponentType<any>

function compose<P>(...hocs: HOC<any>[]) {
  return (Component: React.ComponentType<P>) =>
    hocs.reduceRight((acc, hoc) => hoc(acc), Component as React.ComponentType<any>)
}

// ✅ Читаемо: применяется снизу вверх (withLoading → withAuth → withErrorBoundary)
const Enhanced = compose(
  withErrorBoundary,  // внешний слой
  withAuth,           // средний слой
  withLoading         // ближайший к компоненту
)(MyComponent)
```

Порядок в `compose`: крайний левый HOC — самый внешний в дереве. Компонент оборачивается справа налево.

```mermaid
graph LR
  A[withErrorBoundary] -->|оборачивает| B[withAuth]
  B -->|оборачивает| C[withLoading]
  C -->|оборачивает| D[MyComponent]
```

## HOC vs Хуки: детальное сравнение

Современный React делает большую часть задач HOC через хуки. Но у каждого подхода своя ниша.

### Пример: отслеживание размера окна

```tsx
// ❌ HOC-подход — многословно, трудно тестировать
interface WithWindowSizeProps {
  windowWidth: number
  windowHeight: number
}

function withWindowSize<P>(Component: React.ComponentType<P & WithWindowSizeProps>) {
  const WithWindowSize = (props: P) => {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

    useEffect(() => {
      const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return <Component {...props} windowWidth={size.width} windowHeight={size.height} />
  }
  WithWindowSize.displayName = `withWindowSize(${Component.name})`
  return WithWindowSize
}

// Использование — нужно создавать новый компонент
const MyComponentWithSize = withWindowSize(MyComponent)
```

```tsx
// ✅ Хук-подход — лаконично, переиспользуемо, тестируемо
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

// Использование — прямо в компоненте
function MyComponent() {
  const { width, height } = useWindowSize()
  // ...
}
```

### Таблица: когда что выбирать

| Задача | HOC | Хук |
|---|---|---|
| Условный рендер (не авторизован → показать логин) | ✅ Уместно | Можно, но нужен early return |
| Обёртка в DOM-элемент (ErrorBoundary) | ✅ Необходимо | ❌ Невозможно |
| Логика с состоянием (fetch, resize) | ❌ Избыточно | ✅ Лучше |
| Данные из контекста в пропсы | Было актуально до хуков | ✅ `useContext` напрямую |
| Совместимость с классовыми компонентами | ✅ | ❌ |

## Типичные ошибки

### ❌ HOC создаётся внутри рендера

```tsx
// ❌ КРИТИЧЕСКАЯ ОШИБКА — новый тип компонента на каждый рендер
function Parent() {
  // withLoading создаёт новую функцию при каждом рендере Parent
  // React думает, что это новый компонент и размонтирует/монтирует заново
  const EnhancedList = withLoading(ItemList)
  return <EnhancedList isLoading={loading} items={items} />
}
```

```tsx
// ✅ Правильно — создаём один раз вне компонента
const EnhancedList = withLoading(ItemList)

function Parent() {
  return <EnhancedList isLoading={loading} items={items} />
}
```

Почему это критично: при создании HOC внутри рендера каждый рендер родителя заставляет React считать `EnhancedList` новым типом компонента. Это приводит к полному размонтированию и монтированию дерева — теряется state, срабатывают эффекты.

### ❌ Не передаются все пропсы

```tsx
// ❌ Плохо — пропсы оригинального компонента теряются
function withLoading(Component) {
  return function({ isLoading }) {  // остальные пропсы не деструктурированы!
    if (isLoading) return <Spinner />
    return <Component />  // пустой компонент без пропсов!
  }
}
```

```tsx
// ✅ Хорошо — spread передаёт все пропсы
function withLoading<P extends object>(Component: React.ComponentType<P>) {
  return function({ isLoading, ...props }: P & { isLoading: boolean }) {
    if (isLoading) return <Spinner />
    return <Component {...(props as P)} />
  }
}
```

### ❌ Нет displayName

```tsx
// ❌ В DevTools: <Unknown> <Unknown> <Unknown>
function withAuth(Component) {
  return (props) => {
    // ...
  }
}

// ✅ В DevTools: withAuth(Dashboard) → withLoading(Dashboard)
function withAuth(Component) {
  const WithAuth = (props) => { /* ... */ }
  WithAuth.displayName = `withAuth(${Component.displayName ?? Component.name ?? 'Component'})`
  return WithAuth
}
```

### ❌ Игнорирование ref (если нужен)

```tsx
// ❌ ref не пробрасывается — компонент не получит ref
const EnhancedInput = withSomething(Input)
<EnhancedInput ref={inputRef} />  // ref укажет на HOC-обёртку, не на <input>

// ✅ Используйте forwardRef если ref важен
function withSomething<P extends object>(Component: React.ComponentType<P>) {
  const WithSomething = React.forwardRef<HTMLInputElement, P>((props, ref) => {
    return <Component {...props} ref={ref} />
  })
  WithSomething.displayName = `withSomething(${Component.name})`
  return WithSomething
}
```

## Практика: withErrorBoundary

Error Boundaries в React можно реализовать только через классовые компоненты. HOC — идеальный способ обернуть классовый `ErrorBoundary` в удобный декоратор:

```tsx
// Классовый ErrorBoundary (неизбежно)
class ErrorBoundaryClass extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ color: 'red' }}>Что-то пошло не так: {this.state.error?.message}</div>
      )
    }
    return this.props.children
  }
}

// HOC-обёртка — делает его удобным
function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WithErrorBoundary = (props: P) => (
    <ErrorBoundaryClass fallback={fallback}>
      <Component {...props} />
    </ErrorBoundaryClass>
  )
  WithErrorBoundary.displayName = `withErrorBoundary(${Component.displayName ?? Component.name})`
  return WithErrorBoundary
}
```

## Итог: место HOC в современном React

HOC — зрелый паттерн, который решил множество задач до появления хуков. Сегодня его применение сужается, но не исчезает:

**HOC остаётся актуальным для:**
- `withErrorBoundary` — ErrorBoundary требует классового компонента
- Библиотек (Redux `connect`, React Router `withRouter`)
- Условного рендера с фолбэком (`withAuth`)

**Хуки лучше для:**
- Любой логики с `useState`, `useEffect`, `useContext`
- Переиспользуемой логики без изменения рендера

Знать HOC необходимо: вы встретите его в любом зрелом проекте на React.
