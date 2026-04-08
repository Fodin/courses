# Задание 12.2: Headless useDropdown + Dropdown compound component

## Цель

Реализовать headless хук `useDropdown` со всей логикой и ARIA-атрибутами, а затем построить на его основе `Dropdown` compound component с дефолтным UI. Пользователь должен иметь возможность использовать либо хук напрямую, либо готовый compound компонент.

## Требования

1. Хук `useDropdown(options)` возвращает: `isOpen`, `selected`, `triggerProps`, `listboxProps`, `getOptionProps(option)`, `close`
2. `triggerProps` содержит ARIA: `aria-haspopup: 'listbox'`, `aria-expanded: boolean`
3. `getOptionProps(option)` возвращает `role: 'option'`, `aria-selected: boolean`, `onClick`
4. `Dropdown` — compound component: `<Dropdown.Trigger>`, `<Dropdown.List>`, `<Dropdown.Option>`
5. `Dropdown` использует контекст для передачи данных хука sub-компонентам
6. Демо: один `Dropdown` через compound API + один кастомный UI через хук напрямую
7. Закрытие по клику вне компонента (через `useEffect` + `document.addEventListener`)

## Подсказки

- Compound context: `const DropdownContext = createContext<UseDropdownReturn | null>(null)`
- Защита контекста: `if (!ctx) throw new Error('...')`
- Назначение sub-компонентов: `Dropdown.Trigger = function DropdownTrigger(...)`
- `useRef` на контейнер + `mousedown` listener для закрытия по клику снаружи
- `useEffect(() => { ... return () => document.removeEventListener(...) }, [isOpen])`

## Чеклист

- [ ] Хук `useDropdown` возвращает все необходимые поля
- [ ] ARIA-атрибуты включены в `triggerProps` и `getOptionProps`
- [ ] `Dropdown.Trigger` использует `triggerProps` из контекста
- [ ] `Dropdown.List` рендерится только когда `isOpen === true`
- [ ] `Dropdown.Option` использует `getOptionProps` из контекста
- [ ] Выбранная опция визуально отмечена
- [ ] Компонент закрывается по клику вне области
- [ ] Кастомный UI через хук работает независимо от Dropdown compound
- [ ] TypeScript: все возвращаемые типы хука явно описаны через interface

## Как проверить себя

Откройте задание. Вы должны увидеть:
- `Dropdown` через compound API — выбор отображается в trigger
- Кастомный UI с теми же данными из хука — работает независимо
- В DevTools Elements: кнопка-триггер имеет `aria-haspopup="listbox"` и `aria-expanded`
- Клик вне обоих дропдаунов — оба закрываются
