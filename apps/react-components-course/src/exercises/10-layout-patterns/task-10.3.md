# Задание 10.3: Tooltip и Popover через порталы

## Цель

Реализовать компоненты `Tooltip` и `Popover` через `createPortal` с позиционированием относительно trigger-элемента и обработкой границ viewport.

## Требования

1. `Tooltip` — простая всплывающая подсказка:
   - Появляется при наведении (`onMouseEnter` / `onMouseLeave`)
   - Рендерится в `document.body` через `createPortal`
   - Позиционируется относительно trigger-элемента через `getBoundingClientRect`
   - Поддерживает `placement: 'top' | 'bottom' | 'left' | 'right'` (default: `'top'`)
   - Не выходит за границы viewport (корректирует позицию при необходимости)

2. `Popover` — всплывающая панель с содержимым:
   - Открывается/закрывается по клику на trigger
   - Рендерится в `document.body` через `createPortal`
   - Позиционируется относительно trigger-элемента
   - Закрывается по клику вне popover (через `mousedown` на document)
   - Поддерживает `children: ReactNode` в качестве содержимого

3. Обработка границ viewport для обоих компонентов:
   - Если tooltip не помещается сверху — показывать снизу (auto-flip)
   - Если tooltip выходит за левый/правый край — смещать горизонтально

4. Демо:
   - Несколько кнопок с `Tooltip` разных направлений (top, bottom, left, right)
   - Кнопки у краёв экрана — tooltip не выходит за viewport
   - Кнопка с `Popover`, содержащим форму или список

## Подсказки

- Используй `useRef` для trigger-элемента: `const triggerRef = useRef<HTMLButtonElement>(null)`
- Позиция tooltip: `triggerRef.current.getBoundingClientRect()` + `window.scrollY/scrollX`
- Пересчитывай позицию при каждом показе (в `useEffect` с зависимостью от `isVisible`)
- Для auto-flip: сравни `rect.top` с высотой tooltip — если не влезает, меняй placement
- Для закрытия Popover по клику вне: `document.addEventListener('mousedown', handler)` с проверкой через `popoverRef.current.contains(event.target)`
- `pointerEvents: 'none'` на tooltip — он не должен перехватывать события мыши

## Чеклист

- [ ] `Tooltip` появляется при наведении и скрывается при уходе мыши
- [ ] `Tooltip` рендерится через `createPortal` в `document.body`
- [ ] Позиция `Tooltip` корректно вычислена относительно trigger-элемента
- [ ] `Tooltip` у правого края не уходит за viewport (смещается влево)
- [ ] `Tooltip` у нижнего края экрана отображается сверху (auto-flip)
- [ ] `Popover` открывается/закрывается по клику
- [ ] `Popover` закрывается по клику вне
- [ ] `Popover` рендерится через `createPortal`
- [ ] Нет утечек слушателей событий (cleanup в useEffect)

## Как проверить себя

Наведите на кнопку у правого края — tooltip должен быть виден полностью, не уходить за экран. Наведите на кнопку у нижнего края — tooltip должен появиться сверху. Откройте Popover и кликните в другом месте — он должен закрыться. Откройте несколько tooltip'ов подряд — предыдущий должен скрываться корректно.
