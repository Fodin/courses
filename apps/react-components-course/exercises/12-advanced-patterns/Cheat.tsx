// Need React import for CSSProperties
import React from 'react'

export function Cheat() {
  const code = (s: string) => (
    <pre style={{ background: '#f5f5f5', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', overflow: 'auto', margin: '0.5rem 0 0' }}>{s}</pre>
  )

  const sectionStyle: React.CSSProperties = { marginBottom: '1.75rem' }
  const h3Style: React.CSSProperties = { color: '#1976d2', marginBottom: '0.35rem', fontSize: '0.95rem' }
  const pStyle: React.CSSProperties = { color: '#555', marginBottom: '0.35rem', fontSize: '0.88rem' }

  return (
    <div className="exercise-container">
      {/* Level 12: Подсказки по продвинутым паттернам / Advanced patterns hints */}
      <h2>Level 12: Подсказки по продвинутым паттернам / Advanced patterns hints</h2>

      <section style={sectionStyle}>
        {/* 12.1 — Discriminated union для controlled/uncontrolled */}
        <h3 style={h3Style}>12.1 — Discriminated union для controlled/uncontrolled</h3>
        {/* never в другой ветке запрещает смешивание props: */}
        <p style={pStyle}>never в другой ветке запрещает смешивание props: / never in the other branch prevents mixing props:</p>
        {code(`type ControlledProps = {
  value: Date
  onChange: (date: Date) => void
  defaultValue?: never    // <- never запрещает это поле
  // <- never disallows this field
}
type UncontrolledProps = {
  defaultValue?: Date
  value?: never           // <- never запрещает это поле
  // <- never disallows this field
  onChange?: never
}
type DatePickerProps = ControlledProps | UncontrolledProps`)}
        {/* useControllableState — абстракция обоих режимов: */}
        <p style={{ ...pStyle, marginTop: '0.5rem' }}>useControllableState — абстракция обоих режимов: / useControllableState — abstraction for both modes:</p>
        {code(`function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (v: T) => void
): [T, (v: T) => void] {
  const [internal, setInternal] = useState(defaultValue)
  const isControlled = controlled !== undefined
  const value = isControlled ? controlled : internal
  const setValue = (newVal: T) => {
    if (!isControlled) setInternal(newVal)
    onChange?.(newVal)
  }
  return [value, setValue]
}`)}
      </section>

      <section style={sectionStyle}>
        {/* 12.1 — Сетка дней календаря / Calendar day grid */}
        <h3 style={h3Style}>12.1 — Сетка дней календаря / Calendar day grid</h3>
        {/* Генерация массива дней с пустыми ячейками в начале: */}
        <p style={pStyle}>Генерация массива дней с пустыми ячейками в начале: / Generate array of days with empty cells at the start:</p>
        {code(`function buildCalendarDays(year: number, month: number) {
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const startOffset = (firstDayOfWeek + 6) % 7  // Mon-first
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: (Date | null)[] = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d))
  }
  return days
}`)}
      </section>

      <section style={sectionStyle}>
        {/* 12.2 — ARIA в triggerProps хука / ARIA in hook's triggerProps */}
        <h3 style={h3Style}>12.2 — ARIA в triggerProps хука / ARIA in hook's triggerProps</h3>
        {/* Пользователь хука получает доступность бесплатно через spread: */}
        <p style={pStyle}>Пользователь хука получает доступность бесплатно через spread: / Hook user gets accessibility for free via spread:</p>
        {code(`// В хуке:
// In the hook:
triggerProps: {
  onClick: () => setIsOpen(prev => !prev),
  'aria-haspopup': 'listbox' as const,
  'aria-expanded': isOpen,
}
// В UI:
// In UI:
<button {...triggerProps}>Выберите...</button>
// -> автоматически получает aria-haspopup и aria-expanded
// -> automatically gets aria-haspopup and aria-expanded`)}
      </section>

      <section style={sectionStyle}>
        {/* 12.2 — Закрытие по клику снаружи / Close on click outside */}
        <h3 style={h3Style}>12.2 — Закрытие по клику снаружи / Close on click outside</h3>
        {code(`const containerRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (!isOpen) return
  const handler = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      close()
    }
  }
  document.addEventListener('mousedown', handler)
  return () => document.removeEventListener('mousedown', handler)
}, [isOpen, close])`)}
      </section>

      <section style={sectionStyle}>
        {/* 12.3 — Защита переходов в reducer / Transition guards in reducer */}
        <h3 style={h3Style}>12.3 — Защита переходов в reducer / Transition guards in reducer</h3>
        {/* Каждый case проверяет, откуда пришли: */}
        <p style={pStyle}>Каждый case проверяет, откуда пришли: / Each case checks where we came from:</p>
        {code(`function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SUBMIT_SHIPPING':
      if (state.status !== 'shipping') return state  // защита!
      // guard!
      return { status: 'payment', shipping: action.payload }

    case 'CONFIRM_ORDER':
      if (state.status !== 'payment') return state   // защита!
      // guard!
      return { status: 'confirmation', orderId: action.orderId, shipping: state.shipping }

    case 'SET_ERROR':
      return { status: 'error', message: action.message, from: state.status }
    // ...
  }
}`)}
      </section>

      <section style={sectionStyle}>
        {/* 12.4 — LibButton через forwardRef + type assertion */}
        <h3 style={h3Style}>12.4 — LibButton через forwardRef + type assertion</h3>
        {/* Сохранение generic T после forwardRef обёртки: */}
        <p style={pStyle}>Сохранение generic T после forwardRef обёртки: / Preserving generic T after forwardRef wrapper:</p>
        {code(`const LibButtonInner = forwardRef(function LibButtonImpl<C extends React.ElementType = 'button'>(
  { as, variant = 'primary', isLoading, children, ...rest }: LibButtonProps<C>,
  ref: React.Ref<Element>
) {
  const Component = (as ?? 'button') as React.ElementType
  return <Component ref={ref} {...rest}>{children}</Component>
})

// Type assertion восстанавливает generic
// Type assertion restores generic
const LibButton = LibButtonInner as <C extends React.ElementType = 'button'>(
  props: LibButtonProps<C> & { ref?: React.Ref<Element> }
) => ReactElement`)}
      </section>

      <section style={sectionStyle}>
        {/* 12.4 — Modal через createPortal */}
        <h3 style={h3Style}>12.4 — Modal через createPortal / Modal via createPortal</h3>
        {code(`import { createPortal } from 'react-dom'

function LibModal({ isOpen, onClose, children }: LibModalProps) {
  if (!isOpen) return null
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)' }}
         onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  )
}`)}
      </section>

      <section style={sectionStyle}>
        {/* 12.4 — useId для label + input */}
        <h3 style={h3Style}>12.4 — useId для label + input / useId for label + input</h3>
        {/* React 18: уникальный id без коллизий на сервере и клиенте: */}
        <p style={pStyle}>React 18: уникальный id без коллизий на сервере и клиенте: / React 18: unique id without server/client collisions:</p>
        {code(`function LibInput({ label, error, ...rest }: LibInputProps, ref) {
  const id = useId()
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? \`\${id}-error\` : undefined}
        {...rest}
      />
      {error && <span id={\`\${id}-error\`} role="alert">{error}</span>}
    </div>
  )
}`)}
      </section>
    </div>
  )
}
