# Задание 9.2: Recursive Conditional Types

## Цель

Создать утилитарные типы с рекурсивными условными типами: DeepReadonly, DeepPartial, DeepRequired, DeepAwaited, Flatten, DeepNullable.

## Требования

1. Реализуйте `DeepReadonly<T>` — рекурсивно делает все свойства readonly, исключая Function
2. Реализуйте `DeepPartial<T>` — рекурсивно делает все свойства optional
3. Реализуйте `DeepRequired<T>` — рекурсивно убирает optional модификатор (`-?`)
4. Реализуйте `DeepAwaited<T>` — рекурсивно разворачивает Promise (включая `Promise<Promise<T>>`)
5. Реализуйте `Flatten<T>` — уплощает вложенные массивы до базового типа
6. Реализуйте `DeepNullable<T>` — рекурсивно добавляет `| null` ко всем свойствам

## Чеклист

- [ ] `DeepReadonly` запрещает изменение вложенных свойств
- [ ] `DeepPartial` позволяет указать только часть конфигурации
- [ ] `DeepRequired` требует все вложенные поля
- [ ] `DeepAwaited` разворачивает `Promise<Promise<string>>` в `string`
- [ ] `Flatten<number[][][]>` возвращает `number`
- [ ] `DeepNullable` добавляет null к каждому полю рекурсивно
- [ ] Все типы исключают Function из рекурсии
- [ ] Результаты отображаются на странице

## Как проверить себя

1. Нажмите кнопку «Запустить»
2. Убедитесь, что `DeepReadonly<Config>` не позволяет модифицировать `config.server.ssl.enabled`
3. Проверьте, что `DeepPartial<Config>` принимает объект только с `server.port`
4. Убедитесь, что `DeepNullable` позволяет `null` на любом уровне вложенности
