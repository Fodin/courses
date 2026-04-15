# Уровень 12. FP в React — расширенная теория

## Откуда React взял FP-идеи

React создавался под влиянием функциональных языков — особенно Elm. Elm Architecture, предложенная в 2012 году, ввела три ключевых понятия: Model (state), View (чистая функция из state в UI) и Update (reducer). React перенял эту идею и развил её через хуки.

```
Elm Architecture → Redux → useReducer + Context
```

Хуки — это не просто API-сахар. Это способ выражать поведение через функции высшего порядка без классов и `this`. `useMemo`, `useCallback`, `useReducer` — всё это функциональные паттерны: мемоизация, замыкания, редьюсеры.

## Почему чистый рендер важен

React предполагает, что компонент — чистая функция:

```typescript
// Чистый компонент: одинаковые props → одинаковый DOM
function UserCard({ name, email }: User) {
  return <div>{name} — {email}</div>
}
```

Если компонент читает внешнее мутируемое состояние или имеет побочные эффекты в теле — React не сможет корректно работать с `StrictMode`, `Suspense`, `concurrent rendering`. Чистота рендера — это не рекомендация, это контракт.

`useEffect` — это специально отведённое место для побочных эффектов. Разделение "чистый рендер / эффекты в useEffect" — это паттерн functional core / imperative shell из уровня 7 на уровне компонента.

## useReducer как мини-Redux

`useReducer` реализует классический паттерн Elm Architecture:

```typescript
type Action = { type: 'INCREMENT' } | { type: 'RESET' }

const reducer = (count: number, action: Action): number => {
  switch (action.type) {
    case 'INCREMENT': return count + 1
    case 'RESET':     return 0
  }
}

function Counter() {
  const [count, dispatch] = useReducer(reducer, 0)
  return (
    <button onClick={() => dispatch({ type: 'INCREMENT' })}>
      {count}
    </button>
  )
}
```

Преимущества перед `useState`:
- Вся логика изменения состояния в одном месте (reducer)
- Легко тестировать: `reducer(state, action) === expectedState`
- Легко добавить Undo/Redo, логирование, time-travel debugging

## Immer: иммутабельность без церемоний

Ручное обновление глубоко вложенных объектов — основная боль иммутабельного подхода:

```typescript
// ❌ без Immer — громоздко
const newState = {
  ...state,
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: 'Moscow',
    }
  }
}

// ✅ с Immer — читаемо
const newState = produce(state, draft => {
  draft.user.address.city = 'Moscow'
})
```

Immer использует `Proxy` под капотом: пока вы мутируете `draft`, Immer записывает операции. По окончании `produce` применяет их к копии оригинала. Оригинальный объект остаётся нетронутым.

### Immer и Structural Sharing

Immer не копирует весь объект — только изменённые ветки:

```
state = { a: { x: 1 }, b: { y: 2 } }
         ↑                ↑
         │                └── не изменялось → та же ссылка
         └── изменялось → новый объект

newState = { a: новый объект, b: та же ссылка что в state }
```

Это называется structural sharing. React использует поверхностное сравнение (`===`) при `React.memo` и `useMemo` — structural sharing делает такие оптимизации надёжными.

## Undo/Redo: иммутабельность как суперсила

Иммутабельные состояния позволяют реализовать time-travel debugging бесплатно: каждый `dispatch` сохраняет предыдущее состояние в стеке.

```
dispatch(action):
  past    = [...past, present]
  present = reducer(present, action)
  future  = []

undo():
  past    = past.slice(0, -1)
  present = last(past)          // восстанавливаем прошлое
  future  = [present, ...future]

redo():
  past    = [...past, present]
  present = future[0]
  future  = future.slice(1)
```

Redux DevTools работает по тому же принципу. В приложениях с мутабельным стейтом такое было бы невозможным или требовало бы глубокого клонирования.

## Кастомные хуки как HOF

Хук — это функция, которую можно параметризовать другими функциями. Это и есть функция высшего порядка:

```typescript
// HOF: принимает функции-правила, возвращает behaviour
function useValidation(rules: ValidationRule[]) {
  const [errors, setErrors] = useState<string[]>([])
  const touch = useCallback(
    (value: string) => setErrors(rules.flatMap(r => r(value))),
    []
  )
  return { errors, touch }
}
```

