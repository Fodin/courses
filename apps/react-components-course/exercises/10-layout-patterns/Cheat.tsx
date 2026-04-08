export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Level 10: Подсказки</h2>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>10.1 — Layout-компоненты</h3>
        <ul style={{ lineHeight: 1.8, paddingLeft: '1.25rem', color: '#444' }}>
          <li>
            <strong>SidebarLayout:</strong> <code>display: flex</code> на контейнере.
            <code>aside</code> с фиксированной <code>width</code> и <code>flexShrink: 0</code>.
            <code>main</code> с <code>flex: 1</code> и <strong><code>minWidth: 0</code></strong> (без него flex-child переполняет контейнер).
          </li>
          <li>
            <strong>CenteredLayout:</strong> внешний div с <code>padding</code>, внутренний с <code>maxWidth</code> и <code>margin: '0 auto'</code>.
          </li>
          <li>
            <strong>RootLayout:</strong> <code>display: flex; flexDirection: column</code>. Шапка — <code>flexShrink: 0</code>, контент — <code>flex: 1</code>.
          </li>
          <li>
            Навигация: <code>useState('dashboard')</code> в <code>Task10_1</code>, передаётся в <code>RootLayout</code> через props.
          </li>
          <li>
            Layout-компоненты <strong>не импортируют</strong> конкретные страницы — только принимают <code>children/sidebar</code>.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#7b1fa2', marginBottom: '0.5rem' }}>10.2 — Modal через createPortal</h3>
        <ul style={{ lineHeight: 1.8, paddingLeft: '1.25rem', color: '#444' }}>
          <li>
            <strong>createPortal:</strong> <code>return createPortal(jsx, document.body)</code> — не забудьте <code>if (!isOpen) return null</code> перед ним.
          </li>
          <li>
            <strong>Закрытие по оверлею:</strong> <code>onClick=&#123;onClose&#125;</code> на оверлее + <code>onClick=&#123;e =&gt; e.stopPropagation()&#125;</code> на контенте.
          </li>
          <li>
            <strong>Escape:</strong> <code>document.addEventListener('keydown', handler)</code> в <code>useEffect</code> с <code>return () =&gt; removeEventListener</code>. Не забудьте добавить <code>isOpen</code> в зависимости.
          </li>
          <li>
            <strong>Блокировка прокрутки:</strong> глобальный счётчик <code>let scrollLockCount = 0</code> вне компонента. Инкремент при монтировании, декремент + сброс overflow при нуле.
          </li>
          <li>
            <strong>Стекинг:</strong> передавайте <code>zIndex</code> prop (1000, 1001, 1002...) для вложенных модалок.
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#c62828', marginBottom: '0.5rem' }}>10.3 — Tooltip и Popover через порталы</h3>
        <ul style={{ lineHeight: 1.8, paddingLeft: '1.25rem', color: '#444' }}>
          <li>
            <strong>Позиция trigger:</strong> <code>triggerRef.current.getBoundingClientRect()</code> возвращает координаты относительно viewport. Прибавьте <code>window.scrollY / scrollX</code> для абсолютных координат.
          </li>
          <li>
            <strong>Tooltip снизу:</strong> <code>top = rect.bottom + scrollY + gap</code>, <code>left = rect.left + scrollX + rect.width/2 - tooltipWidth/2</code>.
          </li>
          <li>
            <strong>Auto-flip:</strong> проверьте <code>rect.bottom + tooltipHeight + gap &gt; window.innerHeight</code> — если true, разместите сверху.
          </li>
          <li>
            <strong>Коррекция по x:</strong> если <code>left + tooltipWidth &gt; window.innerWidth - 8</code> — сдвиньте влево. Если <code>left &lt; 8</code> — сдвиньте вправо.
          </li>
          <li>
            <strong>Popover закрытие вне:</strong> <code>document.addEventListener('mousedown', handler)</code> в <code>useEffect</code>. Проверка: <code>!popoverRef.current.contains(e.target as Node)</code>.
          </li>
          <li>
            <strong>Tooltip pointerEvents:</strong> добавьте <code>pointerEvents: 'none'</code> — tooltip не должен перехватывать события мыши.
          </li>
        </ul>
      </section>
    </div>
  )
}
