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

// ============================================
// Task 3.1 Solution — Tabs with Context
// ============================================

// --- Types ---
interface TabsContextValue {
  activeTab: string
  setActiveTab: (id: string) => void
}

interface TabsRootProps {
  children: ReactNode
  defaultTab: string
}

interface TabProps {
  id: string
  children: ReactNode
  disabled?: boolean
}

interface PanelProps {
  id: string
  children: ReactNode
}

// --- Context ---
const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext)
  if (!ctx) {
    throw new Error('Tabs.Tab и Tabs.Panel должны использоваться внутри <Tabs>')
  }
  return ctx
}

// --- Sub-components ---
function TabsRoot({ children, defaultTab }: TabsRootProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab])

  return (
    <TabsContext.Provider value={value}>
      <div className="tabs-root" style={{ fontFamily: 'sans-serif' }}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({ children }: { children: ReactNode }) {
  return (
    <div
      role="tablist"
      style={{ display: 'flex', gap: 4, borderBottom: '2px solid #e2e8f0', marginBottom: 16 }}
    >
      {children}
    </div>
  )
}

function Tab({ id, children, disabled = false }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext()
  const isActive = activeTab === id

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => setActiveTab(id)}
      style={{
        padding: '8px 16px',
        border: 'none',
        borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
        background: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: isActive ? '#3b82f6' : disabled ? '#94a3b8' : '#64748b',
        fontWeight: isActive ? 600 : 400,
        marginBottom: -2,
        transition: 'color 0.15s, border-color 0.15s',
      }}
    >
      {children}
    </button>
  )
}

function TabsPanel({ id, children }: PanelProps) {
  const { activeTab } = useTabsContext()
  if (activeTab !== id) return null
  return (
    <div role="tabpanel" style={{ padding: '8px 0' }}>
      {children}
    </div>
  )
}

TabsRoot.displayName = 'Tabs'
TabsList.displayName = 'Tabs.List'
Tab.displayName = 'Tabs.Tab'
TabsPanel.displayName = 'Tabs.Panel'

const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab,
  Panel: TabsPanel,
})

