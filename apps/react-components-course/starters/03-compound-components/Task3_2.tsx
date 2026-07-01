import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useMemo,
  type ReactNode,
  type KeyboardEvent,
} from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.2: Select с клавиатурной навигацией
// Task 3.2: Select with keyboard navigation
// ============================================
//
// Реализуйте кастомный <Select> с декларативным API и поддержкой
// Implement a custom <Select> with a declarative API and support for
// навигации с клавиатуры (ArrowDown, ArrowUp, Enter, Escape).
// keyboard navigation (ArrowDown, ArrowUp, Enter, Escape).
//
// Итоговый API:
// The final API:
//
//   <Select onChange={setValue} placeholder="Выберите...">
//     <Select.Options>
//       <Select.Option value="ru">Россия</Select.Option>
//       <Select.Option value="de">Германия</Select.Option>
//     </Select.Options>
//   </Select>

// --- Step 1: Типы контекста ---
// --- Step 1: Context types ---

// TODO: Создайте интерфейс SelectContextValue с полями:
// TODO: Create the SelectContextValue interface with fields:
//   selected: string | null
//   focusedIndex: number
//   isOpen: boolean
//   options: string[]
//   select: (value: string) => void
//   toggle: () => void
//   close: () => void
//   setFocusedIndex: (i: number) => void
interface SelectContextValue {
  // TODO: ваши поля здесь
  // TODO: your fields here
  selected: string | null
  focusedIndex: number
  isOpen: boolean
  options: string[]
  select: (value: string) => void
  toggle: () => void
  close: () => void
  setFocusedIndex: (i: number) => void
}

// --- Step 2: Контекст и хук ---
// --- Step 2: Context and hook ---

const SelectContext = createContext<SelectContextValue | null>(null)

// TODO: Реализуйте useSelectContext() с проверкой на null
// TODO: Implement useSelectContext() with a null check
function useSelectContext(): SelectContextValue {
  // TODO: ваш код здесь
  // TODO: your code here
  throw new Error('Not implemented')
}

// --- Step 3: Вспомогательная функция для извлечения values ---
// --- Step 3: Helper function for extracting values ---

// TODO: Реализуйте функцию, которая обходит children и собирает
// TODO: Implement a function that traverses children and collects
// все value из Select.Option компонентов в массив string[].
// all values from Select.Option components into a string[].
// Это нужно для клавиатурной навигации по индексу.
// This is needed for keyboard navigation by index.
function extractOptionValues(_children: ReactNode): string[] {
  // TODO: ваш код здесь
  // TODO: your code here
  // Подсказка: обходите children рекурсивно,
  // Hint: traverse children recursively,
  // ищите элементы с props.value !== undefined
  // look for elements with props.value !== undefined
  return []
}

// --- Step 4: SelectRoot — корневой компонент ---
// --- Step 4: SelectRoot — root component ---

interface SelectRootProps {
  children: ReactNode
  onChange?: (value: string) => void
  placeholder?: string
}

