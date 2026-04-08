import { useState, useEffect, useCallback, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.2: Modal на createPortal
// ============================================
//
// Реализуйте компонент Modal, который:
//   1. Рендерится через createPortal в document.body
//   2. Закрывается по клику на тёмный оверлей
//   3. Закрывается по нажатию Escape
//   4. Блокирует прокрутку страницы при открытии
//   5. Поддерживает стекинг (несколько модалок одновременно)
//
// Подсказки:
//   - createPortal(jsx, document.body) — рендер в body
//   - useEffect для addEventListener('keydown', ...) + cleanup
//   - useEffect для document.body.style.overflow = 'hidden' + cleanup
//   - Для стекинга: prop zIndex (default 1000), у вложенных — больше
//   - Клик на оверлей = onClose, клик на контент = e.stopPropagation()

// TODO: Счётчик открытых модалок для корректной разблокировки прокрутки
// let scrollLockCount = 0

// TODO: Опишите интерфейс ModalProps
// interface ModalProps {
//   isOpen: boolean
//   onClose: () => void
//   title?: string
//   children: ReactNode
//   zIndex?: number
// }

// TODO: Реализуйте компонент Modal
// function Modal({ isOpen, onClose, title, children, zIndex = 1000 }: ModalProps) {
//   // useEffect: блокировка прокрутки
//   useEffect(() => {
//     if (!isOpen) return
//     scrollLockCount++
//     document.body.style.overflow = 'hidden'
//     return () => {
//       scrollLockCount--
//       if (scrollLockCount === 0) document.body.style.overflow = ''
//     }
//   }, [isOpen])
//
//   // useEffect: закрытие по Escape
//   useEffect(() => {
//     if (!isOpen) return
//     const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
//     document.addEventListener('keydown', handler)
//     return () => document.removeEventListener('keydown', handler)
//   }, [isOpen, onClose])
//
//   if (!isOpen) return null
//
//   return createPortal(
//     <div
//       style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex }}
//       onClick={onClose}
//     >
//       <div onClick={e => e.stopPropagation()} style={{ /* стили контента */ }}>
//         {/* Шапка с title и кнопкой × */}
//         {/* Содержимое children */}
//       </div>
//     </div>,
//     document.body
//   )
// }

export function Task10_2() {
  const { t } = useLanguage()
  const [modal1Open, setModal1Open] = useState(false)
  const [modal2Open, setModal2Open] = useState(false)

  const closeModal1 = useCallback(() => setModal1Open(false), [])
  const closeModal2 = useCallback(() => setModal2Open(false), [])

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 10.2</h2>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setModal1Open(true)}
          style={{ padding: '0.6rem 1.25rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Открыть модалку
        </button>
      </div>

      {/* TODO: Используйте компонент Modal */}
      {/* <Modal isOpen={modal1Open} onClose={closeModal1} title="Модалка 1">
        <p>Контент модалки. Нажмите Escape или кликните на фон.</p>
        <button onClick={() => setModal2Open(true)}>Открыть вложенную</button>
      </Modal>

      <Modal isOpen={modal2Open} onClose={closeModal2} title="Модалка 2" zIndex={1001}>
        <p>Вторая модалка поверх первой.</p>
        <button onClick={closeModal2}>Закрыть</button>
      </Modal> */}
    </div>
  )
}
