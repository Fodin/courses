import { useState, type ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.3 — Toggle с render prop
// Task 2.3 — Toggle with render prop
// ============================================

// TODO: Объявите интерфейс того, что Toggle передаёт в render prop
// TODO: Declare the interface that Toggle passes to render prop
// interface ToggleRenderProps {
//   isOpen: boolean
//   toggle: () => void  // переключить состояние / toggle state
//   open: () => void    // открыть / open
//   close: () => void   // закрыть / close
// }

// TODO: Объявите интерфейс пропсов Toggle
// TODO: Declare the Toggle props interface
// interface ToggleProps {
//   defaultOpen?: boolean
//   render: (props: ToggleRenderProps) => ReactNode
// }

// TODO: Реализуйте компонент Toggle
// TODO: Implement the Toggle component
// - useState для isOpen (начальное значение — defaultOpen ?? false)
// - useState for isOpen (initial value — defaultOpen ?? false)
// - Объявите actions: ToggleRenderProps с toggle/open/close через setIsOpen
// - Declare actions: ToggleRenderProps with toggle/open/close via setIsOpen
// - Верните render(actions) обёрнутый во фрагмент
// - Return render(actions) wrapped in a fragment
// function Toggle({ defaultOpen = false, render }: ToggleProps) { ... }

export function Task2_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 2.3 — Toggle</h2>

      {/* TODO: Dropdown-меню */}
      {/* TODO: Dropdown menu */}
      {/* Toggle render prop показывает кнопку "Меню ▼/▲" */}
      {/* Toggle render prop shows "Menu ▼/▲" button */}
      {/* При isOpen=true — появляется список пунктов (Профиль, Настройки, Выйти) */}
      {/* When isOpen=true — a list of items appears (Profile, Settings, Logout) */}
      {/* Клик по пункту вызывает toggle (закрывает меню) */}
      {/* Clicking an item calls toggle (closes the menu) */}
      <section style={{ marginBottom: '32px' }}>
        <h3>Dropdown-меню</h3>
        {/* TODO: <Toggle render={({ isOpen, toggle }) => ( ... )} /> */}
        <p style={{ color: '#9ca3af' }}>Реализуйте Toggle выше</p>
      </section>

      {/* TODO: Modal trigger */}
      {/* TODO: Modal trigger */}
      {/* Кнопка "Открыть модалку" вызывает open() */}
      {/* "Open modal" button calls open() */}
      {/* При isOpen=true показывается оверлей (position: fixed, inset: 0) */}
      {/* When isOpen=true an overlay is shown (position: fixed, inset: 0) */}
      {/* Клик на оверлей — close(), клик на окно — e.stopPropagation() */}
      {/* Click on overlay — close(), click on window — e.stopPropagation() */}
      {/* Кнопка "×" внутри окна тоже вызывает close() */}
      {/* "×" button inside the window also calls close() */}
      <section style={{ marginBottom: '32px' }}>
        <h3>Modal trigger</h3>
        {/* TODO: <Toggle render={({ isOpen, open, close }) => ( ... )} /> */}
        <p style={{ color: '#9ca3af' }}>Реализуйте Toggle выше</p>
      </section>

      {/* TODO: Expandable section (аккордеон) */}
      {/* TODO: Expandable section (accordion) */}
      {/* Создайте 3 раздела с вопросами и ответами */}
      {/* Create 3 sections with questions and answers */}
      {/* Каждый раздел — отдельный <Toggle> */}
      {/* Each section is a separate <Toggle> */}
      {/* Заголовок кликабелен, при клике — toggle() */}
      {/* Header is clickable, on click — toggle() */}
      {/* При isOpen=true — показывается текст ответа */}
      {/* When isOpen=true — answer text is shown */}
      {/* Рядом с заголовком индикатор "+" / "−" */}
      {/* Next to the header is a "+" / "−" indicator */}
      <section>
        <h3>Expandable section (аккордеон)</h3>
        {/* TODO: три <Toggle> для трёх FAQ-вопросов */}
        {/* TODO: three <Toggle> for three FAQ questions */}
        <p style={{ color: '#9ca3af' }}>Реализуйте Toggle выше</p>
      </section>
    </div>
  )
}
