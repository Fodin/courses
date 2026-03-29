# Задание 12.1: Higher-Kinded Types

## Цель

Реализовать имитацию типов высшего порядка (HKTs) в TypeScript, используя паттерн дефункционализации через URI-реестр, и написать обобщённые функции, работающие с любым функтором.

## Требования

1. Создайте интерфейс `URItoKind<A>` -- реестр, отображающий URI-строки на конструкторы типов (Array, Option, Promise, Identity)
2. Реализуйте типы `URIS` и `Kind<F, A>` для обращения к реестру
3. Реализуйте интерфейс `Functor<F extends URIS>` с методом `map`
4. Реализуйте конкретные функторы: `arrayFunctor`, `optionFunctor`, `identityFunctor`
5. Напишите обобщённые функции `doubleAll` и `stringify`, работающие с любым функтором
6. Покажите, что одна и та же обобщённая функция работает с Array, Option и Identity

## Чеклист

- [ ] `Kind<"Array", number>` = `number[]`
- [ ] `Kind<"Option", string>` = `string | null`
- [ ] `arrayFunctor.map([1, 2, 3], n => n * 2)` = `[2, 4, 6]`
- [ ] `optionFunctor.map(null, n => n * 2)` = `null`
- [ ] `optionFunctor.map(5, n => n * 2)` = `10`
- [ ] `doubleAll` работает с любым функтором
- [ ] `stringify` работает с любым функтором

## Как проверить себя

1. Попробуйте вызвать `doubleAll` с несуществующим URI -- должна быть ошибка
2. Убедитесь, что `map` сохраняет контейнерный тип (Array -> Array, не Array -> Option)
3. Проверьте, что реестр расширяем через declaration merging
