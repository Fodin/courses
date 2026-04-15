# Уровень 8: Кастомные хуки — паттерны и антипаттерны

## Кастомный хук — не абстракция, а единица переиспользования логики

Хуки React — это не магия и не ООП. Это просто функции, которые вызываются в определённом порядке. Кастомный хук — это обычная функция с `use` в имени, которая может вызывать другие хуки внутри.

Ключевой вопрос: **зачем выделять кастомный хук?**

Ответ не "чтобы было красиво". Ответ конкретный:

1. **Логика повторяется** — один и тот же набор хуков встречается в нескольких компонентах
2. **Компонент слишком сложный** — один компонент делает слишком много, его сложно читать и тестировать

Всё остальное — хук ради хука.

---

## Когда НЕ нужно выделять хук

```tsx
// ❌ Хук ради хука — одноразовая логика, живёт в одном компоненте
function useModalState() {
  const [open, setOpen] = useState(false)
  return { open, open: () => setOpen(true), close: () => setOpen(false) }
}

// ✅ Просто useState внутри компонента — достаточно
function ProfilePage() {
  const [modalOpen, setModalOpen] = useState(false)
  // ...
}
```

```tsx
// ❌ Преждевременная абстракция — хук используется один раз
function useUserProfile(userId: string) {
  const [user, setUser] = useState(null)
  useEffect(() => { fetchUser(userId).then(setUser) }, [userId])
  return user
}

// ✅ Просто useEffect в компоненте, пока не появится второй потребитель
function UserPage({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)
  useEffect(() => { fetchUser(userId).then(setUser) }, [userId])
}
```

---

## Правила именования

Хук **должен начинаться с `use`** — это не соглашение, а требование линтера (rules-of-hooks). Имя строится как глагол + существительное:

| Хук | Что делает |
|-----|-----------|
| `useDebounce` | задерживает обновление значения |
| `usePrevious` | запоминает предыдущее значение |
| `useToggle` | переключает boolean |
| `useAsync` | управляет жизненным циклом Promise |
| `useInterval` | запускает setInterval с cleanup |
| `useLocalStorage` | синхронизирует state с localStorage |

---

## Паттерн: useDebounce

Классический хук — откладывает обновление значения пока пользователь не перестанет вводить:

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer) // ← cleanup: отменяем таймер при следующем вызове
  }, [value, delay])

  return debounced
}
```

Cleanup — ключевой момент. При каждом новом значении старый таймер отменяется, новый запускается. Без cleanup каждый keystroke создаёт новый таймер и все они срабатывают.

---

## Паттерн: usePrevious

Запоминает предыдущее значение через `useRef`:

```tsx
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  })                    // ← нет массива зависимостей: обновляем после каждого рендера

  return ref.current    // ← возвращаем значение ДО текущего рендера
}
```

Почему не `useState`? Потому что `setState` триггерит ещё один рендер. `useRef` обновляется без рендера. Значение в `ref.current` — это всегда значение из предыдущего рендера, потому что эффект выполняется после.

---

## Паттерн: Latest Callback

Проблема closure trap в setInterval:

```tsx
// ❌ Closure trap: callback захватывает count=0 при создании интервала
useEffect(() => {
  const id = setInterval(() => {
    console.log(count) // всегда 0!
  }, 1000)
  return () => clearInterval(id)
}, []) // пустой массив — интервал создаётся один раз
```

Решение — хранить актуальный callback в ref:

```tsx
function useLatestCallback<T extends (...args: unknown[]) => unknown>(callback: T): T {
  const ref = useRef<T>(callback)

  useEffect(() => {
    ref.current = callback
  })

  return useCallback((...args) => ref.current(...args), []) as T
}

// Использование:
const latestCallback = useLatestCallback(() => {
  console.log(count) // всегда актуальный count!
})

