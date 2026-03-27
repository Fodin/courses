# Задание 1.2: Abstract Factory

## Цель

Реализовать паттерн Abstract Factory для создания семейств UI-компонентов в разных темах (Light/Dark).

## Требования

1. Создайте интерфейс `UIComponent` с методом `render(): string`
2. Реализуйте по три компонента для каждой темы (6 классов):
   - `LightButton` / `DarkButton` — кнопки с разными стилями
   - `LightInput` / `DarkInput` — поля ввода с разными стилями
   - `LightCard` / `DarkCard` — карточки с разными стилями
3. Создайте интерфейс `UIFactory` с методами:
   - `createButton(label: string): UIComponent`
   - `createInput(placeholder: string): UIComponent`
   - `createCard(title: string, content: string): UIComponent`
4. Реализуйте `LightThemeFactory` и `DarkThemeFactory`
5. Создайте функцию `getFactory(theme: 'light' | 'dark'): UIFactory`

## Чеклист

- [ ] Интерфейс `UIComponent` с `render()` определён
- [ ] 6 классов компонентов (по 3 на тему) реализуют `UIComponent`
- [ ] Интерфейс `UIFactory` определён с тремя методами-создателями
- [ ] Две фабрики реализуют `UIFactory`
- [ ] Все компоненты одной фабрики стилистически согласованы
- [ ] Демонстрация показывает render обеих тем

## Как проверить себя

1. Нажмите кнопку запуска
2. Убедитесь, что Light-компоненты визуально отличаются от Dark
3. Убедитесь, что фабрика гарантирует: все компоненты из одной темы
4. Попробуйте добавить третью тему — достаточно создать новую фабрику