// TODO: Реализуйте SelectRoot:
// TODO: Implement SelectRoot:
//   State: selected, isOpen, focusedIndex
//   - select(value): устанавливает selected, закрывает список, вызывает onChange
//   - select(value): sets selected, closes the list, calls onChange
//   - toggle(): открывает/закрывает список
//   - toggle(): opens/closes the list
//   - close(): закрывает список
//   - close(): closes the list
//   - handleKeyDown: обрабатывает ArrowDown, ArrowUp, Enter/Space, Escape
//   - handleKeyDown: handles ArrowDown, ArrowUp, Enter/Space, Escape
//   - useEffect: закрывает список при клике вне компонента (mousedown + rootRef)
//   - useEffect: closes the list on click outside the component (mousedown + rootRef)
//   - Рендерит SelectContext.Provider + SelectTrigger + children
//   - Renders SelectContext.Provider + SelectTrigger + children
function SelectRoot({ children, onChange: _onChange, placeholder = 'Выберите...' }: SelectRootProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  // TODO: Извлеките options из children через extractOptionValues
  // TODO: Extract options from children via extractOptionValues
  const options: string[] = []

  // TODO: Реализуйте функции select, toggle, close
  // TODO: Implement select, toggle, close functions

  // TODO: Реализуйте handleKeyDown для клавиатурной навигации
  // TODO: Implement handleKeyDown for keyboard navigation
  const handleKeyDown = (_e: KeyboardEvent<HTMLDivElement>) => {
    // TODO: обработка ArrowDown, ArrowUp, Enter, Space, Escape
    // TODO: handle ArrowDown, ArrowUp, Enter, Space, Escape
  }

  // TODO: useEffect для закрытия при клике вне
  // TODO: useEffect for closing on click outside
  useEffect(() => {
    // TODO: addEventListener('mousedown', handler) + cleanup
  }, [])

  const value = useMemo(
    () => ({
      selected,
      focusedIndex,
      isOpen,
      options,
      select: (_v: string) => { setSelected(_v) },  // TODO: доработать / improve
      toggle: () => { setIsOpen(o => !o) },          // TODO: доработать / improve
      close: () => { setIsOpen(false) },             // TODO: доработать / improve
      setFocusedIndex,
    }),
    [selected, focusedIndex, isOpen, options],
  )

  return (
    <SelectContext.Provider value={value}>
      <div
        ref={rootRef}
        onKeyDown={handleKeyDown}
        style={{ position: 'relative', display: 'inline-block', minWidth: 200 }}
      >
        {/* TODO: Добавьте SelectTrigger с placeholder */}
        {/* TODO: Add SelectTrigger with placeholder */}
        <button>{placeholder}</button>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

// --- Step 5: Select.Trigger ---

// TODO: Реализуйте SelectTrigger:
// TODO: Implement SelectTrigger:
//   - Читает selected, isOpen, toggle из контекста
//   - Reads selected, isOpen, toggle from context
//   - Показывает selected или placeholder
//   - Shows selected or placeholder
//   - onClick → toggle()
//   - aria-haspopup="listbox", aria-expanded={isOpen}
function SelectTrigger({ placeholder }: { placeholder: string }) {
  // TODO: используйте useSelectContext()
  // TODO: use useSelectContext()
  return (
    <button aria-haspopup="listbox">
      {placeholder}
    </button>
  )
}

// --- Step 6: Select.Options ---

// TODO: Реализуйте SelectOptions:
// TODO: Implement SelectOptions:
//   - Читает isOpen из контекста
//   - Reads isOpen from context
//   - Если !isOpen — возвращает null
//   - If !isOpen — return null
//   - Рендерит children с role="listbox"
//   - Renders children with role="listbox"
function SelectOptions({ children }: { children: ReactNode }) {
  // TODO: ваш код здесь
  // TODO: your code here
  return <div role="listbox">{children}</div>
}

// --- Step 7: Select.Option ---

interface SelectOptionProps {
  value: string
  children: ReactNode
}

// TODO: Реализуйте SelectOption:
// TODO: Implement SelectOption:
//   - Читает selected, focusedIndex, options, select из контекста
//   - Reads selected, focusedIndex, options, select from context
//   - isSelected = selected === value
//   - isFocused = options[focusedIndex] === value
//   - onClick → select(value)
//   - role="option", aria-selected={isSelected}
//   - Визуально выделяет выбранный и focused варианты
//   - Visually highlights the selected and focused options
function SelectOption({ value, children }: SelectOptionProps) {
  // TODO: ваш код здесь
  // TODO: your code here
  return (
    <div role="option" onClick={() => {}}>
      {children}
    </div>
  )
}

// Чтобы TypeScript не ругался на неиспользованную переменную
// To prevent TypeScript from complaining about unused variable
void SelectTrigger

// --- Step 8: Соберите Select ---
// --- Step 8: Assemble Select ---

// TODO: установите displayName для каждого компонента
// TODO: set displayName for each component
// TODO: соберите через Object.assign
// TODO: assemble via Object.assign
const Select = Object.assign(SelectRoot, {
  Options: SelectOptions,
  Option: SelectOption,
})

// ============================================
// Демонстрация
// Demo
// ============================================

export function Task3_2() {
  const { t } = useLanguage()
  const [value, setValue] = useState<string | null>(null)

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 3.2 — Select</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>
        {/* Реализуйте компоненты выше. Проверьте клавиатурную навигацию: */}
        {/* Implement the components above. Check keyboard navigation: */}
        Реализуйте компоненты выше. Проверьте клавиатурную навигацию:
        Tab → стрелки → Enter → Escape
      </p>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          {/* Выберите страну: */}
          {/* Select a country: */}
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
            Выберите страну:
          </label>
          {/* Выберите страну... */}
          {/* Select a country... */}
          <Select onChange={setValue} placeholder="Выберите страну...">
            <Select.Options>
              <Select.Option value="ru">Россия</Select.Option>
              <Select.Option value="by">Беларусь</Select.Option>
              <Select.Option value="kz">Казахстан</Select.Option>
              <Select.Option value="ua">Украина</Select.Option>
              <Select.Option value="de">Германия</Select.Option>
            </Select.Options>
          </Select>
        </div>

        {value && (
          {/* Выбрано: */}
          {/* Selected: */}
          <div style={{ padding: '8px 12px', background: '#f0fdf4', borderRadius: 6, fontSize: 14 }}>
            Выбрано: <strong>{value}</strong>
          </div>
        )}
      </div>
    </div>
  )
}