useEffect(() => {
  const id = setInterval(latestCallback, 1000)
  return () => clearInterval(id)
}, [latestCallback]) // стабильная ссылка, интервал не пересоздаётся
```

Это аналог `useEffectEvent` из будущих версий React — способ "вынести" логику из зависимостей useEffect.

---

## Правила хуков: почему они существуют

React хранит хуки как **linked list** в Fiber node. Каждый хук — узел с `memoizedState` и `next`. При каждом рендере React обходит этот список по порядку — первый хук, второй, третий.

Это значит:
- Количество хуков должно быть постоянным между рендерами
- Порядок хуков должен быть одинаковым

Нарушение этих правил — runtime ошибка "Rendered more hooks than during the previous render".

```tsx
// ❌ Нельзя: хук в условии меняет порядок
function Component({ show }: { show: boolean }) {
  if (show) {
    const [val, setVal] = useState(0) // хук 1 — только если show=true!
  }
  const [other, setOther] = useState('') // хук 1 или 2 в зависимости от show
}

// ✅ Хуки всегда в одном порядке
function Component({ show }: { show: boolean }) {
  const [val, setVal] = useState(0)   // хук 1 — всегда
  const [other, setOther] = useState('') // хук 2 — всегда
}
```

---

## Антипаттерны кастомных хуков

### 1. Хук делает слишком много

```tsx
// ❌ God hook — нарушает Single Responsibility
function useUserPage(userId: string) {
  const user = useFetchUser(userId)
  const posts = useFetchPosts(userId)
  const [editMode, setEditMode] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const analytics = useAnalytics()
  // ...
}

// ✅ Маленькие хуки, скомпозированные в компоненте
function UserPage({ userId }: { userId: string }) {
  const user = useFetchUser(userId)
  const posts = useFetchPosts(userId)
  const [editMode, setEditMode] = useState(false)
  // ...
}
```

### 2. Неявные зависимости

```tsx
// ❌ Хук читает из контекста без явного указания
function useUserData() {
  const { userId } = useContext(AuthContext) // скрытая зависимость!
  return useFetch(`/users/${userId}`)
}

// ✅ Зависимость явная — через параметр
function useUserData(userId: string) {
  return useFetch(`/users/${userId}`)
}
```

### 3. Нарушение инкапсуляции — возврат setState напрямую

```tsx
// ❌ Протекающая абстракция
function useCounter() {
  const [count, setCount] = useState(0)
  return { count, setCount } // внешний код может поставить -1 или 999
}

// ✅ Инкапсулированный интерфейс
function useCounter(min = 0, max = 100) {
  const [count, setCount] = useState(min)
  const increment = () => setCount(c => Math.min(max, c + 1))
  const decrement = () => setCount(c => Math.max(min, c - 1))
  return { count, increment, decrement }
}
```

---

## ⚠️ Частые ошибки начинающих

### Забытый cleanup в useDebounce

```tsx
// ❌ Без cleanup — каждый keystroke создаёт таймер
useEffect(() => {
  setTimeout(() => setDebounced(value), delay)
  // нет return () => clearTimeout(timer)!
}, [value, delay])

// ✅ С cleanup
useEffect(() => {
  const timer = setTimeout(() => setDebounced(value), delay)
  return () => clearTimeout(timer)
}, [value, delay])
```

### usePrevious через useState

```tsx
// ❌ useState триггерит лишний рендер
function usePrevious(value) {
  const [prev, setPrev] = useState(undefined)
  const [curr, setCurr] = useState(value)
  if (curr !== value) { setPrev(curr); setCurr(value) } // ещё один рендер!
  return prev
}

// ✅ useRef не триггерит рендер
function usePrevious(value) {
  const ref = useRef()
  useEffect(() => { ref.current = value })
  return ref.current
}
```

### Нестабильная ссылка на callback в setInterval

```tsx
// ❌ Closure trap
useEffect(() => {
  const id = setInterval(() => onTick(count), 1000) // захватывает count=0
  return () => clearInterval(id)
}, []) // пустой массив — count никогда не обновится

// ✅ Latest callback через ref
const latestTick = useLatestCallback(() => onTick(count))
useEffect(() => {
  const id = setInterval(latestTick, 1000)
  return () => clearInterval(id)
}, [latestTick])
```
