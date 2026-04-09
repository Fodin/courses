# Level 12: Advanced Patterns — Detailed Guide

## Controlled vs Uncontrolled: component in two modes

Imagine a light switch. A regular switch is **uncontrolled**: it remembers itself whether the light is on. A smart home with a central panel is **controlled**: state is stored in the system, the switch only displays it and reports changes.

Same logic in React. Native `<input>` works in both modes:

```tsx
// Uncontrolled — browser stores the value
<input defaultValue="hello" />

// Controlled — React stores the value
<input value={text} onChange={e => setText(e.target.value)} />
```

### Why support both modes?

**Uncontrolled** — less code for the user. Ideal for simple forms where value is only needed on submit.

**Controlled** — full control. Needed for live validation, synchronizing multiple components, saving to global store.

### TypeScript: forced paired props

If `value` is passed without `onChange` — it's a bug. TypeScript should catch this:

```tsx
// Discriminated union via never
type ControlledProps = {
  value: Date
  onChange: (date: Date) => void
  defaultValue?: never  {/* prevent mixing */}
}

type UncontrolledProps = {
  defaultValue?: Date
  value?: never         {/* prevent mixing */}
  onChange?: never
}

type DatePickerProps = (ControlledProps | UncontrolledProps) & {
  {/* shared props for both modes */}
  minDate?: Date
  maxDate?: Date
  placeholder?: string
}
```

### Implementation: useControllableState

A classic pattern — a hook that abstracts both modes:

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

The component uses the hook and doesn't know which mode it works in:

```tsx
function DatePicker({ value, defaultValue, onChange, ...rest }: DatePickerProps) {
  const [date, setDate] = useControllableState(value, defaultValue ?? new Date(), onChange)
  {/* now we only work with date and setDate */}
}
```

### ⚠️ Common mistakes

❌ **Switching between modes during runtime** — if you pass `value` after the component worked as uncontrolled, React will warn and behavior becomes undefined.

```tsx
// Bad: value appears from undefined
function Form() {
  const [controlled, setControlled] = useState(false)
  return <DatePicker value={controlled ? someDate : undefined} />
}
```

✅ **Determine mode at mount** — if value is passed initially, component is controlled. If not — uncontrolled forever.

---

## Headless components: logic without UI

Imagine a chef and a waiter. The chef knows recipes and manages the kitchen (logic), the waiter decides how to serve the dish (UI). A headless component is the chef. UI — a replaceable waiter.

### Why is this needed?

Headless architecture allows:
- Reusing complex logic in different UI contexts
- Testing logic separately from UI
- Library users to use your logic with their own design

### useDropdown: headless hook

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
      'aria-label': 'Options list',
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

### Compound component based on the hook

The hook provides logic. Compound component provides default UI through context:

```tsx
// Context for compound component
const DropdownContext = createContext<UseDropdownReturn | null>(null)

function useDropdownContext() {
  const ctx = useContext(DropdownContext)
  if (!ctx) throw new Error('useDropdownContext: needs Dropdown as parent')
  return ctx
}

// Root component creates hook and passes result through context
function Dropdown({ children, options, onSelect }: DropdownProps) {
  const dropdown = useDropdown({ options, onSelect })
  return (
    <DropdownContext.Provider value={dropdown}>
      <div style={{ position: 'relative' }}>{children}</div>
    </DropdownContext.Provider>
  )
}

// Sub-components read from context
Dropdown.Trigger = function DropdownTrigger({ children }: { children: React.ReactNode }) {
  const { selected, triggerProps } = useDropdownContext()
  return (
    <button {...triggerProps}>
      {children ?? selected ?? 'Select...'}
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

### ⚠️ Common mistakes

❌ **ARIA attributes only in UI layer** — if accessibility is in the component, not the hook, custom UI loses it.

```tsx
// Bad: ARIA only in component
function DropdownTrigger() {
  return <button aria-expanded={isOpen}>...</button>  {/* custom UI won't get aria-expanded */}
}
```

✅ **ARIA in hook via triggerProps** — hook user automatically gets correct attributes through spread.

---

## State Machines: explicit transitions

Imagine a traffic light. It doesn't store `isRed`, `isYellow`, `isGreen` as three independent flags — those are three booleans that could theoretically give `isRed && isGreen`. Instead, the traffic light stores one value: `'red' | 'yellow' | 'green'`.

### The flags problem

```tsx
// Bad: impossible states are possible
const [isLoading, setIsLoading] = useState(false)
const [isError, setIsError] = useState(false)
const [isSuccess, setIsSuccess] = useState(false)
// Can get isLoading && isError && isSuccess === true — absurd
```

### State machine via discriminated union

```tsx
// Good: only valid states
type CheckoutState =
  | { status: 'idle' }
  | { status: 'shipping'; data: Partial<ShippingData> }
  | { status: 'payment'; shipping: ShippingData }
  | { status: 'confirmation'; orderId: string; shipping: ShippingData }
  | { status: 'error'; message: string; previousStatus: string }
```

TypeScript narrows the type when checking `status`:

```tsx
if (state.status === 'confirmation') {
  console.log(state.orderId)  {/* TypeScript knows: orderId exists */}
  console.log(state.message)  {/* Error: message doesn't exist in confirmation */}
}
```

### Typed actions and useReducer

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
      if (state.status !== 'idle') return state  {/* protection from invalid transition */}
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

### ⚠️ Common mistakes

❌ **Transitions without protection** — `SUBMIT_PAYMENT` without checking `status === 'payment'` allows skipping steps.

❌ **Data not bound to state** — storing `shippingData` separately from `shipping` state, then not knowing if data is current.

✅ **Data inside state** — in `payment` status there's already `shipping`, in `confirmation` there's already `orderId`. No extra fields — no confusion.

---

## Provider pattern for UI libraries

A component library needs a single configuration point: colors, sizes, locale, styles. Passing this via props to each component is inconvenient. Provider solves this elegantly.

### Typed config

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

### Components read config + local override

```tsx
function useUIKit() {
  return useContext(UIKitContext) ?? DEFAULT_CONFIG
}

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: UIKitConfig['size']  {/* local override */}
  children: React.ReactNode
}

function LibButton({ variant = 'primary', size, children }: ButtonProps) {
  const config = useUIKit()
  const effectiveSize = size ?? config.size  {/* props > context > default */}
  // ...
}
```

### ⚠️ Common mistakes

❌ **createContext without default value** — components break outside the provider. Always give a sensible default.

❌ **Mutating config** — config from context is readonly. Create a new object when changing.

✅ **Partial overrides via spread** — `<UIKitProvider config={{ ...defaultConfig, primaryColor: '#e91e63' }}>` — convenient fine-tuning.

---

## Capstone: mini-library design principles

When creating a set of components, keep the pyramid in mind:

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

Each library component should:
1. **Button** — polymorphic `as` prop, compound variants, forwardRef
2. **Input** — controlled + uncontrolled, forwardRef, error state
3. **Modal** — portal, focus trap, context for sub-components, Error Boundary
4. **Select** — headless hook + compound, ARIA, keyboard navigation

Final goal: library users can take just the hook (`useDropdown`) and build their own UI, or take the ready component (`<Select>`) — both paths are first-class.
