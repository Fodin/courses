# Задание 0.3: Discriminated Unions

## Цель

Научиться использовать размеченные объединения и exhaustive check для безопасной обработки вариантов.

## Требования

1. Создайте систему событий приложения:
   - `ClickEvent` — с координатами `x`, `y` и `target`
   - `SubmitEvent` — с `formId` и `data`
   - `NavigateEvent` — с `from` и `to`
2. Объедините в тип `AppEvent` с дискриминантом `type`
3. Создайте функцию `handleEvent(event: AppEvent): string` с `switch` по `type`
4. Добавьте exhaustive check через `never` в `default`
5. Создайте функцию `formatEvent` с форматированием для каждого типа
6. Обработайте массив разных событий

## Чеклист

- [ ] Три типа событий с общим дискриминантом `type`
- [ ] `switch` корректно сужает типы в каждом `case`
- [ ] `default` содержит exhaustive check через `never`
- [ ] Все события из массива обработаны и отображены
