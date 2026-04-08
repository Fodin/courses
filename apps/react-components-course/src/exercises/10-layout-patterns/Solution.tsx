import { useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import { createPortal } from 'react-dom'

// ============================================
// Task 10.1 Solution: Layout-компоненты
// ============================================

interface RootLayoutProps {
  children: ReactNode
  currentPage: string
  onNavigate: (page: string) => void
}

function RootLayout({ children, currentPage, onNavigate }: RootLayoutProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profile', label: 'Профиль' },
    { id: 'settings', label: 'Настройки' },
  ]

  return (
    <div style={{ minHeight: 400, display: 'flex', flexDirection: 'column', background: '#f8f9fa', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
      <header style={{
        background: '#1976d2',
        color: '#fff',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        flexShrink: 0,
      }}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: 0.5 }}>
          MyApp
        </div>
        <nav style={{ display: 'flex', gap: '0.25rem' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                padding: '0.4rem 1rem',
                background: currentPage === item.id ? 'rgba(255,255,255,0.25)' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: currentPage === item.id ? 600 : 400,
                transition: 'background 0.15s',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  )
}

interface SidebarLayoutProps {
  sidebar: ReactNode
  children: ReactNode
  sidebarWidth?: number
}

function SidebarLayout({ sidebar, children, sidebarWidth = 220 }: SidebarLayoutProps) {
  return (
    <div style={{ display: 'flex', minHeight: 320 }}>
      <aside style={{
        width: sidebarWidth,
        flexShrink: 0,
        background: '#fff',
        borderRight: '1px solid #e0e0e0',
        padding: '1rem',
      }}>
        {sidebar}
      </aside>
      <main style={{ flex: 1, minWidth: 0, padding: '1.25rem' }}>
        {children}
      </main>
    </div>
  )
}

interface CenteredLayoutProps {
  children: ReactNode
  maxWidth?: number
}

function CenteredLayout({ children, maxWidth = 720 }: CenteredLayoutProps) {
  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ maxWidth, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  )
}

// Страницы-заглушки — знают только о своём содержимом

function DashboardSidebar() {
  const items = ['Обзор', 'Аналитика', 'Отчёты', 'Пользователи', 'Финансы']
  const [active, setActive] = useState('Обзор')
  return (
    <nav>
      <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '0.75rem', fontWeight: 600 }}>
        Меню
      </div>
      {items.map(item => (
        <button
          key={item}
          onClick={() => setActive(item)}
          style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '0.5rem 0.75rem',
            background: active === item ? '#e3f2fd' : 'transparent',
            color: active === item ? '#1565c0' : '#444',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
            marginBottom: '0.15rem', fontWeight: active === item ? 600 : 400,
            fontSize: '0.9rem',
          }}
        >
          {item}
        </button>
      ))}
    </nav>
  )
}

function DashboardContent() {
  const stats = [
    { label: 'Пользователей', value: '12 481', change: '+8%' },
    { label: 'Заказов', value: '3 920', change: '+15%' },
    { label: 'Выручка', value: '₽1.2M', change: '+4%' },
  ]
  return (
    <div>
      <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Обзор</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.25rem' }}>{s.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: '#4caf50', fontWeight: 500 }}>{s.change}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfilePage() {
  return (
    <div>
      <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem' }}>Профиль пользователя</h3>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: '1.5rem', flexShrink: 0,
        }}>АС</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Алексей Смирнов</div>
          <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>a.smirnov@example.com</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ padding: '0.4rem 1rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
              Редактировать
            </button>
            <button style={{ padding: '0.4rem 1rem', background: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
              Сменить пароль
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  return (
    <div>
      <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem' }}>Настройки</h3>
      {[
        { label: 'Уведомления по email', checked: notifications, onChange: setNotifications },
        { label: 'Тёмная тема', checked: darkMode, onChange: setDarkMode },
      ].map(item => (
        <label key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={item.checked}
            onChange={e => item.onChange(e.target.checked)}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
        </label>
      ))}
    </div>
  )
}

export function Task10_1_Solution() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    if (currentPage === 'dashboard') {
      return (
        <SidebarLayout sidebar={<DashboardSidebar />}>
          <DashboardContent />
        </SidebarLayout>
      )
    }
    if (currentPage === 'profile') {
      return (
        <CenteredLayout maxWidth={560}>
          <ProfilePage />
        </CenteredLayout>
      )
    }
    return (
      <CenteredLayout maxWidth={480}>
        <SettingsPage />
      </CenteredLayout>
    )
  }

  return (
    <div className="exercise-container">
      <h2>Решение 10.1: Layout-компоненты</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        <strong>RootLayout</strong> с шапкой и навигацией. <strong>SidebarLayout</strong> для Dashboard. <strong>CenteredLayout</strong> для Profile и Settings.
      </p>

      <RootLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </RootLayout>

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0f4ff', borderRadius: '6px', fontSize: '0.85rem', color: '#555' }}>
        Текущий layout: {currentPage === 'dashboard' ? 'SidebarLayout (двухколоночный)' : 'CenteredLayout (по центру)'}
      </div>
    </div>
  )
}

