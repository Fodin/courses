# Задание 2.2: Key Remapping

## Цель

Освоить key remapping через `as`-clause в mapped types: создание getter/setter-интерфейсов, фильтрация ключей, добавление префиксов.

## Требования

1. Реализуйте `Getters<T>` -- создаёт интерфейс с геттерами (`getName`, `getAge` и т.д.) для каждого свойства
2. Реализуйте `Setters<T>` -- создаёт интерфейс с сеттерами (`setName`, `setAge` и т.д.)
3. Реализуйте `OmitByType<T, U>` -- исключает ключи, значения которых совместимы с `U` (через `as never`)
4. Реализуйте `ExtractByType<T, U>` -- оставляет только ключи, значения которых совместимы с `U`
5. Реализуйте `Prefixed<T, P>` -- добавляет префикс к каждому ключу
6. Реализуйте `EventHandlers<T>` -- создаёт обработчики вида `on{Key}Change(newValue, oldValue)`

## Чеклист

- [ ] `Getters<{name: string}>` содержит `getName: () => string`
- [ ] `Setters<{age: number}>` содержит `setAge: (value: number) => void`
- [ ] `OmitByType<{id: number, name: string}, number>` содержит только `name`
- [ ] `ExtractByType<{id: number, name: string}, string>` содержит только `name`
- [ ] `Prefixed<{x: number}, 'api'>` содержит `api_x: number`
- [ ] `EventHandlers` корректно типизирует колбэки с новым и старым значением

## Как проверить себя

1. Вызовите методы Getters и Setters -- убедитесь, что типы аргументов/возвратов корректны
2. Проверьте, что OmitByType действительно убирает все числовые свойства
3. Создайте EventHandlers и вызовите обработчик с типизированными аргументами
