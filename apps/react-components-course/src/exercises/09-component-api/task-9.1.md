# Задание 9.1: Полиморфный Button с `as` prop

## Цель

Реализовать компонент `Button`, который умеет рендериться как разный HTML-элемент или React-компонент через `as` prop. TypeScript должен автоматически подтягивать нужные props в зависимости от значения `as`.

## Требования

1. Компонент принимает `as` prop с дефолтным значением `'button'`
2. При `as="button"` доступны все стандартные атрибуты `<button>`: `onClick`, `disabled`, `type` и т.д.
3. При `as="a"` доступны все стандартные атрибуты `<a>`: `href`, `target`, `rel` и т.д.
4. Компонент поддерживает `variant` prop: `'primary' | 'secondary' | 'ghost'`
5. Компонент поддерживает `size` prop: `'sm' | 'md' | 'lg'`
6. Все нативные HTML-атрибуты пробрасываются через `...rest`
7. Демонстрация: показать Button как `button` с onClick, Button как `a` с href, и разные варианты/размеры

## Подсказки

- Используй `React.ComponentPropsWithoutRef<C>` для получения props нужного элемента
- Паттерн: `type ButtonProps<C extends React.ElementType = 'button'> = { as?: C; variant?:... } & Omit<React.ComponentPropsWithoutRef<C>, 'as'>`
- Внутри компонента: `const Component = as ?? 'button'`
- Чтобы TypeScript правильно вывел generic, объяви функцию через `function Button<C extends React.ElementType = 'button'>`
- `Omit<ComponentPropsWithoutRef<C>, keyof OwnProps>` — убирает конфликты между твоими props и нативными

## Чеклист

- [ ] Тип `ButtonProps<C>` принимает generic параметр `C extends React.ElementType`
- [ ] При `as="a"` TypeScript требует `href` и предлагает `target`, `rel`
- [ ] При `as="button"` TypeScript предлагает `onClick`, `disabled`, `type`
- [ ] Prop `variant` влияет на визуальный стиль
- [ ] Prop `size` влияет на размер
- [ ] Нативные атрибуты пробрасываются через `...rest`
- [ ] В демо: три кнопки разных вариантов + кнопка-ссылка с href

## Как проверить себя

Откройте задание в браузере. Вы должны увидеть:
- Кнопки `primary`, `secondary`, `ghost` — разные стили
- Кнопки `sm`, `md`, `lg` — разные размеры
- Ссылку-кнопку (`as="a"`) с правильным href
- При наведении на ссылку-кнопку в статус-баре браузера — видеть URL

Откройте TypeScript: попробуйте передать `href` в кнопку с `as="button"` — должна быть ошибка компилятора.