// --- Demo ---
export function Task3_1_Solution() {
  return (
    <div className="exercise-container">
      <h2>Решение 3.1 — Tabs (Compound Components)</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>
        Компоненты общаются через Context без явной передачи пропсов
      </p>

      <Tabs defaultTab="overview">
        <Tabs.List>
          <Tabs.Tab id="overview">Обзор</Tabs.Tab>
          <Tabs.Tab id="features">Возможности</Tabs.Tab>
          <Tabs.Tab id="settings">Настройки</Tabs.Tab>
          <Tabs.Tab id="disabled" disabled>Заблокировано</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel id="overview">
          <div style={{ padding: '12px 0' }}>
            <h3 style={{ margin: '0 0 8px' }}>Обзор</h3>
            <p>Compound Components — паттерн для создания гибких компонентов с декларативным API.</p>
            <p>
              Вместо передачи всего через пропсы, дочерние компоненты читают общее состояние
              из Context.
            </p>
          </div>
        </Tabs.Panel>

        <Tabs.Panel id="features">
          <div style={{ padding: '12px 0' }}>
            <h3 style={{ margin: '0 0 8px' }}>Возможности</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Гибкое расположение частей компонента</li>
              <li>Неявное разделение состояния через Context</li>
              <li>Декларативный API как у HTML-элементов</li>
              <li>Полная типизация TypeScript</li>
            </ul>
          </div>
        </Tabs.Panel>

        <Tabs.Panel id="settings">
          <div style={{ padding: '12px 0' }}>
            <h3 style={{ margin: '0 0 8px' }}>Настройки</h3>
            <p>Здесь могут быть настройки компонента.</p>
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

// ============================================
// Task 3.2 Solution — Select with keyboard navigation
// ============================================

// --- Types ---
interface SelectContextValue {
  selected: string | null
  focusedIndex: number
  isOpen: boolean
  options: string[]
  select: (value: string) => void
  toggle: () => void
  close: () => void
  setFocusedIndex: (i: number) => void
}

interface SelectRootProps {
  children: ReactNode
  onChange?: (value: string) => void
  placeholder?: string
}

interface SelectOptionProps {
  value: string
  children: ReactNode
}

// --- Context ---
const SelectContext = createContext<SelectContextValue | null>(null)

function useSelectContext(): SelectContextValue {
  const ctx = useContext(SelectContext)
  if (!ctx) {
    throw new Error('Select sub-компоненты должны использоваться внутри <Select>')
  }
  return ctx
}

// --- Helper: extract option values from children ---
function extractOptionValues(children: ReactNode): string[] {
  const values: string[] = []
  const traverse = (nodes: ReactNode) => {
    // Use type assertion for React internal
    const childArray = Array.isArray(nodes) ? nodes : [nodes]
    for (const child of childArray) {
      if (child && typeof child === 'object' && 'props' in child) {
        const el = child as { props: { value?: string; children?: ReactNode } }
        if (el.props.value !== undefined) {
          values.push(el.props.value)
        } else if (el.props.children) {
          traverse(el.props.children)
        }
      }
    }
  }
  traverse(children)
  return values
}

// --- Sub-components ---
function SelectRoot({ children, onChange, placeholder = 'Выберите...' }: SelectRootProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const options = useMemo(() => extractOptionValues(children), [children])

  const select = (value: string) => {
    setSelected(value)
    setIsOpen(false)
    onChange?.(value)
  }

  const toggle = () => {
    setIsOpen(prev => {
      if (!prev) setFocusedIndex(options.indexOf(selected ?? '') >= 0 ? options.indexOf(selected!) : 0)
      return !prev
    })
  }

  const close = () => {
    setIsOpen(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setFocusedIndex(0)
        } else {
          setFocusedIndex(i => Math.min(i + 1, options.length - 1))
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (isOpen) {
          setFocusedIndex(i => Math.max(i - 1, 0))
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen && options[focusedIndex]) {
          select(options[focusedIndex])
        } else {
          toggle()
        }
        break
      case 'Escape':
        close()
        break
    }
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const value = useMemo(
    () => ({ selected, focusedIndex, isOpen, options, select, toggle, close, setFocusedIndex }),
    [selected, focusedIndex, isOpen, options],
  )

  return (
    <SelectContext.Provider value={value}>
      <div
        ref={rootRef}
        onKeyDown={handleKeyDown}
        style={{ position: 'relative', display: 'inline-block', minWidth: 200 }}
      >
        {/* Inject placeholder into context for Trigger */}
        <SelectTrigger placeholder={placeholder} />
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({ placeholder }: { placeholder: string }) {
  const { selected, isOpen, toggle } = useSelectContext()

  return (
    <button
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      onClick={toggle}
      style={{
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #e2e8f0',
        borderRadius: 6,
        background: 'white',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 14,
        color: selected ? '#1e293b' : '#94a3b8',
      }}
    >
      {selected ?? placeholder}
      <span style={{ marginLeft: 8 }}>{isOpen ? '▲' : '▼'}</span>
    </button>
  )
}

function SelectOptions({ children }: { children: ReactNode }) {
  const { isOpen } = useSelectContext()
  if (!isOpen) return null

  return (
    <div
      role="listbox"
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: 4,
        border: '1px solid #e2e8f0',
        borderRadius: 6,
        background: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}

function SelectOption({ value, children }: SelectOptionProps) {
  const { selected, focusedIndex, options, select } = useSelectContext()
  const isSelected = selected === value
  const isFocused = options[focusedIndex] === value

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => select(value)}
      style={{
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: 14,
        background: isFocused ? '#eff6ff' : 'transparent',
        color: isSelected ? '#3b82f6' : '#1e293b',
        fontWeight: isSelected ? 600 : 400,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {children}
      {isSelected && <span>✓</span>}
    </div>
  )
}

SelectRoot.displayName = 'Select'
SelectTrigger.displayName = 'Select.Trigger'
SelectOptions.displayName = 'Select.Options'
SelectOption.displayName = 'Select.Option'

const Select = Object.assign(SelectRoot, {
  Options: SelectOptions,
  Option: SelectOption,
})

// --- Demo ---
export function Task3_2_Solution() {
  const [country, setCountry] = useState<string | null>(null)

  return (
    <div className="exercise-container">
      <h2>Решение 3.2 — Select с клавиатурной навигацией</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>
        Управляйте стрелками, Enter и Escape. Клик вне — закрывает список.
      </p>

      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
            Страна
          </label>
          <Select onChange={setCountry} placeholder="Выберите страну...">
            <Select.Options>
              <SelectOption value="ru">Россия</SelectOption>
              <SelectOption value="by">Беларусь</SelectOption>
              <SelectOption value="kz">Казахстан</SelectOption>
              <SelectOption value="ua">Украина</SelectOption>
              <SelectOption value="de">Германия</SelectOption>
              <SelectOption value="fr">Франция</SelectOption>
            </Select.Options>
          </Select>
        </div>

        {country && (
          <div
            style={{
              padding: '8px 12px',
              background: '#f0fdf4',
              borderRadius: 6,
              border: '1px solid #bbf7d0',
              fontSize: 14,
            }}
          >
            Выбрано: <strong>{country}</strong>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Task 3.3 Solution — Stepper (wizard pattern)
// ============================================

// --- Types ---
interface StepperContextValue {
  currentStep: number
  totalSteps: number
  next: () => void
  prev: () => void
  goTo: (step: number) => void
  isCompleted: boolean
  onComplete?: () => void
}

interface StepperRootProps {
  children: ReactNode
  initialStep?: number
  onComplete?: () => void
}

interface StepperStepProps {
  title: string
  children: ReactNode
  stepIndex?: number
}

// --- Context ---
const StepperContext = createContext<StepperContextValue | null>(null)

function useStepperContext(): StepperContextValue {
  const ctx = useContext(StepperContext)
  if (!ctx) {
    throw new Error('Stepper sub-компоненты должны использоваться внутри <Stepper>')
  }
  return ctx
}

// --- Sub-components ---
function StepperRoot({ children, initialStep = 0, onComplete }: StepperRootProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isCompleted, setIsCompleted] = useState(false)

  // Count steps
  const totalSteps = useMemo(() => {
    let count = 0
    const countSteps = (nodes: ReactNode) => {
      const childArray = Array.isArray(nodes) ? nodes : [nodes]
      for (const child of childArray) {
        if (child && typeof child === 'object' && 'type' in child) {
          const el = child as { type: unknown }
          if (el.type === StepperStep) count++
        }
      }
    }
    countSteps(children)
    return count
  }, [children])

  const next = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1)
    } else {
      setIsCompleted(true)
      onComplete?.()
    }
  }

  const prev = () => {
    setCurrentStep(s => Math.max(0, s - 1))
  }

  const goTo = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)))
  }

  const value = useMemo(
    () => ({ currentStep, totalSteps, next, prev, goTo, isCompleted, onComplete }),
    [currentStep, totalSteps, isCompleted],
  )

  if (isCompleted) {
    return (
      <div className="exercise-container" style={{ textAlign: 'center', padding: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h3 style={{ margin: '0 0 8px', color: '#16a34a' }}>Готово!</h3>
        <p style={{ color: '#64748b', margin: '0 0 16px' }}>Все шаги успешно пройдены</p>
        <button
          onClick={() => { setIsCompleted(false); setCurrentStep(0) }}
          style={{
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Начать заново
        </button>
      </div>
    )
  }

  return (
    <StepperContext.Provider value={value}>
      <div style={{ fontFamily: 'sans-serif' }}>
        {children}
      </div>
    </StepperContext.Provider>
  )
}

function StepperStep({ title, children, stepIndex = 0 }: StepperStepProps) {
  const { currentStep } = useStepperContext()
  if (currentStep !== stepIndex) return null

  return (
    <div>
      <h3 style={{ margin: '0 0 16px', color: '#1e293b' }}>
        <span style={{ color: '#3b82f6' }}>Шаг {stepIndex + 1}:</span> {title}
      </h3>
      <div style={{ minHeight: 80 }}>{children}</div>
    </div>
  )
}

function StepperControls() {
  const { currentStep, totalSteps, next, prev } = useStepperContext()
  const isFirst = currentStep === 0
  const isLast = currentStep === totalSteps - 1

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
      <button
        onClick={prev}
        disabled={isFirst}
        style={{
          padding: '8px 16px',
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          background: 'white',
          cursor: isFirst ? 'not-allowed' : 'pointer',
          color: isFirst ? '#94a3b8' : '#1e293b',
        }}
      >
        Назад
      </button>
      <button
        onClick={next}
        style={{
          padding: '8px 16px',
          background: isLast ? '#16a34a' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        {isLast ? 'Завершить' : 'Далее'}
      </button>
    </div>
  )
}

function StepperProgress() {
  const { currentStep, totalSteps, goTo } = useStepperContext()

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center' }}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const isPast = i < currentStep
        const isCurrent = i === currentStep

        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => goTo(i)}
              title={`Шаг ${i + 1}`}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: isCurrent ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                background: isPast ? '#3b82f6' : isCurrent ? '#eff6ff' : 'white',
                color: isPast ? 'white' : isCurrent ? '#3b82f6' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isPast ? '✓' : i + 1}
            </button>
            {i < totalSteps - 1 && (
              <div
                style={{
                  width: 32,
                  height: 2,
                  background: isPast ? '#3b82f6' : '#e2e8f0',
                  transition: 'background 0.3s',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

StepperRoot.displayName = 'Stepper'
StepperStep.displayName = 'Stepper.Step'
StepperControls.displayName = 'Stepper.Controls'
StepperProgress.displayName = 'Stepper.Progress'

const Stepper = Object.assign(StepperRoot, {
  Step: StepperStep,
  Controls: StepperControls,
  Progress: StepperProgress,
})

// --- Demo ---
export function Task3_3_Solution() {
  return (
    <div className="exercise-container">
      <h2>Решение 3.3 — Stepper (Wizard-паттерн)</h2>
      <p style={{ color: '#64748b', marginBottom: 24 }}>
        Многошаговая форма с декларативным API через Compound Components
      </p>

      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 24,
          maxWidth: 480,
        }}
      >
        <Stepper
          onComplete={() => console.log('Stepper completed!')}
        >
          <Stepper.Progress />

          <Stepper.Step stepIndex={0} title="Личные данные">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                placeholder="Имя"
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 14,
                }}
              />
              <input
                placeholder="Email"
                type="email"
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 14,
                }}
              />
            </div>
          </Stepper.Step>

          <Stepper.Step stepIndex={1} title="Адрес доставки">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                placeholder="Город"
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 14,
                }}
              />
              <input
                placeholder="Улица, дом"
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  fontSize: 14,
                }}
              />
            </div>
          </Stepper.Step>

          <Stepper.Step stepIndex={2} title="Подтверждение">
            <div
              style={{
                padding: 16,
                background: '#f8fafc',
                borderRadius: 8,
                fontSize: 14,
                color: '#64748b',
              }}
            >
              <p style={{ margin: '0 0 8px' }}>Проверьте введённые данные и нажмите «Завершить».</p>
              <p style={{ margin: 0 }}>
                Это последний шаг — после подтверждения заказ будет оформлен.
              </p>
            </div>
          </Stepper.Step>

          <Stepper.Controls />
        </Stepper>
      </div>
    </div>
  )
}
