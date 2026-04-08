import { useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.3: Tooltip и Popover через порталы
// Task 10.3: Tooltip and Popover via portals
// ============================================
//
// Реализуйте два компонента через createPortal:
// Implement two components via createPortal:
//
// Tooltip:
//   - Появляется при наведении (onMouseEnter / onMouseLeave)
//   - Appears on hover (onMouseEnter / onMouseLeave)
//   - Рендерится в document.body через createPortal
//   - Renders into document.body via createPortal
//   - Позиция вычисляется через triggerRef.current.getBoundingClientRect()
//   - Position is computed via triggerRef.current.getBoundingClientRect()
//   - placement: 'top' | 'bottom' | 'left' | 'right'
//   - Auto-flip: если не влезает — показать с другой стороны
//   - Auto-flip: if it doesn't fit — show from the other side
//   - Не выходит за горизонтальные края viewport
//   - Doesn't go beyond horizontal edges of viewport
//
// Popover:
//   - Открывается/закрывается по клику
//   - Opens/closes on click
//   - Рендерится в document.body через createPortal
//   - Renders into document.body via createPortal
//   - Закрывается по клику вне (document mousedown)
//   - Closes on click outside (document mousedown)
//   - Содержимое через children
//   - Content via children

// TODO: Тип для направления tooltip
// TODO: Type for tooltip direction
// type Placement = 'top' | 'bottom' | 'left' | 'right'

// TODO: Реализуйте функцию вычисления позиции
// TODO: Implement position computation function
// function computeTooltipPosition(
//   triggerRect: DOMRect,
//   tooltipWidth: number,
//   tooltipHeight: number,
//   placement: Placement
// ) {
//   const gap = 8
//   let top = 0
//   let left = 0
//   // Подсказка: triggerRect.bottom + window.scrollY + gap — позиция снизу trigger
//   // Hint: triggerRect.bottom + window.scrollY + gap — position below trigger
//   // Не забудьте учесть window.scrollX для left
//   // Don't forget to account for window.scrollX for left
//   // Корректируйте left если выходит за правый/левый край viewport
//   // Adjust left if it goes beyond right/left edge of viewport
//   return { top, left }
// }

// TODO: Реализуйте Tooltip
// TODO: Implement Tooltip
// Принимает: triggerRef (ref на trigger-элемент), content, placement, isVisible
// Accepts: triggerRef (ref to trigger element), content, placement, isVisible
// Или оборачивает trigger через children render prop
// Or wraps trigger via children render prop

// TODO: Реализуйте Popover
// TODO: Implement Popover
// Используйте useRef для popoverRef
// Use useRef for popoverRef
// document.addEventListener('mousedown', handler) + cleanup
// Проверка: !popoverRef.current.contains(e.target as Node)
// Check: !popoverRef.current.contains(e.target as Node)

export function Task10_3() {
  const { t } = useLanguage()

  // TODO: Создайте примеры использования Tooltip и Popover
  // TODO: Create examples of Tooltip and Popover usage
  // Tooltip у правого края экрана — должен скорректировать позицию
  // Tooltip at the right edge of screen — should adjust position
  // Popover с формой
  // Popover with a form

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 10.3</h2>

      {/* TODO: Добавьте кнопки с Tooltip разных направлений */}
      {/* TODO: Add buttons with Tooltips in different directions */}
      {/* <TooltipWrapper placement="top" label="сверху" />
      <TooltipWrapper placement="bottom" label="снизу" />
      <TooltipWrapper placement="left" label="слева" />
      <TooltipWrapper placement="right" label="справа" /> */}

      {/* TODO: Добавьте Popover */}
      {/* TODO: Add Popover */}
      {/* <Popover trigger={...}>
        <p>Содержимое popover</p>
      </Popover> */}
    </div>
  )
}
