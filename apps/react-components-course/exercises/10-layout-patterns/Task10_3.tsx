import { useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.3: Tooltip и Popover через порталы
// ============================================
//
// Реализуйте два компонента через createPortal:
//
// Tooltip:
//   - Появляется при наведении (onMouseEnter / onMouseLeave)
//   - Рендерится в document.body через createPortal
//   - Позиция вычисляется через triggerRef.current.getBoundingClientRect()
//   - placement: 'top' | 'bottom' | 'left' | 'right'
//   - Auto-flip: если не влезает — показать с другой стороны
//   - Не выходит за горизонтальные края viewport
//
// Popover:
//   - Открывается/закрывается по клику
//   - Рендерится в document.body через createPortal
//   - Закрывается по клику вне (document mousedown)
//   - Содержимое через children

// TODO: Тип для направления tooltip
// type Placement = 'top' | 'bottom' | 'left' | 'right'

// TODO: Реализуйте функцию вычисления позиции
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
//   // Не забудьте учесть window.scrollX для left
//   // Корректируйте left если выходит за правый/левый край viewport
//   return { top, left }
// }

// TODO: Реализуйте Tooltip
// Принимает: triggerRef (ref на trigger-элемент), content, placement, isVisible
// Или оборачивает trigger через children render prop

// TODO: Реализуйте Popover
// Используйте useRef для popoverRef
// document.addEventListener('mousedown', handler) + cleanup
// Проверка: !popoverRef.current.contains(e.target as Node)

export function Task10_3() {
  const { t } = useLanguage()

  // TODO: Создайте примеры использования Tooltip и Popover
  // Tooltip у правого края экрана — должен скорректировать позицию
  // Popover с формой

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 10.3</h2>

      {/* TODO: Добавьте кнопки с Tooltip разных направлений */}
      {/* <TooltipWrapper placement="top" label="сверху" />
      <TooltipWrapper placement="bottom" label="снизу" />
      <TooltipWrapper placement="left" label="слева" />
      <TooltipWrapper placement="right" label="справа" /> */}

      {/* TODO: Добавьте Popover */}
      {/* <Popover trigger={...}>
        <p>Содержимое popover</p>
      </Popover> */}
    </div>
  )
}
