import { useState, type ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.3 — Toggle с render prop
// ============================================

// TODO: Объявите интерфейс того, что Toggle передаёт в render prop
// interface ToggleRenderProps {
//   isOpen: boolean
//   toggle: () => void  // переключить состояние
//   open: () => void    // открыть
//   close: () => void   // закрыть
// }

// TODO: Объявите интерфейс пропсов Toggle
// interface ToggleProps {
//   defaultOpen?: boolean
//   render: (props: ToggleRenderProps) => ReactNode
// }

// TODO: Реализуйте компонент Toggle
// - useState для isOpen (начальное значение — defaultOpen ?? false)
// - Объявите actions: ToggleRenderProps с toggle/open/close через setIsOpen
// - Верните render(actions) обёрнутый во фрагмент
// function Toggle({ defaultOpen = false, render }: ToggleProps) { ... }

export function Task2_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 2.3 — Toggle</h2>

      {/* TODO: Dropdown-меню
          Toggle render prop показывает кнопку "Меню ▼/▲"
          При isOpen=true — появляется список пунктов (Профиль, Настройки, Выйти)
          Клик по пункту вызывает toggle (закрывает меню)
      */}
      <section style={{ marginBottom: '32px' }}>
        <h3>Dropdown-меню</h3>
        {/* TODO: <Toggle render={({ isOpen, toggle }) => ( ... )} /> */}
        <p style={{ color: '#9ca3af' }}>Реализуйте Toggle выше</p>
      </section>

      {/* TODO: Modal trigger
          Кнопка "Открыть модалку" вызывает open()
          При isOpen=true показывается оверлей (position: fixed, inset: 0)
          Клик на оверлей — close(), клик на окно — e.stopPropagation()
          Кнопка "×" внутри окна тоже вызывает close()
      */}
      <section style={{ marginBottom: '32px' }}>
        <h3>Modal trigger</h3>
        {/* TODO: <Toggle render={({ isOpen, open, close }) => ( ... )} /> */}
        <p style={{ color: '#9ca3af' }}>Реализуйте Toggle выше</p>
      </section>

      {/* TODO: Expandable section (аккордеон)
          Создайте 3 раздела с вопросами и ответами
          Каждый раздел — отдельный <Toggle>
          Заголовок кликабелен, при клике — toggle()
          При isOpen=true — показывается текст ответа
          Рядом с заголовком индикатор "+" / "−"
      */}
      <section>
        <h3>Expandable section (аккордеон)</h3>
        {/* TODO: три <Toggle> для трёх FAQ-вопросов */}
        <p style={{ color: '#9ca3af' }}>Реализуйте Toggle выше</p>
      </section>
    </div>
  )
}
