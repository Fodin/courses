# Задание 12.1: DatePicker в Controlled и Uncontrolled режимах

## Цель

Реализовать компонент `DatePicker` с полноценным UI календаря, который корректно работает в обоих режимах. TypeScript должен принудительно требовать `onChange` при передаче `value` (controlled) и запрещать смешивание режимов.

## Требования

1. Тип `DatePickerProps` — discriminated union: `ControlledProps | UncontrolledProps`
2. `ControlledProps`: `value: Date`, `onChange: (date: Date) => void`, `defaultValue?: never`
3. `UncontrolledProps`: `defaultValue?: Date`, `value?: never`, `onChange?: never`
4. Хук `useControllableState` абстрагирует оба режима — компонент не знает, в каком режиме работает
5. UI: сетка календаря (7 × 5 или 7 × 6 ячеек), навигация по месяцам (предыдущий / следующий)
6. Выбранная дата подсвечивается, сегодняшняя дата отмечена
7. Демо показывает оба режима одновременно: controlled с внешним state + uncontrolled

## Подсказки

- `useControllableState<T>(controlled, defaultVal, onChange)` — возвращает `[value, setValue]`
- Для генерации дней месяца: `new Date(year, month + 1, 0).getDate()` — кол-во дней
- Для определения первого дня недели: `new Date(year, month, 1).getDay()`
- TypeScript не позволит передать `href` туда, где ожидается `Date` — это нормально

## Чеклист

- [ ] `ControlledProps` требует одновременно `value` и `onChange`
- [ ] `UncontrolledProps` не требует ни `value`, ни `onChange`
- [ ] TypeScript: передача `value` без `onChange` — ошибка компиляции
- [ ] TypeScript: смешивание `value` и `defaultValue` — ошибка компиляции
- [ ] Хук `useControllableState` работает в обоих режимах
- [ ] Календарная сетка отображает правильные дни (первый день — в нужном столбце)
- [ ] Навигация по месяцам работает (вперёд / назад)
- [ ] Выбранная дата визуально выделена
- [ ] Сегодняшняя дата отмечена (кружком или другим способом)
- [ ] Демо: два `DatePicker` рядом — controlled и uncontrolled

## Как проверить себя

Откройте задание. Вы должны увидеть:
- Controlled DatePicker: при выборе даты — значение обновляется снаружи
- Uncontrolled DatePicker: хранит выбор самостоятельно
- Оба показывают правильную сетку дней с навигацией по месяцам

Проверьте TypeScript: попробуйте передать `value` без `onChange` — должна быть ошибка.
