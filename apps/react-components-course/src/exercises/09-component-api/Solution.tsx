import { useState, forwardRef, useRef } from 'react'
import type { ReactNode, ReactElement } from 'react'

// ============================================
// Task 9.1 Solution: Polymorphic Button with `as` prop
// ============================================

type ButtonOwnProps<C extends React.ElementType> = {
  as?: C
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

type ButtonProps<C extends React.ElementType = 'button'> = ButtonOwnProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonOwnProps<C>>

const BUTTON_STYLES: Record<string, React.CSSProperties> = {
  primary: { background: '#1976d2', color: '#fff', border: 'none' },
  secondary: { background: 'transparent', color: '#1976d2', border: '2px solid #1976d2' },
  ghost: { background: 'transparent', color: '#555', border: '1px solid #ddd' },
}

const SIZE_STYLES: Record<string, React.CSSProperties> = {
  sm: { padding: '0.3rem 0.75rem', fontSize: '0.8rem' },
  md: { padding: '0.5rem 1.25rem', fontSize: '0.9rem' },
  lg: { padding: '0.75rem 1.75rem', fontSize: '1rem' },
}

function Button<C extends React.ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  ...rest
}: ButtonProps<C>) {
  const Component = (as ?? 'button') as React.ElementType
  return (
    <Component
      style={{
        ...BUTTON_STYLES[variant],
        ...SIZE_STYLES[size],
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 500,
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'opacity 0.15s',
      }}
      {...rest}
    />
  )
}

