import React, { useState, useReducer, useContext, createContext, useRef, useEffect, useId, forwardRef } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode, ReactElement } from 'react'

// ============================================
// Task 12.1 Solution: DatePicker controlled + uncontrolled
// ============================================

// --- useControllableState ---

function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (value: T) => void] {
  const [internalValue, setInternalValue] = useState<T>(defaultValue)
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

// --- DatePicker types ---

type ControlledDatePickerProps = {
  value: Date
  onChange: (date: Date) => void
  defaultValue?: never
}

type UncontrolledDatePickerProps = {
  defaultValue?: Date
  value?: never
  onChange?: never
}

type DatePickerProps = (ControlledDatePickerProps | UncontrolledDatePickerProps) & {
  minDate?: Date
  maxDate?: Date
  placeholder?: string
}

// --- Calendar helpers ---

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

function buildCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // getDay() returns 0=Sun..6=Sat, convert to Mon-first
  const startDow = (firstDay.getDay() + 6) % 7
  const days: (Date | null)[] = []
  for (let i = 0; i < startDow; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
  return days
}

// --- DatePicker component ---

function DatePicker({ value, defaultValue, onChange, placeholder = 'Выберите дату' }: DatePickerProps) {
  const [date, setDate] = useControllableState(value, defaultValue ?? new Date())
  const [viewYear, setViewYear] = useState(date.getFullYear())
  const [viewMonth, setViewMonth] = useState(date.getMonth())
  const [isOpen, setIsOpen] = useState(false)
  const today = new Date()

  const days = buildCalendarDays(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const selectDay = (d: Date) => {
    setDate(d)
    setIsOpen(false)
  }

  const cellStyle = (d: Date | null): React.CSSProperties => {
    if (!d) return { visibility: 'hidden' }
    const selected = isSameDay(d, date)
    const isToday = isSameDay(d, today)
    return {
      width: 32, height: 32,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '50%',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: selected ? 600 : isToday ? 500 : 400,
      background: selected ? '#1976d2' : 'transparent',
      color: selected ? '#fff' : isToday ? '#1976d2' : '#333',
      border: isToday && !selected ? '1px solid #1976d2' : '1px solid transparent',
    }
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          padding: '0.5rem 0.9rem',
          borderRadius: '6px',
          border: '1px solid #ddd',
          background: '#fff',
          cursor: 'pointer',
          fontSize: '0.9rem',
          minWidth: 160,
        }}
      >
        {placeholder}: {date.toLocaleDateString('ru-RU')}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '110%',
          left: 0,
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '10px',
          padding: '1rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 100,
          minWidth: 260,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#666' }}>‹</button>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{MONTHS[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#666' }}>›</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: '0.25rem' }}>
            {WEEKDAYS.map(w => (
              <div key={w} style={{ textAlign: 'center', fontSize: '0.75rem', color: '#999', fontWeight: 600, padding: '0.2rem 0' }}>{w}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {days.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={cellStyle(d)} onClick={() => d && selectDay(d)}>
                  {d?.getDate()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function Task12_1_Solution() {
  const [controlledDate, setControlledDate] = useState(new Date(2025, 5, 15))

  return (
    <div className="exercise-container">
      <h2>Решение 12.1: DatePicker — Controlled + Uncontrolled</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Один компонент — два режима. TypeScript запрещает value без onChange.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Controlled (value + onChange)
          </div>
          <DatePicker
            value={controlledDate}
            onChange={setControlledDate}
          />
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: '#e3f2fd', borderRadius: '6px', fontSize: '0.85rem' }}>
            Внешний state: <strong>{controlledDate.toLocaleDateString('ru-RU')}</strong>
          </div>
          <button
            onClick={() => setControlledDate(new Date())}
            style={{ marginTop: '0.5rem', padding: '0.3rem 0.75rem', fontSize: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: '#f5f5f5' }}
          >
            Сброс на сегодня
          </button>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Uncontrolled (только defaultValue)
          </div>
          <DatePicker
            defaultValue={new Date(2025, 0, 1)}
            placeholder="Дата рождения"
          />
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: '#f3e5f5', borderRadius: '6px', fontSize: '0.85rem', color: '#666' }}>
            Состояние хранится внутри компонента
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 12.2 Solution: Headless useDropdown + Dropdown compound
// ============================================

interface UseDropdownOptions {
  options: string[]
  defaultSelected?: string | null
  onSelect?: (value: string) => void
}

interface UseDropdownReturn {
  isOpen: boolean
  selected: string | null
  options: string[]
  triggerProps: {
    onClick: () => void
    'aria-haspopup': 'listbox'
    'aria-expanded': boolean
  }
  listboxProps: {
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
  const [selected, setSelected] = useState<string | null>(defaultSelected)

  const handleSelect = (option: string) => {
    setSelected(option)
    setIsOpen(false)
    onSelect?.(option)
  }

  return {
    isOpen,
    selected,
    options,
    triggerProps: {
      onClick: () => setIsOpen(prev => !prev),
      'aria-haspopup': 'listbox',
      'aria-expanded': isOpen,
    },
    listboxProps: {
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

// --- Dropdown Compound Component ---

const DropdownContext = createContext<UseDropdownReturn | null>(null)

function useDropdownContext(): UseDropdownReturn {
  const ctx = useContext(DropdownContext)
  if (!ctx) throw new Error('useDropdownContext: компонент должен быть внутри <Dropdown>')
  return ctx
}

interface DropdownProps {
  options: string[]
  onSelect?: (value: string) => void
  defaultSelected?: string
  children: ReactNode
}

function Dropdown({ options, onSelect, defaultSelected, children }: DropdownProps) {
  const dropdown = useDropdown({ options, onSelect, defaultSelected })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropdown.isOpen) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        dropdown.close()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdown.isOpen, dropdown.close])

  return (
    <DropdownContext.Provider value={dropdown}>
      <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

Dropdown.Trigger = function DropdownTrigger({ children }: { children?: ReactNode }) {
  const { selected, triggerProps } = useDropdownContext()
  return (
    <button
      {...triggerProps}
      style={{
        padding: '0.5rem 1rem',
        border: '1px solid #ddd',
        borderRadius: '6px',
        background: '#fff',
        cursor: 'pointer',
        minWidth: 180,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.9rem',
      }}
    >
      <span>{children ?? selected ?? 'Выберите...'}</span>
      <span style={{ color: '#999', fontSize: '0.8rem' }}>{triggerProps['aria-expanded'] ? '▲' : '▼'}</span>
    </button>
  )
}

interface DropdownListProps {
  options?: string[]
}

Dropdown.List = function DropdownList({ options: optionsProp }: DropdownListProps) {
  const { isOpen, options, selected, listboxProps, getOptionProps } = useDropdownContext()
  const list = optionsProp ?? options
  if (!isOpen) return null
  return (
    <ul
      {...listboxProps}
      style={{
        position: 'absolute',
        top: '110%',
        left: 0,
        right: 0,
        margin: 0,
        padding: '0.25rem 0',
        listStyle: 'none',
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        zIndex: 100,
      }}
    >
      {list.map(opt => (
        <Dropdown.Option key={opt} option={opt} isSelected={selected === opt} />
      ))}
    </ul>
  )
}

Dropdown.Option = function DropdownOption({ option, isSelected }: { option: string; isSelected?: boolean }) {
  const { getOptionProps, selected } = useDropdownContext()
  const active = isSelected ?? selected === option
  return (
    <li
      {...getOptionProps(option)}
      style={{
        padding: '0.5rem 0.75rem',
        cursor: 'pointer',
        fontSize: '0.9rem',
        background: active ? '#e3f2fd' : 'transparent',
        color: active ? '#1976d2' : '#333',
        fontWeight: active ? 500 : 400,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {option}
      {active && <span>✓</span>}
    </li>
  )
}

const FRUIT_OPTIONS = ['Яблоко', 'Банан', 'Манго', 'Апельсин', 'Клубника', 'Черника']
const LANG_OPTIONS = ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Kotlin']

export function Task12_2_Solution() {
  const [log, setLog] = useState<string[]>([])
  const addLog = (msg: string) => setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)])

  // Кастомный UI использует хук напрямую
  const langDropdown = useDropdown({
    options: LANG_OPTIONS,
    onSelect: (v) => addLog(`Хук: выбран язык "${v}"`),
  })
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!langDropdown.isOpen) return
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) langDropdown.close()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [langDropdown.isOpen, langDropdown.close])

  return (
    <div className="exercise-container">
      <h2>Решение 12.2: Headless useDropdown + Dropdown compound</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Один хук — два UI. Compound component для стандартного UI, хук напрямую для кастомного.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Compound API
          </div>
          <Dropdown options={FRUIT_OPTIONS} onSelect={v => addLog(`Compound: выбран фрукт "${v}"`)}>
            <Dropdown.Trigger />
            <Dropdown.List />
          </Dropdown>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Кастомный UI через хук
          </div>
          <div ref={langRef} style={{ position: 'relative', display: 'inline-block' }}>
            <button
              {...langDropdown.triggerProps}
              style={{
                padding: '0.5rem 1rem',
                border: '2px solid #9c27b0',
                borderRadius: '20px',
                background: langDropdown.selected ? '#f3e5f5' : '#fff',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: '#9c27b0',
                fontWeight: 500,
              }}
            >
              {langDropdown.selected ?? 'Язык программирования'} {langDropdown.isOpen ? '▲' : '▼'}
            </button>

            {langDropdown.isOpen && (
              <div
                {...langDropdown.listboxProps}
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  background: '#fff',
                  border: '2px solid #9c27b0',
                  borderRadius: '12px',
                  padding: '0.5rem',
                  zIndex: 100,
                  minWidth: 200,
                  boxShadow: '0 4px 20px rgba(156,39,176,0.2)',
                }}
              >
                {LANG_OPTIONS.map(opt => (
                  <div
                    key={opt}
                    {...langDropdown.getOptionProps(opt)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      background: langDropdown.selected === opt ? '#f3e5f5' : 'transparent',
                      color: langDropdown.selected === opt ? '#9c27b0' : '#333',
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {log.length > 0 && (
        <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#f5f5f5', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          {log.map((entry, i) => <div key={i} style={{ color: '#333' }}>{entry}</div>)}
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 12.3 Solution: Checkout state machine
// ============================================

interface ShippingData {
  name: string
  address: string
  city: string
}

type CheckoutState =
  | { status: 'idle' }
  | { status: 'shipping'; data: Partial<ShippingData> }
  | { status: 'payment'; shipping: ShippingData }
  | { status: 'confirmation'; orderId: string; shipping: ShippingData }
  | { status: 'error'; message: string; from: string }

type CheckoutAction =
  | { type: 'START_CHECKOUT' }
  | { type: 'SUBMIT_SHIPPING'; payload: ShippingData }
  | { type: 'SUBMIT_PAYMENT' }
  | { type: 'CONFIRM_ORDER'; orderId: string }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'RETRY' }
  | { type: 'RESET' }

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'START_CHECKOUT':
      if (state.status !== 'idle') return state
      return { status: 'shipping', data: {} }

    case 'SUBMIT_SHIPPING':
      if (state.status !== 'shipping') return state
      return { status: 'payment', shipping: action.payload }

    case 'SUBMIT_PAYMENT':
      if (state.status !== 'payment') return state
      // simulate async — in real app this would be async action
      return state

    case 'CONFIRM_ORDER':
      if (state.status !== 'payment') return state
      return { status: 'confirmation', orderId: action.orderId, shipping: state.shipping }

    case 'SET_ERROR':
      return { status: 'error', message: action.message, from: state.status }

    case 'RETRY':
      if (state.status !== 'error') return state
      if (state.from === 'shipping') return { status: 'shipping', data: {} }
      if (state.from === 'payment') return { status: 'payment', shipping: (state as { shipping?: ShippingData }).shipping ?? { name: '', address: '', city: '' } }
      return { status: 'idle' }

    case 'RESET':
      return { status: 'idle' }

    default:
      return state
  }
}

const CHECKOUT_STEPS = ['idle', 'shipping', 'payment', 'confirmation'] as const

function CheckoutStepper({ currentStatus }: { currentStatus: string }) {
  const stepLabels: Record<string, string> = {
    idle: 'Корзина',
    shipping: 'Доставка',
    payment: 'Оплата',
    confirmation: 'Готово',
  }
  const currentIndex = CHECKOUT_STEPS.indexOf(currentStatus as typeof CHECKOUT_STEPS[number])

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
      {CHECKOUT_STEPS.map((step, i) => {
        const done = i < currentIndex
        const active = i === currentIndex
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 600,
              background: done ? '#4caf50' : active ? '#1976d2' : '#e0e0e0',
              color: done || active ? '#fff' : '#999',
              transition: 'all 0.2s',
            }}>
              {done ? '✓' : i + 1}
            </div>
            <div style={{ marginLeft: 6, fontSize: '0.8rem', fontWeight: active ? 600 : 400, color: active ? '#1976d2' : '#666' }}>
              {stepLabels[step]}
            </div>
            {i < CHECKOUT_STEPS.length - 1 && (
              <div style={{ width: 32, height: 2, margin: '0 8px', background: done ? '#4caf50' : '#e0e0e0', transition: 'background 0.2s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function Task12_3_Solution() {
  const [state, dispatch] = useReducer(checkoutReducer, { status: 'idle' })
  const [shippingForm, setShippingForm] = useState<Partial<ShippingData>>({ name: '', address: '', city: '' })

  const handleShippingSubmit = () => {
    if (!shippingForm.name || !shippingForm.address || !shippingForm.city) return
    dispatch({ type: 'SUBMIT_SHIPPING', payload: shippingForm as ShippingData })
  }

  const handlePayment = () => {
    const orderId = Math.random().toString(36).slice(2, 10).toUpperCase()
    // Simulate success
    dispatch({ type: 'CONFIRM_ORDER', orderId })
  }

  const simulateError = () => {
    dispatch({ type: 'SET_ERROR', message: 'Сервер временно недоступен. Попробуйте снова.' })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.5rem 0.75rem',
    border: '1px solid #ddd', borderRadius: '6px',
    fontSize: '0.9rem', boxSizing: 'border-box',
  }

  const btnStyle = (color: string): React.CSSProperties => ({
    padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none',
    background: color, color: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem',
  })

  return (
    <div className="exercise-container">
      <h2>Решение 12.3: Checkout state machine</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        useReducer с discriminated union. Невозможные состояния — невозможны.
      </p>

      <CheckoutStepper currentStatus={state.status === 'error' ? 'idle' : state.status} />

      <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '10px', minHeight: 160 }}>
        {state.status === 'idle' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛒</div>
            <p style={{ color: '#555', marginBottom: '1rem' }}>Ваша корзина: 3 товара на сумму 4 990 ₽</p>
            <button onClick={() => dispatch({ type: 'START_CHECKOUT' })} style={btnStyle('#1976d2')}>
              Оформить заказ
            </button>
          </div>
        )}

        {state.status === 'shipping' && (
          <div>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Адрес доставки</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                style={inputStyle}
                placeholder="Имя получателя"
                value={shippingForm.name ?? ''}
                onChange={e => setShippingForm(f => ({ ...f, name: e.target.value }))}
              />
              <input
                style={inputStyle}
                placeholder="Адрес"
                value={shippingForm.address ?? ''}
                onChange={e => setShippingForm(f => ({ ...f, address: e.target.value }))}
              />
              <input
                style={inputStyle}
                placeholder="Город"
                value={shippingForm.city ?? ''}
                onChange={e => setShippingForm(f => ({ ...f, city: e.target.value }))}
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleShippingSubmit} style={btnStyle('#1976d2')}>Далее</button>
                <button onClick={simulateError} style={btnStyle('#e65100')}>Симулировать ошибку</button>
              </div>
            </div>
          </div>
        )}

        {state.status === 'payment' && (
          <div>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Оплата</h3>
            <div style={{ padding: '0.75rem', background: '#e3f2fd', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Доставка: <strong>{state.shipping.name}</strong>, {state.shipping.address}, {state.shipping.city}
            </div>
            <div style={{ padding: '1rem', border: '2px dashed #ddd', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem', color: '#666' }}>
              💳 Форма ввода карты (упрощено)
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handlePayment} style={btnStyle('#388e3c')}>Оплатить 4 990 ₽</button>
              <button onClick={simulateError} style={btnStyle('#e65100')}>Симулировать ошибку</button>
            </div>
          </div>
        )}

        {state.status === 'confirmation' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
            <h3 style={{ margin: '0 0 0.5rem' }}>Заказ оформлен!</h3>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: '#1976d2', marginBottom: '0.5rem' }}>
              #{state.orderId}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
              Доставим в {state.shipping.city} по адресу: {state.shipping.address}
            </div>
            <button onClick={() => dispatch({ type: 'RESET' })} style={btnStyle('#666')}>
              Новый заказ
            </button>
          </div>
        )}

        {state.status === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>❌</div>
            <h3 style={{ margin: '0 0 0.5rem', color: '#d32f2f' }}>Ошибка</h3>
            <p style={{ color: '#555', marginBottom: '1rem' }}>{state.message}</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => dispatch({ type: 'RETRY' })} style={btnStyle('#1976d2')}>
                Повторить
              </button>
              <button onClick={() => dispatch({ type: 'RESET' })} style={btnStyle('#666')}>
                Сброс
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Task 12.4 Solution: Capstone mini UI-library
// ============================================

// --- UIKit Config & Provider ---

interface UIKitConfig {
  colorScheme: 'light' | 'dark'
  primaryColor: string
  size: 'compact' | 'normal' | 'large'
}

const DEFAULT_UIKIT_CONFIG: UIKitConfig = {
  colorScheme: 'light',
  primaryColor: '#1976d2',
  size: 'normal',
}

const UIKitContext = createContext<UIKitConfig>(DEFAULT_UIKIT_CONFIG)

function useUIKit(): UIKitConfig {
  return useContext(UIKitContext)
}

function UIKitProvider({ config, children }: { config: Partial<UIKitConfig>; children: ReactNode }) {
  const merged: UIKitConfig = { ...DEFAULT_UIKIT_CONFIG, ...config }
  return <UIKitContext.Provider value={merged}>{children}</UIKitContext.Provider>
}

// --- Lib Button ---

type LibButtonOwnProps<C extends React.ElementType> = {
  as?: C
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: UIKitConfig['size']
  isLoading?: boolean
}

type LibButtonProps<C extends React.ElementType = 'button'> =
  LibButtonOwnProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof LibButtonOwnProps<C>>

const LibButtonInner = forwardRef(function LibButtonImpl<C extends React.ElementType = 'button'>(
  { as, variant = 'primary', size, isLoading, children, style, ...rest }: LibButtonProps<C>,
  ref: React.Ref<Element>
) {
  const config = useUIKit()
  const effectiveSize = size ?? config.size
  const Component = (as ?? 'button') as React.ElementType

  const variantColors: Record<string, { bg: string; color: string; border: string }> = {
    primary: { bg: config.primaryColor, color: '#fff', border: config.primaryColor },
    secondary: { bg: 'transparent', color: config.primaryColor, border: config.primaryColor },
    ghost: { bg: 'transparent', color: '#555', border: '#ddd' },
    danger: { bg: '#d32f2f', color: '#fff', border: '#d32f2f' },
  }

  const sizePadding: Record<string, string> = {
    compact: '0.3rem 0.75rem',
    normal: '0.5rem 1.25rem',
    large: '0.75rem 1.75rem',
  }

  const vc = variantColors[variant]
  const isDark = config.colorScheme === 'dark'

  return (
    <Component
      ref={ref}
      style={{
        padding: sizePadding[effectiveSize],
        background: isDark && variant === 'ghost' ? '#333' : vc.bg,
        color: isDark && variant === 'ghost' ? '#ddd' : vc.color,
        border: `1.5px solid ${vc.border}`,
        borderRadius: '6px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        fontWeight: 500,
        fontSize: '0.9rem',
        opacity: isLoading ? 0.7 : 1,
        pointerEvents: isLoading ? 'none' : 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        textDecoration: 'none',
        transition: 'opacity 0.15s',
        ...style,
      }}
      {...rest}
    >
      {isLoading && (
        <span style={{
          width: 12, height: 12,
          border: `2px solid ${vc.color}`,
          borderTopColor: 'transparent',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'spin 0.7s linear infinite',
        }} />
      )}
      {children}
    </Component>
  )
})

LibButtonInner.displayName = 'LibButton'

const LibButton = LibButtonInner as <C extends React.ElementType = 'button'>(
  props: LibButtonProps<C> & { ref?: React.Ref<Element> }
) => ReactElement

// --- Lib Input ---

interface LibInputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'id'> {
  label?: string
  error?: string
}

const LibInput = forwardRef<HTMLInputElement, LibInputProps>(function LibInput(
  { label, error, style, ...rest },
  ref
) {
  const config = useUIKit()
  const id = useId()
  const isDark = config.colorScheme === 'dark'

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            marginBottom: '0.3rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: isDark ? '#ddd' : '#333',
          }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: `1.5px solid ${error ? '#d32f2f' : isDark ? '#555' : '#ddd'}`,
          borderRadius: '6px',
          fontSize: '0.9rem',
          background: isDark ? '#2a2a2a' : '#fff',
          color: isDark ? '#eee' : '#333',
          boxSizing: 'border-box',
          outline: 'none',
          ...style,
        }}
        {...rest}
      />
      {error && (
        <span
          id={`${id}-error`}
          role="alert"
          style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.8rem', color: '#d32f2f' }}
        >
          {error}
        </span>
      )}
    </div>
  )
})

LibInput.displayName = 'LibInput'

// --- Error Boundary for Modal ---

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ModalErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ padding: '1rem', color: '#d32f2f', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <div style={{ fontSize: '0.9rem' }}>Произошла ошибка в содержимом модального окна</div>
        </div>
      )
    }
    return this.props.children
  }
}

// --- Lib Modal ---

interface LibModalContextValue {
  onClose: () => void
}

const LibModalContext = createContext<LibModalContextValue | null>(null)

interface LibModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

function LibModal({ isOpen, onClose, children }: LibModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <LibModalContext.Provider value={{ onClose }}>
      <div
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: '#fff', borderRadius: '12px', padding: 0,
            minWidth: 320, maxWidth: 480, width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            overflow: 'hidden',
          }}
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </LibModalContext.Provider>,
    document.body
  )
}

LibModal.Header = function LibModalHeader({ children }: { children: ReactNode }) {
  const ctx = useContext(LibModalContext)
  return (
    <div style={{
      padding: '1rem 1.25rem',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span style={{ fontWeight: 600, fontSize: '1rem' }}>{children}</span>
      <button
        onClick={ctx?.onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#999', lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  )
}

LibModal.Body = function LibModalBody({ children }: { children: ReactNode }) {
  return (
    <ModalErrorBoundary>
      <div style={{ padding: '1.25rem' }}>{children}</div>
    </ModalErrorBoundary>
  )
}

LibModal.Footer = function LibModalFooter({ children }: { children: ReactNode }) {
  return (
    <div style={{
      padding: '0.75rem 1.25rem',
      borderTop: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.5rem',
    }}>
      {children}
    </div>
  )
}

// --- Lib Select ---

interface LibSelectProps {
  options: string[]
  value: string | null
  onChange: (value: string) => void
  placeholder?: string
}

function LibSelect({ options, value, onChange, placeholder = 'Выберите...' }: LibSelectProps) {
  const config = useUIKit()
  const dropdown = useDropdown({ options, defaultSelected: value ?? undefined, onSelect: onChange })
  const containerRef = useRef<HTMLDivElement>(null)
  const isDark = config.colorScheme === 'dark'

  useEffect(() => {
    if (!dropdown.isOpen) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) dropdown.close()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdown.isOpen, dropdown.close])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        {...dropdown.triggerProps}
        role="combobox"
        aria-controls="select-listbox"
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: `1.5px solid ${isDark ? '#555' : '#ddd'}`,
          borderRadius: '6px',
          background: isDark ? '#2a2a2a' : '#fff',
          color: isDark ? '#eee' : '#333',
          cursor: 'pointer',
          fontSize: '0.9rem',
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ color: value ? (isDark ? '#eee' : '#333') : '#aaa' }}>
          {value ?? placeholder}
        </span>
        <span style={{ color: '#999', fontSize: '0.75rem' }}>
          {dropdown.isOpen ? '▲' : '▼'}
        </span>
      </button>

      {dropdown.isOpen && (
        <ul
          id="select-listbox"
          {...dropdown.listboxProps}
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            margin: 0,
            padding: '0.25rem 0',
            listStyle: 'none',
            background: isDark ? '#2a2a2a' : '#fff',
            border: `1.5px solid ${isDark ? '#555' : '#ddd'}`,
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            zIndex: 200,
          }}
        >
          {options.map(opt => (
            <li
              key={opt}
              {...dropdown.getOptionProps(opt)}
              style={{
                padding: '0.45rem 0.75rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                background: value === opt ? (isDark ? '#1a3a5c' : '#e3f2fd') : 'transparent',
                color: value === opt ? config.primaryColor : (isDark ? '#ddd' : '#333'),
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {opt}
              {value === opt && <span>✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// --- Capstone Demo ---

const COUNTRIES = ['Россия', 'Беларусь', 'Казахстан', 'Украина', 'Германия', 'США']
const COLOR_OPTIONS = ['#1976d2', '#9c27b0', '#e91e63', '#388e3c', '#e65100']

export function Task12_4_Solution() {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light')
  const [primaryColor, setPrimaryColor] = useState('#1976d2')
  const [libSize, setLibSize] = useState<UIKitConfig['size']>('normal')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [inputError, setInputError] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const addLog = (msg: string) => setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 6)])

  const isDark = scheme === 'dark'

  const handleInputSubmit = () => {
    if (!inputValue.trim()) {
      setInputError('Поле обязательно для заполнения')
      inputRef.current?.focus()
      return
    }
    setInputError('')
    addLog(`Input: отправлено "${inputValue}"`)
  }

  const handleLoadingBtn = () => {
    setIsLoading(true)
    addLog('Button: запрос отправлен...')
    setTimeout(() => {
      setIsLoading(false)
      addLog('Button: запрос завершён')
    }, 1500)
  }

  return (
    <div className="exercise-container">
      <h2>Решение 12.4: Capstone — мини UI-библиотека</h2>

      {/* Config panel */}
      <div style={{
        padding: '0.75rem 1rem',
        background: isDark ? '#1a1a1a' : '#f5f5f5',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: isDark ? '#aaa' : '#666', fontWeight: 600 }}>Тема:</span>
          <button
            onClick={() => setScheme(s => s === 'light' ? 'dark' : 'light')}
            style={{
              padding: '0.25rem 0.75rem', borderRadius: '20px', border: 'none',
              background: isDark ? '#444' : '#ddd', color: isDark ? '#eee' : '#333',
              cursor: 'pointer', fontSize: '0.8rem',
            }}
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: isDark ? '#aaa' : '#666', fontWeight: 600 }}>Цвет:</span>
          {COLOR_OPTIONS.map(c => (
            <div
              key={c}
              onClick={() => setPrimaryColor(c)}
              style={{
                width: 20, height: 20, borderRadius: '50%', background: c, cursor: 'pointer',
                border: primaryColor === c ? '2px solid #fff' : '2px solid transparent',
                boxShadow: primaryColor === c ? `0 0 0 2px ${c}` : 'none',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: isDark ? '#aaa' : '#666', fontWeight: 600 }}>Размер:</span>
          {(['compact', 'normal', 'large'] as const).map(s => (
            <button
              key={s}
              onClick={() => setLibSize(s)}
              style={{
                padding: '0.2rem 0.5rem', borderRadius: '4px', border: 'none',
                background: libSize === s ? primaryColor : isDark ? '#333' : '#e0e0e0',
                color: libSize === s ? '#fff' : isDark ? '#bbb' : '#555',
                cursor: 'pointer', fontSize: '0.75rem',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <UIKitProvider config={{ colorScheme: scheme, primaryColor, size: libSize }}>
        <div style={{
          background: isDark ? '#121212' : '#fff',
          padding: '1.5rem',
          borderRadius: '10px',
          border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
        }}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          {/* Button section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#888' : '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.75rem' }}>
              Button (полиморфный + forwardRef)
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <LibButton variant="primary" onClick={() => addLog('Button: primary нажат')}>Primary</LibButton>
              <LibButton variant="secondary" onClick={() => addLog('Button: secondary нажат')}>Secondary</LibButton>
              <LibButton variant="ghost" onClick={() => addLog('Button: ghost нажат')}>Ghost</LibButton>
              <LibButton variant="danger" onClick={() => addLog('Button: danger нажат')}>Danger</LibButton>
              <LibButton isLoading onClick={handleLoadingBtn}>...</LibButton>
              <LibButton onClick={handleLoadingBtn} isLoading={isLoading}>
                {isLoading ? 'Загрузка' : 'С загрузкой'}
              </LibButton>
              <LibButton
                as="a"
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                onClick={() => addLog('Link: react.dev')}
              >
                react.dev ↗
              </LibButton>
            </div>
          </div>

          {/* Input section */}
          <div style={{ marginBottom: '1.5rem', maxWidth: 400 }}>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#888' : '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.75rem' }}>
              Input (forwardRef + aria-invalid)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <LibInput
                ref={inputRef}
                label="Имя пользователя"
                placeholder="Введите имя..."
                value={inputValue}
                onChange={e => {
                  setInputValue(e.target.value)
                  if (inputError) setInputError('')
                }}
                error={inputError}
              />
              <LibInput label="Email" placeholder="user@example.com" type="email" />
              <LibInput label="Неверный ввод" defaultValue="ошибка" error="Некорректный формат" />
              <LibButton onClick={handleInputSubmit}>Отправить</LibButton>
            </div>
          </div>

          {/* Select section */}
          <div style={{ marginBottom: '1.5rem', maxWidth: 280 }}>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#888' : '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.75rem' }}>
              Select (headless useDropdown + controlled)
            </div>
            <LibSelect
              options={COUNTRIES}
              value={selectedCountry}
              onChange={v => {
                setSelectedCountry(v)
                addLog(`Select: выбрана "${v}"`)
              }}
              placeholder="Страна"
            />
            {selectedCountry && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: isDark ? '#aaa' : '#666' }}>
                Выбрано: <strong style={{ color: isDark ? '#eee' : '#333' }}>{selectedCountry}</strong>
              </div>
            )}
          </div>

          {/* Modal section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: isDark ? '#888' : '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.75rem' }}>
              Modal (portal + context + ErrorBoundary)
            </div>
            <LibButton onClick={() => { setIsModalOpen(true); addLog('Modal: открыт') }}>
              Открыть Modal
            </LibButton>
          </div>

          {/* Event log */}
          {log.length > 0 && (
            <div style={{
              padding: '0.75rem',
              background: isDark ? '#1a1a1a' : '#f5f5f5',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
            }}>
              {log.map((entry, i) => (
                <div key={i} style={{ color: isDark ? '#aaa' : '#444', lineHeight: 1.6 }}>{entry}</div>
              ))}
            </div>
          )}
        </div>
      </UIKitProvider>

      {/* Modal is outside provider intentionally to test portal */}
      <LibModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); addLog('Modal: закрыт') }}>
        <LibModal.Header>Пример модального окна</LibModal.Header>
        <LibModal.Body>
          <p style={{ margin: '0 0 1rem', color: '#555', fontSize: '0.9rem' }}>
            Это содержимое рендерится через <code>createPortal</code> в <code>document.body</code>.
            Обёрнуто в <code>ErrorBoundary</code> — ошибка здесь не уронит приложение.
          </p>
          <LibInput label="Сообщение" placeholder="Напишите что-нибудь..." />
        </LibModal.Body>
        <LibModal.Footer>
          <LibButton variant="ghost" onClick={() => setIsModalOpen(false)}>Отмена</LibButton>
          <LibButton onClick={() => { setIsModalOpen(false); addLog('Modal: форма отправлена') }}>Отправить</LibButton>
        </LibModal.Footer>
      </LibModal>
    </div>
  )
}
