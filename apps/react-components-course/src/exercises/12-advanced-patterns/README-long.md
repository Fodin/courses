# Level 12: Продвинутые паттерны — подробное руководство

## Controlled vs Uncontrolled: компонент в двух режимах

Представьте выключатель света. Обычный выключатель — **uncontrolled**: он сам помнит, включён ли свет. Умный дом с центральным пультом — **controlled**: состояние хранится в системе, выключатель просто отображает его и сообщает об изменениях.

В React та же логика. Нативные `<input>` работают в обоих режимах:

```tsx
// Uncontrolled — браузер хранит значение
<input defaultValue="hello" />

// Controlled — React хранит значение
<input value={text} onChange={e => setText(e.target.value)} />
```

### Почему важно поддерживать оба режима?

**Uncontrolled** — меньше кода у пользователя. Идеально для простых форм, когда значение нужно только при сабмите.

**Controlled** — полный контроль. Нужен для валидации на лету, синхронизации нескольких компонентов, сохранения в глобальный стор.

### TypeScript: принудительный парный props

Если `value` передан без `onChange` — это баг. TypeScript должен это поймать:

```tsx
// Discriminated union через never
type ControlledProps = {
  value: Date
  onChange: (date: Date) => void
  defaultValue?: never  // запрещаем смешивание
}

type UncontrolledProps = {
  defaultValue?: Date
  value?: never        // запрещаем смешивание
  onChange?: never
}

type DatePickerProps = (ControlledProps | UncontrolledProps) & {
  // общие props для обоих режимов
  minDate?: Date
  maxDate?: Date
  placeholder?: string
}
```

### Реализация: useControllableState

Классический паттерн — хук, который абстрагирует работу с обоими режимами:

```tsx
function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (value: T) => void] {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined

  const value = isControlled ? controlledValue : internalValue

  const setValue = (newValue: T) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  return [value, setValue]
}
```

Компонент использует хук и не знает, в каком режиме работает:

```tsx
function DatePicker({ value, defaultValue, onChange, ...rest }: DatePickerProps) {
  const [date, setDate] = useControllableState(value, defaultValue ?? new Date(), onChange)
  // дальше работаем только с date и setDate
}
```

### ⚠️ Частые ошибки

❌ **Переключение между режимами во время работы** — если передать `value` после того как компонент работал как uncontrolled, React выдаст предупреждение и поведение станет неопределённым.

```tsx
// Плохо: value появляется из undefined
function Form() {
  const [controlled, setControlled] = useState(false)
  return <DatePicker value={controlled ? someDate : undefined} />
}
```

✅ **Определяйте режим при монтировании** — если value передан изначально, компонент controlled. Если нет — uncontrolled навсегда.

---

## Headless компоненты: логика без UI

Представьте шеф-повара и официанта. Шеф знает рецепты и управляет кухней (логика), официант решает как подать блюдо (UI). Headless компонент — это шеф. UI — сменяемый официант.

### Зачем это нужно?

Headless архитектура позволяет:
- Переиспользовать сложную логику в разных UI-контекстах
- Тестировать логику отдельно от UI
- Пользователям библиотеки использовать вашу логику со своим дизайном

### useDropdown: headless хук

```tsx
interface UseDropdownOptions {
  options: string[]
  defaultSelected?: string | null
  onSelect?: (value: string) => void
}

interface UseDropdownReturn {
  isOpen: boolean
  selected: string | null
  triggerProps: {
    onClick: () => void
    'aria-haspopup': 'listbox'
    'aria-expanded': boolean
  }
  listProps: {
    role: 'listbox'
    'aria-label': string
  }
  getOptionProps: (option: string) => {
    role: 'option'
    'aria-selected': boolean
    onClick: () => void
  }
  close: () => void
}

function useDropdown({ options, defaultSelected = null, onSelect }: UseDropdownOptions): UseDropdownReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(defaultSelected)

  const handleSelect = (option: string) => {
    setSelected(option)
    setIsOpen(false)
    onSelect?.(option)
  }

  return {
    isOpen,
    selected,
    triggerProps: {
      onClick: () => setIsOpen(prev => !prev),
      'aria-haspopup': 'listbox',
      'aria-expanded': isOpen,
    },
    listProps: {
      role: 'listbox',
      'aria-label': 'Список вариантов',
    },
    getOptionProps: (option) => ({
      role: 'option',
      'aria-selected': selected === option,
      onClick: () => handleSelect(option),
    }),
    close: () => setIsOpen(false),
  }
}
```

### Compound component на основе хука

Хук предоставляет логику. Compound component предоставляет дефолтный UI через контекст:

```tsx
// Context для compound компонента
const DropdownContext = createContext<UseDropdownReturn | null>(null)

function useDropdownContext() {
  const ctx = useContext(DropdownContext)
  if (!ctx) throw new Error('useDropdownContext: нужен Dropdown как родитель')
  return ctx
}

// Корневой компонент создаёт хук и передаёт результат через контекст
function Dropdown({ children, options, onSelect }: DropdownProps) {
  const dropdown = useDropdown({ options, onSelect })
  return (
    <DropdownContext.Provider value={dropdown}>
      <div style={{ position: 'relative' }}>{children}</div>
    </DropdownContext.Provider>
  )
}

// Sub-компоненты читают из контекста
Dropdown.Trigger = function DropdownTrigger({ children }: { children: React.ReactNode }) {
  const { selected, triggerProps } = useDropdownContext()
  return (
    <button {...triggerProps}>
      {children ?? selected ?? 'Выберите...'}
    </button>
  )
}

Dropdown.List = function DropdownList({ options }: { options: string[] }) {
  const { isOpen, listProps, getOptionProps, selected } = useDropdownContext()
  if (!isOpen) return null
  return (
    <ul {...listProps}>
      {options.map(opt => (
        <li key={opt} {...getOptionProps(opt)}>
          {opt} {selected === opt && '✓'}
        </li>
      ))}
    </ul>
  )
}
```