// ============================================
// Task 10.2 Solution: Modal с createPortal
// ============================================

// Счётчик открытых модалок для управления прокруткой
let scrollLockCount = 0

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  zIndex?: number
}

function Modal({ isOpen, onClose, title, children, zIndex = 1000 }: ModalProps) {
  // Блокировка прокрутки
  useEffect(() => {
    if (!isOpen) return
    scrollLockCount++
    document.body.style.overflow = 'hidden'
    return () => {
      scrollLockCount--
      if (scrollLockCount === 0) {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: 480,
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Шапка */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #eee',
        }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
            {title ?? 'Диалог'}
          </h3>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: 28, height: 28,
              border: 'none', background: '#f0f0f0',
              borderRadius: '50%', cursor: 'pointer',
              fontSize: '1rem', lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>
        {/* Содержимое */}
        <div style={{ padding: '1.25rem' }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export function Task10_2_Solution() {
  const [modal1Open, setModal1Open] = useState(false)
  const [modal2Open, setModal2Open] = useState(false)
  const [modal3Open, setModal3Open] = useState(false)

  const closeModal1 = useCallback(() => setModal1Open(false), [])
  const closeModal2 = useCallback(() => setModal2Open(false), [])
  const closeModal3 = useCallback(() => setModal3Open(false), [])

  return (
    <div className="exercise-container">
      <h2>Решение 10.2: Modal через createPortal</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Модалки рендерятся в <code>document.body</code> через portal. Поддерживают стекинг, Escape, клик на оверлей, блокировку прокрутки.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setModal1Open(true)}
          style={{ padding: '0.6rem 1.25rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
        >
          Открыть модалку
        </button>
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fff3e0', borderRadius: '6px', fontSize: '0.85rem', color: '#555' }}>
        Попробуйте: открыть модалку → открыть вложенную → нажать Escape (закроется верхняя) → нажать ещё раз
      </div>

      {/* Первая модалка */}
      <Modal
        isOpen={modal1Open}
        onClose={closeModal1}
        title="Модалка 1"
        zIndex={1000}
      >
        <p style={{ margin: '0 0 1rem', color: '#555', lineHeight: 1.6 }}>
          Это первая модалка. Нажмите Escape или кликните на фон, чтобы закрыть.
        </p>
        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f5f5f5', borderRadius: '6px', fontSize: '0.85rem', color: '#666' }}>
          Прокрутка страницы заблокирована.
        </div>
        <button
          onClick={() => setModal2Open(true)}
          style={{ padding: '0.5rem 1rem', background: '#7b1fa2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Открыть вложенную модалку
        </button>
      </Modal>

      {/* Вторая модалка (поверх первой) */}
      <Modal
        isOpen={modal2Open}
        onClose={closeModal2}
        title="Модалка 2 (вложенная)"
        zIndex={1001}
      >
        <p style={{ margin: '0 0 1rem', color: '#555', lineHeight: 1.6 }}>
          Это вторая модалка поверх первой. z-index = 1001.
        </p>
        <button
          onClick={() => setModal3Open(true)}
          style={{ padding: '0.5rem 1rem', background: '#c62828', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Ещё одна модалка
        </button>
      </Modal>

      {/* Третья модалка */}
      <Modal
        isOpen={modal3Open}
        onClose={closeModal3}
        title="Модалка 3 (третий уровень)"
        zIndex={1002}
      >
        <p style={{ margin: '0 0 1rem', color: '#555', lineHeight: 1.6 }}>
          Третий уровень стека. Закройте Escape — закроется только эта модалка.
        </p>
        <button
          onClick={closeModal3}
          style={{ padding: '0.5rem 1rem', background: '#388e3c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Закрыть
        </button>
      </Modal>
    </div>
  )
}

// ============================================
// Task 10.3 Solution: Tooltip и Popover через порталы
// ============================================

type Placement = 'top' | 'bottom' | 'left' | 'right'

interface TooltipPosition {
  top: number
  left: number
  actualPlacement: Placement
}

function computeTooltipPosition(
  triggerRect: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number,
  placement: Placement
): TooltipPosition {
  const gap = 8
  const vw = window.innerWidth
  const vh = window.innerHeight
  const scrollX = window.scrollX
  const scrollY = window.scrollY

  let top = 0
  let left = 0
  let actualPlacement = placement

  if (placement === 'top') {
    top = triggerRect.top + scrollY - tooltipHeight - gap
    left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipWidth / 2
    // auto-flip: если не влезает сверху — показать снизу
    if (triggerRect.top - tooltipHeight - gap < 0) {
      top = triggerRect.bottom + scrollY + gap
      actualPlacement = 'bottom'
    }
  } else if (placement === 'bottom') {
    top = triggerRect.bottom + scrollY + gap
    left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipWidth / 2
    // auto-flip: если не влезает снизу — показать сверху
    if (triggerRect.bottom + tooltipHeight + gap > vh) {
      top = triggerRect.top + scrollY - tooltipHeight - gap
      actualPlacement = 'top'
    }
  } else if (placement === 'left') {
    top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipHeight / 2
    left = triggerRect.left + scrollX - tooltipWidth - gap
    if (triggerRect.left - tooltipWidth - gap < 0) {
      left = triggerRect.right + scrollX + gap
      actualPlacement = 'right'
    }
  } else {
    top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipHeight / 2
    left = triggerRect.right + scrollX + gap
    if (triggerRect.right + tooltipWidth + gap > vw) {
      left = triggerRect.left + scrollX - tooltipWidth - gap
      actualPlacement = 'left'
    }
  }

  // Корректировка горизонтальных границ
  if (placement === 'top' || placement === 'bottom') {
    if (left + tooltipWidth > vw + scrollX - 8) {
      left = vw + scrollX - tooltipWidth - 8
    }
    if (left < scrollX + 8) {
      left = scrollX + 8
    }
  }

  return { top, left, actualPlacement }
}

interface TooltipComponentProps {
  content: string
  placement?: Placement
  children: (ref: React.RefObject<HTMLButtonElement | null>) => ReactNode
}

function TooltipComponent({ content, placement = 'top', children }: TooltipComponentProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState<TooltipPosition>({ top: 0, left: 0, actualPlacement: placement })

  useEffect(() => {
    if (!visible || !triggerRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipEl = tooltipRef.current
    const tw = tooltipEl?.offsetWidth ?? 120
    const th = tooltipEl?.offsetHeight ?? 32

    setPos(computeTooltipPosition(triggerRect, tw, th, placement))
  }, [visible, placement])

  return (
    <>
      {children(triggerRef)}
      {visible && createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            background: '#212121',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'opacity 0.1s',
          }}
          onMouseEnter={() => setVisible(false)}
        >
          {content}
          {/* Стрелка */}
          <span style={{
            position: 'absolute',
            ...(pos.actualPlacement === 'bottom' && { top: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)' }),
            ...(pos.actualPlacement === 'top' && { bottom: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)' }),
            ...(pos.actualPlacement === 'right' && { left: -4, top: '50%', transform: 'translateY(-50%) rotate(45deg)' }),
            ...(pos.actualPlacement === 'left' && { right: -4, top: '50%', transform: 'translateY(-50%) rotate(45deg)' }),
            width: 8, height: 8,
            background: '#212121',
          }} />
        </div>,
        document.body
      )}
      {/* Обёртка для событий мыши */}
      <span
        style={{ display: 'contents' }}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      />
    </>
  )
}

interface PopoverProps {
  trigger: (ref: React.RefObject<HTMLButtonElement>, onClick: () => void) => ReactNode
  children: ReactNode
  title?: string
}

function Popover({ trigger, children, title }: PopoverProps) {
  const triggerRef = useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>
  const popoverRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    const popoverWidth = popoverRef.current?.offsetWidth ?? 280

    let left = rect.left + scrollX
    const vw = window.innerWidth
    if (left + popoverWidth > vw + scrollX - 8) {
      left = rect.right + scrollX - popoverWidth
    }

    setPos({
      top: rect.bottom + scrollY + 8,
      left,
    })
  }, [])

  const handleToggle = useCallback(() => {
    setOpen(prev => !prev)
  }, [])

  useEffect(() => {
    if (!open) return
    updatePosition()

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open, updatePosition])

  return (
    <>
      {trigger(triggerRef, handleToggle)}
      {open && createPortal(
        <div
          ref={popoverRef}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: 280,
            background: '#fff',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            border: '1px solid #e0e0e0',
            zIndex: 8000,
            overflow: 'hidden',
          }}
        >
          {title && (
            <div style={{
              padding: '0.75rem 1rem',
              borderBottom: '1px solid #eee',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              {title}
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#888', padding: '0 4px' }}
              >
                ×
              </button>
            </div>
          )}
          <div style={{ padding: '1rem' }}>
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export function Task10_3_Solution() {
  return (
    <div className="exercise-container">
      <h2>Решение 10.3: Tooltip и Popover через порталы</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Позиционирование через <code>getBoundingClientRect</code>. Auto-flip при выходе за viewport.
      </p>

      {/* Секция Tooltip */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ margin: '0 0 1rem', color: '#444', fontSize: '0.95rem' }}>Tooltip — направления</h4>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {(['top', 'bottom', 'left', 'right'] as Placement[]).map(placement => (
            <TooltipWrapper key={placement} placement={placement} />
          ))}
        </div>
      </div>

      {/* Auto-flip demo */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ margin: '0 0 1rem', color: '#444', fontSize: '0.95rem' }}>Auto-flip у краёв экрана</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 0.25rem' }}>
          <TooltipWrapper placement="right" label="Левый край" content="Tooltip у левого края" />
          <TooltipWrapper placement="top" label="По центру" content="Обычный tooltip сверху" />
          <TooltipWrapper placement="left" label="Правый край" content="Tooltip у правого края" />
        </div>
      </div>

      {/* Popover */}
      <div>
        <h4 style={{ margin: '0 0 1rem', color: '#444', fontSize: '0.95rem' }}>Popover</h4>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Popover
            title="Настройки уведомлений"
            trigger={(ref, onClick) => (
              <button
                ref={ref}
                onClick={onClick}
                style={{ padding: '0.5rem 1rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Уведомления
              </button>
            )}
          >
            <PopoverNotificationForm />
          </Popover>

          <Popover
            title="Выбор цвета"
            trigger={(ref, onClick) => (
              <button
                ref={ref}
                onClick={onClick}
                style={{ padding: '0.5rem 1rem', background: '#7b1fa2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Цвет темы
              </button>
            )}
          >
            <PopoverColorPicker />
          </Popover>
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#888' }}>
          Клик вне Popover закрывает его
        </div>
      </div>
    </div>
  )
}

// Вспомогательные компоненты для демо

function TooltipWrapper({ placement, label, content }: { placement: Placement; label?: string; content?: string }) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState<TooltipPosition>({ top: 0, left: 0, actualPlacement: placement })
  const tooltipRef = useRef<HTMLDivElement>(null)

  const tooltipContent = content ?? `Tooltip ${placement}`

  useEffect(() => {
    if (!visible || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const tw = tooltipRef.current?.offsetWidth ?? 120
    const th = tooltipRef.current?.offsetHeight ?? 32
    setPos(computeTooltipPosition(rect, tw, th, placement))
  }, [visible, placement])

  return (
    <>
      <button
        ref={triggerRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{
          padding: '0.45rem 0.9rem',
          background: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        {label ?? placement}
      </button>
      {visible && createPortal(
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            background: '#212121',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}
        >
          {tooltipContent}
          <div style={{ fontSize: '10px', opacity: 0.7, marginTop: 1 }}>
            → {pos.actualPlacement !== placement ? `flip: ${placement}→${pos.actualPlacement}` : pos.actualPlacement}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

function PopoverNotificationForm() {
  const [email, setEmail] = useState(true)
  const [push, setPush] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {[
        { label: 'Email-уведомления', checked: email, onChange: setEmail },
        { label: 'Push-уведомления', checked: push, onChange: setPush },
      ].map(item => (
        <label key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={item.checked}
            onChange={e => item.onChange(e.target.checked)}
          />
          {item.label}
        </label>
      ))}
      <button style={{ marginTop: '0.25rem', padding: '0.4rem 0.8rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
        Сохранить
      </button>
    </div>
  )
}

function PopoverColorPicker() {
  const colors = ['#1976d2', '#7b1fa2', '#c62828', '#2e7d32', '#e65100', '#37474f']
  const [selected, setSelected] = useState('#1976d2')
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {colors.map(color => (
          <button
            key={color}
            onClick={() => setSelected(color)}
            style={{
              width: 32, height: 32,
              background: color,
              border: selected === color ? '3px solid #333' : '3px solid transparent',
              borderRadius: '50%',
              cursor: 'pointer',
              outline: selected === color ? '2px solid #fff' : 'none',
              outlineOffset: -5,
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: '0.85rem', color: '#666' }}>
        Выбрано: <span style={{ fontWeight: 600, color: selected }}>{selected}</span>
      </div>
    </div>
  )
}
