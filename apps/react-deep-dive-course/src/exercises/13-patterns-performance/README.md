# Уровень 13: Продвинутые паттерны производительности

## Проблема: знания есть, но приложение всё равно тормозит

Вы изучили Fiber, reconciliation, хуки, batching, concurrent mode. Вы знаете internals. Но
реальный проект тормозит — и профайлер показывает сотни лишних рендеров. Почему?

Потому что производительность — это не про знание API. Это про **архитектурные решения**: где
держать state, как организовать Context, как структурировать компоненты. Один неправильный
выбор в начале проекта — и потом вы боретесь с useMemo везде.

Этот уровень — про системный подход. Не "навесить мемо", а "устранить причину лишних рендеров".

---

## State Colocation: держи state рядом с потребителем

Самая частая причина лишних рендеров — state поднят слишком высоко.

```tsx
// ❌ State в корне — при вводе перерендеривается ВСЯ страница
function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div>
      <Header />           {/* ← ре-рендер */}
      <Sidebar />          {/* ← ре-рендер */}
      <SearchBar query={searchQuery} onChange={setSearchQuery} />
      <HeavyDashboard />   {/* ← ре-рендер */}
      <Footer />           {/* ← ре-рендер */}
    </div>
  )
}

// ✅ State рядом с тем, кто его использует
function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('')
  return (
    <div>
      <SearchBar query={searchQuery} onChange={setSearchQuery} />
      <SearchResults query={searchQuery} />
    </div>
  )
}

function App() {
  return (
    <div>
      <Header />
      <Sidebar />
      <SearchSection />    {/* ← только этот блок ре-рендерится */}
      <HeavyDashboard />
      <Footer />
    </div>
  )
}
```

📌 Правило: если state используется только в поддереве — держи его там. Поднимай наверх только
тогда, когда без этого не обойтись.

---

## Context Splitting: один большой контекст = все подписчики ре-рендерятся

Context — мощный инструмент, но у него есть подвох: **любое изменение значения контекста
перерендеривает ВСЕХ потребителей**, даже если они используют только часть данных.

```tsx
// ❌ Один большой контекст — все компоненты ре-рендерятся при поиске
const AppContext = createContext({ user, theme, searchQuery, setSearchQuery })

// При вводе в поиск: user и theme не меняются, но UserCard и ThemeToggle
// всё равно перерендериваются, потому что объект контекста новый

// ✅ Разделить на независимые контексты
const UserContext = createContext(user)         // меняется редко
const ThemeContext = createContext(theme)        // меняется редко
const SearchContext = createContext({ searchQuery, setSearchQuery }) // меняется часто
```

🔥 Ключевое: разделяй по **частоте изменений**, а не по "логической принадлежности".

---

## "Children as Props": дешёвый способ избежать ре-рендера

Этот паттерн использует фундаментальное свойство React: **JSX-элемент, переданный как children,
создаётся ДО рендера родителя**. Если родитель ре-рендерится, children уже существуют как
React-элементы — React не перерендеривает их заново.

```tsx
// ❌ HeavyChild — дочерний, ре-рендерится при каждом setState в Wrapper
function Wrapper() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <HeavyChild />   {/* ← ре-рендер при каждом клике */}
    </div>
  )
}

// ✅ HeavyChild передаётся снаружи — React видит тот же element object
function Wrapper({ children }) {
  const [count, setCount] = useState(0)
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      {children}   {/* ← НЕ ре-рендерится */}
    </div>
  )
}

function App() {
  return (
    <Wrapper>
      <HeavyChild />
    </Wrapper>
  )
}
```

💡 Почему работает: `<HeavyChild />` создаётся в `App`. Когда `Wrapper` ре-рендерится,
он получает тот же объект `children` из props. React видит те же `type` и `key` — bailout.

---

## Lazy State Initialization: не выполняй тяжёлое вычисление на каждом рендере

```tsx
// ❌ expensiveCompute() вызывается при каждом рендере (но результат игнорируется)
const [value, setValue] = useState(expensiveCompute())

// ✅ функция-инициализатор вызывается ОДИН РАЗ при монтировании
const [value, setValue] = useState(() => expensiveCompute())
```

📌 С точки зрения Fiber: `useState` при первом рендере (mount) смотрит на тип аргумента.
Функция → вызывает один раз и сохраняет результат в `memoizedState`. При последующих рендерах
(update) аргумент `useState` вообще игнорируется.

---

## useReducer vs useState: когда переключаться

`useReducer` не быстрее `useState` сам по себе. Преимущество в другом:

```tsx
// ❌ useState: каждый обработчик — новая функция при каждом рендере
const [state, setState] = useState({ items: [], filter: 'all', loading: false })
const addItem = (item) => setState(s => ({ ...s, items: [...s.items, item] }))
const setFilter = (f) => setState(s => ({ ...s, filter: f }))

// ✅ useReducer: dispatch — стабильная ссылка (React гарантирует)
const [state, dispatch] = useReducer(reducer, initialState)
// dispatch никогда не меняется → можно передавать дочерним без useCallback
```

🔥 Главный плюс: `dispatch` стабилен по ссылке. Передаёте дочерним компонентам — не нужен
`useCallback`. Это особенно важно при Context: можно разделить ValueContext и DispatchContext.

---

## Виртуализация: зачем нужна

Reconciliation 10 000 элементов — это 10 000 fiber nodes, которые React обходит при каждом
рендере. Даже если они не меняются — traversal занимает время.

```
Список 10 000 строк:
  без виртуализации  → 10 000 DOM-узлов в дереве → ~200ms рендер
  с виртуализацией   → ~20 видимых DOM-узлов     → ~2ms рендер
```

Виртуализация (react-window, TanStack Virtual) рендерит только видимые элементы.
При скролле — переиспользует DOM-узлы, подменяя данные.

---

## ⚠️ Распространённые ошибки новичков

### 1. Поднимать state "на всякий случай"

```tsx
// ❌ "Вдруг пригодится" — поднимаем в корень
function App() {
  const [modalOpen, setModalOpen] = useState(false)  // используется только в Header
  ...
}

// ✅ Держим там, где нужно
function Header() {
  const [modalOpen, setModalOpen] = useState(false)
  ...
}
```

### 2. Класть setter и value в один контекст

```tsx
// ❌ ThemeContext с value + setter — обновляется при каждой смене темы,
//    даже компоненты, которые только вызывают setter (они не должны ре-рендериться)
const ThemeContext = createContext({ theme, setTheme })

// ✅ Два контекста — потребители setter не ре-рендерятся при смене темы
const ThemeValueContext = createContext(theme)
const ThemeSetterContext = createContext(setTheme)  // setTheme стабильна
```

### 3. Создавать объект/массив инлайн в JSX, ломая React.memo

```tsx
// ❌ Новый объект на каждом рендере → React.memo бесполезен
<MemoizedChild style={{ color: 'red' }} options={['a', 'b']} />

// ✅ Вынести за пределы рендера или useMemo
const style = { color: 'red' }        // константа вне компонента
const options = ['a', 'b']            // константа вне компонента
<MemoizedChild style={style} options={options} />
```

---

## Резюме

```
Проблема                   → Решение
─────────────────────────────────────────────────────
State слишком высоко       → State Colocation
Весь UI ре-рендерится      → Context Splitting
Тяжёлый дочерний компонент → Children as Props
Тяжёлая инициализация      → Lazy State Init
Нестабильные коллбэки      → useReducer + dispatch
10 000+ элементов          → Виртуализация
```
