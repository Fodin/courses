export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Level 10: Подсказки / Hints</h2>

      <section style={{ marginBottom: '1.5rem' }}>
        {/* 10.1 — Layout-компоненты / Layout components */}
        <h3 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>10.1 — Layout-компоненты / Layout components</h3>
        <ul style={{ lineHeight: 1.8, paddingLeft: '1.25rem', color: '#444' }}>
          <li>
            <strong>SidebarLayout:</strong> <code>display: flex</code> на контейнере.
            <code>aside</code> с фиксированной <code>width</code> и <code>flexShrink: 0</code>.
            <code>main</code> с <code>flex: 1</code> и <strong><code>minWidth: 0</code></strong> (без него flex-child переполняет контейнер).
            {/* without it, flex-child overflows the container */}
          </li>
          <li>
            <strong>CenteredLayout:</strong> внешний div с <code>padding</code>, внутренний с <code>maxWidth</code> и <code>margin: '0 auto'</code>.
            {/* outer div with padding, inner with maxWidth and margin: '0 auto' */}
          </li>
          <li>
            <strong>RootLayout:</strong> <code>display: flex; flexDirection: column</code>. Шапка — <code>flexShrink: 0</code>, контент — <code>flex: 1</code>.
            {/* Header — flexShrink: 0, content — flex: 1 */}
          </li>
          <li>
            Навигация: <code>useState('dashboard')</code> в <code>Task10_1</code>, передаётся в <code>RootLayout</code> через props.
            {/* Navigation: useState('dashboard') in Task10_1, passed to RootLayout via props */}
          </li>
          <li>
            Layout-компоненты <strong>не импортируют</strong> конкретные страницы — только принимают <code>children/sidebar</code>.
            {/* Layout components do not import specific pages — they only accept children/sidebar */}
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        {/* 10.2 — Modal через createPortal / Modal via createPortal */}
        <h3 style={{ color: '#7b1fa2', marginBottom: '0.5rem' }}>10.2 — Modal через createPortal / Modal via createPortal</h3>
        <ul style={{ lineHeight: 1.8, paddingLeft: '1.25rem', color: '#444' }}>
          <li>
            <strong>createPortal:</strong> <code>return createPortal(jsx, document.body)</code> — не забудьте <code>if (!isOpen) return null</code> перед ним.
            {/* don't forget if (!isOpen) return null before it */}
          </li>
          <li>
            <strong>Закрытие по оверлею:</strong> <code>onClick={'{onClose}'}</code> на оверлее + <code>onClick={'{e => e.stopPropagation()}'}</code> на контенте.
            {/* Close on overlay: onClick on overlay + onClick on content */}
          </li>
          <li>
            <strong>Escape:</strong> <code>document.addEventListener('keydown', handler)</code> в <code>useEffect</code> с <code>return () => removeEventListener</code>. Не забудьте добавить <code>isOpen</code> в зависимости.
            {/* Don't forget to add isOpen to dependencies */}
          </li>
          <li>
            <strong>Блокировка прокрутки:</strong> глобальный счётчик <code>let scrollLockCount = 0</code> вне компонента. Инкремент при монтировании, декремент + сброс overflow при нуле.
            {/* Scroll lock: global counter outside the component. Increment on mount, decrement + reset overflow at zero */}
          </li>
          <li>
            <strong>Стекинг:</strong> передавайте <code>zIndex</code> prop (1000, 1001, 1002...) для вложенных модалок.
            {/* Stacking: pass zIndex prop for nested modals */}
          </li>
        </ul>
      </section>

      <section>
        {/* 10.3 — Tooltip и Popover через порталы / Tooltip and Popover via portals */}
        <h3 style={{ color: '#c62828', marginBottom: '0.5rem' }}>10.3 — Tooltip и Popover через порталы / Tooltip and Popover via portals</h3>
        <ul style={{ lineHeight: 1.8, paddingLeft: '1.25rem', color: '#444' }}>
          <li>
            <strong>Позиция trigger:</strong> <code>triggerRef.current.getBoundingClientRect()</code> возвращает координаты относительно viewport. Прибавьте <code>window.scrollY / scrollX</code> для абсолютных координат.
            {/* Trigger position: returns coordinates relative to viewport. Add window.scrollY/scrollX for absolute coordinates */}
          </li>
          <li>
            <strong>Tooltip снизу:</strong> <code>top = rect.bottom + scrollY + gap</code>, <code>left = rect.left + scrollX + rect.width/2 - tooltipWidth/2</code>.
            {/* Tooltip below */}
          </li>
          <li>
            <strong>Auto-flip:</strong> проверьте <code>rect.bottom + tooltipHeight + gap > window.innerHeight</code> — если true, разместите сверху.
            {/* Auto-flip: check if it fits, if true — place on top */}
          </li>
          <li>
            <strong>Коррекция по x:</strong> если <code>left + tooltipWidth > window.innerWidth - 8</code> — сдвиньте влево. Если <code>left < 8</code> — сдвиньте вправо.
            {/* X correction: if overflows right edge — shift left. If overflows left edge — shift right */}
          </li>
          <li>
            <strong>Popover закрытие вне:</strong> <code>document.addEventListener('mousedown', handler)</code> в <code>useEffect</code>. Проверка: <code>!popoverRef.current.contains(e.target as Node)</code>.
            {/* Popover close outside: in useEffect. Check if click is outside popover */}
          </li>
          <li>
            <strong>Tooltip pointerEvents:</strong> добавьте <code>pointerEvents: 'none'</code> — tooltip не должен перехватывать события мыши.
            {/* Tooltip pointerEvents: tooltip should not intercept mouse events */}
          </li>
        </ul>
      </section>
    </div>
  )
}
