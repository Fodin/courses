# Задание 10.1: Option и Either из fp-ts

## Цель

Освоить `Option` и `Either` из настоящей библиотеки fp-ts, понять отличия от ручных реализаций из Level 6.

## Требования

1. Импортировать `* as O from 'fp-ts/Option'` и `* as E from 'fp-ts/Either'`
2. Импортировать `pipe` из `'fp-ts/function'`
3. Реализовать функцию `getUserEmail(userId: number): string` через `pipe` + `O.fromNullable` + `O.flatMap` + `O.map` + `O.getOrElse`
4. Реализовать функцию `parseAndValidate(input: string): E.Either<string, number>` — парсинг float → проверка NaN → проверка > 0 через `E.flatMap`
5. Компонент должен показывать поле ввода userId и числа, рядом — результат
6. Для userId=2 (нет email) должен возвращаться fallback 'N/A'

## Чеклист

- [ ] Используются реальные импорты из `fp-ts/Option` и `fp-ts/Either`
- [ ] `pipe` из `fp-ts/function`
- [ ] `O.getOrElse` получает `() => 'N/A'` (thunk, не значение!)
- [ ] `E.flatMap` правильно прерывает цепочку при ошибке
- [ ] Компонент интерактивен: меняем userId — меняется результат

## Как проверить себя

Введите:
- userId=1 → 'ALICE@EXAMPLE.COM'
- userId=2 → 'N/A' (нет email)
- userId=99 → 'N/A' (нет пользователя)
- число=-5 → Left('Должно быть > 0')
- число=abc → Left('Не число')
- число=25 → Right('5.0000')
