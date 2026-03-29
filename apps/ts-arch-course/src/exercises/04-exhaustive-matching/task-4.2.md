# Задание 4.2: Variant Types

## Цель

Создать систему типобезопасных конструкторов для tagged union типов (Variant), которая упрощает создание размеченных объединений и обеспечивает корректную типизацию.

## Требования

1. Реализуйте generic тип `Variant<Tag, Data?>`, где `Data` опциональна — варианты могут быть как с данными, так и без
2. Создайте перегруженную функцию-конструктор `variant(tag)` и `variant(tag, data)`
3. Реализуйте тип `RemoteData<E, A>` с вариантами: `NotAsked`, `Loading`, `Failure<E>`, `Success<A>`
4. Создайте конструкторы для каждого варианта RemoteData
5. Реализуйте функцию `matchVariant()` для паттерн-матчинга по полю `_tag`
6. Продемонстрируйте на примере `PaymentResult` с вариантами: `Approved`, `Declined`, `Pending`, `Refunded`

## Чеклист

- [ ] `Variant<'Ok', { id: number }>` создаёт тип `{ readonly _tag: 'Ok'; readonly data: { id: number } }`
- [ ] `Variant<'NotAsked'>` создаёт тип `{ readonly _tag: 'NotAsked' }` (без data)
- [ ] Функция `variant('Ok', data)` возвращает корректно типизированный объект
- [ ] Функция `variant('NotAsked')` работает без второго аргумента
- [ ] `matchVariant()` обеспечивает исчерпывающую обработку всех вариантов
- [ ] В обработчиках `matchVariant` доступны данные конкретного варианта с правильными типами

## Как проверить себя

1. `variant('Success', 42)` должен иметь тип `Variant<'Success', number>`
2. `variant('Loading')` должен иметь тип `Variant<'Loading'>` без поля `data`
3. В `matchVariant` попробуйте пропустить вариант — должна быть ошибка компиляции