export function Task9_1_Solution() {
  const [log, setLog] = useState<string[]>([])

  const addLog = (msg: string) =>
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)])

  return (
    <div className="exercise-container">
      <h2>Решение 9.1: Полиморфный Button</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Один компонент Button — три варианта, три размера, два режима рендеринга (button / a)
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
          Варианты
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary" onClick={() => addLog('Нажат Primary')}>Primary</Button>
          <Button variant="secondary" onClick={() => addLog('Нажат Secondary')}>Secondary</Button>
          <Button variant="ghost" onClick={() => addLog('Нажат Ghost')}>Ghost</Button>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
          Размеры
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button size="sm" onClick={() => addLog('Нажат SM')}>Small</Button>
          <Button size="md" onClick={() => addLog('Нажат MD')}>Medium</Button>
          <Button size="lg" onClick={() => addLog('Нажат LG')}>Large</Button>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
          Как ссылка (as="a")
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            as="a"
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            onClick={() => addLog('Перешли по ссылке react.dev')}
          >
            react.dev
          </Button>
          <Button
            as="a"
            href="https://typescriptlang.org"
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
          >
            typescriptlang.org
          </Button>
        </div>
      </div>

      {log.length > 0 && (
        <div style={{ padding: '0.75rem', background: '#f5f5f5', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          {log.map((entry, i) => <div key={i} style={{ color: '#333' }}>{entry}</div>)}
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 9.2 Solution: Modal with discriminated props
// ============================================

type AlertModalProps = {
  variant: 'alert'
  message: string
  onClose: () => void
}

type ConfirmModalProps = {
  variant: 'confirm'
  message: string
  onConfirm: () => void
  onCancel: () => void
}

type FormModalProps = {
  variant: 'form'
  title: string
  children: ReactNode
  onSubmit: () => void
  onCancel: () => void
}

type ModalProps = AlertModalProps | ConfirmModalProps | FormModalProps

function Modal(props: ModalProps) {
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  }

  const dialogStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: '12px',
    padding: '2rem',
    minWidth: 320,
    maxWidth: 480,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  }

  const btnBase: React.CSSProperties = {
    padding: '0.5rem 1.25rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.9rem',
  }

  if (props.variant === 'alert') {
    return (
      <div style={overlayStyle}>
        <div style={dialogStyle}>
          <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.75rem' }}>ℹ️</div>
          <p style={{ margin: '0 0 1.5rem', textAlign: 'center', color: '#333' }}>{props.message}</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={props.onClose} style={{ ...btnBase, background: '#1976d2', color: '#fff' }}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (props.variant === 'confirm') {
    return (
      <div style={overlayStyle}>
        <div style={dialogStyle}>
          <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.75rem' }}>⚠️</div>
          <p style={{ margin: '0 0 1.5rem', textAlign: 'center', color: '#333' }}>{props.message}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button onClick={props.onCancel} style={{ ...btnBase, background: '#f5f5f5', color: '#333' }}>
              Отмена
            </button>
            <button onClick={props.onConfirm} style={{ ...btnBase, background: '#d32f2f', color: '#fff' }}>
              Подтвердить
            </button>
          </div>
        </div>
      </div>
    )
  }

  // variant === 'form'
  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem' }}>{props.title}</h3>
        <div style={{ marginBottom: '1.5rem' }}>{props.children}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={props.onCancel} style={{ ...btnBase, background: '#f5f5f5', color: '#333' }}>
            Отмена
          </button>
          <button onClick={props.onSubmit} style={{ ...btnBase, background: '#1976d2', color: '#fff' }}>
            Отправить
          </button>
        </div>
      </div>
    </div>
  )
}

type ActiveModal = 'alert' | 'confirm' | 'form' | null

export function Task9_2_Solution() {
  const [active, setActive] = useState<ActiveModal>(null)
  const [log, setLog] = useState<string[]>([])

  const addLog = (msg: string) =>
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4)])

  const btnStyle: React.CSSProperties = {
    padding: '0.5rem 1.25rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.9rem',
  }

  return (
    <div className="exercise-container">
      <h2>Решение 9.2: Modal с discriminated union</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Три варианта модалки — TypeScript требует разные props для каждого
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button onClick={() => setActive('alert')} style={{ ...btnStyle, background: '#1976d2', color: '#fff' }}>
          Показать Alert
        </button>
        <button onClick={() => setActive('confirm')} style={{ ...btnStyle, background: '#e65100', color: '#fff' }}>
          Показать Confirm
        </button>
        <button onClick={() => setActive('form')} style={{ ...btnStyle, background: '#388e3c', color: '#fff' }}>
          Показать Form
        </button>
      </div>

      {log.length > 0 && (
        <div style={{ padding: '0.75rem', background: '#f5f5f5', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          {log.map((entry, i) => <div key={i} style={{ color: '#333' }}>{entry}</div>)}
        </div>
      )}

      {active === 'alert' && (
        <Modal
          variant="alert"
          message="Это информационное сообщение. Всё в порядке!"
          onClose={() => {
            addLog('Alert закрыт')
            setActive(null)
          }}
        />
      )}

      {active === 'confirm' && (
        <Modal
          variant="confirm"
          message="Вы уверены, что хотите удалить этот элемент? Это действие необратимо."
          onConfirm={() => {
            addLog('Confirm: действие подтверждено')
            setActive(null)
          }}
          onCancel={() => {
            addLog('Confirm: действие отменено')
            setActive(null)
          }}
        />
      )}

      {active === 'form' && (
        <Modal
          variant="form"
          title="Обратная связь"
          onSubmit={() => {
            addLog('Form: данные отправлены')
            setActive(null)
          }}
          onCancel={() => {
            addLog('Form: форма закрыта')
            setActive(null)
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Ваше имя"
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <textarea
              placeholder="Ваше сообщение..."
              rows={3}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', resize: 'none' }}
            />
          </div>
        </Modal>
      )}
    </div>
  )
}

// ============================================
// Task 9.3 Solution: SelectableList<T> — generic component
// ============================================

interface SelectableListProps<T> {
  items: T[]
  selectedItem: T | null
  onSelect: (item: T) => void
  renderItem: (item: T, isSelected: boolean) => ReactNode
  keyExtractor: (item: T) => string
}

function SelectableList<T>({
  items,
  selectedItem,
  onSelect,
  renderItem,
  keyExtractor,
}: SelectableListProps<T>) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map(item => {
        const key = keyExtractor(item)
        const isSelected = selectedItem !== null && keyExtractor(selectedItem) === key

        return (
          <li
            key={key}
            onClick={() => onSelect(item)}
            style={{
              padding: '0.6rem 0.75rem',
              cursor: 'pointer',
              borderRadius: '6px',
              background: isSelected ? '#e3f2fd' : 'transparent',
              border: isSelected ? '1px solid #90caf9' : '1px solid transparent',
              marginBottom: '0.25rem',
              transition: 'background 0.15s',
            }}
          >
            {renderItem(item, isSelected)}
          </li>
        )
      })}
    </ul>
  )
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Product {
  id: string
  name: string
  price: number
  category: string
}

const DEMO_USERS: User[] = [
  { id: 'u1', name: 'Алексей Смирнов', email: 'a.smirnov@example.com', role: 'Frontend Dev' },
  { id: 'u2', name: 'Мария Иванова', email: 'm.ivanova@example.com', role: 'Backend Dev' },
  { id: 'u3', name: 'Сергей Петров', email: 's.petrov@example.com', role: 'DevOps' },
  { id: 'u4', name: 'Екатерина Козлова', email: 'e.kozlova@example.com', role: 'Designer' },
]

const DEMO_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Keychron K2', price: 8990, category: 'Клавиатуры' },
  { id: 'p2', name: 'Logitech MX Master 3', price: 6490, category: 'Мыши' },
  { id: 'p3', name: 'Samsung 27" 4K', price: 34990, category: 'Мониторы' },
  { id: 'p4', name: 'AirPods Pro', price: 19990, category: 'Наушники' },
]

export function Task9_3_Solution() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <div className="exercise-container">
      <h2>Решение 9.3: SelectableList&lt;T&gt;</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Один generic компонент — два списка с разными типами данных
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Список пользователей (User[])
          </div>
          <SelectableList
            items={DEMO_USERS}
            selectedItem={selectedUser}
            onSelect={setSelectedUser}
            keyExtractor={user => user.id}
            renderItem={(user, isSelected) => (
              <div>
                <div style={{ fontWeight: isSelected ? 600 : 400 }}>{user.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>{user.role}</div>
              </div>
            )}
          />
          {selectedUser && (
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#e3f2fd', borderRadius: '6px', fontSize: '0.85rem' }}>
              <strong>Выбран:</strong> {selectedUser.name} ({selectedUser.email})
            </div>
          )}
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Список товаров (Product[])
          </div>
          <SelectableList
            items={DEMO_PRODUCTS}
            selectedItem={selectedProduct}
            onSelect={setSelectedProduct}
            keyExtractor={product => product.id}
            renderItem={(product, isSelected) => (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: isSelected ? 600 : 400 }}>{product.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>{product.category}</div>
                </div>
                <div style={{ fontWeight: 'bold', color: '#d32f2f' }}>
                  {product.price.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            )}
          />
          {selectedProduct && (
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#e3f2fd', borderRadius: '6px', fontSize: '0.85rem' }}>
              <strong>Выбран:</strong> {selectedProduct.name} — {selectedProduct.price.toLocaleString('ru-RU')} ₽
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 9.4 Solution: Autocomplete<T> + forwardRef
// ============================================

interface AutocompleteProps<T> {
  options: T[]
  value: string
  onChange: (value: string) => void
  onSelect: (item: T) => void
  getOptionLabel: (item: T) => string
  placeholder?: string
}

// Generic + forwardRef workaround via type assertion
const AutocompleteInner = forwardRef(function AutocompleteImpl<T>(
  {
    options,
    value,
    onChange,
    onSelect,
    getOptionLabel,
    placeholder = 'Начните вводить...',
  }: AutocompleteProps<T>,
  ref: React.Ref<HTMLInputElement>
) {
  const [isOpen, setIsOpen] = useState(false)

  const filtered = value.length > 0
    ? options.filter(opt =>
        getOptionLabel(opt).toLowerCase().includes(value.toLowerCase())
      )
    : options

  const handleSelect = (item: T) => {
    onSelect(item)
    onChange(getOptionLabel(item))
    setIsOpen(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        ref={ref}
        value={value}
        onChange={e => {
          onChange(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.6rem 0.75rem',
          borderRadius: '6px',
          border: '1px solid #ddd',
          fontSize: '0.95rem',
          boxSizing: 'border-box',
        }}
      />
      {isOpen && filtered.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            margin: '0.25rem 0 0',
            padding: 0,
            listStyle: 'none',
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '6px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            zIndex: 100,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {filtered.map((item, i) => (
            <li
              key={i}
              onMouseDown={() => handleSelect(item)}
              style={{
                padding: '0.5rem 0.75rem',
                cursor: 'pointer',
                borderBottom: i < filtered.length - 1 ? '1px solid #f0f0f0' : 'none',
              }}
              onMouseEnter={e => ((e.target as HTMLLIElement).style.background = '#f5f5f5')}
              onMouseLeave={e => ((e.target as HTMLLIElement).style.background = '')}
            >
              {getOptionLabel(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})

AutocompleteInner.displayName = 'Autocomplete'

// Type assertion workaround: preserve generic T after forwardRef wrapping
const Autocomplete = AutocompleteInner as <T>(
  props: AutocompleteProps<T> & { ref?: React.Ref<HTMLInputElement> }
) => ReactElement

interface City {
  id: string
  name: string
  region: string
}

const DEMO_CITIES: City[] = [
  { id: '1', name: 'Москва', region: 'Московская область' },
  { id: '2', name: 'Санкт-Петербург', region: 'Ленинградская область' },
  { id: '3', name: 'Новосибирск', region: 'Новосибирская область' },
  { id: '4', name: 'Екатеринбург', region: 'Свердловская область' },
  { id: '5', name: 'Казань', region: 'Республика Татарстан' },
  { id: '6', name: 'Нижний Новгород', region: 'Нижегородская область' },
  { id: '7', name: 'Самара', region: 'Самарская область' },
  { id: '8', name: 'Омск', region: 'Омская область' },
]

export function Task9_4_Solution() {
  const [cityValue, setCityValue] = useState('')
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }

  return (
    <div className="exercise-container">
      <h2>Решение 9.4: Autocomplete&lt;T&gt; + forwardRef</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Generic компонент с forwardRef. Workaround через type assertion для React 18
      </p>

      <div style={{ maxWidth: 400 }}>
        <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
          Выберите город
        </label>
        <Autocomplete
          ref={inputRef}
          options={DEMO_CITIES}
          value={cityValue}
          onChange={setCityValue}
          onSelect={city => {
            setSelectedCity(city)
          }}
          getOptionLabel={city => city.name}
          placeholder="Начните вводить название..."
        />

        <button
          onClick={handleFocus}
          style={{
            marginTop: '0.75rem',
            padding: '0.4rem 1rem',
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          Сфокусировать через ref
        </button>

        {selectedCity && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#e8f5e9', borderRadius: '6px', fontSize: '0.9rem' }}>
            <strong>Выбран:</strong> {selectedCity.name}
            <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.2rem' }}>{selectedCity.region}</div>
          </div>
        )}

        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f5f5f5', borderRadius: '6px', fontSize: '0.8rem', color: '#666' }}>
          💡 Откройте React DevTools — компонент называется "Autocomplete", не "ForwardRef"
        </div>
      </div>
    </div>
  )
}
