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
// ============================================
//
// Реализуйте кастомный <Select> с декларативным API и поддержкой
// навигации с клавиатуры (ArrowDown, ArrowUp, Enter, Escape).
//
// Итоговый API:
//
//   <Select onChange={setValue} placeholder="Выберите...">
//     <Select.Options>
//       <Select.Option value="ru">Россия</Select.Option>
//       <Select.Option value="de">Германия</Select.Option>
//     </Select.Options>
//   </Select>

// --- Step 1: Типы контекста ---

// TODO: Создайте интерфейс SelectContextValue с полями:
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

const SelectContext = createContext<SelectContextValue | null>(null)

// TODO: Реализуйте useSelectContext() с проверкой на null
function useSelectContext(): SelectContextValue {
  // TODO: ваш код здесь
  throw new Error('Not implemented')
}

// --- Step 3: Вспомогательная функция для извлечения values ---

// TODO: Реализуйте функцию, которая обходит children и собирает
// все value из Select.Option компонентов в массив string[].
// Это нужно для клавиатурной навигации по индексу.
function extractOptionValues(_children: ReactNode): string[] {
  // TODO: ваш код здесь
  // Подсказка: обходите children рекурсивно,
  // ищите элементы с props.value !== undefined
  return []
}

// --- Step 4: SelectRoot — корневой компонент ---

interface SelectRootProps {
  children: ReactNode
  onChange?: (value: string) => void
  placeholder?: string
}

// TODO: Реализуйте SelectRoot:
//   State: selected, isOpen, focusedIndex
//   - select(value): устанавливает selected, закрывает список, вызывает onChange
//   - toggle(): открывает/закрывает список
//   - close(): закрывает список
//   - handleKeyDown: обрабатывает ArrowDown, ArrowUp, Enter/Space, Escape
//   - useEffect: закрывает список при клике вне компонента (mousedown + rootRef)
//   - Рендерит SelectContext.Provider + SelectTrigger + children
function SelectRoot({ children, onChange: _onChange, placeholder = 'Выберите...' }: SelectRootProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  // TODO: Извлеките options из children через extractOptionValues
  const options: string[] = []

  // TODO: Реализуйте функции select, toggle, close

  // TODO: Реализуйте handleKeyDown для клавиатурной навигации
  const handleKeyDown = (_e: KeyboardEvent<HTMLDivElement>) => {
    // TODO: обработка ArrowDown, ArrowUp, Enter, Space, Escape
  }

  // TODO: useEffect для закрытия при клике вне
  useEffect(() => {
    // TODO: addEventListener('mousedown', handler) + cleanup
  }, [])

  const value = useMemo(
    () => ({
      selected,
      focusedIndex,
      isOpen,
      options,
      select: (_v: string) => { setSelected(_v) },  // TODO: доработать
      toggle: () => { setIsOpen(o => !o) },          // TODO: доработать
      close: () => { setIsOpen(false) },             // TODO: доработать
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
        <button>{placeholder}</button>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

// --- Step 5: Select.Trigger ---

// TODO: Реализуйте SelectTrigger:
//   - Читает selected, isOpen, toggle из контекста
//   - Показывает selected или placeholder
//   - onClick → toggle()
//   - aria-haspopup="listbox", aria-expanded={isOpen}
function SelectTrigger({ placeholder }: { placeholder: string }) {
  // TODO: используйте useSelectContext()
  return (
    <button aria-haspopup="listbox">
      {placeholder}
    </button>
  )
}

// --- Step 6: Select.Options ---

// TODO: Реализуйте SelectOptions:
//   - Читает isOpen из контекста
//   - Если !isOpen — возвращает null
//   - Рендерит children с role="listbox"
function SelectOptions({ children }: { children: ReactNode }) {
  // TODO: ваш код здесь
  return <div role="listbox">{children}</div>
}

// --- Step 7: Select.Option ---

interface SelectOptionProps {
  value: string
  children: ReactNode
}

// TODO: Реализуйте SelectOption:
//   - Читает selected, focusedIndex, options, select из контекста
//   - isSelected = selected === value
//   - isFocused = options[focusedIndex] === value
//   - onClick → select(value)
//   - role="option", aria-selected={isSelected}
//   - Визуально выделяет выбранный и focused варианты
function SelectOption({ value, children }: SelectOptionProps) {
  // TODO: ваш код здесь
  return (
    <div role="option" onClick={() => {}}>
      {children}
    </div>
  )
}

// Чтобы TypeScript не ругался на неиспользуемую переменную
void SelectTrigger

// --- Step 8: Соберите Select ---

// TODO: установите displayName для каждого компонента
// TODO: соберите через Object.assign
const Select = Object.assign(SelectRoot, {
  Options: SelectOptions,
  Option: SelectOption,
})

// ============================================
// Демонстрация
// ============================================

export function Task3_2() {
  const { t } = useLanguage()
  const [value, setValue] = useState<string | null>(null)

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 3.2 — Select</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>
        Реализуйте компоненты выше. Проверьте клавиатурную навигацию:
        Tab → стрелки → Enter → Escape
      </p>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
            Выберите страну:
          </label>
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
          <div style={{ padding: '8px 12px', background: '#f0fdf4', borderRadius: 6, fontSize: 14 }}>
            Выбрано: <strong>{value}</strong>
          </div>
        )}
      </div>
    </div>
  )
}
