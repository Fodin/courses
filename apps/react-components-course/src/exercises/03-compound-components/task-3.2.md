# Задание 3.2: Компонент `<Select>` с клавиатурной навигацией

## Цель

Реализовать кастомный Select с декларативным API в стиле Compound Components, который поддерживает навигацию с клавиатуры и доступен для пользователей с ограниченными возможностями.

## Требования

1. Создать контекст `SelectContext` с полями: `selected: string | null`, `focusedIndex: number`, `isOpen: boolean`, `options: string[]`, функции `select(value: string)`, `toggle()`, `close()`, `setFocusedIndex(i: number)`
2. Реализовать `SelectRoot` — корневой компонент, хранящий всё состояние; принимает `onChange?: (value: string) => void` и `children`
3. Реализовать `Select.Trigger` — кнопка, показывающая выбранное значение или placeholder `"Выберите..."`. Клик открывает/закрывает список. Атрибуты: `aria-haspopup="listbox"`, `aria-expanded={isOpen}`
4. Реализовать `Select.Options` — контейнер списка (`role="listbox"`), отображается только когда `isOpen === true`
5. Реализовать `Select.Option` — элемент списка, принимает `value: string` и `children`; при клике вызывает `select(value)`, визуально выделяется если `selected === value` или `focusedIndex` указывает на него
6. Добавить клавиатурную навигацию в `SelectRoot`: `ArrowDown` → следующий, `ArrowUp` → предыдущий, `Enter`/`Space` → открыть или выбрать, `Escape` → закрыть
7. Закрывать список при клике вне компонента (`useEffect` + `addEventListener('mousedown')`)
8. Собрать `Select` через `Object.assign` и продемонстрировать с 5+ опциями

## Подсказки

- `Select.Option` не знает своего индекса сам по себе. Один из способов: в `SelectRoot` собирать `options` через `useMemo` из children, используя `React.Children.map` для извлечения `value`-пропсов
- Для закрытия при клике вне: `useRef` на корневом элементе + `mousedown` listener, сравниваем `event.target` с `ref.current.contains(event.target)`
- `focusedIndex` нужен только когда список открыт — сбрасывайте его при закрытии
- Для навигации `ArrowDown`/`ArrowUp` используйте `e.preventDefault()`, иначе страница будет скроллиться

## Чеклист

- [ ] `SelectContext` содержит все необходимые поля и функции
- [ ] `Select.Trigger` показывает выбранное значение или placeholder
- [ ] `Select.Options` скрыт когда `isOpen === false`
- [ ] `Select.Option` выделяет выбранный вариант
- [ ] `ArrowDown` / `ArrowUp` перемещают фокус по списку без скролла страницы
- [ ] `Enter` / `Space` открывает список или выбирает элемент
- [ ] `Escape` закрывает список
- [ ] Клик вне компонента закрывает список
- [ ] ARIA-атрибуты расставлены корректно

## Как проверить себя

- Откройте компонент и управляйте Select только с клавиатуры (Tab → Select → Enter → стрелки → Enter)
- Убедитесь, что выбранное значение отображается в Trigger
- Кликните в стороне от Select — список должен закрыться
- Проверьте в браузерном инспекторе: `aria-expanded` меняется при открытии
