# Задание 12.4: Capstone — мини UI-библиотека

## Цель

Создать мини-библиотеку из четырёх компонентов (`Button`, `Input`, `Modal`, `Select`), применив все паттерны курса: полиморфный API, compound components, context, forwardRef, Error Boundaries и headless логику. Все компоненты конфигурируются через `UIKitProvider`.

## Требования

### UIKitProvider
- `UIKitConfig`: `colorScheme: 'light' | 'dark'`, `primaryColor: string`, `size: 'compact' | 'normal' | 'large'`
- Хук `useUIKit()` читает конфиг из контекста
- Разумные дефолты, компоненты работают без провайдера

### Button
- Полиморфный: `as` prop с дефолтом `'button'`
- `variant`: `'primary' | 'secondary' | 'ghost' | 'danger'`
- `size`: переопределяет `config.size` локально
- `forwardRef` для доступа к DOM-элементу
- `isLoading` prop: показывает спиннер, блокирует клики

### Input
- `forwardRef` с типом `HTMLInputElement`
- `error?: string` — показывает сообщение об ошибке под полем
- `label?: string` — связанный `<label>` через id
- Controlled + uncontrolled через нативный механизм (`value` vs `defaultValue`)
- `aria-invalid` при наличии `error`

### Modal
- Рендерится через `createPortal` в `document.body`
- Context для sub-компонентов: `Modal.Header`, `Modal.Body`, `Modal.Footer`
- `isOpen` + `onClose` — controlled
- Клик по overlay закрывает модальное окно
- Обёрнут в `ErrorBoundary` — ошибка в body не ломает приложение

### Select
- Использует `useDropdown` хук из задания 12.2
- Compound: `Select.Trigger`, `Select.Option`
- `value` + `onChange` — controlled
- ARIA: `combobox` роль на trigger, `listbox` на список

### Демо
- Переключатель темы (light/dark) через `UIKitProvider`
- Все четыре компонента демонстрируются на одном экране
- Лог событий (клики, выборы, сабмиты)

## Подсказки

- `createPortal(children, document.body)` — Modal рендерится вне дерева
- `forwardRef` + displayName для удобства в DevTools
- `useId()` (React 18) — уникальные id для label + input
- Error Boundary вокруг Modal.Body: `<ErrorBoundary fallback={...}>`
- Button isLoading: `pointer-events: none` + SVG-спиннер через CSS animation

## Чеклист

- [ ] `UIKitProvider` + `useUIKit` hook работают
- [ ] Button: полиморфный `as`, `variant`, `size`, `isLoading`, `forwardRef`
- [ ] Input: `forwardRef`, `label`, `error`, `aria-invalid`
- [ ] Modal: portal, overlay click, sub-компоненты через context, ErrorBoundary
- [ ] Select: `useDropdown` хук внутри, controlled API, ARIA
- [ ] Все компоненты используют `config.primaryColor` из провайдера
- [ ] Переключатель темы меняет внешний вид всех компонентов
- [ ] Лог отображает события взаимодействия

## Как проверить себя

Откройте задание. Убедитесь:
- Переключите тему — все компоненты перекрашиваются
- Откройте Modal, сломайте содержимое — ErrorBoundary показывает fallback, приложение не падает
- Button `as="a"` с href — TypeScript предлагает `target`, не предлагает `disabled`
- Input с `error` — красная рамка + сообщение + `aria-invalid="true"` в DOM
- Select — работает навигация клавиатурой (Tab + Enter опционально)