Правила — это pure функции `string → string[]`. Их можно тестировать без React. Хук только соединяет логику с состоянием.

Аналогично `useFilteredList`:

```typescript
function useFilteredList<T>(items: T[], filters: FilterFn<T>[]): T[] {
  return items.filter(item => filters.every(f => f(item)))
}
```

Это просто `filter` + `every`, обёрнутые в хук. Ноль реактивных зависимостей кроме входных данных.

## ADT для UI state

Когда у компонента несколько взаимоисключающих состояний, ADT (algebraic data type) надёжнее отдельных флагов:

```typescript
// Три флага: 2³ = 8 комбинаций, из которых только 4 допустимы
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
const [data, setData] = useState<User[] | null>(null)

// Можно оказаться в состоянии loading=true, data=[...] одновременно — баг!

// ADT: ровно 4 состояния, ни одной недопустимой комбинации
type RemoteData<E, A> =
  | { tag: 'NotAsked' }
  | { tag: 'Loading' }
  | { tag: 'Failure'; error: E }
  | { tag: 'Success'; data: A }
```

Компилятор TypeScript гарантирует, что вы не можете создать `{ tag: 'Loading'; data: [...] }` — такого типа не существует.

## RemoteData в экосистеме

`RemoteData` — не изобретение этого курса. Это паттерн из Elm, привнесённый в TypeScript такими библиотеками как `@devexperts/remote-data-ts` и `fp-ts-remote-data`. Идея та же — использовать тип суммы вместо набора флагов.

Аналогичный подход применяется в `tRPC`, `react-query` (хотя там отдельные поля, но с конвенцией), `SWR`.

## Match: exhaustive pattern matching

```tsx
function Match<E, A>({ data, notAsked, loading, failure, success }: MatchProps<E, A>) {
  switch (data.tag) {
    case 'NotAsked': return notAsked()
    case 'Loading':  return loading()
    case 'Failure':  return failure(data.error)
    case 'Success':  return success(data.data)
  }
}
```

TypeScript проверяет exhaustiveness: если добавить новый вариант в `RemoteData`, но не добавить новый кейс в switch — будет ошибка компиляции. Этого не добиться при `if (loading) ... if (error) ...`.

В JSX это выглядит декларативно:

```tsx
<Match
  data={remoteUsers}
  notAsked={() => <p>Нажмите загрузить</p>}
  loading={() => <Spinner />}
  failure={e => <ErrorMessage error={e} />}
  success={users => <UserList users={users} />}
/>
```

## Связь с Effect для async

В уровне 11 мы изучали Effect — библиотеку для контроля над побочными эффектами. RemoteData и Effect — комплементарные инструменты:

```typescript
// Effect моделирует вычисление: Effect<A, E, R>
// RemoteData моделирует его UI-состояние: NotAsked | Loading | Failure | Success

function useRemoteData<E, A>(effect: Effect.Effect<A, E>) {
  const [state, setState] = useState<RemoteData<E, A>>(notAsked())

  const run = useCallback(() => {
    setState(loading())
    Effect.runPromise(effect)
      .then(data => setState(success(data)))
      .catch(e => setState(failure(e)))
  }, [effect])

  return { state, run }
}
```

Effect описывает "как получить данные", RemoteData описывает "в каком состоянии находится результат". Вместе они дают полный контроль над async-потоком.

## Когда FP в React — overkill

FP-паттерны не нужны везде. Признаки избыточного применения:

- Форма с 3 полями использует `RemoteData` для каждого поля
- `useReducer` для простого `useState<boolean>`
- `pipeRules` для единственного правила
- `Match` компонент там, где `if` справляется за две строки
- Immer для обновления простого примитивного стейта

Хорошее правило: применяйте FP-паттерны когда они убирают классы ошибок или упрощают тест. Если паттерн добавляет сложность без пользы — это преждевременная абстракция.

| Ситуация | Инструмент |
|---|---|
| Простое true/false | `useState` |
| 2+ взаимосвязанных поля | `useReducer` |
| Загрузка с ошибкой | `RemoteData` |
| Несколько независимых правил | `pipeRules` |
| Несколько независимых фильтров | `useFilteredList` |
| История изменений | `History` + `useReducer` |
