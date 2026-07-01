import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.2: Modal с discriminated union props
// Task 9.2: Modal with discriminated union props
// ============================================
//
// Реализуйте компонент Modal с тремя вариантами.
// Implement a Modal component with three variants.
// TypeScript должен требовать разные props для каждого варианта.
// TypeScript should require different props for each variant.
//
// Три варианта:
// Three variants:
// - variant: 'alert'   → обязательны: message, onClose
// - variant: 'alert'   → required: message, onClose
// - variant: 'confirm' → обязательны: message, onConfirm, onCancel
// - variant: 'confirm' → required: message, onConfirm, onCancel
// - variant: 'form'    → обязательны: title, children, onSubmit, onCancel
// - variant: 'form'    → required: title, children, onSubmit, onCancel
//
// Подсказка: discriminated union
// Hint: discriminated union
// type ModalProps =
//   | { variant: 'alert'; message: string; onClose: () => void }
//   | { variant: 'confirm'; message: string; onConfirm: () => void; onCancel: () => void }
//   | { variant: 'form'; title: string; children: React.ReactNode; onSubmit: () => void; onCancel: () => void }

// TODO: Определите тип ModalProps как discriminated union
// TODO: Define ModalProps type as discriminated union
// type ModalProps = ...

// TODO: Реализуйте компонент Modal с тремя ветками рендеринга
// TODO: Implement Modal component with three rendering branches
// function Modal(props: ModalProps) {
//   if (props.variant === 'alert') { return ... }
//   if (props.variant === 'confirm') { return ... }
//   // variant === 'form'
//   return ...
// }

type ActiveModal = 'alert' | 'confirm' | 'form' | null

export function Task9_2() {
  const { t } = useLanguage()
  const [active, setActive] = useState<ActiveModal>(null)

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 9.2</h2>

      {/* TODO: Три кнопки для открытия разных вариантов */}
      {/* TODO: Three buttons to open different variants */}
      {/* <button onClick={() => setActive('alert')}>Показать Alert</button> */}
      {/* <button onClick={() => setActive('confirm')}>Показать Confirm</button> */}
      {/* <button onClick={() => setActive('form')}>Показать Form</button> */}

      {/* TODO: Рендер модалки в зависимости от active */}
      {/* TODO: Render modal depending on active */}
      {/* {active === 'alert' && (
        <Modal variant="alert" message="..." onClose={() => setActive(null)} />
      )} */}
      {/* {active === 'confirm' && (
        <Modal variant="confirm" message="..." onConfirm={...} onCancel={...} />
      )} */}
      {/* {active === 'form' && (
        <Modal variant="form" title="..." onSubmit={...} onCancel={...}>
          <input type="text" placeholder="Ваше имя" />
        </Modal>
      )} */}
    </div>
  )
}