### ⚠️ Частые ошибки

❌ **ARIA атрибуты только в UI-слое** — если доступность реализована в компоненте, а не в хуке, кастомный UI теряет её.

```tsx
// Плохо: ARIA только в компоненте
function DropdownTrigger() {
  return <button aria-expanded={isOpen}>...</button>  // кастомный UI не получит aria-expanded
}
```

✅ **ARIA в хуке через triggerProps** — пользователь хука автоматически получает правильные атрибуты через spread.

---

## State Machines: явные переходы

Представьте светофор. Он не хранит `isRed`, `isYellow`, `isGreen` как три независимых флага — это три булевых значения, из которых теоретически можно получить `isRed && isGreen`. Вместо этого светофор хранит одно значение: `'red' | 'yellow' | 'green'`.

### Проблема флагов

```tsx
// Плохо: невозможные состояния возможны
const [isLoading, setIsLoading] = useState(false)
const [isError, setIsError] = useState(false)
const [isSuccess, setIsSuccess] = useState(false)
// Можно получить isLoading && isError && isSuccess === true — абсурд
```

### State machine через discriminated union

```tsx
// Хорошо: только допустимые состояния
type CheckoutState =
  | { status: 'idle' }
  | { status: 'shipping'; data: Partial<ShippingData> }
  | { status: 'payment'; shipping: ShippingData }
  | { status: 'confirmation'; orderId: string; shipping: ShippingData }
  | { status: 'error'; message: string; previousStatus: string }
```

TypeScript сужает тип при проверке `status`:

```tsx
if (state.status === 'confirmation') {
  console.log(state.orderId)  // TypeScript знает: orderId есть
  console.log(state.message)  // Ошибка: message нет в confirmation
}
```

### Typed actions и useReducer

```tsx
type CheckoutAction =
  | { type: 'START_SHIPPING' }
  | { type: 'SUBMIT_SHIPPING'; payload: ShippingData }
  | { type: 'SUBMIT_PAYMENT' }
  | { type: 'CONFIRM_ORDER'; orderId: string }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'RESET' }

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'START_SHIPPING':
      if (state.status !== 'idle') return state  // защита от невалидного перехода
      return { status: 'shipping', data: {} }

    case 'SUBMIT_SHIPPING':
      if (state.status !== 'shipping') return state
      return { status: 'payment', shipping: action.payload }

    case 'CONFIRM_ORDER':
      if (state.status !== 'payment') return state
      return { status: 'confirmation', orderId: action.orderId, shipping: state.shipping }

    case 'SET_ERROR':
      return { status: 'error', message: action.message, previousStatus: state.status }

    case 'RESET':
      return { status: 'idle' }

    default:
      return state
  }
}
```

### ⚠️ Частые ошибки

❌ **Переходы без защиты** — `SUBMIT_PAYMENT` без проверки `status === 'payment'` позволяет пропустить шаги.

❌ **Данные не привязаны к состоянию** — хранить `shippingData` отдельно от состояния `shipping`, а потом не знать, актуальны ли данные.

✅ **Данные внутри состояния** — в статусе `payment` уже есть `shipping`, в `confirmation` уже есть `orderId`. Нет лишних полей — нет путаницы.

---

## Provider pattern для UI-библиотек

Компонентная библиотека нуждается в единой точке конфигурации: цвета, размеры, локаль, стили. Передавать это через props в каждый компонент — неудобно. Provider решает это элегантно.

### Типизированный конфиг

```tsx
interface UIKitConfig {
  colorScheme: 'light' | 'dark'
  primaryColor: string
  borderRadius: 'none' | 'sm' | 'md' | 'lg'
  size: 'compact' | 'normal' | 'large'
}

const DEFAULT_CONFIG: UIKitConfig = {
  colorScheme: 'light',
  primaryColor: '#1976d2',
  borderRadius: 'md',
  size: 'normal',
}
```

### Компоненты читают конфиг + локальный override

```tsx
function useUIKit() {
  return useContext(UIKitContext) ?? DEFAULT_CONFIG
}

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: UIKitConfig['size']  // локальный override
  children: React.ReactNode
}

function LibButton({ variant = 'primary', size, children }: ButtonProps) {
  const config = useUIKit()
  const effectiveSize = size ?? config.size  // props > контекст > дефолт
  // ...
}
```

### ⚠️ Частые ошибки

❌ **createContext без дефолтного значения** — компоненты ломаются за пределами провайдера. Всегда давайте разумный дефолт.

❌ **Мутировать конфиг** — конфиг из контекста — readonly. Создавайте новый объект при изменении.

✅ **Partial overrides через spread** — `<UIKitProvider config={{ ...defaultConfig, primaryColor: '#e91e63' }}>` — удобная точечная настройка.

---

## Capstone: принципы проектирования мини-библиотеки

Когда создаёте набор компонентов, держите в голове пирамиду:

```
      Capstone
     /        \
  Headless    State Machine
 /        \  /            \
Context   Compound    Polymorphic
 \          |           /
  forwardRef + Error Boundaries
       |
   TypeScript-first API
```

Каждый компонент библиотеки должен:
1. **Button** — полиморфный `as` prop, compound variants, forwardRef
2. **Input** — controlled + uncontrolled, forwardRef, error state
3. **Modal** — portal, фокус-трап, context для sub-компонентов, Error Boundary
4. **Select** — headless хук + compound, ARIA, keyboard navigation

Финальная цель: пользователь библиотеки может взять только хук (`useDropdown`) и построить свой UI, или взять готовый компонент (`<Select>`) — оба пути первоклассные.
